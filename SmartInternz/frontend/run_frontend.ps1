$env:Path = "C:\Program Files\nodejs;" + $env:Path
Write-Host "Node.js Path added. Starting Frontend..."
npm install
npm run dev
