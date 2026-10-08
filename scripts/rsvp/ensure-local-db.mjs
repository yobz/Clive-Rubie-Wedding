import {existsSync,readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';
if(process.platform==='win32'&&existsSync('.env.local')){
 const config=parseEnv(readFileSync('.env.local','utf8'));
 const address=config.DATABASE_URL?new URL(config.DATABASE_URL):null;
 if(address?.hostname==='127.0.0.1'&&address.port==='54329'){
  const result=spawnSync('powershell.exe',['-NoProfile','-File','scripts/rsvp/local-db.ps1','start'],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
 }
}
