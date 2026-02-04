import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditListingPage.module.css';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage'; // Додайте імпорт лоадера

const EditListingPage = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const { updateListing } = useListings();
    const { isAuthenticated } = useAuth();

    const CLOUD_NAME = "dmgawz7me";
    const UPLOAD_PRESET = "listing_images"; 

    const [dbAmenities, setDbAmenities] = useState([]);
    const [existingImages, setExistingImages] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        price: '',
        type: 1,
        owners: 1,
        neighbours: 1,
        communalService: 1,
        latitude: 50.3291,
        longitude: 26.5126,
        amenityIds: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [amenitiesData, listingData] = await Promise.all([
                    ListingService.getAmenities(),
                    ListingService.getById(listingId)
                ]);
                setDbAmenities(amenitiesData);
                setExistingImages(listingData.listingImages || []);
                
                setFormData({
                    title: listingData.title,
                    description: listingData.description,
                    address: listingData.address,
                    price: listingData.price,
                    type: listingData.type,
                    owners: listingData.owners,
                    neighbours: listingData.neighbours,
                    communalService: listingData.communalServices?.[0] || 0,
                    latitude: listingData.latitude,
                    longitude: listingData.longitude,
                    amenityIds: listingData.amenities?.map(a => typeof a === 'object' ? a.id : a) || []
                });
            } catch (err) {
                console.error("Помилка завантаження:", err);
                navigate('/my-listings');
            } finally {
                setIsLoading(false);
            }
        };
        if (isAuthenticated) loadData();
    }, [listingId, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const val = (['type', 'owners', 'neighbours', 'communalService', 'price'].includes(name)) 
            ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const toggleAmenity = (id) => {
        setFormData(prev => ({
            ...prev,
            amenityIds: prev.amenityIds.includes(id)
                ? prev.amenityIds.filter(aId => aId !== id)
                : [...prev.amenityIds, id]
        }));
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        for (const file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { 
                    method: "POST", 
                    body: data 
                });
                const result = await response.json();
                if (result.secure_url) {
                    const savedImage = await ListingService.addImage(listingId, result.secure_url);
                    setExistingImages(prev => [...prev, savedImage]);
                }
            } catch (error) {
                console.error("Upload error:", error);
            }
        }
        setIsUploading(false);
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Видалити це зображення?")) return;
        try {
            await ListingService.deleteImage(imageId);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            alert("Помилка видалення");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updateDto = {
                ...formData,
                price: parseFloat(formData.price),
                communalServices: [formData.communalService],
            };
            await updateListing(listingId, updateDto);
            alert('Зміни збережено успішно!');
            navigate(`/listings/${listingId}`);
        } catch (err) {
            alert(err.response?.data?.Message || "Помилка збереження");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Використовуємо лоадер під час завантаження даних або збереження
    if (isLoading || isSubmitting) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <h1 className={styles.pageTitle}>Редагувати оголошення</h1>
                
                <form onSubmit={handleSubmit} className={styles.listingForm}>
                    <div className={styles.formColumns}>
                        <div className={styles.formSection}>
                            <h2>Основна інформація</h2>
                            <div className={styles.formGroup}>
                                <label>Заголовок</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Адреса</label>
                                <input name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ціна (грн)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Опис</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" />
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h2>Деталі та Фото</h2>
                            <div className={styles.formGroup}>
                                <label>Тип житла</label>
                                <select name="type" value={formData.type} onChange={handleChange}>
                                    <option value={1}>Квартира</option>
                                    <option value={0}>Будинок</option>
                                    <option value={2}>Кімната</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Фотогалерея</label>
                                <div className={styles.imageGrid}>
                                    {existingImages.map((img) => (
                                        <div key={img.id} className={styles.imagePreviewItem}>
                                            <img src={img.imageUrl} alt="Listing" className={styles.previewImage} />
                                            <button type="button" className={styles.removeImageButton} onClick={() => handleDeleteImage(img.id)}>×</button>
                                        </div>
                                    ))}
                                    <label className={styles.addPhotoButton}>
                                        <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                                        <span>{isUploading ? "⏳" : "+"}</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Комунальні послуги</label>
                                <select name="communalService" value={formData.communalService} onChange={handleChange}>
                                    <option value={0}>Включено</option>
                                    <option value={1}>Окремо</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Зручності</h2>
                        <div className={styles.amenitiesList}>
                            {dbAmenities.map((amenity) => (
                                <div 
                                    key={amenity.id} 
                                    className={`${styles.amenityItem} ${formData.amenityIds.includes(amenity.id) ? styles.selected : ''}`}
                                    onClick={() => toggleAmenity(amenity.id)}
                                >
                                    <div className={styles.amenityIndicator}></div>
                                    <span>{amenity.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting || isUploading}>
                        Зберегти зміни
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditListingPage;