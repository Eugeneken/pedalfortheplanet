import express from 'express';
import Registration from '../models/Registration.js';

const router = express.Router();

// Get all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create registration
router.post('/', async (req, res) => {
  const registration = new Registration({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    route_km: req.body.route_km,
    tier: req.body.tier,
    tshirt_size: req.body.tshirt_size || 'M',
    payment_status: 'pending'
  });

  try {
    const newRegistration = await registration.save();
    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update registration
router.put('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (req.body.name) registration.name = req.body.name;
    if (req.body.email) registration.email = req.body.email;
    if (req.body.phone) registration.phone = req.body.phone;
    if (req.body.route_km) registration.route_km = req.body.route_km;
    if (req.body.tier) registration.tier = req.body.tier;
    if (req.body.tshirt_size) registration.tshirt_size = req.body.tshirt_size;
    if (req.body.payment_status) registration.payment_status = req.body.payment_status;
    if (typeof req.body.lat !== 'undefined') registration.lat = req.body.lat;
    if (typeof req.body.lng !== 'undefined') registration.lng = req.body.lng;
    if (req.body.paymentReference) registration.paymentReference = req.body.paymentReference;
    registration.updatedAt = new Date();

    const updatedRegistration = await registration.save();
    res.json(updatedRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
