import { NextResponse } from 'next/server';
import { addDiscussionLink } from '@/lib/archive-actions';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    await addDiscussionLink(form);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
