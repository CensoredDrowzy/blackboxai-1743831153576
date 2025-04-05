#!/bin/bash

# Build Script for Linux Environment
CONFIGURATION="Release"
OUTPUT_DIR="./dist"
VERSION=$(date +"%Y%m%d%H%M")

# Check for .NET SDK
if ! command -v dotnet &> /dev/null; then
    echo -e "\033[31mError: .NET SDK not found\033[0m"
    exit 1
fi

# Create output directory
mkdir -p $OUTPUT_DIR/wwwroot

# Build .NET components
echo "Building .NET components..."
dotnet publish ./src/ -c $CONFIGURATION -o $OUTPUT_DIR \
    --self-contained true -r linux-x64 /p:PublishSingleFile=true

# Copy web assets
echo "Copying web assets..."
cp -r ./wwwroot/* $OUTPUT_DIR/wwwroot/

# Create tar archive
echo "Creating package..."
tar -czf "MiniRoyaleCheat-$VERSION.tar.gz" -C $OUTPUT_DIR .

echo -e "\033[32mBuild completed successfully. Output: MiniRoyaleCheat-$VERSION.tar.gz\033[0m"