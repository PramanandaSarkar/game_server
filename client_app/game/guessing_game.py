from flask import Flask, render_template_string, request, jsonify
import random

app = Flask(__name__)

# Initialize the random number (game state)
random_int = random.randint(1, 9)

@app.route('/')
def index():
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guess the Number Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .container {
            display: inline-block;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .buttons {
            margin-top: 20px;
        }
        .buttons button {
            font-size: 20px;
            padding: 15px;
            margin: 5px;
            cursor: pointer;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
        #message {
            margin-top: 20px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Guess the Number (1 to 9)</h2>
        <div class="buttons">
            <!-- Create buttons 1 to 9 -->
            {% for i in range(1, 10) %}
                <button onclick="submitGuess({{ i }})">{{ i }}</button>
            {% endfor %}
        </div>
        <div id="message"></div>
    </div>

    <script>
        function submitGuess(guess) {
            // Send guess to the server
            fetch('/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'guess=' + guess
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').innerText = data.message;
                if (data.status === 'win') {
                    // Disable buttons once the game is won
                    document.querySelectorAll('button').forEach(button => {
                        button.disabled = true;
                    });
                }
            })
            .catch(error => console.error('Error:', error));
        }
    </script>
</body>
</html>
''')

@app.route('/guess', methods=['POST'])
def guess():
    global random_int  # Use the global random number
    user_guess = int(request.form['guess'])
    
    if user_guess < 1 or user_guess > 9:
        return jsonify({"message": "Please guess a number between 1 and 9.", "status": "error"})
    
    if user_guess < random_int:
        return jsonify({"message": "Too low! Try again.", "status": "continue"})
    elif user_guess > random_int:
        return jsonify({"message": "Too high! Try again.", "status": "continue"})
    else:
        random_int = random.randint(1, 9)  # Reset the game with a new number
        return jsonify({"message": "Congratulations! You guessed the correct number.", "status": "win"})

if __name__ == '__main__':
    app.run(debug=True)
