import React from 'react';
import FlowChart from './components/FlowChart';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Testando WebSocket com Reactflow</h1>
      </header>
      <main>
        <FlowChart />
      </main>
    </div>
  );
}

export default App;