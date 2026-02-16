import React from 'react';
import styles from './ListingForm.module.css';
import Select from '../../common/Select/Select';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import AddressPicker from '../../../pages/AddListingPage/AddressPicker/AddressPicker';
import ImageUploader from '../../../pages/AddListingPage/ImageUploader/ImageUploader';
import AmenitySection from '../../../pages/AddListingPage/AmenitySection/AmenitySection';
import { LISTING_TYPES, COMMUNAL_SERVICES, OWNERSHIP_TYPES, NEIGHBOUR_TYPES } from '../../../constants/listingEnums';

const ListingForm = ({ 
    formData, setFormData, onSubmit, onCancel,
    isSubmitting, dbAmenities, imageUrls, setImageUrls, 
    isUploading, setIsUploading, submitText 
}) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['type', 'communalService', 'owners', 'neighbours'];
        const finalValue = numericFields.includes(name) ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    return (
        <form onSubmit={onSubmit} className={styles.listingForm}>
            <div className={styles.formColumns}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Основна інформація</h2>
                    
                    <div className={styles.formGroup}>
                        <label>Заголовок</label>
                        <Input
                            name="title" 
                            placeholder="Наприклад: Затишна кімната біля НаУОА"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            maxLength={255}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Локація в Острозі</label>
                        <AddressPicker 
                            lat={formData.latitude} 
                            lng={formData.longitude} 
                            address={formData.address}
                            onAddressChange={(addr, lat, lng) => setFormData(prev => ({
                                ...prev, address: addr, latitude: lat, longitude: lng
                            }))} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Вартість оренди</label>
                        <div className={styles.priceInputWrapper}>
                            <Input 
                                type="number" 
                                name="price" 
                                placeholder="0"
                                value={formData.price} 
                                onChange={handleChange}
                                style={{ marginBottom: 0 }} // Прибираємо відступ тільки тут
                                className={styles.priceInputCompact}
                                required
                            />
                            <span className={styles.currencyBadge}>₴ / міс.</span>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.labelWithCounter}>
                            <label>Опис об'єкту</label>
                            <span className={styles.charCounter}>
                                {(formData.description || "").length}/1000
                            </span>
                        </div>
                        <div className={styles.textareaWrapper}>
                            <textarea 
                                className={styles.inputField} 
                                name="description" 
                                placeholder="Розкажіть про умови..."
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                                rows="6" 
                                maxLength={1000}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Деталі та Фото</h2>
                    <div className={styles.formGroup}>
                        <label>Тип житла</label>
                        <Select name="type" value={formData.type} onChange={handleChange} options={LISTING_TYPES} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Комунальні послуги</label>
                        <Select name="communalService" value={formData.communalService} onChange={handleChange} options={COMMUNAL_SERVICES} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Проживання з господарями</label>
                        <Select name="owners" value={formData.owners} onChange={handleChange} options={OWNERSHIP_TYPES} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Наявність сусідів</label>
                        <Select name="neighbours" value={formData.neighbours} onChange={handleChange} options={NEIGHBOUR_TYPES} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Фотографії</label>
                        <ImageUploader 
                            imageUrls={imageUrls} 
                            setImageUrls={setImageUrls} 
                            isUploading={isUploading} 
                            setIsUploading={setIsUploading} 
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Зручності та особливості</h2>
                <AmenitySection 
                    amenities={dbAmenities} 
                    selectedIds={formData.amenityIds} 
                    toggleAmenity={(id) => setFormData(prev => ({
                        ...prev,
                        amenityIds: prev.amenityIds.includes(id) ? prev.amenityIds.filter(aId => aId !== id) : [...prev.amenityIds, id]
                    }))} 
                />
            </div>

            <div className={styles.submitWrapper}>
                {onCancel && (
                    <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} className={styles.cancelBtnWidth}>
                        Скасувати
                    </Button>
                )}
                <Button type="submit" variant="primary" disabled={isSubmitting || isUploading} className={styles.submitBtnWidth}>
                    {isSubmitting ? "Збереження..." : submitText}
                </Button>
            </div>
        </form>
    );
};

export default ListingForm;