import express from 'express';
import SosAlert from '../models/SosAlert.js';

const router = express.Router();

// Get all SOS alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await SosAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active SOS alerts
router.get('/active', async (req, res) => {
  try {
    const alerts = await SosAlert.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get SOS alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await SosAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'SOS alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create SOS alert
router.post('/', async (req, res) => {
  const alert = new SosAlert({
    rider_name: req.body.rider_name,
    rider_phone: req.body.rider_phone,
    route_km: req.body.route_km,
    route_name: req.body.route_name,
    lat: req.body.lat,
    lng: req.body.lng,
    maps_url: req.body.maps_url,
    status: 'active'
  });

  try {
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update SOS alert
router.put('/:id', async (req, res) => {
  try {
    const alert = await SosAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'SOS alert not found' });

    if (req.body.rider_name) alert.rider_name = req.body.rider_name;
    if (req.body.rider_phone) alert.rider_phone = req.body.rider_phone;
    if (req.body.status) alert.status = req.body.status;
    alert.updatedAt = new Date();

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
