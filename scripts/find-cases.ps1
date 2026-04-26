param([string]$sha)

$content = git show "$sha`:index.html" 2>&1
$lines = $content -split "`r`n|`n"
$i = 0
foreach($line in $lines) {
    if ($line -match "case [\x27](vocabulario|biblioteca|telc)[\x27]") {
        Write-Output ("Line " + $i + ": " + $line.Trim().Substring(0, [Math]::Min(120, $line.Trim().Length)))
    }
    $i++
}