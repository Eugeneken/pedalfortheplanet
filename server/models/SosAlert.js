import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema({
  rider_name: { type: String, required: true },
  rider_phone: { type: String },
  route_km: { type: String },
  route_name: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  maps_url: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'resolved', 'acknowledged'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('SosAlert', sosAlertSchema);
