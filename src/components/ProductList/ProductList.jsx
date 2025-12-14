import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const { products, cart, dispatch } = useApp();

  const handleAdd = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.thumbnailImageUrl || product.imageUrl
      }
    });
  };

  const handleRemove = (product) => {
    dispatch({ type: 'REMOVE_ITEM', payload: product.id });
  };

  return (
    <div className={styles.productGrid}>
      {products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={handleAdd}
            onRemove={handleRemove}
            cartItem={cartItem}
          />
        );
      })}
    </div>
  );
};
