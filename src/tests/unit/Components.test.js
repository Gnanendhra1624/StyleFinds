import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../src/context/AppContext';

test('Header renders and shows cart button', () => {
  const { Header } = require('../../src/components/Header/Header');
  render(
    <AppProvider>
      <Header />
    </AppProvider>
  );

  expect(screen.getByText(/StyleFinds/i)).toBeInTheDocument();
  expect(screen.getByTestId('cart-button')).toBeInTheDocument();
});

test('Footer contains GitHub and LinkedIn links', () => {
  const { Footer } = require('../../src/components/Footer/Footer');
  render(<Footer />);

  const links = screen.getAllByRole('link');
  expect(links.length).toBeGreaterThanOrEqual(2);
  expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', 'https://github.com');
  expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', 'https://www.linkedin.com/feed/');
});

test('ProductCard renders with minimal product props', () => {
  const { ProductCard } = require('../../src/components/ProductCard/ProductCard');
  const product = { id: 1, name: 'Test', price: 9.99, imageUrl: null, thumbnailImageUrl: null };

  render(<ProductCard product={product} onAdd={() => {}} onRemove={() => {}} />);
  expect(screen.getByText(/Test/i)).toBeInTheDocument();
});

test('ImageWithFallback uses fallback when src missing', () => {
  const { default: ImageWithFallback } = require('../../src/components/ImageWithFallback/ImageWithFallback');
  render(<ImageWithFallback src={null} alt="fallback" />);
  expect(screen.getByAltText('fallback').src).toContain('no-image-available.png');
});

test('ImageWithFallback switches to fallback on error', () => {
  const { default: ImageWithFallback } = require('../../src/components/ImageWithFallback/ImageWithFallback');
  render(<ImageWithFallback src="/invalid.png" alt="Broken" />);
  const img = screen.getByAltText('Broken');
  fireEvent.error(img);
  expect(img.src).toContain('no-image-available.png');
});

test('Pagination next/previous call setCurrentPage', () => {
  jest.resetModules();
  const setCurrentPage = jest.fn();
  jest.mock('../../src/context/AppContext', () => ({ useApp: () => ({ currentPage: 2, totalPages: 5, setCurrentPage }) }));
  const { Pagination } = require('../../src/components/Pagination/Pagination');

  render(<Pagination />);
  fireEvent.click(screen.getByText(/Next/i));
  expect(setCurrentPage).toHaveBeenCalledWith(3);

  fireEvent.click(screen.getByText(/Previous/i));
  expect(setCurrentPage).toHaveBeenCalledWith(1);
});

test('CartDrawer shows items and close button works', () => {
  jest.resetModules();
  const setIsCartOpen = jest.fn();
  const dispatch = jest.fn();
  jest.mock('../../src/context/AppContext', () => ({
    useApp: () => ({
      cart: [{ id: 1, name: 'Item', price: 5, image: '/no-image-available.png', quantity: 1 }],
      dispatch,
      cartTotal: 5,
      isCartOpen: true,
      setIsCartOpen
    })
  }));

  const { CartDrawer } = require('../../src/components/CartDrawer/CartDrawer');
  render(<CartDrawer />);

  expect(screen.getByText(/Item/i)).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('close-cart'));
  expect(setIsCartOpen).toHaveBeenCalledWith(false);
});

test('ProductList renders with AppProvider', () => {
  const { ProductList } = require('../../src/components/ProductList/ProductList');
  const { container } = render(
    <AppProvider>
      <ProductList />
    </AppProvider>
  );
  expect(container.firstChild).toBeInTheDocument();
});
