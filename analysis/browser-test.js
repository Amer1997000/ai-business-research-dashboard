const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const server = require('./serve');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-dashboard-'));
const root = path.resolve(__dirname, '..');
const browser = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--window-size=1440,1600', 'http://127.0.0.1:4173/dashboard/'
], { stdio: 'ignore' });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getTarget() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(response => response.json());
      const page = targets.find(target => target.type === 'page' && target.url.includes('/dashboard/'));
      if (page) return page;
    } catch {}
    await delay(100);
  }
  throw new Error('Chrome DevTools target did not become available');
}

async function run() {
  const target = await getTarget();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    }
  };
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => (await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

  await command('Page.enable');
  await command('Runtime.enable');
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await evaluate("document.readyState === 'complete' && document.querySelectorAll('.kpi').length === 4")) break;
    await delay(100);
  }

  const errors = await evaluate("window.__portfolioErrors || []");
  const initial = await evaluate("document.getElementById('filterStatus').textContent");
  if (initial !== 'Showing 70 participants and 560 task responses') throw new Error(`Unexpected initial state: ${initial}`);

  const filtered = await evaluate(`(() => {
    const condition = document.getElementById('conditionFilter');
    condition.value = 'manual'; condition.dispatchEvent(new Event('change'));
    const sequence = document.getElementById('sequenceFilter');
    sequence.value = 'S1'; sequence.dispatchEvent(new Event('change'));
    return document.getElementById('filterStatus').textContent;
  })()`);
  if (filtered !== 'Showing 21 participants and 84 task responses') throw new Error(`Filter test failed: ${filtered}`);

  await evaluate(`(() => {
    const condition = document.getElementById('conditionFilter'); condition.value = 'all'; condition.dispatchEvent(new Event('change'));
    const sequence = document.getElementById('sequenceFilter'); sequence.value = 'all'; sequence.dispatchEvent(new Event('change'));
  })()`);

  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1600, deviceScaleFactor: 1, mobile: false });
  const desktop = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(root, 'screenshots', 'dashboard-overview.png'), Buffer.from(desktop.data, 'base64'));

  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 1200, deviceScaleFactor: 1, mobile: true });
  const mobile = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(root, 'screenshots', 'dashboard-mobile.png'), Buffer.from(mobile.data, 'base64'));

  socket.close();
  console.log(JSON.stringify({ initial, filtered, runtimeErrors: errors.length, screenshots: 2 }, null, 2));
}

run().finally(async () => {
  browser.kill();
  server.close();
  await delay(500);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}).catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
