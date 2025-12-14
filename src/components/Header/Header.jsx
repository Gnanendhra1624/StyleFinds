
import React, { useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Header.module.css';

export const Header = () => {
  const { searchTerm, setSearchTerm, setCurrentPage, cartCount, setIsCartOpen, triggerSearch } = useApp();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    // Always update searchTerm (ensures UI reflects the input value)
    setSearchTerm(q);
    setCurrentPage(1);
    // Pass override explicitly so `effectiveQuery` is updated immediately
    // and pagination will use the same query (including empty string).
    triggerSearch(q);
  };

  const handleQuickFilter = (term) => {
    setInputValue(term);
    setSearchTerm(term);
    setCurrentPage(1);
    // ensure an API request is sent for quick filters as well
    triggerSearch(term);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoWave}>≋</div>
          <span className={styles.logoText}>StyleFinds</span>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>

        <div className={styles.quickFilters}>
          <button
            onClick={() => handleQuickFilter('shoes')}
            className={searchTerm === 'shoes' ? styles.filterBtnActive : styles.filterBtn}
          >
            Shoes
          </button>
          <button
            onClick={() => handleQuickFilter('sunglasses')}
            className={searchTerm === 'sunglasses' ? styles.filterBtnActive : styles.filterBtn}
          >
            Sunglasses
          </button>
          <button
            onClick={() => handleQuickFilter('jeans')}
            className={searchTerm === 'jeans' ? styles.filterBtnActive : styles.filterBtn}
          >
            Jeans
          </button>
          <button
            onClick={() => handleQuickFilter('hats')}
            className={searchTerm === 'hats' ? styles.filterBtnActive : styles.filterBtn}
          >
            Hats
          </button>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)} 
          className={styles.cartButton}
          data-testid="cart-button"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};