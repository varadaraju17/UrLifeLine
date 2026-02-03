# PowerShell script to run Vite directly
# This bypasses issues with special characters in the directory path
Write-Host "Starting Frontend..."
node "node_modules/vite/bin/vite.js"
