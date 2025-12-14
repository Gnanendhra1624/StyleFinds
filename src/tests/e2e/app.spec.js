const { test, expect } = require('@playwright/test');

test.describe('StyleFinds end-to-end', () => {
  let apiCallCount = 0;

  test.beforeEach(async ({ page }) => {
    // Reset counter and listen to page requests
    apiCallCount = 0;
    page.on('request', (req) => {
      if (req.url().includes('/api/search/search.json')) apiCallCount += 1;
    });

    // Intercept product API calls and return deterministic fixtures
    await page.route('**/api/search/search.json**', async (route) => {
      const url = route.request().url();
      const params = new URL(url);
      const q = params.searchParams.get('q') || '';

      const sunglasses = [
        {
          id: 'p1',
          name: 'Sunny Sunglasses',
          price: 19.99,
          imageUrl: 'https://example.com/img1.png',
          thumbnailImageUrl: 'https://example.com/img1_thumb.png'
        },
        {
          id: 'p2',
          name: 'Polarized Shades',
          price: 29.5,
          imageUrl: 'https://example.com/img2.png',
          thumbnailImageUrl: 'https://example.com/img2_thumb.png'
        }
      ];

      const jeans = [
        {
          id: 'j1',
          name: 'Blue Jeans',
          price: 49.99,
          imageUrl: 'https://example.com/jeans1.png',
          thumbnailImageUrl: 'https://example.com/jeans1_thumb.png'
        }
      ];

      const payload = {
        results: q.toLowerCase().includes('jeans') ? jeans : sunglasses,
        // allow pagination interactions in tests
        pagination: { totalPages: 3 }
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(payload)
      });
    });
  });

  test('loads products, adds to cart, updates totals and responds to search', async ({ page }) => {
    await page.goto('/');

    // Verify initial search term and products loaded
    await expect(page.locator('h1')).toContainText('sunglasses');
    await expect(page.locator('h3:has-text("Sunny Sunglasses")')).toBeVisible();
    // Ensure only one request was made on first visit
    expect(apiCallCount).toBe(1);

    // Add the same product twice to make quantity 2
    const firstAdd = page.locator('button[aria-label="Add to cart"]').first();
    await firstAdd.click();
    await firstAdd.click();

    // Open cart
    await page.click('[data-testid="cart-button"]');

    // Cart should show 1 item (one kind) and the product name
    await expect(page.locator('text=Your Cart (1 Items)')).toBeVisible();
    await expect(page.locator('h4:has-text("Sunny Sunglasses")')).toBeVisible();

    // Narrow cart scope to the open cart drawer and find the item
    const cartDrawer = page.locator('div:has(h2:has-text("Your Cart"))').first();
    const cartItem = cartDrawer.locator('div:has-text("Sunny Sunglasses")').first();
    await cartItem.waitFor({ state: 'visible' });

    // capture item price from the cart item
    const priceText = await cartItem.locator('p').first().innerText();
    const price = parseFloat(priceText.replace('$', ''));

    // Assert subtotal reflects quantity 2 (check inside cart drawer)
    await expect(cartDrawer.locator(`text=$${(price * 2).toFixed(2)}`).first()).toBeVisible();

    // Remove item via delete button (use a deterministic selector)
    const deleteBtn = cartItem.locator('button[data-testid^="delete-"]');
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click({ force: true });
    // The cart item should be removed from the drawer
    await expect(cartDrawer.locator('h4:has-text("Sunny Sunglasses")')).toHaveCount(0);

    // Test search updates results
    // Type in the search input and submit
    await page.fill('input[placeholder="Search products..."]', 'jeans');
    await page.press('input[placeholder="Search products..."]', 'Enter');

    // Ensure heading updates and new product appears
    await expect(page.locator('h1')).toContainText('jeans');
    await expect(page.locator('h3:has-text("Blue Jeans")')).toBeVisible();

    // Press Enter with empty input — should send a request with q=""
    await page.fill('input[placeholder="Search products..."]', '');
    const resp = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/search/search.json') && resp.status() === 200),
      page.press('input[placeholder="Search products..."]', 'Enter')
    ]).then(results => results[0]);

    const reqUrl = resp.url();
    expect(reqUrl).toContain('q=');
    expect(reqUrl).not.toContain('jeans');

    // The route fixture returns the default (sunglasses) when q is empty
    await expect(page.locator('h3:has-text("Sunny Sunglasses")')).toBeVisible();

    // Clicking a quick filter should send a request with that term
    // Make sure cart is closed so it doesn't intercept the click; use
    // force click if the close button is present but overlay intercepts.
    const closeBtn = page.locator('[data-testid="close-cart"]');
    if (await closeBtn.count() > 0) {
      await closeBtn.click({ force: true });
      await page.waitForSelector('[data-testid="close-cart"]', { state: 'hidden' });
    }

    const quickFilterResp = Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/search/search.json') && resp.status() === 200),
      page.click('text=Shoes')
    ]).then(results => results[0]);

    const qResp = await quickFilterResp;
    const qUrl = new URL(qResp.url());
    expect(qUrl.searchParams.get('q')).toBe('shoes');
    await expect(page.locator('h1')).toContainText('shoes');

    // Ensure any open cart drawer is closed so the pagination button is clickable
    if (await page.isVisible('[data-testid="close-cart"]')) {
      await page.click('[data-testid="close-cart"]');
    }

    // Now click Next to trigger pagination — the request should include q=""
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/search/search.json') && resp.url().includes('page=2') && resp.status() === 200),
      page.click('[aria-label="Next page"]')
    ]);
  });
});
