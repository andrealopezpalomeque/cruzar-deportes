#!/usr/bin/env node

import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') })

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Failed files from the migration report
const failedFiles = [
  'johor_photo_img_0_1755054047472.jpg',
  'boca_photo_img_19_1757200707086.jpg',
  'boca_photo_img_38_1757200828883.jpg',
  'boca_authentic_photo_img_14_1755187937402.jpg',
  'boca_authentic_photo_img_41_1755188030717.jpg',
  'boca_authentic_photo_img_7_1755187915979.jpg',
  'boca_kid_kits_photo_img_13_1755188149958.jpg',
  'boca_kid_kits_photo_img_37_1755188258493.jpg',
  'boca_kid_kits_photo_img_8_1755188132877.jpg',
  'newells_old_boys_photo_img_10_1755186998077.jpg',
  'racing_photo_img_37_1757200563065.jpg',
  'racing_player_version_photo_img_15_1755186570449.jpg',
  'racing_player_version_photo_img_5_1755186544626.jpg',
  'river_kid_kit_photo_img_13_1757199551707.jpg',
  'river_long_sleeve_photo_img_2_1755187261465.jpg',
  'river_long_sleeve_authentic_photo_img_7_1755186262996.jpg',
  'sarsfield_photo_img_9_1757200210357.jpg',
  'argentina_2006_photo_img_11_1757577821705.jpg',
  'argentina_2006_photo_img_38_1757577911899.jpg',
  'argentina_2010_photo_img_20_1757578022492.jpg',
  'argentina_2014_photo_img_25_1757578145890.jpg',
  'argentina_2014_adizero_photo_img_13_1757575421663.jpg',
  'argentina_2014_adizero_photo_img_9_1757575409626.jpg',
  'argentina_2014_long_sleeve_player_version_photo_img_22_1757572017612.jpg',
  'argentina_2014_world_final_photo_img_8_1757572884679.jpg',
  'bulgaria_1994_photo_img_15_1757370751219.jpg',
  'china_1998_photo_img_17_1757376023479.jpg',
  'china_2002_photo_img_16_1757375877268.jpg',
  'czech_1996_photo_img_25_1757376702427.jpg',
  'denmark_1986_photo_img_18_1757373333939.jpg',
  'denmark_1986_photo_img_7_1757373227113.jpg',
  'denmark_1998_photo_img_10_1757372645113.jpg',
  'denmark_88_photo_img_12_1757376859381.jpg',
  'england_02_long_sleeve_photo_img_5_1757366806372.jpg',
  'england_1980_photo_img_21_1757373705810.jpg',
  'england_1982_photo_img_23_1757373803642.jpg',
  'england_1989_photo_img_26_1757373905166.jpg',
  'england_1990_photo_img_15_1757373973772.jpg',
  'england_1990_photo_img_34_1757374025079.jpg',
  'england_1990_photo_img_8_1757373953157.jpg',
  'england_1994_photo_img_1_1757374142468.jpg',
  'england_1994_photo_img_6_1757374159222.jpg',
  'england_1996_photo_img_26_1757374360392.jpg',
  'england_1998_shorts_photo_img_3_1757368213443.jpg',
  'england_2002_photo_img_17_1757374714665.jpg',
  'england_2002_photo_img_44_1757374792208.jpg',
  'england_2002_photo_img_6_1757374681071.jpg',
  'england_2004_photo_img_6_1757374895702.jpg',
  'england_2010_photo_img_0_1757375017144.jpg',
  'england_2010_photo_img_2_1757375024612.jpg',
  'england_2018_photo_img_0_1757375273464.jpg',
  'england_82_kid_kit_photo_img_13_1757368338085.jpg',
  'england_92_photo_img_10_1757376968393.jpg',
  'england_92_photo_img_4_1757376949866.jpg',
  'england_96_kid_kit_photo_img_19_1757368413043.jpg',
  'england_96_long_sleeve_photo_img_11_1757366755725.jpg',
  'finland_1982_photo_img_8_1757372006404.jpg',
  'iceland_16_17_photo_img_13_1757370543565.jpg',
  'italy_1982_photo_img_3_1757377032069.jpg',
  'italy_1990_photo_img_17_1757377686439.jpeg',
  'italy_1994_photo_img_29_1757377792111.jpg',
  'italy_1994_photo_img_43_1757377837078.jpg',
  'italy_94_kid_kit_photo_img_0_1757369976603.jpg',
  'italy_95_photo_img_1_1757379679319.jpg',
  'italy_96_photo_img_20_1757379845788.jpg',
  'italy_96_photo_img_37_1757379898253.jpg',
  'japan_00_photo_img_5_1757379387849.jpg',
  'japan_10_photo_img_12_1757379350256.jpg',
  'japan_16_17_photo_img_1_1757375340618.jpg',
  'japan_18_kid_kit_photo_img_1_1757368889308.jpg',
  'japan_1998_photo_img_48_1757376332296.jpg',
  'japan_98_gk_long_sleeve_photo_img_12_1757366700517.jpg',
  'japan_99_photo_img_6_1757379459176.jpg',
  'japan_captain_tsubasa_photo_img_26_1757367012534.jpg',
  'korea_20_photo_img_10_1757378201808.jpg',
  'netherland_04_photo_img_18_1757371837075.jpg',
  'netherland_04_photo_img_35_1757371889029.jpg',
  'netherland_08_photo_img_8_1757371948298.jpg',
  'netherland_2002_photo_img_7_1757370276961.jpg',
  'netherland_98_long_sleeve_photo_img_5_1757366282473.jpg',
  'netherlands_1988_photo_img_31_1757369367945.jpg',
  'netherlands_1988_kid_kit_photo_img_20_1757366572603.jpg',
  'netherlands_1988_long_sleeve_photo_img_8_1757366189092.jpg',
  'netherlands_1996_photo_img_11_1757369669943.jpg',
  'netherlands_1998_photo_img_22_1757369775363.jpg',
  'netherlands_2014_photo_img_0_1757369874114.jpg',
  'north_ireland_79_photo_img_10_1757369210340.jpg',
  'north_ireland_88_photo_img_3_1757369141743.jpg',
  'north_ireland_90_93_away_photo_img_9_1757366357136.jpg',
  'norway_98_99_photo_img_12_1757372069686.jpg',
  'poland_12_photo_img_12_1757378133019.jpg',
  'poland_1982_photo_img_5_1757375467828.jpg',
  'romania_1994_photo_img_13_1757373466306.jpg'
]

function findImagePath(fileName) {
  // Try to find the image file in the public/images directory structure
  const basePath = join(__dirname, '../public/images')

  // Common directory structures to check
  const searchPaths = [
    // AFC teams
    'afc/johor',
    'afc/seoul_fc',
    // LPF AFA teams
    'lpf_afa/boca',
    'lpf_afa/boca_authentic',
    'lpf_afa/boca_kid_kits',
    'lpf_afa/newells_old_boys',
    'lpf_afa/racing',
    'lpf_afa/racing_player_version',
    'lpf_afa/river_kid_kit',
    'lpf_afa/river_long_sleeve',
    'lpf_afa/river_long_sleeve_authentic',
    'lpf_afa/sarsfield',
    // National retro teams
    'national_retro/argentina_2006',
    'national_retro/argentina_2010',
    'national_retro/argentina_2014',
    'national_retro/argentina_2014_adizero',
    'national_retro/argentina_2014_long_sleeve_player_version',
    'national_retro/argentina_2014_world_final',
    'national_retro/bulgaria_1994',
    'national_retro/china_1998',
    'national_retro/china_2002',
    'national_retro/czech_1996',
    'national_retro/denmark_1986',
    'national_retro/denmark_1998',
    'national_retro/denmark_88',
    'national_retro/england_02_long_sleeve',
    'national_retro/england_1980',
    'national_retro/england_1982',
    'national_retro/england_1989',
    'national_retro/england_1990',
    'national_retro/england_1994',
    'national_retro/england_1996',
    'national_retro/england_1998_shorts',
    'national_retro/england_2002',
    'national_retro/england_2004',
    'national_retro/england_2010',
    'national_retro/england_2018',
    'national_retro/england_82_kid_kit',
    'national_retro/england_92',
    'national_retro/england_96_kid_kit',
    'national_retro/england_96_long_sleeve',
    'national_retro/finland_1982',
    'national_retro/iceland_16_17',
    'national_retro/italy_1982',
    'national_retro/italy_1990',
    'national_retro/italy_1994',
    'national_retro/italy_94_kid_kit',
    'national_retro/italy_95',
    'national_retro/italy_96',
    'national_retro/japan_00',
    'national_retro/japan_10',
    'national_retro/japan_16_17',
    'national_retro/japan_18_kid_kit',
    'national_retro/japan_1998',
    'national_retro/japan_98_gk_long_sleeve',
    'national_retro/japan_99',
    'national_retro/japan_captain_tsubasa',
    'national_retro/korea_20',
    'national_retro/netherland_04',
    'national_retro/netherland_08',
    'national_retro/netherland_2002',
    'national_retro/netherland_98_long_sleeve',
    'national_retro/netherlands_1988',
    'national_retro/netherlands_1988_kid_kit',
    'national_retro/netherlands_1988_long_sleeve',
    'national_retro/netherlands_1996',
    'national_retro/netherlands_1998',
    'national_retro/netherlands_2014',
    'national_retro/north_ireland_79',
    'national_retro/north_ireland_88',
    'national_retro/north_ireland_90_93_away',
    'national_retro/norway_98_99',
    'national_retro/poland_12',
    'national_retro/poland_1982',
    'national_retro/romania_1994'
  ]

  for (const searchPath of searchPaths) {
    const fullPath = join(basePath, searchPath, fileName)
    if (existsSync(fullPath)) {
      return fullPath
    }
  }

  return null
}

function getCloudinaryFolderFromFileName(fileName) {
  // Extract team info from filename and return appropriate Cloudinary folder
  if (fileName.includes('johor')) return 'products/afc/johor'
  if (fileName.includes('seoul_fc')) return 'products/afc/seoul_fc'
  if (fileName.includes('boca_authentic')) return 'products/lpf_afa/boca_authentic'
  if (fileName.includes('boca_kid_kits')) return 'products/lpf_afa/boca_kid_kits'
  if (fileName.includes('boca')) return 'products/lpf_afa/boca'
  if (fileName.includes('newells_old_boys')) return 'products/lpf_afa/newells_old_boys'
  if (fileName.includes('racing_player_version')) return 'products/lpf_afa/racing_player_version'
  if (fileName.includes('racing')) return 'products/lpf_afa/racing'
  if (fileName.includes('river_kid_kit')) return 'products/lpf_afa/river_kid_kit'
  if (fileName.includes('river_long_sleeve_authentic')) return 'products/lpf_afa/river_long_sleeve_authentic'
  if (fileName.includes('river_long_sleeve')) return 'products/lpf_afa/river_long_sleeve'
  if (fileName.includes('sarsfield')) return 'products/lpf_afa/sarsfield'

  // National retro teams
  if (fileName.startsWith('argentina_') || fileName.startsWith('bulgaria_') ||
      fileName.startsWith('china_') || fileName.startsWith('czech_') ||
      fileName.startsWith('denmark_') || fileName.startsWith('england_') ||
      fileName.startsWith('finland_') || fileName.startsWith('iceland_') ||
      fileName.startsWith('italy_') || fileName.startsWith('japan_') ||
      fileName.startsWith('korea_') || fileName.startsWith('netherland') ||
      fileName.startsWith('north_ireland') || fileName.startsWith('norway_') ||
      fileName.startsWith('poland_') || fileName.startsWith('romania_')) {

    // Extract team name from filename
    const teamName = fileName.split('_photo_img')[0]
    return `products/national_retro/${teamName}`
  }

  return 'products/misc'
}

async function uploadImageToCloudinary(localPath, cloudinaryFolder, fileName) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `cruzar-deportes/${cloudinaryFolder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ],
      overwrite: false,
      unique_filename: true,
      timeout: 60000 // 60 second timeout
    })

    return {
      original_filename: fileName,
      cloudinary_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    }
  } catch (error) {
    throw error
  }
}

async function retryFailedUploads() {
  console.log('🔄 Starting retry of failed uploads...')
  console.log(`📊 Found ${failedFiles.length} failed images to retry`)
  console.log('⚙️  Using Cloudinary cloud:', process.env.CLOUDINARY_CLOUD_NAME)

  const retryResults = {
    successful: [],
    failed: [],
    notFound: [],
    urlMapping: {}
  }

  // Load existing URL mapping to update it
  const urlMappingPath = join(__dirname, 'url-mapping.json')
  let existingMapping = {}
  if (existsSync(urlMappingPath)) {
    try {
      existingMapping = JSON.parse(readFileSync(urlMappingPath, 'utf8'))
    } catch (error) {
      console.log('⚠️  Could not load existing URL mapping, creating new one')
    }
  }

  for (let i = 0; i < failedFiles.length; i++) {
    const fileName = failedFiles[i]
    const localPath = findImagePath(fileName)

    console.log(`📤 Retrying ${i + 1}/${failedFiles.length}: ${fileName}`)

    if (!localPath) {
      console.log(`   ❌ File not found locally`)
      retryResults.notFound.push(fileName)
      continue
    }

    const cloudinaryFolder = getCloudinaryFolderFromFileName(fileName)
    console.log(`   📁 Folder: ${cloudinaryFolder}`)

    try {
      const result = await uploadImageToCloudinary(localPath, cloudinaryFolder, fileName)

      retryResults.successful.push({
        fileName,
        localPath,
        cloudinaryFolder,
        ...result
      })

      // Add to URL mapping
      const relativePath = localPath.replace(join(__dirname, '../public'), '')
      retryResults.urlMapping[relativePath] = result.cloudinary_url

      console.log(`   ✅ Success: ${result.cloudinary_url}`)
      console.log(`   📏 Size: ${Math.round(result.bytes / 1024)}KB (${result.width}x${result.height})`)
    } catch (error) {
      retryResults.failed.push({
        fileName,
        localPath,
        cloudinaryFolder,
        error: error.message
      })
      console.log(`   ❌ Failed: ${error.message}`)
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log('\n🎉 Retry Complete!')
  console.log(`✅ Successful uploads: ${retryResults.successful.length}`)
  console.log(`❌ Failed uploads: ${retryResults.failed.length}`)
  console.log(`🔍 Not found locally: ${retryResults.notFound.length}`)

  if (retryResults.failed.length > 0) {
    console.log('\n⚠️  Still failed:')
    retryResults.failed.forEach(({ fileName, error }) => {
      console.log(`   - ${fileName}: ${error}`)
    })
  }

  if (retryResults.notFound.length > 0) {
    console.log('\n🔍 Files not found locally:')
    retryResults.notFound.forEach(fileName => {
      console.log(`   - ${fileName}`)
    })
  }

  // Update URL mapping with new successful uploads
  const updatedMapping = { ...existingMapping, ...retryResults.urlMapping }

  // Save updated mapping and retry report
  const retryReportPath = join(__dirname, 'retry-failed-uploads-report.json')
  writeFileSync(retryReportPath, JSON.stringify(retryResults, null, 2))
  writeFileSync(urlMappingPath, JSON.stringify(updatedMapping, null, 2))

  console.log(`\n📄 Retry report saved to: ${retryReportPath}`)
  console.log(`🗺️  Updated URL mapping saved to: ${urlMappingPath}`)

  if (retryResults.successful.length > 0) {
    console.log('\n🔄 Next steps:')
    console.log('1. Rebuild your application to include the new URLs')
    console.log('2. Deploy the updated build')
    console.log('\nRun: npm run firebase:build-deploy')
  }

  return retryResults
}

// Check if Cloudinary config is set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration not found. Please set environment variables:')
  console.error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
  process.exit(1)
}

// Run retry
retryFailedUploads().catch(error => {
  console.error('💥 Retry failed:', error)
  process.exit(1)
})