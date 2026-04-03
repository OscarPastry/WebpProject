
import { prisma } from '@/lib/prisma'
import DbExplorerClient from './DbExplorerClient'

export default async function DbExplorerPage() {
  const tablesResult = await prisma.$queryRawUnsafe<{ table_name: string }[]>(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name NOT LIKE '\\_prisma\\_migrations'
    ORDER BY table_name
  `)
  const tables = tablesResult.map(t => t.table_name)

  const columnsResult = await prisma.$queryRawUnsafe<{ table_name: string, column_name: string, data_type: string, is_nullable: string }[]>(`
    SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `)

  const pkResult = await prisma.$queryRawUnsafe<{ table_name: string, column_name: string }[]>(`
    SELECT tc.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'
  `)

  const fkResult = await prisma.$queryRawUnsafe<{ table_name: string, column_name: string, foreign_table_name: string, foreign_column_name: string }[]>(`
    SELECT tc.table_name, kcu.column_name,
           ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
  `)

  const dbSchema = tables.map(tableName => {
    const cols = columnsResult.filter(c => c.table_name === tableName)
    const pks  = pkResult.filter(p => p.table_name === tableName).map(p => p.column_name)
    const fks  = fkResult.filter(f => f.table_name === tableName)
    return {
      tableName,
      columns: cols.map(col => ({
        name: col.column_name, type: col.data_type,
        isNullable: col.is_nullable === 'YES',
        isPk: pks.includes(col.column_name),
        fkTarget: fks.find(f => f.column_name === col.column_name) || null
      }))
    }
  })

  const rowCounts = await Promise.all(
    tables.map(async t => {
      const r = await prisma.$queryRawUnsafe<{ count: number | bigint }[]>(`SELECT COUNT(*) FROM "${t}"`)
      return { tableName: t, count: Number(r[0].count) }
    })
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* DB Explorer Header */}
      <div className="border-b-[3px] border-black bg-[#ece8dd] px-8 py-5 flex items-end justify-between shrink-0">
        <div>
          <p className="font-mono text-xs uppercase font-black text-black/40 mb-1">Interactive Database</p>
          <h1 className="font-headline font-black text-4xl uppercase tracking-tighter leading-none">
            DB <span className="bg-[#ffe500] px-2 border-[3px] border-black">Explorer</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-mono font-black text-sm">{tables.length} TABLES</p>
          <p className="font-mono text-xs text-black/40">PostgreSQL · Prisma ORM</p>
        </div>
      </div>

      {/* Explorer Panel */}
      <div className="flex-1 overflow-hidden border-[3px] border-black m-4"
        style={{ boxShadow: '6px 6px 0px 0px #000' }}>
        <DbExplorerClient schema={dbSchema} rowCounts={rowCounts} />
      </div>
    </div>
  )
}
