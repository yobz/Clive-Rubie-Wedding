param([ValidateSet('start','stop','status')][string]$Action='start')
$ErrorActionPreference='Stop'
$projectRoot=Resolve-Path (Join-Path $PSScriptRoot '../..')
$pgCtl=Join-Path $projectRoot '.local/pg-runtime/pgsql/bin/pg_ctl.exe'
$dataPath=Join-Path $projectRoot '.local/pgdata'
if (!(Test-Path -LiteralPath $pgCtl)) { throw 'Portable PostgreSQL is missing. Alternatively run docker compose --env-file .env.local up -d, then npm run db:setup.' }
if ($Action -eq 'start') {
 & $pgCtl -D $dataPath -l (Join-Path $projectRoot '.local/postgres.log') -o '-h 127.0.0.1 -p 54329' -w start
} elseif ($Action -eq 'stop') { & $pgCtl -D $dataPath -m fast -w stop
} else { & $pgCtl -D $dataPath status }
