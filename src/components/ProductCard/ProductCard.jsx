import React from 'react';
import { Minus, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';

export class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      imageClass: ''
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  }

  render() {
    const { product, onAdd, onRemove, cartItem } = this.props;
    const { imageClass } = this.state;

    return (
      <div
        className={styles.productCard}
        data-in-cart={!!cartItem}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={`${styles.productImageContainer} ${imageClass ? styles[imageClass] : ''}`}>
          <ImageWithFallback
            src={product.thumbnailImageUrl || product.imageUrl}
            alt={product.name}
            className={styles.productImage}
            onLoad={(e) => {
              try {
                const { naturalWidth, naturalHeight } = e.target;
                const ratio = naturalWidth / naturalHeight;
                let cls = '';
                if (ratio < 0.7) cls = 'portraitTall';
                else if (ratio < 1) cls = 'portrait';
                else if (ratio > 1.6) cls = 'landscapeWide';
                else cls = 'landscape';
                this.setState({ imageClass: cls });
              } catch (err) {
                // ignore
              }
            }}
          />
        </div>

        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price}</span>
            {product.msrp && product.msrp > product.price && (
              <span className={styles.msrp}>${product.msrp}</span>
            )}
          </div>

          <div className={styles.productActions}>
            <button
              onClick={() => onRemove(product)}
              disabled={!cartItem}
              className={`${styles.actionButton} ${styles.actionButtonMinus}`}
              aria-label="Remove item"
            >
              <Minus size={16} />
            </button>

            <button
              onClick={() => onAdd(product)}
              className={`${styles.actionButton} ${styles.actionButtonCart}`}
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}