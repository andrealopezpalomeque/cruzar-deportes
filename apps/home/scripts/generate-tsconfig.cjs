const fs = require('fs')
const path = require('path')

const nuxtDir = path.join(__dirname, '../.nuxt')

// Ensure .nuxt directory exists
if (!fs.existsSync(nuxtDir)) {
  fs.mkdirSync(nuxtDir, { recursive: true })
}

// Create tsconfig.app.json
const tsconfigApp = {
  extends: './tsconfig.json'
}

fs.writeFileSync(
  path.join(nuxtDir, 'tsconfig.app.json'),
  JSON.stringify(tsconfigApp, null, 2)
)

// Create tsconfig.shared.json
const tsconfigShared = {
  extends: './tsconfig.json'
}

fs.writeFileSync(
  path.join(nuxtDir, 'tsconfig.shared.json'),
  JSON.stringify(tsconfigShared, null, 2)
)

console.log('✓ Generated tsconfig.app.json and tsconfig.shared.json')
