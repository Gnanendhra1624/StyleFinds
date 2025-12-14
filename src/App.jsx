import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { searchProducts } from './services/api';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
import { Pagination } from './components/Pagination/Pagination';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { Footer } from './components/Footer/Footer';
import styles from './App.module.css';

// Keep a short-lived record of the most recent fetch key so duplicate
// initial fetches (for example caused by React StrictMode in dev) can
// be ignored. Module-level so it survives mount/unmount cycles.
const _lastFetch = { key: null, ts: 0 };

const MainApp = () => {
  const { 
    products, 
    setProducts, 
    loading, 
    setLoading, 
    searchTerm, 
    currentPage, 
    setTotalPages,
    searchSignal,
    effectiveQuery
  } = useApp();

  useEffect(() => {
    const fetchProducts = async () => {
      const key = `${effectiveQuery}|${currentPage}`;
      // If we've fetched the same key very recently, skip to avoid
      // duplicate requests caused by dev-only StrictMode remounts.
      if (_lastFetch.key === key && Date.now() - _lastFetch.ts < 5000) {
        return;
      }

      _lastFetch.key = key;
      _lastFetch.ts = Date.now();

      setLoading(true);
      try {
        // Use the persistent `effectiveQuery` when fetching; it defaults
        // to 'sunglasses' on first visit and can be set to empty string by
        // the header when the user submits an empty query.
        const data = await searchProducts(effectiveQuery, currentPage);
        setProducts(data.results || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [effectiveQuery, currentPage, searchSignal, setProducts, setLoading, setTotalPages]);

  return (
    <div className={styles.app}>
      <div className={styles.backgroundOverlay} />
      
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.resultsHeading}>
            Showing results for "{searchTerm}"
          </h1>

          <Pagination />

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : products.length === 0 ? (
            <div className={styles.noResults}>No products found</div>
          ) : (
            <ProductList />
          )}

          <Pagination />
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;