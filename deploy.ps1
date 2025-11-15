# GitHub Pages Deployment Script
# This script builds and deploys the app without exposing your GitHub token

Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Step 1: Backup the current environment file with token
Write-Host "`nBacking up environment.ts..." -ForegroundColor Yellow
Copy-Item src/environments/environment.ts src/environments/environment.backup.ts -Force

# Step 2: Create deployment version without token
Write-Host "Creating deployment version (without token)..." -ForegroundColor Yellow
$envContent = Get-Content src/environments/environment.ts -Raw
$envContent = $envContent -replace "githubToken: '[^']*'", "githubToken: ''"
Set-Content src/environments/environment.ts $envContent

# Step 3: Build the app
Write-Host "`nBuilding application..." -ForegroundColor Yellow
npm run build -- --base-href=/issue-beacon/

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBuild failed! Restoring environment.ts..." -ForegroundColor Red
    Copy-Item src/environments/environment.backup.ts src/environments/environment.ts -Force
    Remove-Item src/environments/environment.backup.ts -Force
    exit 1
}

# Step 4: Deploy to GitHub Pages
Write-Host "`nDeploying to GitHub Pages..." -ForegroundColor Yellow
npx angular-cli-ghpages --dir=dist/github-issue-explorer/browser

# Step 5: Restore the original environment file with token
Write-Host "`nRestoring environment.ts with your token..." -ForegroundColor Yellow
Copy-Item src/environments/environment.backup.ts src/environments/environment.ts -Force
Remove-Item src/environments/environment.backup.ts -Force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment successful!" -ForegroundColor Green
    Write-Host "Your app is live at: https://bsse23094.github.io/issue-beacon/" -ForegroundColor Cyan
    Write-Host "Your local token has been restored for development" -ForegroundColor Green
} else {
    Write-Host "`nDeployment may have had issues, but environment.ts was restored" -ForegroundColor Yellow
}
