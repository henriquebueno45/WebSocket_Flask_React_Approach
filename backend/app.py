import json
import time
import random
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from threading import Thread

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def generate_sensor_data():
    while True:
        data = {
            'temperature': {
                'value': round(random.uniform(20, 30), 2),
                'name': 'Temperature'
            },
            'humidity': {
                'value': round(random.uniform(30, 70), 2),
                'name': 'Humidity'
            },
            'timestamp': time.strftime('%H:%M:%S')
        }
        print('Sending data:', json.dumps(data))
        socketio.emit('updateSensorData', data)
        socketio.sleep(1)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    Thread(target=generate_sensor_data).start()
    socketio.run(app, debug=True, port=5000)