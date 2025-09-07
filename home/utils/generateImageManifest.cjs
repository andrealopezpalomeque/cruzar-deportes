const fs = require('fs')
const path = require('path')

// Build-time script to generate an image manifest
function generateImageManifest() {
  const publicDir = path.join(__dirname, '../public/images')
  const manifest = {}
  
  // Categories to scan
  const categories = ['afc', 'caf', 'eredivisie', 'lpf_afa', 'serie_a_enilive']
  
  categories.forEach(category => {
    const categoryPath = path.join(publicDir, category)
    
    if (!fs.existsSync(categoryPath)) return
    
    manifest[category] = {}
    
    const teams = fs.readdirSync(categoryPath).filter(item => {
      const teamPath = path.join(categoryPath, item)
      return fs.statSync(teamPath).isDirectory()
    })
    
    teams.forEach(team => {
      const teamPath = path.join(categoryPath, team)
      const images = fs.readdirSync(teamPath)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .sort((a, b) => {
          // Sort by the image index in the filename
          const aMatch = a.match(/_img_(\d+)_/)
          const bMatch = b.match(/_img_(\d+)_/)
          
          if (aMatch && bMatch) {
            return parseInt(aMatch[1]) - parseInt(bMatch[1])
          }
          
          return a.localeCompare(b)
        })
        .map(file => `/images/${category}/${team}/${file}`)
      
      if (images.length > 0) {
        manifest[category][team] = images
      }
    })
  })
  
  // Write manifest to a TypeScript file
  const manifestContent = `// Auto-generated image manifest
// Run 'node utils/generateImageManifest.cjs' to regenerate

export const imageManifest: Record<string, Record<string, string[]>> = ${JSON.stringify(manifest, null, 2)}

export function getTeamImagesFromManifest(teamKey: string, category: string): string[] {
  return imageManifest[category]?.[teamKey] || []
}
`
  
  const outputPath = path.join(__dirname, 'imageManifest.ts')
  fs.writeFileSync(outputPath, manifestContent)
  
  console.log(`Generated image manifest with ${Object.keys(manifest).length} categories`)
  console.log('Total teams:', Object.values(manifest).reduce((total, category) => total + Object.keys(category).length, 0))
}

if (require.main === module) {
  generateImageManifest()
}

module.exports = { generateImageManifest }