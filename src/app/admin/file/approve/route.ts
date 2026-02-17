import { NextResponse } from 'next/server';
import { adminApproveFile } from '@/lib/archive-actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await adminApproveFile(body.fileId, Boolean(body.approve));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
