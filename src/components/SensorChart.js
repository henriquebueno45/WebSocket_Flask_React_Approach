import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { connectToSocket, disconnectSocket } from '../services/socketService';
import '../styles/SensorChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Humidity',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const updateChartData = (msg) => {
      console.log('Raw data received in updateChartData:', JSON.stringify(msg));

      if (typeof msg !== 'object' || msg === null) {
        console.error('Invalid data received:', msg);
        return;
      }

      setChartData(prevState => {
        const timestamp = msg.timestamp || new Date().toLocaleTimeString();
        const temperatureValue = msg.temperature?.value ?? null;
        const humidityValue = msg.humidity?.value ?? null;

        console.log('Processed values:', { timestamp, temperatureValue, humidityValue });

        const newLabels = [...prevState.labels, timestamp];
        const newTempData = [...prevState.datasets[0].data, temperatureValue];
        const newHumidData = [...prevState.datasets[1].data, humidityValue];

        // Limit to last 10 data points
        if (newLabels.length > 10) {
          newLabels.shift();
          newTempData.shift();
          newHumidData.shift();
        }

        const newState = {
          labels: newLabels,
          datasets: [
            {
              ...prevState.datasets[0],
              data: newTempData,
              label: msg.temperature?.name || 'Temperature',
            },
            {
              ...prevState.datasets[1],
              data: newHumidData,
              label: msg.humidity?.name || 'Humidity',
            },
          ],
        };

        console.log('New chart state:', JSON.stringify(newState, null, 2));
        return newState;
      });
    };

    connectToSocket(updateChartData);

    return () => {
      disconnectSocket();
    };
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Data',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (chartData.labels.length === 0) {
    return <div>Waiting for data...</div>;
  }

  return (
    <div className="sensor-chart">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default SensorChart;