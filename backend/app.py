from flask import Flask
from flask_socketio import SocketIO, emit
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Cliente conectado')
    send_data()

@socketio.on('disconnect')
def handle_disconnect():
    print('Cliente desconectado')

def send_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, 'data.json')
    
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    emit('data', data)

if __name__ == '__main__':
    socketio.run(app, debug=True)