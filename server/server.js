
import express from 'express';
import cors from 'cors';
import playerRoutes  from './routes/player.js';
import homeRoutes from './routes/home.js';
import matchRoutes from './routes/match.js';
import authRoutes from './routes/auth.js';


// const playerRoutes = require('./routes/player');
// const homeRoutes = require('./routes/home');
// const matchRoutes = require('./routes/match');
// const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());   



// routes
app.use('/player', playerRoutes);
app.use('/', homeRoutes);
app.use("/match", matchRoutes);
app.use("/auth", authRoutes);



app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});
