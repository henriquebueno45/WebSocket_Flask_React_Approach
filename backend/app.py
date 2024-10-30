import json
import time
import random
from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
from threading import Thread

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Dicionário para armazenar os nós e seus valores
nodes = {}

def generate_node_data():
    while True:
        data = {node_id: round(random.uniform(0, 100), 2) for node_id in nodes.keys()}
        print('Sending data:', json.dumps(data))
        socketio.emit('updateNodeData', data)
        socketio.sleep(1)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('updateNodes')
def handle_update_nodes(data):
    global nodes
    nodes = data
    print('Nodes updated:', nodes)

@socketio.on('startSimulation')
def handle_start_simulation():
    Thread(target=generate_node_data).start()

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)