# Find switch and function definitions in the original file
$orig = $env:TEMP + '\orig_index.html'
$content = Get-Content $orig -Raw
$lines = $content -split "`n"

Write-Host "Total lines: $($lines.Length)"

# Look for App function definition and its content
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match 'function App\(') {
        Write-Host "`n=== App function at line $($i+1) ==="
    }
    if ($line -match 'function VocabSRS|function BibliotecaPanel|function TelcLevels|function AdvancedPract|function InicioPanel|function EscrituraPanel|function LecturaPanel|function HistoriaPanel|function RutaPanel|function ComunidadPanel') {
        Write-Host "Line $($i+1): $($line.Trim().Substring(0, [Math]::Min(120, $line.Trim().Length)))"
    }
    if ($line -match 'switch') {
        Write-Host "Line $($i+1): $($line.Trim().Substring(0, [Math]::Min(120, $line.Trim().Length)))"
    }
}