$lines = Get-Content '..\index.html' -Encoding UTF8

Write-Host "Total lines: $($lines.Count)"

# Find the babel inline block
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '<script type="text/babel">' -and $i -gt 500) {
        Write-Host "Script start at line $($i+1)"
        # Find closing tag
        for ($j = $i+1; $j -lt $lines.Count; $j++) {
            if ($lines[$j] -match '</script>') {
                Write-Host "Script end at line $($j+1)"
                Write-Host "Total inline lines: $($j - $i - 1)"
                
                # Extract just the bootstrap + useTelcExamClock + TelcExamHud
                $inlineLines = $lines[($i+1)..($j-1)]
                
                # Find hidePreboot and everything after it
                $bootstrapStart = -1
                $telcClockStart = -1
                $telcHudStart = -1
                for ($k = 0; $k -lt $inlineLines.Count; $k++) {
                    if ($inlineLines[$k] -match 'const hidePreboot') { $bootstrapStart = $k }
                    if ($inlineLines[$k] -match 'function useTelcExamClock') { $telcClockStart = $k }
                }
                
                Write-Host "hidePreboot at inline line: $bootstrapStart"
                Write-Host "useTelcExamClock at inline line: $telcClockStart"
                Write-Host "Last line: $($inlineLines.Count)"
                
                # The bootstrap + useTelcExamClock + TelcExamHud are the last ~50 lines
                Write-Host "Last 50 lines of inline:"
                for ($k = [Math]::Max(0, $inlineLines.Count - 50); $k -lt $inlineLines.Count; $k++) {
                    Write-Host "$k: $($inlineLines[$k])"
                }
                
                break
            }
        }
        break
    }
}