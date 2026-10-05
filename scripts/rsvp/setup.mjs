import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {randomBytes,randomUUID,createHash,createCipheriv} from 'node:crypto';
import pg from 'pg';
mkdirSync('.local',{recursive:true});
if(!existsSync('.env.local')){
 const password=randomBytes(24).toString('hex');
 const admin=randomBytes(18).toString('base64url');
 writeFileSync('.env.local',`POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgresql://wedding:${password}@127.0.0.1:54329/wedding\nADMIN_PASSWORD=${admin}\nADMIN_SESSION_SECRET=${randomBytes(48).toString('hex')}\n`);
 writeFileSync('.local/admin-access.txt',`Local dashboard: http://localhost:5173/admin\nPassword: ${admin}\nKeep this file private.\n`);
}
process.loadEnvFile('.env.local');
if(process.argv.includes('--env-only')){console.log('Local environment ready. Credentials are in .local/admin-access.txt.');process.exit(0);}
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000});
try{
 await pool.query(readFileSync('scripts/rsvp/schema.sql','utf8'));
 const fixtures=[['Yasuo',1],['Rakan',2],['Ahri',4],['Garen',2],['Teemo',1]];
 const links=[];
 for(const [name,seats] of fixtures){
  if((await pool.query('SELECT id FROM invitations WHERE main_guest_name=$1',[name])).rowCount)continue;
  const token=randomBytes(32).toString('base64url'),iv=randomBytes(12);
  const cipher=createCipheriv('aes-256-gcm',createHash('sha256').update(process.env.ADMIN_SESSION_SECRET).digest(),iv);
  const data=Buffer.concat([cipher.update(token,'utf8'),cipher.final()]);
  await pool.query('INSERT INTO invitations(id,main_guest_name,reserved_seats,token_hash,token_ciphertext) VALUES($1,$2,$3,$4,$5)',[randomUUID(),name,seats,createHash('sha256').update(token).digest('hex'),Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url')]);
  links.push({name,seats,url:`http://localhost:5173/invite/${token}`});
 }
 if(links.length)writeFileSync('.local/test-invitations.json',JSON.stringify(links,null,2));
 console.log('PostgreSQL schema ready; sample household links available in the dashboard.');
}finally{await pool.end();}
