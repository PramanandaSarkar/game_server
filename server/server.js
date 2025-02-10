
const express = require('express');
const cors = require('cors');



const playerRoutes = require('./routes/player');
const homeRoutes = require('./routes/home');
const matchRoutes = require('./routes/match');
const authRoutes = require('./routes/auth');

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
