import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    
    // Check if already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 400 });
    }

    const subscriber = await Newsletter.create({ email });
    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('Newsletter POST Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
