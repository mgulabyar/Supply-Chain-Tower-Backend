// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const controlRoutes = require('./routes/controlTower');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());
// app.use('/api/tower', controlRoutes);

// // Socket.io Real-time simulation
// io.on('connection', (socket) => {
//   console.log('Client connected to Tower Monitoring');
  
//   // Simulate truck movement every 5 seconds
//   setInterval(() => {
//     socket.emit('shipmentUpdate', {
//       id: "SHP-101",
//       lat: 31.5204 + (Math.random() * 0.01),
//       lng: 74.3587 + (Math.random() * 0.01),
//       status: "In-Transit"
//     });
//   }, 5000);
// });

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => server.listen(5000, () => console.log('Tower Hub Online on Port 5000')))
//   .catch(err => console.log(err));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Models
const Inventory = mongoose.model('Inventory', new mongoose.Schema({
  itemName: String,
  stock: Number,
  min: Number,
  val: String
}));

const Shipment = mongoose.model('Shipment', new mongoose.Schema({
  id: String, lat: Number, lng: Number, status: String
}));

// AI Service (GPT-4o)
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/api/tower/summary', async (req, res) => {
  const inventory = await Inventory.find();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Give 1 line supply chain advice for low stock." }],
    max_tokens: 30
  });
  res.json({ inventory, aiStrategy: completion.choices[0].message.content });
});

app.post('/api/tower/seed', async (req, res) => {
    await Inventory.deleteMany({});
    await Inventory.create([
        { itemName: 'Processors', stock: 15, min: 20, val: '$45k' },
        { itemName: 'Sensors', stock: 80, min: 30, val: '$12k' }
    ]);
    res.json({ message: "Seeded" });
});

io.on('connection', (socket) => {
  setInterval(() => {
    socket.emit('shipmentUpdate', {
      id: "TRK-99",
      lat: 31.5204 + (Math.random() * 0.01),
      lng: 74.3587 + (Math.random() * 0.01)
    });
  }, 5000);
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(5000, () => console.log('Backend Port 5000'));
});