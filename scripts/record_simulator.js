const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRAME_DIR = '/tmp/simulator_frames';
const OUTPUT_GIF = '/home/akash/flxos-labs/flxos-labs-website/public/images/screenshots/simulator_demo.gif';
const FRAME_RATE = 10; // 10 FPS
const FRAME_DELAY = 100; // 100ms

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function record() {
  console.log('Cleaning frames directory...');
  if (fs.existsSync(FRAME_DIR)) {
    fs.rmSync(FRAME_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAME_DIR, { recursive: true });

  console.log('Launching headless browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/#simulator...');
  await page.goto('http://localhost:3000/#simulator');
  await page.waitForLoadState('networkidle');

  console.log('Waiting for simulator boot sequence to complete...');
  // Next.js hydration plus FlxOS bootloader takes ~3 seconds
  await sleep(3500);

  // Locate the physical tablet mockup container
  const simulator = page.locator('div[class*="deviceFrame"]').first();
  await simulator.scrollIntoViewIfNeeded();

  let frameCount = 0;
  let isRecording = true;

  console.log('Starting asynchronous frame capture...');
  const recordInterval = setInterval(async () => {
    if (!isRecording) return;
    frameCount++;
    const framePath = path.join(FRAME_DIR, `frame_${String(frameCount).padStart(3, '0')}.png`);
    try {
      await simulator.screenshot({ path: framePath });
    } catch (e) {
      // Ignore transient capture errors during layout changes
    }
  }, FRAME_DELAY);

  try {
    console.log('Step 1: Wait 1 second (showing campfire wallpaper)...');
    await sleep(1000);

    console.log('Step 2: Clicking Launcher button (☰)...');
    const launcherBtn = page.locator('div[class*="dock"] > div[class*="dockItem"]').first();
    await launcherBtn.click();
    await sleep(1200); // Wait for launcher panel slide-in animation

    console.log('Step 3: Click "System Info" app...');
    const sysInfoApp = page.locator('div[class*="launcherItem"]:has-text("System Info")');
    await sysInfoApp.click();
    await sleep(1500); // Wait for System Info window opening and initial rendering

    console.log('Step 4: Click "Memory" tab...');
    const memoryTab = page.locator('div[class*="tabItem"]:has-text("Memory")');
    await memoryTab.click();
    await sleep(1500); // Wait for heap chart animation

    console.log('Step 5: Click "Network" tab...');
    const networkTab = page.locator('div[class*="tabItem"]:has-text("Network")');
    await networkTab.click();
    await sleep(1500);

    console.log('Step 6: Click "Tasks" tab...');
    const tasksTab = page.locator('div[class*="tabItem"]:has-text("Tasks")');
    await tasksTab.click();
    await sleep(1500);

    console.log('Step 7: Close System Info app...');
    const closeBtn = page.locator('div[class*="window"]:has-text("System Info") button[class*="windowBtn"]').last();
    await closeBtn.click();
    await sleep(1000);

    console.log('Step 8: Click bottom-right Control Center button (▲)...');
    const controlCenterBtn = page.locator('div[class*="dock"] > div[class*="dockItem"]').last();
    await controlCenterBtn.click();
    await sleep(1500); // Wait for Quick Access panel slide-up animation

    console.log('Step 9: Click "creenshot" (Screenshot) button (white screen flash)...');
    const screenshotBtn = page.locator('div[class*="qaButtonCol"]:has-text("creenshot")');
    await screenshotBtn.click();
    await sleep(1200); // Wait for shutter flash fade animation

    console.log('Step 10: Click top status bar to drop down Notification Panel...');
    const statusBar = page.locator('div[class*="statusBar"]').first();
    await statusBar.click();
    await sleep(1500); // Wait for Notification panel slide-down animation

    console.log('Step 11: Click "Clear All" notifications...');
    const clearAllBtn = page.locator('button[class*="clearBtn"]:has-text("Clear All")');
    await clearAllBtn.click();
    await sleep(1000);

    console.log('Step 12: Close Notification Panel (▲)...');
    const closeNotifBtn = page.locator('div[class*="panelCloseTab"]');
    await closeNotifBtn.click();
    await sleep(1200);

    console.log('Execution completed. Ending recording loop...');
  } catch (err) {
    console.error('Error during browser actions execution:', err);
  } finally {
    isRecording = false;
    clearInterval(recordInterval);
  }

  console.log(`Captured ${frameCount} frames in total.`);
  await browser.close();

  console.log('Encoding frames to looping GIF using ffmpeg (lanczos palette optimization)...');
  try {
    const parentDir = path.dirname(OUTPUT_GIF);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const command = `ffmpeg -y -framerate ${FRAME_RATE} -i ${FRAME_DIR}/frame_%03d.png -vf "fps=${FRAME_RATE},scale=448:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ${OUTPUT_GIF}`;
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully generated looping GIF at ${OUTPUT_GIF}`);
  } catch (e) {
    console.error('Failed to encode GIF using ffmpeg:', e);
  }
}

record().catch(console.error);
