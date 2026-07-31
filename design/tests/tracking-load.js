import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3100';
const TOKEN = '0123456789abcdef0123456789abcdef';

export const options = {
  scenarios: {
    customers: {
      executor: 'constant-vus',
      vus: 20,
      duration: '15s',
      exec: 'customerPoll',
    },
    drivers: {
      executor: 'constant-vus',
      vus: 5,
      duration: '15s',
      exec: 'driverPing',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.99'],
  },
};

export function customerPoll() {
  const res = http.get(`${BASE_URL}/api/track?t=${TOKEN}`, {
    tags: { surface:'customer-tracking' },
  });
  check(res, {
    'tracking returns 200': r => r.status === 200,
    'tracking has live ride': r => r.json('ride.location.recorded_at') !== undefined,
  });
  sleep(1);
}

export function driverPing() {
  const res = http.post(`${BASE_URL}/api/driver-location`, JSON.stringify({
    token:TOKEN,lat:60.1699,lng:24.9384,eta_minutes:7,
    accuracy_m:8,speed_mps:9,heading_deg:180,distance_remaining_km:4.2,
  }), {
    headers:{'Content-Type':'application/json'},
    tags:{surface:'driver-location'},
  });
  check(res, {
    'location returns 200': r => r.status === 200,
    'location is accepted': r => r.json('success') === true,
  });
  sleep(1);
}
