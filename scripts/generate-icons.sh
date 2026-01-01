#!/bin/bash

# PWA Icon Generator Script for PollutionX
# This script generates all required icon sizes from the SVG source

echo "🎨 Generating PWA icons for PollutionX..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is required. Install with:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt install imagemagick"
    echo "   Windows: Download from https://imagemagick.org/"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Source SVG file
SVG_SOURCE="public/icons/icon.svg"

if [ ! -f "$SVG_SOURCE" ]; then
    echo "❌ Source SVG file not found: $SVG_SOURCE"
    exit 1
fi

# Define icon sizes for PWA
SIZES=(16 32 36 48 72 96 128 144 152 180 192 384 512)

echo "📱 Generating icons..."

for size in "${SIZES[@]}"; do
    output_file="public/icons/icon-${size}x${size}.png"
    convert "$SVG_SOURCE" -resize "${size}x${size}" "$output_file"
    echo "   ✅ Generated ${size}x${size} icon"
done

# Generate favicon
convert "$SVG_SOURCE" -resize "32x32" "public/favicon.ico"
echo "   ✅ Generated favicon.ico"

# Generate Apple Touch Icon
convert "$SVG_SOURCE" -resize "180x180" "public/apple-touch-icon.png"
echo "   ✅ Generated apple-touch-icon.png"

echo ""
echo "🎉 PWA icons generated successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Test your PWA with: npm run dev"
echo "   2. Check PWA audit in Chrome DevTools > Lighthouse"
echo "   3. Deploy to production for full PWA functionality"
echo ""
echo "📱 PWA Features enabled:"
echo "   ✅ Install prompt"
echo "   ✅ Offline functionality"  
echo "   ✅ Background sync"
echo "   ✅ Push notifications"
echo "   ✅ App-like experience"
