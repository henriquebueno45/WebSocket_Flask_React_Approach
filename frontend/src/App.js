import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Conectado ao servidor');
    });

    socket.on('data', (receivedData) => {
      console.log('Dados recebidos:', receivedData);
      setData(receivedData);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado do servidor');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div className="App">
      <h1>Dados do Servidor (via WebSocket)</h1>
      
      <h2>Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;