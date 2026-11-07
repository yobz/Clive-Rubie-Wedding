import {randomUUID} from 'node:crypto';
import {db} from '@/lib/rsvp/db';

export const runtime='nodejs';

function authorized(request:Request){
  const secret=process.env.CRON_SECRET;
  if(!secret)return false;
  const supplied=request.headers.get('authorization')?.replace(/^Bearer\s+/i,'')||request.headers.get('x-cron-secret');
  return supplied===secret;
}

export async function GET(request:Request){
  if(!authorized(request))return Response.json({error:'Unauthorized'},{status:401});
  const client=await db().connect();
  try{
    await client.query('BEGIN');
    const jobResult=await client.query(`SELECT * FROM pending_link_expiry_jobs WHERE enabled=true AND status='scheduled' AND run_at<=now() ORDER BY run_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`);
    const job=jobResult.rows[0];
    if(!job){await client.query('COMMIT');return Response.json({ok:true,processed:false});}
    await client.query(`UPDATE pending_link_expiry_jobs SET status='running',started_at=now() WHERE id=$1`,[job.id]);
    const excluded=await client.query('SELECT invitation_id FROM pending_link_expiry_exclusions WHERE job_id=$1',[job.id]);
    const excludedIds=excluded.rows.map(row=>row.invitation_id);
    const targets=await client.query(`SELECT id FROM invitations WHERE revoked=false AND attendance IS NULL AND message_only=false AND ($1::uuid[] IS NULL OR id <> ALL($1::uuid[])) FOR UPDATE`,[excludedIds.length?excludedIds:null]);
    for(const row of targets.rows){
      await client.query(`UPDATE invitations SET revoked=true,edit_version=edit_version+1 WHERE id=$1 AND revoked=false AND attendance IS NULL AND message_only=false`,[row.id]);
      await client.query(`INSERT INTO pending_link_expiry_audit(id,job_id,invitation_id,action,details) VALUES($1,$2,$3,'revoked',$4)`,[randomUUID(),job.id,row.id,JSON.stringify({runAt:job.run_at})]);
    }
    await client.query(`UPDATE pending_link_expiry_jobs SET status='completed',completed_at=now() WHERE id=$1`,[job.id]);
    await client.query('COMMIT');
    return Response.json({ok:true,processed:true,revoked:targets.rowCount,excluded:excludedIds.length});
  }catch(error){
    await client.query('ROLLBACK');
    return Response.json({error:'Scheduled revocation failed.'},{status:500});
  }finally{client.release();}
}
