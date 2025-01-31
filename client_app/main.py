import socket
import threading
import tkinter as tk
from tkinter import scrolledtext

# --- Networking ---
HOST = '127.0.0.1'  # Server IP address
PORT = 12345  # Server port
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# --- GUI ---
window = tk.Tk()
window.title("Guessing Game Client")

# Login Frame
login_frame = tk.Frame(window)
login_frame.pack()
username_label = tk.Label(login_frame, text="Username:")
username_label.grid(row=0, column=0)
username_entry = tk.Entry(login_frame)
username_entry.grid(row=0, column=1)
login_button = tk.Button(login_frame, text="Login", command=lambda: login())
login_button.grid(row=1, column=0, columnspan=2)

# Game Frame (Hidden initially)
game_frame = tk.Frame(window)

chat_area = scrolledtext.ScrolledText(game_frame, wrap=tk.WORD)
chat_area.pack()

message_label = tk.Label(game_frame, text="Your Guess/Message:")
message_label.pack()
message_entry = tk.Entry(game_frame)
message_entry.pack()

send_button = tk.Button(game_frame, text="Send", command=lambda: send_message())
send_button.pack()

# --- Game Logic ---
username = ""
game_started = False

def login():
    global username
    username = username_entry.get()
    if username:
        try:
            client.connect((HOST, PORT))
            client.send(username.encode())  # Send username to server
            response = client.recv(1024).decode()
            if response == "Login successful":
                login_frame.pack_forget()  # Hide login frame
                game_frame.pack()  # Show game frame
                threading.Thread(target=receive_messages, daemon=True).start()  # Start receiving thread
                chat_area.insert(tk.END, "Welcome to the game!\n")
            else:
                chat_area.insert(tk.END, response + "\n") # Display any errors
        except Exception as e:
            chat_area.insert(tk.END, f"Connection error: {e}\n")
    else:
        chat_area.insert(tk.END, "Please enter a username.\n")

def send_message():
    message = message_entry.get()
    if message:
        try:
            client.send(message.encode())
            message_entry.delete(0, tk.END)  # Clear the entry field
        except Exception as e:
            chat_area.insert(tk.END, f"Error sending message: {e}\n")

def receive_messages():
    global game_started
    while True:
        try:
            message = client.recv(1024).decode()
            if message == "Game started":
                game_started = True
                chat_area.insert(tk.END, "The game has started! Guess a number between 1 and 9.\n")
            elif message.startswith("Guess Result:"):  # Guess result from server
                chat_area.insert(tk.END, message + "\n")
            elif message.startswith("Player "):
                chat_area.insert(tk.END, message + "\n")
            elif message == "You guessed correctly!": # Win message
                chat_area.insert(tk.END, message + "\n")
                game_started = False # Game ends
            elif message == "Game Over":
                chat_area.insert(tk.END, message + "\n")
                game_started = False
            else:
                chat_area.insert(tk.END, message + "\n") # Chat messages

        except Exception as e:
            print(f"Receiving error: {e}")
            break  # Exit the loop if there's an error

window.mainloop()