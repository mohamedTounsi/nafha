import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Save to DB only (Nodemailer removed as per request)
    const contact = await Contact.create({ name, email, message });

    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
