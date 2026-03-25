#!/bin/bash
set -e

log() { echo "[$(date '+%H:%M:%S')] $1"; }

log "Node: $(node --version) | npm: $(npm --version)"

log "Installing dependencies..."
npm install --legacy-peer-deps
log "Dependencies installed successfully."

log "Setting NODE_OPTIONS for OpenSSL legacy provider (required for Node 17+)..."
export NODE_OPTIONS=--openssl-legacy-provider

log "Starting dev server at http://localhost:3000 ..."
npm run dev
