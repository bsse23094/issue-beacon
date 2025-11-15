# GitHub Pages Deployment Script
# Production builds automatically use environment.prod.ts (no token)
# Your local environment.ts keeps your token for development

Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Build the app (production config automatically uses environment.prod.ts)
Write-Host "`nBuilding application..." -ForegroundColor Yellow
npm run build -- --base-href=/issue-beacon/

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBuild failed!" -ForegroundColor Red
    exit 1
}

# Deploy to GitHub Pages
Write-Host "`nDeploying to GitHub Pages..." -ForegroundColor Yellow
npx angular-cli-ghpages --dir=dist/github-issue-explorer/browser

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment successful!" -ForegroundColor Green
    Write-Host "Your app is live at: https://bsse23094.github.io/issue-beacon/" -ForegroundColor Cyan
} else {
    Write-Host "`nDeployment failed!" -ForegroundColor Red
    exit 1
}

