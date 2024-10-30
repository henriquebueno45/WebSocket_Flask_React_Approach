import json
import time
import random
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from threading import Thread, Event

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

nodes = {}
simulation_thread = None
stop_event = Event()

def generate_node_data():
    while not stop_event.is_set():
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
    global simulation_thread, stop_event
    if simulation_thread is None or not simulation_thread.is_alive():
        stop_event.clear()
        simulation_thread = Thread(target=generate_node_data)
        simulation_thread.start()

@socketio.on('stopSimulation')
def handle_stop_simulation():
    global stop_event
    stop_event.set()

@socketio.on('deleteNode')
def handle_delete_node(node_id):
    if node_id in nodes:
        del nodes[node_id]
        print(f'Node {node_id} deleted')

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)