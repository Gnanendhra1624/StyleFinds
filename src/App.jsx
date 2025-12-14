import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { searchProducts } from './services/api';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
import { Pagination } from './components/Pagination/Pagination';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { Footer } from './components/Footer/Footer';
import styles from './App.module.css';

const MainApp = () => {
  const { 
    products, 
    setProducts, 
    loading, 
    setLoading, 
    searchTerm, 
    currentPage, 
    setTotalPages 
  } = useApp();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(searchTerm, currentPage);
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
  }, [searchTerm, currentPage, setProducts, setLoading, setTotalPages]);

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