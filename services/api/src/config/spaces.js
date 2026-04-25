const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
})

const BUCKET = 'wiseutils-cdn'
const CDN_BASE = 'https://wiseutils-cdn.nyc3.cdn.digitaloceanspaces.com'

module.exports = { s3, BUCKET, CDN_BASE }
