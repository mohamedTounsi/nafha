import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock amount'],
    default: 0,
  },
  category: {
    type: [String],
    required: [true, 'Please provide at least one category'],
  },
}, {
  timestamps: true,
});

// Force deletion of existing model to apply schema changes in development
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model('Product', ProductSchema);
