import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase configuration - you'll need to set these environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY // Service role key (not anon key)

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   EXPO_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_KEY')
  console.error(
    '\nPlease add these to your .env file or set them as environment variables.'
  )
  process.exit(1)
}

interface DatabaseFile {
  name: string
  path: string
  order: number
}

// Database files in the correct deployment order
const databaseFiles: DatabaseFile[] = [
  { name: 'users.sql', path: 'src/database/users.sql', order: 1 },
  { name: 'categories.sql', path: 'src/database/categories.sql', order: 2 },
  { name: 'products.sql', path: 'src/database/products.sql', order: 3 },
  { name: 'orders.sql', path: 'src/database/orders.sql', order: 4 },
  { name: 'order_items.sql', path: 'src/database/order_items.sql', order: 5 },
]

async function executeSQLFile(
  filePath: string,
  fileName: string
): Promise<boolean> {
  try {
    console.log(`📄 Reading ${fileName}...`)

    const absolutePath = path.resolve(filePath)
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`)
    }

    const sqlContent = fs.readFileSync(absolutePath, 'utf8')

    if (!sqlContent.trim()) {
      throw new Error(`File is empty: ${fileName}`)
    }

    console.log(`🚀 Executing ${fileName}...`)

    // Execute SQL using Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        apikey: SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        sql: sqlContent,
      }),
    })

    if (!response.ok) {
      // Try alternative method using direct SQL execution
      const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          apikey: SUPABASE_SERVICE_KEY,
        },
        body: sqlContent,
      })

      if (!sqlResponse.ok) {
        const errorText = await sqlResponse.text()
        throw new Error(`HTTP ${sqlResponse.status}: ${errorText}`)
      }
    }

    console.log(`✅ Successfully executed ${fileName}`)
    return true
  } catch (error) {
    console.error(`❌ Error executing ${fileName}:`)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    } else {
      console.error(`   ${String(error)}`)
    }
    return false
  }
}

async function deployDatabase(): Promise<void> {
  console.log('🚀 Starting database deployment...\n')

  console.log('📋 Files to deploy:')
  databaseFiles.forEach((file) => {
    console.log(`   ${file.order}. ${file.name}`)
  })
  console.log('')

  let successCount = 0
  let failureCount = 0

  for (const file of databaseFiles) {
    const success = await executeSQLFile(file.path, file.name)
    if (success) {
      successCount++
    } else {
      failureCount++
    }
    console.log('') // Add spacing between files
  }

  console.log('📊 Deployment Summary:')
  console.log(`   ✅ Successful: ${successCount}`)
  console.log(`   ❌ Failed: ${failureCount}`)
  console.log(`   📁 Total files: ${databaseFiles.length}`)

  if (failureCount > 0) {
    console.log(
      '\n⚠️  Some files failed to deploy. Please check the errors above.'
    )
    console.log(
      '💡 You can also manually execute the failed SQL files in your Supabase SQL Editor.'
    )
    process.exit(1)
  } else {
    console.log('\n🎉 Database deployment completed successfully!')
    console.log('✨ Your database schema is now ready to use.')

    console.log('\n📝 Next steps:')
    console.log('   1. Check your Supabase Dashboard > Table Editor')
    console.log(
      '   2. Verify all tables are created: users, categories, products, orders, order_items'
    )
    console.log('   3. Test your app authentication and data loading')
    console.log(
      '   4. Add sample data using the examples in DATABASE_DEPLOYMENT.md'
    )
  }
}

// Helper function to check Supabase connection
async function checkSupabaseConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing Supabase connection...')

    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        apikey: SUPABASE_SERVICE_KEY,
      },
    })

    if (response.ok) {
      console.log('✅ Supabase connection successful')
      return true
    } else {
      console.error(`❌ Supabase connection failed: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Main execution
async function main() {
  try {
    console.log('🏪 E-Commerce Database Deployment Tool')
    console.log('=====================================\n')

    // Check connection first
    const connectionOk = await checkSupabaseConnection()
    if (!connectionOk) {
      console.log('\n💡 Troubleshooting tips:')
      console.log('   - Verify your SUPABASE_URL is correct')
      console.log(
        '   - Ensure SUPABASE_SERVICE_KEY is the service role key (not anon key)'
      )
      console.log('   - Check your internet connection')
      process.exit(1)
    }

    console.log('')
    await deployDatabase()
  } catch (error) {
    console.error('\n💥 Unexpected error during deployment:')
    console.error(error)
    process.exit(1)
  }
}

// Run the deployment
main()
