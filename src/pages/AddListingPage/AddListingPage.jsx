// src/pages/AddListingPage/AddListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AddListingPage.module.css';

// Імпортуємо useListings з нашого контексту
import { useListings } from '../../context/ListingContext'; // <--- ІМПОРТ

// Симуляція даних про доступні зручності з бази даних
const availableAmenities = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'kitchen', label: 'Кухня' },
    { value: 'washing-machine', label: 'Пральна машина' },
    { value: 'balcony', label: 'Балкон' },
    { value: 'parking', label: 'Паркінг' },
    { value: 'gym', label: 'Спортзал' },
    { value: 'air-conditioning', label: 'Кондиціонер' },
    { value: 'dishwasher', label: 'Посудомийна машина' },
    { value: 'pet-friendly', label: 'Можна з тваринами' },
    { value: 'furnished', label: 'Мебльована' },
];

const AddListingPage = () => {
    const navigate = useNavigate();
    const { listingId } = useParams();
    const { addListing } = useListings(); // <--- ВИКОРИСТОВУЄМО addListing З КОНТЕКСТУ

    const initialFormData = {
        title: '',
        housingType: 'room', // Змінено на 'room', оскільки у вас в селекті 'room'
        description: '',
        address: 'м. Острог, вул. Незалежності, 15',
        utilityPaymentType: 'separate',
        ownerOccupancy: 'with-owner',
        neighborInfo: 'with-roommates',
        amenities: [],
        price: '',
        // Нові поля, які були додані в listings.js та в ListingContext
        bedrooms: 1,
        bathrooms: 1,
        guests: 1,
        condition: 'new', // Дефолтне значення
        buildYear: '', // Може бути числом або null
        floor: '',
        totalFloors: '',
        heating: '',
        parking: false,
        balcony: false,
        animals: false, // Відповідає pet-friendly?
        children: false,
        wifi: false, // Може бути перекрите amenity 'wifi'
    };

    const [formData, setFormData] = useState(initialFormData);
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const MAX_DESCRIPTION_LENGTH = 2000;
    const [imagePreviews, setImagePreviews] = useState([]);
    const MAX_IMAGES = 6;

    const isEditMode = !!listingId;
    const pageTitle = isEditMode ? 'Редагувати оголошення' : 'Створити оголошення';
    const submitButtonText = isEditMode ? 'Оновити оголошення' : 'Опублікувати';

    useEffect(() => {
        if (isEditMode && listingId) {
            const storedListings = JSON.parse(localStorage.getItem('listings')) || [];
            const listingToEdit = storedListings.find(item => String(item.id) === listingId);

            if (listingToEdit) {
                // Мапінг 'type' з listings.js до 'housingType' для форми
                const mappedHousingType =
                    listingToEdit.type === 'Квартира' ? 'apartment' :
                    listingToEdit.type === 'Кімната' ? 'room' :
                    listingToEdit.type === 'Будинок' ? 'house' :
                    'room'; // Дефолтне значення

                // Мапінг amenity labels до values
                const mappedAmenities = listingToEdit.amenities ? listingToEdit.amenities.map(label => {
                    const amenity = availableAmenities.find(a => a.label === label);
                    return amenity ? amenity.value : null; // Повертаємо value або null, якщо не знайдено
                }).filter(Boolean) : []; // Відфільтровуємо null

                setFormData({
                    title: listingToEdit.title || '',
                    housingType: mappedHousingType,
                    description: listingToEdit.fullDescription || listingToEdit.description || '',
                    address: listingToEdit.address || 'м. Острог, вул. Незалежності, 15',
                    utilityPaymentType: listingToEdit.utilityPaymentType || 'separate',
                    ownerOccupancy: listingToEdit.ownerOccupancy || 'with-owner',
                    neighborInfo: listingToEdit.neighborInfo || 'with-roommates',
                    amenities: mappedAmenities, // Використовуємо mappedAmenities
                    price: listingToEdit.price || '',
                    bedrooms: listingToEdit.bedrooms || 1,
                    bathrooms: listingToEdit.bathrooms || 1,
                    guests: listingToEdit.guests || 1,
                    condition: listingToEdit.condition || 'new',
                    buildYear: listingToEdit.buildYear || '',
                    floor: listingToEdit.floor || '',
                    totalFloors: listingToEdit.totalFloors || '',
                    heating: listingToEdit.heating || '',
                    parking: listingToEdit.parking || false,
                    balcony: listingToEdit.balcony || false,
                    animals: listingToEdit.animals || false,
                    children: listingToEdit.children || false,
                    wifi: listingToEdit.wifi || false,
                });

                setImagePreviews(listingToEdit.allImages || []);
                setDescriptionCharCount(listingToEdit.fullDescription?.length || listingToEdit.description?.length || 0);
            } else {
                console.error('Оголошення для редагування не знайдено:', listingId);
                navigate('/add-listing');
            }
        } else {
            setFormData(initialFormData);
            setImagePreviews([]);
            setDescriptionCharCount(0);
        }
    }, [listingId, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'description') {
            setDescriptionCharCount(value.length);
        }
    };

    const handleAmenityToggle = (amenityValue) => {
        setFormData((prevData) => {
            const currentAmenities = prevData.amenities;
            if (currentAmenities.includes(amenityValue)) {
                return {
                    ...prevData,
                    amenities: currentAmenities.filter((item) => item !== amenityValue),
                };
            } else {
                return {
                    ...prevData,
                    amenities: [...currentAmenities, amenityValue],
                };
            }
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const currentImageCount = imagePreviews.length;
        const filesToProcess = files.slice(0, MAX_IMAGES - currentImageCount);

        const newPreviews = [];
        filesToProcess.forEach((file) => {
            newPreviews.push(URL.createObjectURL(file));
        });

        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        if (imagePreviews[indexToRemove].startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviews[indexToRemove]);
        }
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalImageUrls = imagePreviews.length > 0
            ? imagePreviews
            : ['/src/assets/images/завантаження (4).jpg']; // Використовуємо ваше дефолтне зображення

        // Мапінг 'housingType' форми до 'type' в ListingsContext
        const mappedType =
            formData.housingType === 'apartment' ? 'Квартира' :
            formData.housingType === 'room' ? 'Кімната' :
            formData.housingType === 'house' ? 'Будинок' :
            'Кімната'; // Дефолтне значення

        const listingToSave = {
            title: formData.title,
            type: mappedType, // Використовуємо mappedType
            description: formData.description,
            fullDescription: formData.description,
            address: formData.address,
            utilityPaymentType: formData.utilityPaymentType,
            ownerOccupancy: formData.ownerOccupancy,
            neighborInfo: formData.neighborInfo,
            amenities: formData.amenities.map(value => {
                const amenity = availableAmenities.find(a => a.value === value);
                return amenity ? amenity.label : value;
            }),
            price: parseFloat(formData.price),
            imageUrl: finalImageUrls[0],
            allImages: finalImageUrls,
            bedrooms: parseInt(formData.bedrooms, 10),
            bathrooms: parseInt(formData.bathrooms, 10),
            guests: parseInt(formData.guests, 10),
            condition: formData.condition,
            buildYear: formData.buildYear ? parseInt(formData.buildYear, 10) : null,
            floor: formData.floor ? parseInt(formData.floor, 10) : null,
            totalFloors: formData.totalFloors ? parseInt(formData.totalFloors, 10) : null,
            heating: formData.heating,
            parking: formData.parking,
            balcony: formData.balcony,
            animals: formData.animals,
            children: formData.children,
            wifi: formData.wifi,
            // Ці поля будуть встановлені в ListingContext при створенні,
            // а при редагуванні збережуться з існуючого об'єкта
            // ownerId: буде встановлений в ListingContext
            // owner: буде встановлений в ListingContext
            // reviews: []
            // publishedDate: буде встановлений в ListingContext
            // rating: буде встановлений в ListingContext
        };

        let storedListings = JSON.parse(localStorage.getItem('listings')) || [];

        if (isEditMode) {
            const updatedListings = storedListings.map(item => {
                if (String(item.id) === listingId) {
                    return {
                        ...item, // Зберігаємо існуючі дані, які не змінюються формою
                        ...listingToSave, // Оновлюємо поля, які можуть бути змінені формою
                        // Переконаємося, що rating, reviews, ownerId, owner зберігаються, якщо вони не оновлюються через форму
                        // Вони вже були завантажені в useEffect, тому просто залишимо їх
                        rating: item.rating || 0, // Зберігаємо існуючий рейтинг
                        reviews: item.reviews || [], // Зберігаємо існуючі відгуки
                        ownerId: item.ownerId, // Зберігаємо існуючий ownerId
                        owner: item.owner, // Зберігаємо існуючі дані власника
                    };
                }
                return item;
            });
            localStorage.setItem('listings', JSON.stringify(updatedListings));
            alert('Оголошення успішно оновлено!');
            navigate(`/listing/${listingId}`);
        } else {
            // Використовуємо функцію addListing з контексту
            const newListingId = addListing(listingToSave); // <--- ВИКЛИК addListing З КОНТЕКСТУ
            alert('Оголошення успішно додано!');
            navigate(`/listing/${newListingId}`); // Перенаправляємо на сторінку нового оголошення
        }
    };

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
                <form onSubmit={handleSubmit} className={styles.listingForm}>
                    <div className={styles.formColumns}>
                        {/* Ліва колонка */}
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Вкажіть назву</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Назва оголошення"
                                    required
                                    maxLength="70"
                                />
                                <span className={styles.charCounter}>{formData.title.length}/70</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="housingType">Вкажіть тип житла</label>
                                <select
                                    id="housingType"
                                    name="housingType"
                                    value={formData.housingType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="room">Кімната</option>
                                    <option value="apartment">Квартира</option>
                                    <option value="house">Будинок</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Придумайте опис</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Опис"
                                    rows="5"
                                    required
                                    maxLength={MAX_DESCRIPTION_LENGTH}
                                ></textarea>
                                <span className={styles.charCounter}>{descriptionCharCount}/{MAX_DESCRIPTION_LENGTH}</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="address">Вкажіть адресу</label>
                                <select
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="м. Острог, вул. Незалежності, 15">Вулиця Незалежності, 15</option>
                                    <option value="м. Острог, вул. Студентська, 3">Вулиця Студентська, 3</option>
                                    <option value="м. Острог, пров. Лісовий, 7">Провулок Лісовий, 7</option>
                                    <option value="м. Острог, вул. Паркова, 20">Вулиця Паркова, 20</option>
                                    <option value="м. Острог, вул. Шкільна, 8">Вулиця Шкільна, 8</option>
                                </select>
                            </div>

                            {/* Нові поля для кількісних характеристик */}
                            <div className={styles.formGroup}>
                                <label htmlFor="bedrooms">Кількість спалень</label>
                                <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="bathrooms">Кількість ванних кімнат</label>
                                <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="guests">Максимальна кількість гостей</label>
                                <input type="number" id="guests" name="guests" value={formData.guests} onChange={handleChange} min="1" />
                            </div>

                        </div>

                        {/* Права колонка */}
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="utilityPaymentType">Вкажіть тип оплати за комунальні послуги</label>
                                <select
                                    id="utilityPaymentType"
                                    name="utilityPaymentType"
                                    value={formData.utilityPaymentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="separate">Окремо</option>
                                    <option value="included">Включено в ціну</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="ownerOccupancy">Вкажіть інформацію про проживання власників</label>
                                <select
                                    id="ownerOccupancy"
                                    name="ownerOccupancy"
                                    value={formData.ownerOccupancy}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="with-owner">Проживання з господарями</option>
                                    <option value="without-owner">Без господарів</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="neighborInfo">Вкажіть інформацію про сусідів</label>
                                <select
                                    id="neighborInfo"
                                    name="neighborInfo"
                                    value={formData.neighborInfo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="with-roommates">Проживання з сусідами</option>
                                    <option value="no-roommates">Без сусідів</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="price">Вкажіть ціну, ₴</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    required
                                    min="0"
                                />
                            </div>

                            {/* Додаткові поля, які були додані в listings.js */}
                            <div className={styles.formGroup}>
                                <label htmlFor="condition">Стан</label>
                                <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
                                    <option value="new">Новий</option>
                                    <option value="good">Добрий</option>
                                    <option value="needs-repair">Потребує ремонту</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="buildYear">Рік побудови</label>
                                <input type="number" id="buildYear" name="buildYear" value={formData.buildYear} onChange={handleChange} min="1900" max={new Date().getFullYear()} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="floor">Поверх</label>
                                <input type="number" id="floor" name="floor" value={formData.floor} onChange={handleChange} min="0" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="totalFloors">Всього поверхів</label>
                                <input type="number" id="totalFloors" name="totalFloors" value={formData.totalFloors} onChange={handleChange} min="0" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="heating">Опалення</label>
                                <input type="text" id="heating" name="heating" value={formData.heating} onChange={handleChange} placeholder="Централізоване, індивідуальне тощо" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Паркінг
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input type="checkbox" name="balcony" checked={formData.balcony} onChange={handleChange} /> Балкон
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input type="checkbox" name="animals" checked={formData.animals} onChange={handleChange} /> Можна з тваринами
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input type="checkbox" name="children" checked={formData.children} onChange={handleChange} /> Можна з дітьми
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input type="checkbox" name="wifi" checked={formData.wifi} onChange={handleChange} /> Wi-Fi
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Секція Зручності */}
                    <div className={styles.formSection}>
                        <div className={styles.formGroup}>
                            <label>Оберіть наявні зручності (можна декілька)</label>
                            <div className={styles.amenitiesList}>
                                {availableAmenities.map((amenity) => (
                                    <div
                                        key={amenity.value}
                                        className={`${styles.amenityItem} ${formData.amenities.includes(amenity.value) ? styles.selected : ''}`}
                                        onClick={() => handleAmenityToggle(amenity.value)}
                                    >
                                        <span className={styles.amenityIndicator}></span>
                                        {amenity.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Секція додавання фото */}
                    <div className={`${styles.formSection} ${styles.photoUploadSection}`}>
                        <h2>Додайте фото</h2>
                        <div className={styles.imageGrid}>
                            {/* Кнопка "Додати фото" */}
                            {imagePreviews.length < MAX_IMAGES && (
                                <label htmlFor="imageUpload" className={styles.addPhotoButton}>
                                    <span>+</span>
                                </label>
                            )}
                            <input
                                type="file"
                                id="imageUpload"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            {/* Попередній перегляд завантажених зображень */}
                            {imagePreviews.map((src, index) => (
                                <div key={index} className={styles.imagePreviewItem}>
                                    <img src={src} alt={`Перегляд ${index}`} className={styles.previewImage} />
                                    <button
                                        type="button"
                                        className={styles.removeImageButton}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {/* Порожні слоти для решти фото */}
                            {Array.from({ length: MAX_IMAGES - imagePreviews.length }).map((_, index) => (
                                <div key={`empty-${index}`} className={styles.emptyPhotoSlot}>
                                    <img src="/icons/icon-camera.png" alt="Placeholder" className={styles.placeholderCamera} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        {submitButtonText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddListingPage;