
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    
    case 'REMOVE_ITEM':
      const item = state.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        return state.map(item =>
          item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return state.filter(item => item.id !== action.payload);
    
    case 'DELETE_ITEM':
      return state.filter(item => item.id !== action.payload);
    
    default:
      return state;
  }
};

export const AppProvider = ({ children, initialState = [] }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('sunglasses');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{
      cart, dispatch, products, setProducts, loading, setLoading,
      searchTerm, setSearchTerm, currentPage, setCurrentPage,
      totalPages, setTotalPages, cartCount, cartTotal,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
