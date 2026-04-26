# Get the original file's switch/case structure
$content = git show cabab3c:index.html
$lines = $content -split "`n"

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    # Look for switch, case, and function definitions
    if ($line -match 'case\s+[''"``]' -or $line -match 'switch\s*\(') {
        Write-Host "$($i+1): $($line.Trim().Substring(0, [Math]::Min(150, $line.Trim().Length)))"
    }
    # Also look for return React.createElement lines
    if ($line -match 'React\.createElement\(' -and $line -match 'case') {
        Write-Host "  -> $($line.Trim().Substring(0, [Math]::Min(150, $line.Trim().Length)))"
    }
}