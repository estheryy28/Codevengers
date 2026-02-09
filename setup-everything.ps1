# ============================================
# Complete Setup Script for Codevengers
# Run this script as ADMINISTRATOR
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Codevengers Complete Setup Script   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ============================================
# STEP 1: Install Node.js
# ============================================
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Green

$nodeInstalled = $false
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  Node.js already installed: $nodeVersion" -ForegroundColor Gray
        $nodeInstalled = $true
    }
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host "  Downloading Node.js LTS..." -ForegroundColor Gray
    
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $nodeMsi = "$env:TEMP\node-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
        
        Write-Host "  Installing Node.js (this may take a minute)..." -ForegroundColor Gray
        Start-Process msiexec.exe -Wait -ArgumentList "/i `"$nodeMsi`" /qn /norestart"
        
        # Refresh environment
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version 2>$null
        if ($nodeVersion) {
            Write-Host "  Node.js installed successfully: $nodeVersion" -ForegroundColor Green
            # Add to current session PATH if not there
            if ($env:Path -notlike "*nodejs*") {
                $env:Path = "C:\Program Files\nodejs;$env:Path"
            }
        } else {
            Write-Host "  WARNING: Node.js installation may require a restart" -ForegroundColor Yellow
        }
        
        Remove-Item $nodeMsi -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "  ERROR: Failed to download/install Node.js" -ForegroundColor Red
        Write-Host "  Please install manually from https://nodejs.org/" -ForegroundColor Yellow
    }
}

# ============================================
# STEP 2: Install Compilers (MinGW + Java)
# ============================================
Write-Host ""
Write-Host "[2/4] Installing Compilers (MinGW + OpenJDK)..." -ForegroundColor Green

$installDir = "C:\dev-tools"
$mingwDir = "$installDir\mingw64"
$javaDir = "$installDir\java"

# Create install directory
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# Install MinGW
$gccExists = Test-Path "$mingwDir\bin\gcc.exe"
if (-not $gccExists) {
    Write-Host "  Downloading MinGW (GCC/G++)..." -ForegroundColor Gray
    
    $mingwUrl = "https://github.com/niXman/mingw-builds-binaries/releases/download/13.2.0-rt_v11-rev1/x86_64-13.2.0-release-posix-seh-ucrt-rt_v11-rev1.7z"
    $mingwZip = "$env:TEMP\mingw.7z"
    $7zUrl = "https://www.7-zip.org/a/7zr.exe"
    $7zExe = "$env:TEMP\7zr.exe"
    
    try {
        Invoke-WebRequest -Uri $7zUrl -OutFile $7zExe -UseBasicParsing
        Invoke-WebRequest -Uri $mingwUrl -OutFile $mingwZip -UseBasicParsing
        
        Write-Host "  Extracting MinGW..." -ForegroundColor Gray
        & $7zExe x $mingwZip -o"$installDir" -y | Out-Null
        
        Remove-Item $mingwZip -Force -ErrorAction SilentlyContinue
        Remove-Item $7zExe -Force -ErrorAction SilentlyContinue
        
        Write-Host "  MinGW installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Failed to install MinGW" -ForegroundColor Red
    }
} else {
    Write-Host "  MinGW already installed" -ForegroundColor Gray
}

# Install Java
$javaExists = Test-Path "$javaDir\bin\java.exe"
if (-not $javaExists) {
    Write-Host "  Downloading OpenJDK 21..." -ForegroundColor Gray
    
    $javaUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_windows_hotspot_21.0.2_13.zip"
    $javaZip = "$env:TEMP\openjdk.zip"
    
    try {
        Invoke-WebRequest -Uri $javaUrl -OutFile $javaZip -UseBasicParsing
        
        Write-Host "  Extracting Java..." -ForegroundColor Gray
        Expand-Archive -Path $javaZip -DestinationPath $installDir -Force
        
        if (Test-Path "$installDir\jdk-21.0.2+13") {
            if (Test-Path $javaDir) { Remove-Item -Recurse -Force $javaDir }
            Rename-Item "$installDir\jdk-21.0.2+13" $javaDir -Force
        }
        
        Remove-Item $javaZip -Force -ErrorAction SilentlyContinue
        
        Write-Host "  OpenJDK installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Failed to install OpenJDK" -ForegroundColor Red
    }
} else {
    Write-Host "  OpenJDK already installed" -ForegroundColor Gray
}

# Update System PATH
Write-Host "  Updating System PATH..." -ForegroundColor Gray
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$pathsToAdd = @("$mingwDir\bin", "$javaDir\bin")

foreach ($newPath in $pathsToAdd) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath = "$currentPath;$newPath"
    }
}

[Environment]::SetEnvironmentVariable("Path", $currentPath, "Machine")
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaDir, "Machine")
$env:Path = $currentPath
$env:JAVA_HOME = $javaDir

# ============================================
# STEP 3: Install Frontend Dependencies
# ============================================
Write-Host ""
Write-Host "[3/4] Installing Frontend Dependencies..." -ForegroundColor Green

$frontendDir = "$projectDir\frontend"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

if (Test-Path $frontendDir) {
    Push-Location $frontendDir
    try {
        if (Test-Path $npmPath) {
            & $npmPath install 2>&1 | Out-Host
            Write-Host "  Frontend dependencies installed" -ForegroundColor Green
        } else {
            npm install 2>&1 | Out-Host
            Write-Host "  Frontend dependencies installed" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        Write-Host "  Try running 'npm install' manually in the frontend folder" -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "  ERROR: Frontend directory not found" -ForegroundColor Red
}

# ============================================
# STEP 4: Install Backend Dependencies
# ============================================
Write-Host ""
Write-Host "[4/4] Installing Backend Dependencies..." -ForegroundColor Green

$backendDir = "$projectDir\backend"

if (Test-Path $backendDir) {
    Push-Location $backendDir
    try {
        if (Test-Path $npmPath) {
            & $npmPath install 2>&1 | Out-Host
            Write-Host "  Backend dependencies installed" -ForegroundColor Green
        } else {
            npm install 2>&1 | Out-Host
            Write-Host "  Backend dependencies installed" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ERROR: Failed to install backend dependencies" -ForegroundColor Red
        Write-Host "  Try running 'npm install' manually in the backend folder" -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "  ERROR: Backend directory not found" -ForegroundColor Red
}

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         Installation Summary          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Node.js:" -ForegroundColor Yellow
try { node --version 2>$null } catch { & "C:\Program Files\nodejs\node.exe" --version 2>$null }

Write-Host ""
Write-Host "GCC:" -ForegroundColor Yellow
if (Test-Path "$mingwDir\bin\gcc.exe") {
    & "$mingwDir\bin\gcc.exe" --version 2>&1 | Select-Object -First 1
} else {
    Write-Host "  Not installed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Java:" -ForegroundColor Yellow
if (Test-Path "$javaDir\bin\java.exe") {
    & "$javaDir\bin\java.exe" -version 2>&1 | Select-Object -First 1
} else {
    Write-Host "  Not installed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Python:" -ForegroundColor Yellow
python --version 2>&1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "       Setup Complete!                 " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Please RESTART your terminal" -ForegroundColor Yellow
Write-Host "for all changes to take effect.        " -ForegroundColor Yellow
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "  Backend:  cd backend && npm start" -ForegroundColor White
Write-Host ""
pause
