import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseLocationPayload } from '../api/driver-location.js';
import { parseStatusPayload } from '../api/driver-status.js';

const TOKEN = '0123456789abcdef0123456789abcdef';

test('accepts a complete, bounded telemetry payload', () => {
  const result = parseLocationPayload({
    token:TOKEN, lat:60.1699, lng:24.9384, eta_minutes:8,
    accuracy_m:7.5, speed_mps:12, heading_deg:359.9,
    distance_remaining_km:4.24,
  });
  assert.equal(result.error, undefined);
  assert.deepEqual(result.value, {
    token:TOKEN, lat:60.1699, lng:24.9384, eta:8,
    accuracy:7.5, speed:12, heading:359.9, distance:4.24,
  });
});

test('rejects malformed driver tokens', () => {
  assert.equal(parseLocationPayload({ token:'short', lat:60, lng:24 }).field, 'token');
  assert.equal(parseStatusPayload({ token:'short', status:'completed' }).field, 'token');
});

test('rejects unsafe GPS and telemetry ranges', () => {
  const cases = [
    [{ token:TOKEN, lat:91, lng:24 }, 'lat'],
    [{ token:TOKEN, lat:60, lng:181 }, 'lng'],
    [{ token:TOKEN, lat:60, lng:24, eta_minutes:10081 }, 'eta_minutes'],
    [{ token:TOKEN, lat:60, lng:24, accuracy_m:-1 }, 'accuracy_m'],
    [{ token:TOKEN, lat:60, lng:24, speed_mps:101 }, 'speed_mps'],
    [{ token:TOKEN, lat:60, lng:24, heading_deg:361 }, 'heading_deg'],
    [{ token:TOKEN, lat:60, lng:24, distance_remaining_km:2001 }, 'distance_remaining_km'],
  ];
  for (const [payload, field] of cases) {
    assert.equal(parseLocationPayload(payload).field, field);
  }
});

test('driver endpoint exposes only forward trip actions', () => {
  for (const status of ['driver_arrived','ride_started','completed']) {
    assert.equal(parseStatusPayload({ token:TOKEN,status }).value.status,status);
  }
  for (const status of ['requested','driver_assigned','driver_en_route','cancelled','admin']) {
    assert.equal(parseStatusPayload({ token:TOKEN,status }).field,'status');
  }
});

test('migration gates tracking and rotates the driver credential', async () => {
  const sql = await readFile(new URL('../supabase/migrations/0005_realtime_tracking.sql',import.meta.url),'utf8');
  assert.match(sql,/b\.driver_id is not null/);
  assert.match(sql,/rotate_driver_token_on_assignment/);
  assert.match(sql,/interval '3 seconds'/);
  assert.match(sql,/invalid status transition/);
  assert.match(sql,/limit 40/);
  assert.match(sql,/revoke all on function public\.get_driver_trip/);
});
