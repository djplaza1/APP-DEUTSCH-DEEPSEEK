$root = "c:\PROFESOR-PLAZA-MULLER-COPIA-cursor-refactor-core-minimo-1029\src"
$targets = @("BibliotecaPanel", "TelcLevels", "VocabSRS")
Get-ChildItem -Recurse -Path $root -Filter "*.jsx" -Name | ForEach-Object {
    $f = Join-Path $root $_
    $c = Get-Content $f -Raw
    foreach ($t in $targets) {
        if ($c -match "(function|const|var|let)\s+$t\s*[=(]") {
            Write-Output ("FOUND {0} in {1}: {2}" -f $t, $_, $Matches[0])
        }
    }
}