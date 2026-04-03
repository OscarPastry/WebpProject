import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { query, safeMode } = await req.json()
    
    // In a real app never do this without extreme caution.
    // For this academic project, we allow arbitrary queries to showcase the DB!
    // But we might want to restrict to SELECT only if safeMode is true.
    if (safeMode && !query.trim().toLowerCase().startsWith('select')) {
      return NextResponse.json({ error: "Only SELECT queries are allowed in safe mode." }, { status: 400 })
    }

    // Convert BigInts from Prisma to string before JSON serialization
    const result = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(query)
    
    const serializeResult = (rows: Record<string, unknown>[]) => {
      return rows.map(row => {
        const serialized: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(row)) {
          serialized[key] = typeof val === 'bigint' ? val.toString() : val
        }
        return serialized
      })
    }

    return NextResponse.json({ result: serializeResult(result) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 })
  }
}
