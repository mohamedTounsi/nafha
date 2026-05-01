import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
