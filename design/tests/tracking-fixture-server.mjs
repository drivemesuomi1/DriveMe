import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.env.PORT || 3100);
const TOKEN = '0123456789abcdef0123456789abcdef';
let status = 'driver_en_route';
let poll = 0;

const MIME = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg',
  '.mp4':'video/mp4',
};

function json(res,code,payload){
  res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(payload));
}

async function body(req){
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const server = createServer(async(req,res) => {
  const url = new URL(req.url,'http://localhost:' + PORT);
  if (url.pathname === '/api/driver-trip'){
    return json(res,url.searchParams.get('t') === TOKEN ? 200 : 404,{
      success:true,trip:{
        reference:'A1B2C3D4',status,mode:'point_to_point',
        scheduled_for:new Date(Date.now() + 3600000).toISOString(),
        pickup:'Hotel Kamp, Helsinki',destination:'Helsinki Airport, Vantaa',
        pickup_point:{lat:60.1687,lng:24.9473},dest_point:{lat:60.3172,lng:24.9633},
      }
    });
  }
  if (url.pathname === '/api/driver-location' && req.method === 'POST'){
    await body(req); return json(res,200,{success:true,status,serverTime:new Date().toISOString()});
  }
  if (url.pathname === '/api/driver-status' && req.method === 'POST'){
    const data = await body(req); status = data.status;
    return json(res,200,{success:true,status});
  }
  if (url.pathname === '/api/track'){
    poll++;
    const lat = 60.19 - Math.min(poll,8) * .0025;
    const lng = 24.96 - Math.min(poll,8) * .0015;
    const trail = Array.from({length:Math.min(poll + 2,10)},(_,i) => ({
      lat:60.195 - i * .0015,lng:24.963 - i * .001,
      recorded_at:new Date(Date.now() - (10 - i) * 5000).toISOString(),
    }));
    return json(res,200,{success:true,ride:{
      reference:'A1B2C3D4',status,mode:'point_to_point',
      pickup:'Hotel Kamp, Helsinki',destination:'Helsinki Airport, Vantaa',
      scheduled_for:new Date(Date.now() + 3600000).toISOString(),
      driver_name:'Mikael',assigned_at:new Date(Date.now() - 900000).toISOString(),
      en_route_at:new Date(Date.now() - 600000).toISOString(),
      arrived_at:status === 'driver_arrived' ? new Date().toISOString() : null,
      started_at:status === 'ride_started' ? new Date().toISOString() : null,
      route_minutes:28,pickup_point:{lat:60.1687,lng:24.9473},
      dest_point:{lat:60.3172,lng:24.9633},trail,
      location:{lat,lng,eta_minutes:Math.max(2,10-poll),accuracy_m:8,
        speed_mps:10.5,heading_deg:188,distance_remaining_km:Math.max(.8,6-poll*.5),
        recorded_at:new Date().toISOString()}
    }});
  }

  const rel = url.pathname === '/' ? 'index.html' :
    url.pathname.slice(1) + (extname(url.pathname) ? '' : '.html');
  const file = join(ROOT,rel);
  if (!file.startsWith(ROOT)) return json(res,404,{success:false});
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    res.writeHead(200,{'Content-Type':MIME[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT,() => console.log('tracking fixture: http://localhost:' + PORT + '/track?t=' + TOKEN));
