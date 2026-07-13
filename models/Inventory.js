const mongoose = require("mongoose");
// Inventory Schema: Represents items in the warehouse with stock levels, cost, and category.
const InventorySchema = new mongoose.Schema({
  itemName: String,
  category: {
    type: String,
    enum: ["Electronics", "Raw Material", "Finished Goods"],
  },
  sku: { type: String, unique: true },
  currentStock: Number,
  reservedStock: Number, 
  minThreshold: Number, 
  warehouseLocation: String,
  unitCost: Number,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inventory", InventorySchema);
