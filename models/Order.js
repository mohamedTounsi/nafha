import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      image: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 8,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
