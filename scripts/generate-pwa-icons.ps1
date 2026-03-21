Add-Type -AssemblyName System.Drawing
$color = [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
$publicDir = (Resolve-Path (Join-Path (Join-Path $PSScriptRoot "..") "public")).Path
foreach ($size in @(192, 512)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear($color)
  $path = Join-Path $publicDir "pwa-${size}x${size}.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Wrote $path"
}
