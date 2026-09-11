# Desabilita a verificacao de certificado SSL/TLS no Node.js para esta sessao
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# Define o caminho explicito para o binario do esbuild
$env:ESBUILD_BINARY_PATH = "$PSScriptRoot\node_modules\@esbuild\win32-x64\esbuild.exe"

# Desabilita o SSL estrito no NPM
npm config set strict-ssl false

# Desbloqueia os binarios do esbuild e node_modules
Get-ChildItem -Path "$PSScriptRoot\node_modules" -Include *.exe,*.dll,*.node -Recurse -ErrorAction SilentlyContinue | Unblock-File

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Iniciando aplicacao Vite (SSL/TLS Desabilitado)..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# Executa o servidor Vite via Node.js
node .\node_modules\vite\bin\vite.js
