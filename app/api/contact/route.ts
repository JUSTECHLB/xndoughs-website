import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const { name, message } = body as { name?: string; message?: string }

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_submissions')
    .insert({ name: name.trim(), message: message.trim() })

  if (error) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
