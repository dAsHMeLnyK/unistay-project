import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddListingPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage';
import AddressPicker from './AddressPicker'; 

const AddListingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); 

    const CLOUD_NAME = "dmgawz7me";
    const UPLOAD_PRESET = "listing_images"; 

    const [dbAmenities, setDbAmenities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);

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
        ListingService.getAmenities()
            .then(setDbAmenities)
            .catch(err => console.error("Помилка зручностей:", err))
            .finally(() => setIsInitialLoading(false));
            
        window.scrollTo(0, 0); // Прокрутка вгору при вході
    }, []);

    const handleAddressChange = useCallback((address, lat, lng) => {
        setFormData(prev => ({
            ...prev,
            address: address,
            latitude: lat,
            longitude: lng
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Валідація числових значень (щоб не було мінусових цін)
        let val = value;
        if (['type', 'owners', 'neighbours', 'communalService', 'price'].includes(name)) {
            val = value === '' ? '' : Math.max(0, parseFloat(value));
        }
        
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
        const uploadedLinks = [];

        for (const file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { 
                    method: "POST", 
                    body: data 
                });
                const fileData = await response.json();
                if (fileData.secure_url) uploadedLinks.push(fileData.secure_url);
            } catch (error) {
                console.error("Помилка завантаження:", error);
            }
        }

        setImageUrls(prev => [...prev, ...uploadedLinks]);
        setIsUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Фінальні перевірки перед відправкою
        if (!isAuthenticated) return alert("Будь ласка, увійдіть в систему");
        if (isUploading) return alert("Зачекайте, поки завантажаться фото");
        if (!formData.address) return alert("Будь ласка, вкажіть адресу на карті");
        if (imageUrls.length === 0) return alert("Додайте хоча б одне фото помешкання");

        setIsSubmitting(true);
        try {
            const listingPayload = {
                title: formData.title,
                description: formData.description,
                address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude,
                price: parseFloat(formData.price || 0),
                type: parseInt(formData.type),
                communalServices: [parseInt(formData.communalService)],
                owners: parseInt(formData.owners),
                neighbours: parseInt(formData.neighbours),
                amenityIds: formData.amenityIds
            };

            const createdListing = await ListingService.create(listingPayload);

            if (imageUrls.length > 0 && createdListing?.id) {
                await Promise.all(imageUrls.map(url => 
                    ListingService.addImage(createdListing.id, url)
                ));
            }

            alert('Оголошення успішно опубліковано!');
            navigate(`/listings/${createdListing.id}`);
        } catch (err) {
            console.error(err);
            alert("Помилка при створенні. Перевірте заповнення полів.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInitialLoading) return <LoadingPage />;

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <h1 className={styles.pageTitle}>Створити нове оголошення</h1>
                
                <form onSubmit={handleSubmit} className={styles.listingForm}>
                    <div className={styles.formColumns}>
                        {/* ЛІВА КОЛОНКА */}
                        <div className={styles.formSection}>
                            <h2>Загальна інформація</h2>
                            <div className={styles.formGroup}>
                                <label>Заголовок</label>
                                <input 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    maxLength={100}
                                    placeholder="Наприклад: Затишна кімната біля Академії" 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Місцезнаходження (Острог)</label>
                                <AddressPicker 
                                    lat={formData.latitude}
                                    lng={formData.longitude}
                                    onAddressChange={handleAddressChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Ціна (грн/міс)</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleChange} 
                                    required 
                                    min="0"
                                    placeholder="0.00" 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Опис</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                    rows="5" 
                                    placeholder="Розкажіть про умови, сусідів, правила..." 
                                />
                            </div>
                        </div>

                        {/* ПРАВА КОЛОНКА */}
                        <div className={styles.formSection}>
                            <h2>Деталі житла</h2>
                            <div className={styles.formGroup}>
                                <label>Тип об'єкту</label>
                                <select name="type" onChange={handleChange} value={formData.type}>
                                    <option value={1}>Квартира</option>
                                    <option value={0}>Будинок</option>
                                    <option value={2}>Кімната</option>
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Фотографії (мінімум 1)</label>
                                <div className={styles.imageGrid}>
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className={styles.imagePreviewItem}>
                                            <img src={url} alt="preview" className={styles.previewImage} />
                                            <button 
                                                type="button" 
                                                className={styles.removeImageButton} 
                                                onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <label className={styles.addPhotoButton}>
                                        <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                                        <span>{isUploading ? "..." : "+"}</span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Комунальні послуги</label>
                                <select name="communalService" onChange={handleChange} value={formData.communalService}>
                                    <option value={0}>Включено у вартість</option>
                                    <option value={1}>Оплачуються окремо</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ЗРУЧНОСТІ */}
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
                                    <span>{amenity.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton} 
                        disabled={isSubmitting || isUploading}
                    >
                        {isSubmitting ? "Публікуємо..." : "Опублікувати оголошення"}
                    </button>
                </form>
            </div>
            {isSubmitting && <LoadingPage message="Ваше оголошення створюється..." />}
        </div>
    );
};

export default AddListingPage;