import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { AppProvider } from '../../context/AppContext';

test('Header renders and shows cart button', () => {
  const { Header } = require('../../components/Header/Header');
  render(
    <AppProvider>
      <Header />
    </AppProvider>
  );

  expect(screen.getByText(/StyleFinds/i)).toBeInTheDocument();
  expect(screen.getByTestId('cart-button')).toBeInTheDocument();
});

test('Footer contains GitHub and LinkedIn links', () => {
  const { Footer } = require('../../components/Footer/Footer');
  render(<Footer />);

  const links = screen.getAllByRole('link');
  expect(links.length).toBeGreaterThanOrEqual(2);
  // GitHub link has an icon-only accessible name; assert by href instead
  expect(document.querySelector('a[href="https://github.com"]')).toBeTruthy();
  expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', 'https://www.linkedin.com/feed/');
});

test('ProductCard renders with minimal product props', () => {
  const { ProductCard } = require('../../components/ProductCard/ProductCard');
  const product = { id: 1, name: 'Test', price: 9.99, imageUrl: null, thumbnailImageUrl: null };

  render(<ProductCard product={product} onAdd={() => {}} onRemove={() => {}} />);
  expect(screen.getByText(/Test/i)).toBeInTheDocument();
});

test('ImageWithFallback uses fallback when src missing', () => {
  const { default: ImageWithFallback } = require('../../components/ImageWithFallback/ImageWithFallback');
  render(<ImageWithFallback src={null} alt="fallback" />);
  expect(screen.getByAltText('fallback').src).toContain('no-image-available.png');
});

test('ImageWithFallback switches to fallback on error', async () => {
  const { default: ImageWithFallback } = require('../../components/ImageWithFallback/ImageWithFallback');
  render(<ImageWithFallback src="/invalid.png" alt="Broken" />);
  const img = screen.getByAltText('Broken');
  // simulate native image error event and wait for state update
  act(() => img.dispatchEvent(new Event('error')));
  await waitFor(() => expect(img.src).toContain('no-image-available.png'));
});

test('Pagination next/previous call setCurrentPage', async () => {
  jest.resetModules();
  const mockSetCurrentPage = jest.fn();
  jest.mock('../../context/AppContext', () => ({ useApp: () => ({ currentPage: 2, totalPages: 5, setCurrentPage: mockSetCurrentPage }) }));
  const { Pagination } = require('../../components/Pagination/Pagination');

  render(<Pagination />);
  const user = userEvent.setup();
  await user.click(screen.getByLabelText(/Next page/i));
  expect(mockSetCurrentPage).toHaveBeenCalledWith(3);

  await user.click(screen.getByLabelText(/Previous page/i));
  expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
});

test('CartDrawer shows items and close button works', async () => {
  jest.resetModules();
  const mockSetIsCartOpen = jest.fn();
  const mockDispatch = jest.fn();
  jest.mock('../../context/AppContext', () => ({
    useApp: () => ({
      cart: [{ id: 1, name: 'Item', price: 5, image: '/no-image-available.png', quantity: 1 }],
      dispatch: mockDispatch,
      cartTotal: 5,
      isCartOpen: true,
      setIsCartOpen: mockSetIsCartOpen
    })
  }));

  const { CartDrawer } = require('../../components/CartDrawer/CartDrawer');
  render(<CartDrawer />);

  // Target the item name heading specifically (h4)
  expect(screen.getByRole('heading', { name: /Item/i, level: 4 })).toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByTestId('close-cart'));
  expect(mockSetIsCartOpen).toHaveBeenCalledWith(false);
});

test('ProductList renders with AppProvider', () => {
  // Ensure any module mocks are cleared and provide a minimal context
  jest.resetModules();
  jest.mock('../../context/AppContext', () => ({ useApp: () => ({ products: [], cart: [], dispatch: jest.fn() }) }));
  const { ProductList } = require('../../components/ProductList/ProductList');
  const { container } = render(<ProductList />);
  expect(container.firstChild).toBeInTheDocument();
});
