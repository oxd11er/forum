import { NextResponse } from 'next/server';
import { addDiscussionFile } from '@/lib/archive-actions';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    await addDiscussionFile(form);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
