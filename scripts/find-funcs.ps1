param([string]$sha)

git show "$sha`:index.html" 2>&1 | Out-File -FilePath "$env:TEMP\index_git.html" -Encoding utf8
$content = Get-Content "$env:TEMP\index_git.html" -Raw
$lines = $content -split "`r`n|`n"
$i = 0
foreach($line in $lines) {
    if ($line -match "function (InicioPanel|EscrituraPanel|LecturaPanel|HistoriaPanel|RutaPanel|ComunidadPanel|VocabSRS|BibliotecaPanel|TelcLevels)") {
        Write-Output ("Line " + $i + ": " + $line.Trim().Substring(0, [Math]::Min(120, $line.Trim().Length)))
    }
    $i++
}