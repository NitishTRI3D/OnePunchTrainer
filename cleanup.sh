#!/bin/bash

# Files and directories to remove
rm -rf src/components
rm -rf src/hooks
rm -rf src/lib
rm -rf src/pages
rm -rf src/types
rm -f src/index.css
rm -f src/vite-env.d.ts

# Keep only these files:
# - src/App.tsx
# - src/App.css
# - src/main.tsx
# - package.json
# - package-lock.json
# - tsconfig.json
# - index.html
# - tailwind.config.js
# - postcss.config.js

echo "Cleanup complete! Remaining essential files:"
echo "- src/App.tsx"
echo "- src/App.css"
echo "- src/main.tsx"
echo "- configuration files (package.json, tsconfig.json, etc.)" 