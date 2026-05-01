import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body;

    // Check stock for all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Only ${product.stock} left.`);
      }
    }

    // Create order
    const order = await Order.create(body);

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
