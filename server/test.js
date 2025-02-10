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
        CREATE TABLE IF NOT EXISTS servers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            port INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY CHECK (id BETWEEN 10000 AND 99999),
            name TEXT NOT NULL,
            rank INTEGER DEFAULT 1,
            server_id INTEGER CHECK (server_id BETWEEN 100 AND 999),
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
    `);
})();

// === Players API ===
app.post("/player", async (req, res) => {
    const { id, name, rank, server_id } = req.body;
    try {
        await db.run("INSERT INTO players (id, name, rank, server_id) VALUES (?, ?, ?, ?)", [id, name, rank, server_id]);
        res.json({ message: "Player added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/player", async (_, res) => {
    const players = await db.all("SELECT * FROM players");
    res.json(players);
});

app.get("/player/:id", async (req, res) => {
    const player = await db.get("SELECT * FROM players WHERE id = ?", [req.params.id]);
    player ? res.json(player) : res.status(404).json({ error: "Player not found" });
});

app.put("/player/:id", async (req, res) => {
    const { rank } = req.body;
    const result = await db.run("UPDATE players SET rank = ? WHERE id = ?", [rank, req.params.id]);
    result.changes ? res.json({ message: "Player updated successfully" }) : res.status(404).json({ error: "Player not found" });
});

app.delete("/player/:id", async (req, res) => {
    const result = await db.run("DELETE FROM players WHERE id = ?", [req.params.id]);
    result.changes ? res.json({ message: "Player deleted successfully" }) : res.status(404).json({ error: "Player not found" });
});

// === Servers API ===
app.post("/server", async (req, res) => {
    const { location, port } = req.body;
    try {
        await db.run("INSERT INTO servers (location, port) VALUES (?, ?)", [location, port]);
        res.json({ message: "Server added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/server", async (_, res) => {
    const servers = await db.all("SELECT * FROM servers");
    res.json(servers);
});

// === Matches API ===
app.post("/match", async (req, res) => {
    const { id, server_id, winner_team } = req.body;
    try {
        await db.run("INSERT INTO matches (id, server_id, winner_team) VALUES (?, ?, ?)", [id, server_id, winner_team]);
        res.json({ message: "Match recorded successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/match", async (_, res) => {
    const matches = await db.all("SELECT * FROM matches");
    res.json(matches);
});

app.get("/match/:id", async (req, res) => {
    const match = await db.get("SELECT * FROM matches WHERE id = ?", [req.params.id]);
    match ? res.json(match) : res.status(404).json({ error: "Match not found" });
});

// === Chat History API ===
app.post("/chat", async (req, res) => {
    const { match_id, player_id, chat } = req.body;
    try {
        await db.run("INSERT INTO chat_history (match_id, player_id, chat) VALUES (?, ?, ?)", [match_id, player_id, chat]);
        res.json({ message: "Chat message added" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/chat/:match_id", async (req, res) => {
    const chatMessages = await db.all("SELECT * FROM chat_history WHERE match_id = ?", [req.params.match_id]);
    res.json(chatMessages);
});

// === Server Start ===
app.listen(4000, () => {
    console.log("Server running on port 4000");
});
