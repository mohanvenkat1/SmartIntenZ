$env:Path = "C:\Program Files\nodejs;" + $env:Path
Write-Host "Node.js Path temporarily added to this session."
npm install
npm start
