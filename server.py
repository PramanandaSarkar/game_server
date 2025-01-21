import socket
import threading

# UDP server configuration
UDP_HOST = "127.0.0.1"
UDP_PORT = 12345

# Store active clients: {client_address: (ip, udp_port)}
active_clients = {}

def handle_udp_connection():
    """Handle incoming UDP messages."""
    udp_server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_server.bind((UDP_HOST, UDP_PORT))
    print(f"[UDP SERVER] Listening on {UDP_HOST}:{UDP_PORT}")

    while True:
        data, client_address = udp_server.recvfrom(1024)
        message = data.decode("utf-8")

        if message == "register":
            # Register client
            active_clients[client_address] = client_address
            print(f"[REGISTER] {client_address} added.")
            udp_server.sendto("Registered successfully.".encode("utf-8"), client_address)

        elif message.startswith("get_clients"):
            # Send list of active clients
            client_list = [f"{addr[0]}:{addr[1]}" for addr in active_clients if addr != client_address]
            udp_server.sendto("\n".join(client_list).encode("utf-8"), client_address)

        elif message.startswith("disconnect"):
            # Remove client
            if client_address in active_clients:
                del active_clients[client_address]
                print(f"[DISCONNECT] {client_address} removed.")
                udp_server.sendto("Disconnected successfully.".encode("utf-8"), client_address)

if __name__ == "__main__":
    udp_thread = threading.Thread(target=handle_udp_connection, daemon=True)
    udp_thread.start()
    print("[SERVER] Server is running...")
    udp_thread.join()
