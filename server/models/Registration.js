import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  route_km: { type: String, required: true },
  tier: { type: String, required: true, enum: ['Individual', 'Family of 4'] },
  tshirt_size: { type: String, default: 'M', enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  payment_status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
  lat: { type: Number },
  lng: { type: Number },
  paymentReference: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Registration', registrationSchema);
