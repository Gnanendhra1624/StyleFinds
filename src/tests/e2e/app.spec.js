const { test, expect } = require('@playwright/test');

test.describe('StyleFinds end-to-end', () => {
  test.beforeEach(async ({ page }) => {
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
        pagination: { totalPages: 1 }
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

    // Remove item via delete button
    await cartItem.locator('button').nth(2).click({ force: true });
    // The cart item should be removed from the drawer
    await expect(cartDrawer.locator('h4:has-text("Sunny Sunglasses")')).toHaveCount(0);

    // Test search updates results
    // Type in the search input and submit
    await page.fill('input[placeholder="Search products..."]', 'jeans');
    await page.press('input[placeholder="Search products..."]', 'Enter');

    // Ensure heading updates and new product appears
    await expect(page.locator('h1')).toContainText('jeans');
    await expect(page.locator('h3:has-text("Blue Jeans")')).toBeVisible();
  });
});
