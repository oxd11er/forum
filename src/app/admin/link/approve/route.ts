import { NextResponse } from 'next/server';
import { adminApproveLink } from '@/lib/archive-actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await adminApproveLink(body.linkId, Boolean(body.approve));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
