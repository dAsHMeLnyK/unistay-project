import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage';
import Card from '../../components/common/Card/Card';
import AmenityDisplay from './AmenityDisplay/AmenityDisplay';
import ListingFeatures from './ListingFeatures/ListingFeatures';
import ReviewSection from './ReviewSection/ReviewSection';
import LocationMap from './LocationMap/LocationMap';
import ListingGallery from './ListingGallery/ListingGallery';
import ListingMainInfo from './ListingMainInfo/ListingMainInfo';

import styles from './ListingDetailsPage.module.css';

const ListingDetailsPage = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await ListingService.getById(listingId);
                setListing(data);
            } catch (err) { 
                console.error("Помилка завантаження:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchDetails();
    }, [listingId]);

    if (loading) return <LoadingPage />;
    if (!listing) return <div className={styles.error}>Оголошення не знайдено</div>;

    return (
        <div className={styles.detailsPage}>
            <div className={`${styles.container} page-content-container`}>
                
                {/* ВЕРХНЯ ЧАСТИНА */}
                <div className={styles.topSection}>
                    <div className={styles.galleryColumn}>
                        <ListingGallery 
                            images={listing.listingImages} 
                            listingId={listing.id} 
                        />
                    </div>
                    <div className={styles.infoColumn}>
                        <ListingMainInfo listing={listing} />
                    </div>
                </div>

                {/* НИЖНЯ ЧАСТИНА: СТЕК КАРТОК */}
                <div className={styles.detailsStack}>
                    <Card className={styles.detailCard}>
                        <div className={styles.sectionGroup}>
                            <h3 className="section-title">Характеристики об'єкту</h3>
                            <ListingFeatures listing={listing} />
                        </div>
                        
                        <div className={styles.descriptionSection}>
                            <h3 className="section-title">Про це житло</h3>
                            <p className={styles.descriptionText}>{listing.description}</p>
                        </div>
                    </Card>

                    <Card className={styles.detailCard}>
                        <h3 className="section-title">Зручності</h3>
                        <AmenityDisplay amenities={listing.amenities} />
                    </Card>

                    <div id="location-map">
                        <Card className={styles.detailCard}>
                            <h3 className="section-title">Розташування</h3>
                            <LocationMap 
                                lat={listing.latitude} 
                                lng={listing.longitude} 
                                address={listing.address} 
                            />
                        </Card>
                    </div>

                    <Card className={styles.detailCard}>
                        <ReviewSection 
                            reviews={listing.reviews} 
                            listingId={listing.id} 
                            ownerId={listing.userId}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsPage;