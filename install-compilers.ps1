# ============================================
# Compiler Installation Script for Windows
# Run this script as ADMINISTRATOR
# ============================================

Write-Host "=== Compiler Installation Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}

$installDir = "C:\dev-tools"
$mingwDir = "$installDir\mingw64"
$javaDir = "$installDir\java"

# Create install directory
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# ============================================
# 1. Install MinGW (GCC/G++)
# ============================================
Write-Host "[1/3] Installing MinGW (GCC/G++)..." -ForegroundColor Green

$mingwUrl = "https://github.com/niXman/mingw-builds-binaries/releases/download/13.2.0-rt_v11-rev1/x86_64-13.2.0-release-posix-seh-ucrt-rt_v11-rev1.7z"
$mingwZip = "$env:TEMP\mingw.7z"

# Download 7-Zip portable for extraction
$7zUrl = "https://www.7-zip.org/a/7zr.exe"
$7zExe = "$env:TEMP\7zr.exe"

Write-Host "  Downloading 7-Zip extractor..." -ForegroundColor Gray
Invoke-WebRequest -Uri $7zUrl -OutFile $7zExe -UseBasicParsing

Write-Host "  Downloading MinGW (this may take a few minutes)..." -ForegroundColor Gray
Invoke-WebRequest -Uri $mingwUrl -OutFile $mingwZip -UseBasicParsing

Write-Host "  Extracting MinGW..." -ForegroundColor Gray
if (Test-Path $mingwDir) { Remove-Item -Recurse -Force $mingwDir }
& $7zExe x $mingwZip -o"$installDir" -y | Out-Null

# ============================================
# 2. Install Java (OpenJDK)
# ============================================
Write-Host "[2/3] Installing Java (OpenJDK 21)..." -ForegroundColor Green

$javaUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_windows_hotspot_21.0.2_13.zip"
$javaZip = "$env:TEMP\openjdk.zip"

Write-Host "  Downloading OpenJDK 21..." -ForegroundColor Gray
Invoke-WebRequest -Uri $javaUrl -OutFile $javaZip -UseBasicParsing

Write-Host "  Extracting Java..." -ForegroundColor Gray
if (Test-Path $javaDir) { Remove-Item -Recurse -Force $javaDir }
Expand-Archive -Path $javaZip -DestinationPath $installDir -Force
Rename-Item "$installDir\jdk-21.0.2+13" $javaDir -Force

# ============================================
# 3. Add to System PATH
# ============================================
Write-Host "[3/3] Adding to System PATH..." -ForegroundColor Green

$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$pathsToAdd = @("$mingwDir\bin", "$javaDir\bin")

foreach ($newPath in $pathsToAdd) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath = "$currentPath;$newPath"
        Write-Host "  Added: $newPath" -ForegroundColor Gray
    }
}

[Environment]::SetEnvironmentVariable("Path", $currentPath, "Machine")
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaDir, "Machine")

# Refresh current session PATH
$env:Path = $currentPath
$env:JAVA_HOME = $javaDir

# ============================================
# Verify Installation
# ============================================
Write-Host ""
Write-Host "=== Verifying Installation ===" -ForegroundColor Cyan

Write-Host ""
Write-Host "GCC Version:" -ForegroundColor Yellow
& "$mingwDir\bin\gcc.exe" --version 2>&1 | Select-Object -First 1

Write-Host ""
Write-Host "G++ Version:" -ForegroundColor Yellow
& "$mingwDir\bin\g++.exe" --version 2>&1 | Select-Object -First 1

Write-Host ""
Write-Host "Java Version:" -ForegroundColor Yellow
& "$javaDir\bin\java.exe" -version 2>&1 | Select-Object -First 1

Write-Host ""
Write-Host "Python Version:" -ForegroundColor Yellow
python --version 2>&1

# Cleanup
Remove-Item $mingwZip -Force -ErrorAction SilentlyContinue
Remove-Item $javaZip -Force -ErrorAction SilentlyContinue
Remove-Item $7zExe -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Installation Complete! ===" -ForegroundColor Green
Write-Host "Please RESTART your terminal for changes to take effect." -ForegroundColor Yellow
Write-Host ""
pause
