import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './CartDrawer.module.css';

export const CartDrawer = () => {
  const { cart, dispatch, cartTotal, isCartOpen, setIsCartOpen } = useApp();

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
      <div className={styles.cartDrawer}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>
            Your Cart <span className={styles.cartItemCount}>({cart.length} Items)</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className={styles.closeButton}
            data-testid="close-cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <p className={styles.emptyCart}>Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image || '/no-image-available.png'}
                  alt={item.name}
                  className={styles.cartItemImage}
                  onError={(e) => {
                    const target = e.target;
                    if (!target.src.includes('no-image-available.png')) target.src = '/no-image-available.png';
                  }}
                />
                
                <div className={styles.cartItemInfo}>
                  <h4 className={styles.cartItemName}>{item.name}</h4>
                  <p className={styles.cartItemPrice}>${item.price}</p>
                </div>

                <div className={styles.cartItemActions}>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    className={styles.cartActionButton}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.cartItemQuantity}>{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                    className={styles.cartActionButton}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch({ type: 'DELETE_ITEM', payload: item.id })}
                  className={styles.deleteButton}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className={styles.checkoutButton}>Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};
