import { NextResponse } from 'next/server';
import { createDiscussion } from '@/lib/archive-actions';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const id = await createDiscussion(form);
    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
