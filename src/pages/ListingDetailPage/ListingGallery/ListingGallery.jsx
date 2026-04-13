import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiLayers } from 'react-icons/fi';
import { useListings } from '../../../context/ListingContext';
import styles from './ListingGallery.module.css';

const ListingGallery = ({ images, listingId }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { favoriteIds, toggleFavorite, compareIds, toggleCompare } = useListings();

    if (!images || images.length === 0) {
        return <div className={styles.placeholderImg}>Фото відсутні</div>;
    }

    const id = listingId?.toString(); 
    const isFavorite = favoriteIds.includes(id);
    const isComparing = compareIds?.includes(id);

    const handleNext = (e) => {
        e.preventDefault();
        if (activeIndex < images.length - 1) setActiveIndex(prev => prev + 1);
    };

    const handlePrev = (e) => {
        e.preventDefault();
        if (activeIndex > 0) setActiveIndex(prev => prev - 1);
    };

    return (
        <div className={styles.galleryContainer}>
            <div className={`${styles.mainFrame} ${isComparing ? styles.frameComparing : ''}`}>
                <img 
                    src={images[activeIndex]?.imageUrl} 
                    alt="Property" 
                    className={styles.activeImage}
                />
                
                {images.length > 1 && (
                    <>
                        <button 
                            className={`${styles.navBtn} ${styles.prevBtn}`} 
                            onClick={handlePrev}
                            disabled={activeIndex === 0}
                        >
                            <FiChevronLeft />
                        </button>
                        <button 
                            className={`${styles.navBtn} ${styles.nextBtn}`} 
                            onClick={handleNext}
                            disabled={activeIndex === images.length - 1}
                        >
                            <FiChevronRight />
                        </button>
                    </>
                )}

                <div className={styles.actionsOverlay}>
                    <button
                        className={`${styles.actionBtn} ${isComparing ? styles.compareActive : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(id);
                        }}
                        title="Додати до порівняння"
                    >
                        <FiLayers />
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(id);
                        }}
                        title="Додати в обране"
                    >
                        <FiHeart 
                            className={styles.heartIcon}
                            fill={isFavorite ? "var(--accent-color)" : "none"} 
                        />
                    </button>
                </div>
            </div>

            <div className={styles.thumbRow}>
                {images.map((img, i) => (
                    <div 
                        key={img.id || i} 
                        className={`${styles.thumb} ${activeIndex === i ? styles.activeThumb : ''}`}
                        onClick={() => setActiveIndex(i)}
                    >
                        <img src={img.imageUrl} alt="Thumbnail" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListingGallery;