import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
  }
}
