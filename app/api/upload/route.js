import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'nafha-products' },
        (error, result) => {
          if (error) {
            reject(NextResponse.json({ error: error.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ url: result.secure_url }));
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
