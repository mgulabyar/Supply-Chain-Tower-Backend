const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  trackingId: String,
  origin: String,
  destination: String,
  status: { type: String, enum: ['In-Transit', 'Delivered', 'Delayed', 'Pending'] },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  eta: Date,
  carrier: String
});

module.exports = mongoose.model('Shipment', ShipmentSchema);