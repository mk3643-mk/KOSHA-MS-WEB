import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await kv.get('kosha_app_state');
    return NextResponse.json(data || {});
  } catch (error) {
    console.error('KV Get Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await kv.set('kosha_app_state', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('KV Set Error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
