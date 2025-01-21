import socket
import threading

# UDP configuration
UDP_HOST = "127.0.0.1"
UDP_PORT = 12345

# TCP configuration
TCP_HOST = "127.0.0.1"
TCP_PORT = 54321

clients = {}  # Store {client_address: TCP socket}

def handle_tcp_client(client_socket, client_address):
    """Handle a connected TCP client."""
    print(f"[TCP CONNECTED] {client_address} connected.")
    clients[client_address] = client_socket

    try:
        while True:
            data = client_socket.recv(1024).decode("utf-8")
            if not data:
                break  # Client disconnected
            print(f"[{client_address}] {data}")

            # Relay the message to all other clients
            for other_address, other_socket in clients.items():
                if other_address != client_address:
                    other_socket.send(f"[{client_address}] {data}".encode("utf-8"))
    except ConnectionResetError:
        print(f"[TCP ERROR] {client_address} disconnected unexpectedly.")
    finally:
        client_socket.close()
        del clients[client_address]
        print(f"[TCP DISCONNECTED] {client_address} disconnected.")

def start_tcp_server():
    """Start the TCP server to handle chat messages."""
    tcp_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    tcp_server.bind((TCP_HOST, TCP_PORT))
    tcp_server.listen()
    print(f"[TCP LISTENING] Server is listening on {TCP_HOST}:{TCP_PORT}")

    while True:
        client_socket, client_address = tcp_server.accept()
        thread = threading.Thread(target=handle_tcp_client, args=(client_socket, client_address))
        thread.start()

def start_udp_server():
    """Start the UDP server to handle initial client connections."""
    udp_server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_server.bind((UDP_HOST, UDP_PORT))
    print(f"[UDP LISTENING] Server is listening on {UDP_HOST}:{UDP_PORT}")

    while True:
        data, client_address = udp_server.recvfrom(1024)
        message = data.decode("utf-8")
        print(f"[UDP CONNECTED] {client_address}: {message}")

        # Send back the TCP server information
        udp_server.sendto(f"Connect to TCP server at {TCP_HOST}:{TCP_PORT}".encode("utf-8"), client_address)

# Start the servers
if __name__ == "__main__":
    udp_thread = threading.Thread(target=start_udp_server, daemon=True)
    tcp_thread = threading.Thread(target=start_tcp_server, daemon=True)

    udp_thread.start()
    tcp_thread.start()

    print("[SERVER RUNNING] UDP and TCP servers are running.")
    udp_thread.join()
    tcp_thread.join()
