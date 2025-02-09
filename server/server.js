const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let db;
(async () => {
    db = await open({
        filename: "game.db",
        driver: sqlite3.Database
    });
    
    await db.exec(`
        -- Creating tables
CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    port INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY CHECK (id BETWEEN 10000 AND 99999),
    name TEXT NOT NULL,
    rank INTEGER DEFAULT 1,
    server_id INTEGER,
    FOREIGN KEY (server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY CHECK (id BETWEEN 1000000 AND 9999999),
    server_id INTEGER,
    winner_team TEXT CHECK (winner_team IN ('red', 'blue')),
    FOREIGN KEY (server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER,
    player_id INTEGER,
    chat TEXT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Inserting data into servers table
INSERT INTO servers (location, port) VALUES 
    ('USA East', 3001),
    ('Europe West', 3002),
    ('Asia Pacific', 3003);

-- Inserting data into players table
INSERT INTO players (id, name, rank, server_id) VALUES 
    (10001, 'Alice', 1, 101),
    (10002, 'Bob', 2, 101),
    (10003, 'Charlie', 1, 102),
    (10004, 'David', 3, 102),
    (10005, 'Eve', 2, 103),
    (10006, 'Frank', 1, 103);

-- Inserting data into matches table
INSERT INTO matches (id, server_id, winner_team) VALUES 
    (1000001, 101, 'red'),
    (1000002, 102, 'blue'),
    (1000003, 103, 'red');

-- Inserting data into chat_history table
INSERT INTO chat_history (match_id, player_id, chat) VALUES 
    (1000001, 10001, 'Good luck!'),
    (1000001, 10002, 'Lets win this!'),
    (1000002, 10003, 'This is a tough match!'),
    (1000002, 10004, 'I got your back!'),
    (1000003, 10005, 'Red team is unstoppable!'),
    (1000003, 10006, 'Blue will never give up!');

    `);
})();

app.post("/players", async (req, res) => {
    const { id, name, server_id } = req.body;
    try {
        await db.run("INSERT INTO players (id, name, server_id) VALUES (?, ?, ?)", [id, name, server_id]);
        res.json({ message: "Player added" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
