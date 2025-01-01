#!/bin/bash

# Create public directory if it doesn't exist
mkdir -p public

# Generate 192x192 icon
convert -background none -size 192x192 public/icon.svg public/icon-192x192.png

# Generate 512x512 icon
convert -background none -size 512x512 public/icon.svg public/icon-512x512.png 