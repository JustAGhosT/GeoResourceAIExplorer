import { NextResponse } from 'next/server'
import { MOCK_MINES } from '@/data/mines'

export async function GET() {
  // In a real application, you would fetch this data from a database
  // or an external API.
  return NextResponse.json(MOCK_MINES)
}