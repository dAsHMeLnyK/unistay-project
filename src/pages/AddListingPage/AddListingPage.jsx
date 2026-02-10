import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddListingPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage';
import ListingForm from '../../components/listings/ListingForm/ListingForm';

const AddListingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [dbAmenities, setDbAmenities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', address: '', price: '',
        type: 1, owners: 1, neighbours: 1, communalService: 1,
        latitude: 50.3291, longitude: 26.5126, amenityIds: []
    });

    useEffect(() => {
        ListingService.getAmenities().then(setDbAmenities).finally(() => setIsInitialLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return alert("Увійдіть в систему");
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                communalServices: [parseInt(formData.communalService)]
            };
            const res = await ListingService.create(payload);
            if (res?.id) {
                await Promise.all(imageUrls.map(url => ListingService.addImage(res.id, url)));
                navigate(`/listings/${res.id}`);
            }
        } catch (err) {
            alert("Помилка при створенні.");
        } finally { setIsSubmitting(false); }
    };

    if (isInitialLoading) return <LoadingPage />;

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                {/* УНІФІКОВАНИЙ ЗАГОЛОВОК */}
                <header className="page-header">
                    <h1 className="page-title">Створити оголошення</h1>
                    <p className="page-subtitle">
                        Опишіть ваше житло якомога детальніше, щоб зацікавити порядних орендарів
                    </p>
                </header>

                <ListingForm 
                    formData={formData} 
                    setFormData={setFormData} 
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(-1)} // Додаємо можливість скасування
                    dbAmenities={dbAmenities} 
                    imageUrls={imageUrls} 
                    setImageUrls={setImageUrls}
                    isUploading={isUploading} 
                    setIsUploading={setIsUploading}
                    isSubmitting={isSubmitting} 
                    submitText="Опублікувати оголошення"
                />
            </div>
        </div>
    );
};

export default AddListingPage;