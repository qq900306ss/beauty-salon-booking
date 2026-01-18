# PWA 圖標說明

請將 Linda 髮廊的 Logo 轉換成以下尺寸的 PNG 圖標檔案:

必需的圖標尺寸:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## 如何生成圖標

1. 準備一個 512x512 的高解析度 Logo 圖片
2. 使用線上工具生成多種尺寸:
   - https://www.pwabuilder.com/imageGenerator
   - https://realfavicongenerator.net/

3. 或使用 ImageMagick 命令列工具批次生成:
```bash
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

## 暫時解決方案

目前可以先使用 Emoji 或純色背景作為臨時圖標，等待設計完成後再替換。
