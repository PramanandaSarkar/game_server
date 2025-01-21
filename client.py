import socket
import threading
from flask import Flask, request, render_template, jsonify

# Server configuration
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 12345

# UDP client configuration
udp_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Flask app for the browser-based interface
app = Flask(__name__)

# Global variables to store peer connections
tcp_connections = {}
current_peer = None

# Register the client with the server
def udp_register():
    udp_client.sendto("register".encode("utf-8"), (SERVER_HOST, SERVER_PORT))
    response, _ = udp_client.recvfrom(1024)
    print(f"[SERVER] {response.decode('utf-8')}")

# Get the list of active clients from the server
def udp_get_clients():
    udp_client.sendto("get_clients".encode("utf-8"), (SERVER_HOST, SERVER_PORT))
    response, _ = udp_client.recvfrom(1024)
    return response.decode("utf-8")

# Establish a TCP connection with a peer
def connect_to_peer(peer_ip, peer_port):
    global current_peer
    try:
        tcp_client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        tcp_client.connect((peer_ip, int(peer_port)))
        current_peer = tcp_client
        tcp_connections[(peer_ip, peer_port)] = tcp_client
        threading.Thread(target=handle_peer_messages, args=(tcp_client,), daemon=True).start()
        return "Connected to peer successfully."
    except Exception as e:
        return f"Failed to connect to peer: {e}"

# Handle incoming TCP messages from peers
def handle_peer_messages(tcp_client):
    while True:
        try:
            data = tcp_client.recv(1024)
            if not data:
                break
            print(f"[PEER] {data.decode('utf-8')}")
        except Exception:
            break

# Flask routes
@app.route("/")
def index():
    """Render the browser interface."""
    return render_template("index.html")

@app.route("/get_clients", methods=["GET"])
def get_clients():
    """Get the list of active clients from the server."""
    clients = udp_get_clients()
    return jsonify({"clients": clients.split("\n") if clients else []})

@app.route("/connect", methods=["POST"])
def connect():
    """Connect to a peer using TCP."""
    data = request.json
    peer_ip = data.get("peer_ip")
    peer_port = data.get("peer_port")
    if not peer_ip or not peer_port:
        return jsonify({"error": "Peer IP and port are required."}), 400
    message = connect_to_peer(peer_ip, peer_port)
    return jsonify({"message": message})

@app.route("/send", methods=["POST"])
def send_message():
    """Send a message to the current peer."""
    global current_peer
    if not current_peer:
        return jsonify({"error": "No active peer connection."}), 400
    data = request.json
    message = data.get("message")
    if not message:
        return jsonify({"error": "Message is required."}), 400
    try:
        current_peer.send(message.encode("utf-8"))
        return jsonify({"message": "Message sent successfully."})
    except Exception as e:
        return jsonify({"error": f"Failed to send message: {e}"}), 500

# Main function
def main():
    udp_register()
    app.run(debug=True, port=5001)

if __name__ == "__main__":
    main()
