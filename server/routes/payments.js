import express from 'express';
import Registration from '../models/Registration.js';

const router = express.Router();

// Initialize payment (stub for M-Pesa integration)
router.post('/mpesa', async (req, res) => {
  try {
    const { registrationId, phone, amount } = req.body;

    // TODO: Integrate with Pesapal M-Pesa API
    // For now, return a mock payment URL
    const mockPaymentUrl = `https://sandbox.pesapal.com/api/pay?amount=${amount}&phone=${phone}`;

    // Update registration with payment reference
    await Registration.findByIdAndUpdate(registrationId, {
      paymentReference: `MOCK_${Date.now()}`
    });

    res.json({
      paymentUrl: mockPaymentUrl,
      message: 'Payment link generated (mock implementation)'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify payment callback
router.post('/verify', async (req, res) => {
  try {
    const { registrationId, status } = req.body;

    // Update registration payment status
    await Registration.findByIdAndUpdate(registrationId, {
      payment_status: status === 'completed' ? 'completed' : 'failed'
    });

    res.json({
      message: 'Payment status updated',
      status
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
