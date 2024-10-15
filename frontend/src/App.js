import React from 'react';
import SensorChart from './components/SensorChart';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sensor Dashboard</h1>
      </header>
      <main>
        <SensorChart />
      </main>
    </div>
  );
}

export default App;