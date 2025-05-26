// src/pages/AddListingPage/AddListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddListingPage.module.css';

// Імпортуємо бібліотеку UUID для надійної унікальності ID
import { v4 as uuidv4 } from 'uuid'; // <-- ДОДАНО: Імпорт uuid

// Функція для генерації унікального ID (використовуємо uuid)
const generateUniqueId = () => {
    return uuidv4(); // Генеруємо унікальний UUID
};

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

    const [formData, setFormData] = useState({
        title: '',
        housingType: 'room', // Встановлено початкове значення
        description: '',
        address: 'м. Острог, вул. Незалежності, 15', // Встановлено початкове значення
        utilityPaymentType: 'separate', // Встановлено початкове значення
        ownerOccupancy: 'with-owner', // Встановлено початкове значення
        neighborInfo: 'with-roommates', // Встановлено початкове значення
        amenities: [],
        price: '',
        images: [],
        // Додайте поля, які потрібні для ListingDetailsPage, якщо їх немає у формі
        // Наприклад, для кількості спалень, ванних кімнат, гостей
        bedrooms: 1, // Можливо, додати поле у форму, або залишити дефолт
        bathrooms: 1, // Можливо, додати поле у форму, або залишити дефолт
        guests: 1, // Можливо, додати поле у форму, або залишити дефолт
    });

    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const MAX_DESCRIPTION_LENGTH = 2000;

    const [imagePreviews, setImagePreviews] = useState([]);
    const MAX_IMAGES = 6;

    useEffect(() => {
        // Цей useEffect тепер менш критичний, якщо ми задаємо початкові значення прямо у useState
        // Але можна залишити, якщо потрібно встановлювати значення на основі іншої логіки
        // Або для синхронізації з localStorage, якщо це потрібно для редагування
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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
        const filesToProcess = files.slice(0, MAX_IMAGES - imagePreviews.length);

        const newPreviews = [];
        const newImageFiles = [];

        filesToProcess.forEach((file) => {
            newPreviews.push(URL.createObjectURL(file));
            newImageFiles.push(file);
        });

        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...newImageFiles],
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
        setFormData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const imageUrls = imagePreviews.length > 0
            ? imagePreviews
            : ['https://via.placeholder.com/600x400?text=Listing+Image'];

        const newListing = {
            id: generateUniqueId(), // Тепер генеруємо UUID
            title: formData.title,
            housingType: formData.housingType,
            description: formData.description,
            fullDescription: formData.description, // <-- ДОДАНО: fullDescription
            address: formData.address,
            utilityPaymentType: formData.utilityPaymentType,
            ownerOccupancy: formData.ownerOccupancy,
            neighborInfo: formData.neighborInfo,
            amenities: formData.amenities.map(value => { // <-- ДОДАНО: Перетворення 'value' на 'label'
                const amenity = availableAmenities.find(a => a.value === value);
                return amenity ? amenity.label : value;
            }),
            price: parseFloat(formData.price),
            imageUrl: imageUrls[0],
            allImages: imageUrls, // <-- ДОДАНО: allImages
            rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // Перетворюємо на число
            reviewCount: Math.floor(Math.random() * 50) + 5,
            publishedDate: new Date().toLocaleDateString('uk-UA'),

            // ДОДАНО: Поля, які є у статичних даних, але не у вашій формі AddListingPage
            bedrooms: formData.bedrooms, // Припускаємо, що це поле є у formData, або має дефолт
            bathrooms: formData.bathrooms, // Припускаємо, що це поле є у formData, або має дефолт
            guests: formData.guests, // Припускаємо, що це поле є у formData, або має дефолт

            owner: { // <-- ДОДАНО: Дані власника за замовчуванням
                name: 'Новий Власник', // Можна зробити поле для вводу у формі
                phone: '+380998887766',
                avatarUrl: 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=NV',
                registrationDate: new Date().toLocaleDateString('uk-UA'),
            },
            reviews: [], // <-- ДОДАНО: Порожній масив відгуків за замовчуванням
        };

        const existingListings = JSON.parse(localStorage.getItem('listings')) || [];
        // Тут ми додаємо нове оголошення на початок, щоб воно було одразу видиме.
        const updatedListings = [newListing, ...existingListings];
        localStorage.setItem('listings', JSON.stringify(updatedListings));

        console.log('Додано нове оголошення:', newListing); // Для дебагу
        alert('Оголошення успішно додано!');
        navigate('/');
    };

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <h1 className={styles.pageTitle}>Створити оголошення</h1>
                <form onSubmit={handleSubmit} className={styles.listingForm}>
                    <div className={styles.formColumns}>
                        {/* Ліва колонка */}
                        <div className={styles.formColumn}>
                            <div className={styles.formSection}>
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
                            </div>
                        </div>

                        {/* Права колонка */}
                        <div className={styles.formColumn}>
                            <div className={styles.formSection}>
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
                            </div>
                        </div>
                    </div> {/* Закінчення formColumns */}

                    {/* НОВА СЕКЦІЯ: Зручності - тепер це окрема широка секція */}
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
                        Опублікувати
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddListingPage;