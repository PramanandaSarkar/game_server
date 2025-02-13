import dbPromise from "../../db/db.js"; 

const getAllPlayers = async (req, res) => {
    try {
        const db = await dbPromise;
        const players = await db.all("SELECT * FROM players");
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPlayerById = async (req, res) => {
    try {
        const db = await dbPromise;
        const player = await db.get("SELECT * FROM players WHERE id = ?", [req.params.id]);

        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        res.json(player);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createPlayer = async (req, res) => {
    const { id, name, rank, server_id } = req.body;
    try {
        const db = await dbPromise;
        await db.run("INSERT INTO players (id, name, rank, server_id) VALUES (?, ?, ?, ?)", [id, name, rank, server_id]);
        res.json({ message: "Player added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export { getAllPlayers, getPlayerById, createPlayer };
