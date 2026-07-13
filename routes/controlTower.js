const router = require('express').Router();
const Inventory = require('../models/Inventory');
const Shipment = require('../models/Shipment');
const { getPredictiveInsights } = require('../services/aiEngine');

router.get('/dashboard-summary', async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$currentStock", "$unitCost"] } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ["$currentStock", "$minThreshold"] }, 1, 0] }
          }
        }
      }
    ]);

    const shipments = await Shipment.find({ status: 'In-Transit' });
    const lowStockItems = await Inventory.find({ currentStock: { $lte: 50 } }); 

    let aiAdvise = "All clear.";
    if (lowStockItems.length > 0) {
      aiAdvise = await getPredictiveInsights(lowStockItems);
    }

    res.json({
      categories: stats,
      activeShipments: shipments,
      aiStrategy: aiAdvise
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/seed', async (req, res) => {
    await Inventory.create(req.body.inventory);
    await Shipment.create(req.body.shipments);
    res.json({ message: "Data Injected!" });
});

module.exports = router;