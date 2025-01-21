import socket
import threading

# UDP configuration
UDP_SERVER_HOST = "127.0.0.1"
UDP_SERVER_PORT = 12345

# TCP configuration (will be received from UDP)
TCP_SERVER_HOST = None
TCP_SERVER_PORT = None

def receive_tcp_messages(client_socket):
    """Handle incoming TCP messages from the server."""
    try:
        while True:
            message = client_socket.recv(1024).decode("utf-8")
            if not message:
                break
            print(message)
    except ConnectionResetError:
        print("[ERROR] Connection to server lost.")
    finally:
        client_socket.close()

def start_client():
    global TCP_SERVER_HOST, TCP_SERVER_PORT

    # Connect to the server using UDP
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.sendto(b"Hello from client!", (UDP_SERVER_HOST, UDP_SERVER_PORT))

    # Receive the TCP server information
    data, server_address = udp_socket.recvfrom(1024)
    udp_socket.close()

    tcp_info = data.decode("utf-8")
    print(f"[INFO] Received from server: {tcp_info}")

    # Extract the TCP host and port from the message
    TCP_SERVER_HOST, TCP_SERVER_PORT = tcp_info.split(" at ")[1].split(":")
    TCP_SERVER_PORT = int(TCP_SERVER_PORT)

    # Connect to the server using TCP
    tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    tcp_socket.connect((TCP_SERVER_HOST, TCP_SERVER_PORT))
    print(f"Connected to TCP server at {TCP_SERVER_HOST}:{TCP_SERVER_PORT}")

    # Start a thread to handle incoming messages
    thread = threading.Thread(target=receive_tcp_messages, args=(tcp_socket,))
    thread.start()

    try:
        while True:
            message = input("Enter message (or 'exit' to quit): ")
            if message.lower() == "exit":
                break
            tcp_socket.send(message.encode("utf-8"))
    finally:
        tcp_socket.close()
        print("Disconnected from server.")

if __name__ == "__main__":
    start_client()
