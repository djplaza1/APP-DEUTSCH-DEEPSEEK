# Extract the inline script from cabab3c and find VocabSRS, BibliotecaPanel, TelcLevels content
param([string]$sha)

# Get the file content
git show "$sha`:index.html" 2>&1 | Out-File -FilePath "$env:TEMP\index_orig.html" -Encoding utf8
$content = Get-Content "$env:TEMP\index_orig.html" -Raw
$lines = $content -split "`r`n|`n"

Write-Output "Total lines: $($lines.Length)"

# Find lines containing case 'vocabulario', case 'biblioteca', case 'telc'
$i = 0
foreach($line in $lines) {
    if ($line -match "case 'vocabulario'" -or $line -match 'case "vocabulario"') {
        Write-Output "Found case vocabulario at line $i"
        for($j = 0; $j -lt 20 -and ($i+$j) -lt $lines.Length; $j++) {
            $lines[$i+$j]
        }
    }
    if ($line -match "case 'biblioteca'" -or $line -match 'case "biblioteca"') {
        Write-Output "Found case biblioteca at line $i"
        for($j = 0; $j -lt 20 -and ($i+$j) -lt $lines.Length; $j++) {
            $lines[$i+$j]
        }
    }
    if ($line -match "case 'telc'" -or $line -match 'case "telc"') {
        Write-Output "Found case telc at line $i"
        for($j = 0; $j -lt 20 -and ($i+$j) -lt $lines.Length; $j++) {
            $lines[$i+$j]
        }
    }
    $i++
}