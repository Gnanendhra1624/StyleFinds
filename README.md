# StyleFinds

<p align="center">
<img src="./public/stylefinds.PNG" alt="stylefinds" width="900" height="300" style="max-width:100%;height:auto;">
</p>

StyleFinds is a small, modern e-commerce product search and cart demo app built with React.
It focuses on a clean search experience, responsive layout, accessible controls, and reliable end-to-end tests.

## Features

- Search with support for explicit empty queries (pressing Enter with an empty input sends q="").
- Quick filters (e.g., `Sunglasses`, `Shoes`) that trigger immediate searches.
- Responsive header and product grid that adapt to small devices.
- Product cards with image fallback behavior and add-to-cart flow.
- Accessible pagination (Previous / Next replaced with `<` and `>` and proper `aria-label`s).
- Cart drawer with test-friendly selectors and keyboard/aria support.
- Playwright end-to-end tests and Jest unit tests for fast verification.

## Tech / Skills Used

- React 18 (Create React App)
- CSS Modules for component-scoped styles and responsive design
- Playwright for end-to-end testing
- Jest and React Testing Library for unit testing
- Accessibility and a11y-friendly attributes (aria-labels, titles)
- Basic performance & UX considerations (debounce, minimal fetch-dedupe in dev mode)

## Getting Started (Development)

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

Open http://localhost:3000 in your browser.

Notes:
- The app uses `react-scripts` (CRA). Content reloads on change.

## Tests

### Unit tests (Jest)

Run all unit tests once:

```bash
npm test
```

### End-to-end tests (Playwright)

1. Install Playwright browsers (first time only):

```bash
npx playwright install
```

2. Run the test suite (this starts the local dev server automatically via `playwright.config.js`):

```bash
npm run test:e2e
```

3. Open the Playwright UI for interactive debugging:

```bash
npm run test:e2e:ui
```

Notes:
- Playwright is preconfigured in `playwright.config.js` to run tests from `./src/tests/e2e` and to start the app with `npm start`.
- Tests include mobile view coverage (Pixel 5) and capture traces/screenshots on failure.

## Important Implementation Details

- Search behavior: the app tracks an `effectiveQuery` so explicit searches for an empty string (`q=""`) are preserved and propagated to pagination.
- Pagination: arrow glyphs (`<`/`>`) are used with accessibility labels and were tuned for visual thickness while keeping button sizes consistent.
- Testing: deterministic selectors (`data-testid`, `aria-label`) and helper interactions (scroll into view, closing overlays) are used to make e2e tests robust.

## Project Structure (key files)

- `src/` - React source
	- `components/` - UI components (Header, ProductList, ProductCard, Pagination, CartDrawer)
	- `context/AppContext.jsx` - app state (cart, search control)
	- `App.jsx` - main fetch + layout logic
	- `tests/` - unit and e2e tests

## Contributing

Feel free to open issues or PRs. If you want to tweak the pagination visuals further, consider replacing the glyphs with SVG icons for precise stroke control.

## License

This project is provided as-is for demo/learning purposes.
