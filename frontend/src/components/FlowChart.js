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
import { establishSocketConnection, disconnectSocket, emitNodes, startSimulation } from '../services/socketService';

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

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'customNode',
      data: { label: `Node ${nodes.length + 1}`, value: 0 },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onRun = useCallback(() => {
    const nodeData = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.value;
      return acc;
    }, {});
    emitNodes(nodeData);
    startSimulation();
  }, [nodes]);

  useEffect(() => {
    const handleSocketUpdate = (data) => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, value: data[node.id] || node.data.value },
        }))
      );
    };

    establishSocketConnection(handleSocketUpdate);

    return () => {
      disconnectSocket();
    };
  }, [setNodes]);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4 }}>
        <button onClick={onAddNode}>Add Node</button>
        <button onClick={onRun}>Run</button>
      </div>
    </div>
  );
}

export default FlowChart;