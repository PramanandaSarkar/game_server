const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function initDb() {
    return open({
        filename: "game.db",
        driver: sqlite3.Database
    });
}

module.exports = initDb();
