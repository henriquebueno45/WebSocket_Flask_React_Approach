import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { establishSocketConnection, disconnectSocket, emitNodes, startSimulation, stopSimulation, deleteNode } from '../services/socketService';

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'customNode',
    data: { label: 'Node 1', value: 0 },
    position: { x: 250, y: 5 },
  },
];

function FlowChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeDelete = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    deleteNode(nodeId);
  }, [setNodes]);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'customNode',
      data: { 
        label: `Node ${nodes.length + 1}`, 
        value: 0,
        onDelete: onNodeDelete  // Add onDelete function here
      },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes, onNodeDelete]);

  const onRun = useCallback(() => {
    const nodeData = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.value;
      return acc;
    }, {});
    emitNodes(nodeData);
    startSimulation();
    setIsSimulationRunning(true);
  }, [nodes]);

  const onStop = useCallback(() => {
    stopSimulation();
    setIsSimulationRunning(false);
  }, []);

  const onNodeIdChange = useCallback((oldId, newId) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === oldId ? { ...node, id: newId } : node
      )
    );
  }, [setNodes]);

  useEffect(() => {
    const handleSocketUpdate = (data) => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { 
            ...node.data, 
            value: data[node.id] || node.data.value,
            onDelete: onNodeDelete  // Ensure onDelete is always present
          },
        }))
      );
    };

    establishSocketConnection(handleSocketUpdate);

    return () => {
      disconnectSocket();
    };
  }, [setNodes, onNodeDelete]);

  // Ensure all existing nodes have the onDelete function
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, onDelete: onNodeDelete },
      }))
    );
  }, [setNodes, onNodeDelete]);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={(event, node) => {
          const newId = prompt("Enter new ID for the node:", node.id);
          if (newId && newId !== node.id) {
            onNodeIdChange(node.id, newId);
          }
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        <button onClick={onAddNode}>Add Node</button>
        {isSimulationRunning ? (
          <button onClick={onStop}>Stop Simulation</button>
        ) : (
          <button onClick={onRun}>Run Simulation</button>
        )}
      </div>
    </div>
  );
}

export default FlowChart;