import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   EXPO_PUBLIC_SUPABASE_URL')
  console.error('   EXPO_PUBLIC_SUPABASE_ANON_KEY')
  console.error('\nPlease add these to your .env file.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface TableInfo {
  name: string
  exists: boolean
  rowCount?: number
  error?: string
}

async function checkTable(tableName: string): Promise<TableInfo> {
  try {
    // Check if table exists and get row count
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        name: tableName,
        exists: false,
        error: error.message,
      }
    }

    return {
      name: tableName,
      exists: true,
      rowCount: count || 0,
    }
  } catch (error) {
    return {
      name: tableName,
      exists: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function checkDatabase(): Promise<void> {
  console.log('🔍 Checking Database Tables')
  console.log('===========================\n')

  const tables = ['users', 'categories', 'products', 'orders', 'order_items']
  const results: TableInfo[] = []

  console.log('📊 Table Status:')

  for (const tableName of tables) {
    const result = await checkTable(tableName)
    results.push(result)

    if (result.exists) {
      console.log(`   ✅ ${result.name.padEnd(12)} - ${result.rowCount} rows`)
    } else {
      console.log(
        `   ❌ ${result.name.padEnd(12)} - ${result.error || 'Not found'}`
      )
    }
  }

  const existingTables = results.filter((r) => r.exists)
  const missingTables = results.filter((r) => !r.exists)

  console.log('\n📋 Summary:')
  console.log(
    `   ✅ Existing tables: ${existingTables.length}/${tables.length}`
  )
  console.log(`   ❌ Missing tables: ${missingTables.length}/${tables.length}`)

  if (missingTables.length > 0) {
    console.log('\n⚠️  Missing tables:')
    missingTables.forEach((table) => {
      console.log(`   - ${table.name}`)
    })

    console.log('\n💡 To deploy missing tables:')
    console.log('   npm run deploy-db')
    console.log('\n📚 Or manually execute SQL files in Supabase Dashboard:')
    console.log('   1. Go to your Supabase project > SQL Editor')
    console.log(
      '   2. Execute files in this order: users.sql, categories.sql, products.sql, orders.sql, order_items.sql'
    )
  } else {
    console.log('\n🎉 All tables are deployed successfully!')

    const totalRows = existingTables.reduce(
      (sum, table) => sum + (table.rowCount || 0),
      0
    )
    console.log(`📈 Total data rows: ${totalRows}`)

    if (totalRows === 0) {
      console.log('\n💡 No data found. Consider adding sample data:')
      console.log('   - Check DATABASE_DEPLOYMENT.md for sample data queries')
      console.log(
        '   - Use Supabase Dashboard > Table Editor to add data manually'
      )
    }
  }

  // Test authentication connection
  console.log('\n🔐 Testing Authentication:')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.log('   ⚠️  Auth check failed:', error.message)
    } else {
      console.log('   ✅ Authentication service is working')
    }
  } catch (error) {
    console.log('   ❌ Auth connection error:', error)
  }
}

async function main() {
  try {
    await checkDatabase()
  } catch (error) {
    console.error('\n💥 Unexpected error:')
    console.error(error)
    process.exit(1)
  }
}

main()
