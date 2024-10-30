import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ id, data, isConnectable }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #777', padding: 10, borderRadius: 5 }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>{data.label} (ID: {id})</div>
      <div>Value: {data.value.toFixed(2)}</div>
      <button onClick={() => data.onDelete(id)} style={{ marginTop: 5 }}>Delete</button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default memo(CustomNode);