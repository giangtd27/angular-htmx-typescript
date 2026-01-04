require('dotenv').config()
const fs = require('fs')
const path = require('path')

// Get environment variables from .env (no defaults)
const apiUrl = process.env.API_URL
const appName = process.env.APP_NAME
const version = process.env.APP_VERSION
const htmxEnabled = process.env.HTMX_ENABLED
const enableLogging = process.env.ENABLE_LOGGING

// Validate required variables
const requiredVars = ['API_URL', 'APP_NAME', 'APP_VERSION', 'HTMX_ENABLED', 'ENABLE_LOGGING']
const missingVars = requiredVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(varName => console.error(`   - ${varName}`))
  console.error('\nPlease create a .env file with all required variables.')
  console.error('See .env.example for reference.')
  process.exit(1)
}

// Generate development environment
const devContent = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  appName: '${appName}',
  version: '${version}',
  htmxEnabled: ${htmxEnabled === 'true'},
  enableLogging: ${enableLogging === 'true'}
}
`

// Generate production environment
const prodContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  appName: '${appName}',
  version: '${version}',
  htmxEnabled: ${htmxEnabled === 'true'},
  enableLogging: ${enableLogging === 'true'}
}
`

// Write environment files
const envDir = path.join(__dirname, '..', 'src', 'environments')
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true })
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), devContent)
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodContent)

console.log('✅ Environment files generated successfully from .env')
console.log(`   - API URL: ${apiUrl}`)
console.log(`   - App Name: ${appName}`)
console.log(`   - Version: ${version}`)
console.log(`   - HTMX Enabled: ${htmxEnabled === 'true'}`)
console.log(`   - Logging Enabled: ${enableLogging === 'true'}`)

