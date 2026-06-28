import puppeteer from 'puppeteer';

(async () => {
  console.log('🔍 Starting Automated UI Spacing and Overlap Tests...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
  } catch (err) {
    console.error('❌ Failed to launch Puppeteer browser:', err.message);
    process.exit(1);
  }

  const page = await browser.newPage();
  
  // Capture page logs and errors for deep debugging
  page.on('console', msg => console.log('🌐 PAGE CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('🚨 PAGE RUNTIME ERROR:', err.message));
  
  // Test viewports (Desktop & Mobile)
  const viewports = [
    { name: 'Desktop', width: 1200, height: 800 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  const routes = [
    { path: '/', expectedSelector: '.homeContainer' },
    { path: '/cities/jaipur', expectedSelector: '.cityBanner' },
    { path: '/places/amber-fort', expectedSelector: '.placeHeader' },
    { path: '/foods/dal-baati-churma', expectedSelector: '.foodHeader' },
    { path: '/festivals/gangaur', expectedSelector: '.festivalHeader' },
    { path: '/history-culture', expectedSelector: '.cultureHeader' }
  ];

  let failed = false;

  for (const viewport of viewports) {
    console.log(`\n🖥️  Testing Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    await page.setViewport({ width: viewport.width, height: viewport.height });

    for (const route of routes) {
      const url = `http://localhost:5173${route.path}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if navbar exists
        const navbar = await page.$('.navbar');
        if (!navbar) {
          console.log(`❌ Fail: Navbar not found on ${route.path}`);
          failed = true;
          continue;
        }

        // Check if expected header content exists
        const header = await page.$(route.expectedSelector);
        if (!header) {
          console.log(`❌ Fail: Expected header selector ${route.expectedSelector} not found on ${route.path}`);
          failed = true;
          continue;
        }

        const navRect = await page.evaluate(el => {
          const { top, bottom, left, right, height } = el.getBoundingClientRect();
          return { top, bottom, left, right, height };
        }, navbar);

        const headerRect = await page.evaluate(el => {
          const { top, bottom, left, right, height } = el.getBoundingClientRect();
          return { top, bottom, left, right, height };
        }, header);

        if (navRect.height === 0) {
          console.log(`❌ Fail: Navbar has 0 height on ${route.path}`);
          failed = true;
        }

        // For subpages, ensure header doesn't hide underneath the sticky navbar
        if (route.path !== '/') {
          const overlap = headerRect.top < navRect.bottom;
          if (overlap) {
            console.log(`❌ Overlap Detected: Header on ${route.path} starts at Y=${headerRect.top}px, which is covered by navbar bottom Y=${navRect.bottom}px`);
            failed = true;
          } else {
            console.log(`✅ Pass: No overlap on ${route.path}. Header top: ${headerRect.top}px, Navbar bottom: ${navRect.bottom}px`);
          }
        } else {
          console.log(`✅ Pass: Home page loaded (hero image styled under navbar).`);
        }
      } catch (err) {
        console.log(`❌ Error loading ${url}: ${err.message}`);
        failed = true;
      }
    }
  }

  await browser.close();
  if (failed) {
    console.log('\n❌ UI Verification failed with overlap/spacing errors.');
    process.exit(1);
  } else {
    console.log('\n🎉 UI Spacing & Overlap Verification passed successfully!');
    process.exit(0);
  }
})();
