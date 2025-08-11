const fs = require('fs')
const path = require('path')

// Script to help deploy database schema to Supabase
// This will read all SQL files and provide instructions for deployment

const databaseDir = path.join(__dirname, '../src/database')
const deploymentOrder = [
  'users.sql',
  'categories.sql',
  'products.sql',
  'orders.sql',
  'order_items.sql',
]

console.log('🚀 Database Deployment Helper\n')
console.log('Follow these steps to deploy your database schema to Supabase:\n')

console.log('1. Go to your Supabase Dashboard: https://app.supabase.com')
console.log('2. Select your project')
console.log('3. Navigate to SQL Editor in the left sidebar')
console.log('4. Execute the following SQL files in this exact order:\n')

deploymentOrder.forEach((filename, index) => {
  const filePath = path.join(databaseDir, filename)

  if (fs.existsSync(filePath)) {
    console.log(`${index + 1}. Execute ${filename}:`)
    console.log(`   📁 File: src/database/${filename}`)
    console.log(`   📋 Copy the content and paste in Supabase SQL Editor`)
    console.log(`   ▶️  Click "Run" to execute\n`)
  } else {
    console.log(`❌ ${filename} not found!`)
  }
})

console.log('5. After deployment, verify in Table Editor that you see:')
console.log('   - users')
console.log('   - categories')
console.log('   - products')
console.log('   - orders')
console.log('   - order_items\n')

console.log('6. Test your app - the tables should now be accessible!\n')

console.log(
  '💡 Pro tip: You can also use the Supabase CLI for automated deployment'
)
console.log('   Run: npx supabase db push')
