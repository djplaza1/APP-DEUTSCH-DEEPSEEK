# Script to replace the inline Babel block with minimal bootstrap
# and add script references for extracted modules

$lines = Get-Content '..\index.html' -Encoding UTF8
$outFile = '..\index.html'

Write-Host "Total lines: $($lines.Count)"

# Find the babel inline block boundaries
$babelStart = -1
$babelEnd = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '<script type="text/babel">' -and $i -gt 500) {
        $babelStart = $i
        Write-Host "Babel start at line $($i+1)"
        for ($j = $i+1; $j -lt $lines.Count; $j++) {
            if ($lines[$j] -match '</script>') {
                $babelEnd = $j
                Write-Host "Babel end at line $($j+1)"
                break
            }
        }
        break
    }
}

if ($babelStart -eq -1 -or $babelEnd -eq -1) {
    Write-Host "ERROR: Could not find babel block"
    exit 1
}

# Find where the module scripts end (last babel src script before the inline)
$lastScriptLine = -1
for ($i = $babelStart - 1; $i -ge 0; $i--) {
    if ($lines[$i] -match '</script>') {
        $lastScriptLine = $i
        break
    }
}
Write-Host "Last script before inline at line $($lastScriptLine+1)"

# The new script references to add
$newScripts = @(
    '    <script type="text/babel" src="src/hooks/useTelcExamClock.js"></script>',
    '    <script type="text/babel" src="src/hooks/TelcExamHud.jsx"></script>',
    '    <script type="text/babel" src="src/app-floating.jsx"></script>',
    '    <script type="text/babel" src="src/app-init.jsx"></script>'
)

# Build new content: keep everything up to lastScriptLine, add new scripts, then skip the inline block
$newContent = @()
for ($i = 0; $i -le $lastScriptLine; $i++) {
    $newContent += $lines[$i]
}
# Add new script references
foreach ($s in $newScripts) {
    $newContent += $s
}
# Append everything after the inline block end
for ($i = $babelEnd + 1; $i -lt $lines.Count; $i++) {
    $newContent += $lines[$i]
}

Set-Content -Path $outFile -Value ($newContent -join "`r`n") -Encoding UTF8
Write-Host "Done. New line count: $($newContent.Count)"
Write-Host "Check the result: scripts removed lines $($babelStart+1)-$($babelEnd+1), scripts added for hooks and app-floating"