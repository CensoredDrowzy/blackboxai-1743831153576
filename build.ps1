# Modified Build Script (Windows PowerShell compatible)
param(
    [string]$Configuration = "Release",
    [string]$OutputDir = ".\dist"
)

# Check for .NET SDK
$dotnetVersion = (dotnet --version 2>&1 | Out-String).Trim()
if (-not $dotnetVersion -or $dotnetVersion -match "command not found") {
    Write-Host "Error: .NET SDK not found" -ForegroundColor Red
    exit 1
}

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

# Build .NET Core components
dotnet publish .\src\ -c $Configuration -o $OutputDir --self-contained true -r win-x64 /p:PublishSingleFile=true

# Copy web assets
Copy-Item -Path .\wwwroot\* -Destination $OutputDir\wwwroot -Recurse -Force

# Create zip archive
$version = (Get-Item .\src\Program.cs).LastWriteTime.ToString("yyyyMMddHHmm")
Compress-Archive -Path $OutputDir\* -DestinationPath ".\MiniRoyaleCheat-$version.zip" -Force

Write-Host "Build completed successfully. Output: .\MiniRoyaleCheat-$version.zip" -ForegroundColor Green