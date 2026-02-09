import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../AddListingPage/AddListingPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage';
import ListingForm from '../../components/listings/ListingForm/ListingForm';

const EditListingPage = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, userId: currentUserId } = useAuth();

    const [dbAmenities, setDbAmenities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [imageUrls, setImageUrls] = useState([]); 
    const initialImagesRef = useRef([]); 
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', address: '', price: '',
        type: 1, owners: 1, neighbours: 1, communalService: 1,
        latitude: 50.3291, longitude: 26.5126, amenityIds: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [amenitiesData, listingData] = await Promise.all([
                    ListingService.getAmenities(),
                    ListingService.getById(listingId)
                ]);

                if (listingData.userId !== currentUserId) {
                    alert("У вас немає прав для редагування");
                    return navigate('/my-listings');
                }

                setDbAmenities(amenitiesData);
                initialImagesRef.current = listingData.listingImages || [];
                setImageUrls(initialImagesRef.current.map(img => img.imageUrl));

                setFormData({
                    title: listingData.title,
                    description: listingData.description,
                    address: listingData.address,
                    price: listingData.price.toString(),
                    type: listingData.type,
                    owners: listingData.owners,
                    neighbours: listingData.neighbours,
                    communalService: listingData.communalServices[0] ?? 1,
                    latitude: listingData.latitude,
                    longitude: listingData.longitude,
                    amenityIds: listingData.amenities.map(a => a.id)
                });

            } catch (err) {
                console.error(err);
                navigate('/my-listings');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) loadData();
    }, [listingId, isAuthenticated, currentUserId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                communalServices: [parseInt(formData.communalService)],
            };
            await ListingService.update(listingId, payload);

            const initialImages = initialImagesRef.current;
            const imagesToDelete = initialImages.filter(img => !imageUrls.includes(img.imageUrl));
            const initialUrls = initialImages.map(img => img.imageUrl);
            const urlsToAdd = imageUrls.filter(url => !initialUrls.includes(url));

            await Promise.all([
                ...imagesToDelete.map(img => ListingService.deleteImage(img.id)),
                ...urlsToAdd.map(url => ListingService.addImage(listingId, url))
            ]);

            navigate(`/listings/${listingId}`);
        } catch (err) {
            alert("Не вдалося зберегти зміни.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (isLoading) return <LoadingPage />;

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <div className="page-title-container">
                    <h1 className="page-title">Редагувати оголошення</h1>
                    <p className="page-subtitle">Внесіть необхідні зміни у ваше оголошення</p>
                </div>
                
                <ListingForm 
                    formData={formData} 
                    setFormData={setFormData} 
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    dbAmenities={dbAmenities} 
                    imageUrls={imageUrls} 
                    setImageUrls={setImageUrls} 
                    isUploading={isUploading} 
                    setIsUploading={setIsUploading}
                    isSubmitting={isSubmitting}
                    submitText="Зберегти зміни"
                />
            </div>
        </div>
    );
};

export default EditListingPage;