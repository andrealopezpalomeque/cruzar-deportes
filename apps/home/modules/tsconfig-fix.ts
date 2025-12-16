import { defineNuxtModule } from '@nuxt/kit'
import { writeFileSync } from 'fs'
import { join } from 'path'

export default defineNuxtModule({
  meta: {
    name: 'tsconfig-fix',
    configKey: 'tsconfigFix'
  },
  setup(options, nuxt) {
    // Hook into the build:before event
    nuxt.hook('build:before', () => {
      const nuxtDir = join(nuxt.options.buildDir)
      
      // Create tsconfig.app.json
      const tsconfigApp = {
        extends: './tsconfig.json'
      }
      
      writeFileSync(
        join(nuxtDir, 'tsconfig.app.json'),
        JSON.stringify(tsconfigApp, null, 2)
      )
      
      // Create tsconfig.shared.json
      const tsconfigShared = {
        extends: './tsconfig.json'
      }
      
      writeFileSync(
        join(nuxtDir, 'tsconfig.shared.json'),
        JSON.stringify(tsconfigShared, null, 2)
      )
      
      // Create tsconfig.node.json
      const tsconfigNode = {
        extends: './tsconfig.json'
      }
      
      writeFileSync(
        join(nuxtDir, 'tsconfig.node.json'),
        JSON.stringify(tsconfigNode, null, 2)
      )
      
      console.log('✓ Generated tsconfig files via module hook')
    })
  }
})
