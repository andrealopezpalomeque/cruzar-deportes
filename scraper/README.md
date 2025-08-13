# Cruzar Deportes Sports Scraper

A professional, respectful image scraper for sports clothing e-commerce sites with anti-detection features and comprehensive progress tracking.

## 🚀 Quick Start - Two-Step Workflow

### Install Dependencies
```bash
yarn install
```

### Step 1: Discover Albums 🔍
```bash
node src/scraper.js [category_slug] [category_url]
```

### Step 2: Scrape Individual Album 📸
```bash
node src/scraper.js [category_slug] --album [album_url]
```

**Complete Example:**
```bash
# Step 1: Discover all albums in CAF category
node src/scraper.js caf "https://wavesoccer.x.yupoo.com/categories/4667651"

# Step 2: Scrape one specific album
node src/scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `node src/scraper.js --list` | List all available categories |
| `node src/scraper.js --progress` | Show current session progress |
| `node src/scraper.js --help` | Show help and usage examples |
| `node src/scraper.js [category] [category_url]` | **Step 1**: Discover albums in category |
| `node src/scraper.js [category] --album [album_url]` | **Step 2**: Scrape individual album |

## 🏷️ Popular Categories

| ID | Category | Description |
|----|----------|-------------|
| 334393 | 🇪🇸 LALIGA EA SPORTS | Spanish La Liga |
| 334373 | 🇩🇪 BUNDESLIGA | German Bundesliga |
| 335567 | 🏴 PREMIER LEAGUE | English Premier League |
| 334382 | 🇮🇹 SERIE A ENILIVE | Italian Serie A |
| 334371 | 🇫🇷 LIGUE1 MCDONALDS | French Ligue 1 |
| 334336 | 🇺🇸 MLS | Major League Soccer |
| 334330 | 🇦🇷 LPF AFA | Argentine Liga |

## 📁 Output Structure

Images are organized automatically by album titles:
```
scraper/downloads/
├── laliga_ea_sports_hypermotion/
│   ├── real_madrid_home_jerseys_2024/
│   │   ├── real_madrid_home_jerseys_2024_photo_img_0_1755022003.jpg
│   │   ├── real_madrid_home_jerseys_2024_photo_img_1_1755022004.jpg
│   │   └── real_madrid_home_jerseys_2024_photo_img_2_1755022005.jpg
│   ├── barcelona_away_kits/
│   │   ├── barcelona_away_kits_photo_img_0_1755022010.jpg
│   │   ├── barcelona_away_kits_photo_img_1_1755022011.jpg
│   │   └── barcelona_away_kits_photo_img_2_1755022012.jpg
│   └── training_collection/
│       ├── training_collection_photo_img_0_1755022020.jpg
│       └── training_collection_photo_img_1_1755022021.jpg
├── bundesliga/
│   ├── bayern_munich_collection/
│   └── borussia_dortmund_kits/
└── temp/                    # Temporary files (auto-cleaned)
```

**Folder Structure:** `[category]/[album_title]/images`  
**Filename Format:** `[album_title]_photo_img_[#]_[timestamp].jpg`

## 🛠️ Features

### ✅ Smart Album Detection
- **Album title extraction**: Automatically extracts meaningful album titles
- **Folder organization**: Creates individual folders for each album
- **Deep photo extraction**: Visits each album to download ALL photos
- **Smart title detection**: Multiple strategies to find descriptive album names
- **Fallback mode**: Direct image scraping if no albums detected

### ✅ Anti-Detection
- Rotating User-Agent headers from real browsers
- Proper referrer and image-specific headers
- Rate limiting (2s between requests, 5s between categories)
- Exponential backoff on errors

### ✅ Robust Processing
- Image validation (format, size, dimensions)
- Multiple image selector strategies
- Smart filename generation with timestamps
- Automatic directory organization by albums

### ✅ Progress Tracking
- Resumable sessions (stop/restart where left off)
- Failed download tracking with retry logic
- Comprehensive logging and session reports
- Progress percentages and detailed statistics

### ✅ Respectful Scraping
- Configurable delays between requests
- Request timeout handling
- Error recovery with backoff
- Minimal server impact

## 📊 Monitoring & Logs

All activities are logged in `scraper/logs/`:
- `scraper.log` - Main application log
- `errors.log` - Error-specific log
- `scraper-YYYY-MM-DD.log` - Daily logs
- `session-[id].log` - Session-specific logs

## 🔧 Configuration

Edit `src/config.js` to modify:
- Request delays and timeouts
- Image processing settings
- File naming patterns
- Logging levels

## 🚦 Two-Step Workflow Examples

### 1. Explore Available Categories
```bash
node src/scraper.js --list
```

### 2. Step 1: Discover Albums 🔍
```bash
# Discover all albums in CAF category
node src/scraper.js caf "https://wavesoccer.x.yupoo.com/categories/4667651"
```
**What happens:**
1. Scraper finds all album links on the category page
2. Extracts meaningful album titles from each link
3. Shows you a numbered list of all available albums
4. Saves album list to `scraper/data/scraped_metadata/caf_albums.json`
5. Provides exact commands for Step 2

**Example Output:**
```
🔍 Discovering albums in category: caf
📂 Category URL: https://wavesoccer.x.yupoo.com/categories/4667651

✅ Found 15 albums:

01. Morocco Home Jersey 2024
    📁 Folder: morocco_home_jersey_2024
    🔗 URL: https://wavesoccer.x.yupoo.com/albums/200353962?uid=1

02. Nigeria Away Kit Collection  
    📁 Folder: nigeria_away_kit_collection
    🔗 URL: https://wavesoccer.x.yupoo.com/albums/200353963?uid=1
```

### 3. Step 2: Scrape Individual Album 📸
```bash
# Scrape one specific album (baby steps!)
node src/scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"
```
**What happens:**
1. Creates folder: `scraper/downloads/caf/morocco_home_jersey_2024/`
2. Visits the album page
3. Downloads ALL photos from that album
4. Organizes files with descriptive names

### 4. Check Progress
```bash
node src/scraper.js --progress
```

### 5. Repeat Step 2 for More Albums
```bash
# Scrape another album when ready
node src/scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353963?uid=1"
```

### 🎯 Benefits of Two-Step Approach
- **Server-friendly**: No overwhelming requests
- **Selective scraping**: Choose only albums you want
- **Progress control**: Scrape at your own pace
- **Clear organization**: Each album in its own folder
- **Resume capability**: Continue where you left off

## ⚠️ Important Notes

1. **Always provide a source URL** - The scraper needs to know where to find images
2. **One category at a time** - Process categories individually for better control
3. **Respectful scraping** - Built-in delays prevent overwhelming target servers
4. **Resume capability** - Safe to stop and restart at any time
5. **Comprehensive logging** - All activities are tracked for debugging

## 🤝 Responsible Usage

This tool is designed for legitimate business purposes only. Please:
- Respect robots.txt files
- Follow target website terms of service
- Use appropriate delays between requests
- Monitor logs for any issues

---

**Built with ❤️ for Cruzar Deportes**