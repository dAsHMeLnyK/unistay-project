// src/pages/AddListingPage/AddListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- ДОДАНО: useParams
import styles from './AddListingPage.module.css';

// Імпортуємо бібліотеку UUID для надійної унікальності ID
import { v4 as uuidv4 } from 'uuid';

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
    const { listingId } = useParams(); // <-- ДОДАНО: Отримуємо listingId з URL

    // Початкові значення форми. Вони будуть перезаписані, якщо це режим редагування.
    const initialFormData = {
        title: '',
        housingType: 'room',
        description: '',
        address: 'м. Острог, вул. Незалежності, 15',
        utilityPaymentType: 'separate',
        ownerOccupancy: 'with-owner',
        neighborInfo: 'with-roommates',
        amenities: [],
        price: '',
        images: [], // Для об'єктів File, якщо будемо працювати з File API
        // Заповнюємо ці поля, щоб вони завжди були у формі, навіть якщо їх немає у початкових даних
        bedrooms: 1,
        bathrooms: 1,
        guests: 1,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const MAX_DESCRIPTION_LENGTH = 2000;
    const [imagePreviews, setImagePreviews] = useState([]); // Для URL прев'ю зображень
    const MAX_IMAGES = 6;

    // Визначаємо, чи перебуваємо ми в режимі редагування
    const isEditMode = !!listingId;
    const pageTitle = isEditMode ? 'Редагувати оголошення' : 'Створити оголошення';
    const submitButtonText = isEditMode ? 'Оновити оголошення' : 'Опублікувати';


    useEffect(() => {
        if (isEditMode && listingId) {
            const storedListings = JSON.parse(localStorage.getItem('listings')) || [];
            const listingToEdit = storedListings.find(item => String(item.id) === listingId);

            if (listingToEdit) {
                // Заповнюємо форму даними оголошення
                setFormData({
                    title: listingToEdit.title || '',
                    housingType: listingToEdit.housingType || 'room',
                    description: listingToEdit.fullDescription || listingToEdit.description || '', // Використовуємо fullDescription
                    address: listingToEdit.address || 'м. Острог, вул. Незалежності, 15',
                    utilityPaymentType: listingToEdit.utilityPaymentType || 'separate',
                    ownerOccupancy: listingToEdit.ownerOccupancy || 'with-owner',
                    neighborInfo: listingToEdit.neighborInfo || 'with-roommates',
                    // Перетворюємо amenities назад у 'value' для форми, якщо вони зберігаються як 'label'
                    amenities: listingToEdit.amenities ? listingToEdit.amenities.map(label => {
                        const amenity = availableAmenities.find(a => a.label === label);
                        return amenity ? amenity.value : label;
                    }) : [],
                    price: listingToEdit.price || '',
                    images: [], // Для режиму редагування ми не завантажуємо File об'єкти
                    bedrooms: listingToEdit.bedrooms || 1,
                    bathrooms: listingToEdit.bathrooms || 1,
                    guests: listingToEdit.guests || 1,
                });

                // Встановлюємо прев'ю зображень з посилань
                setImagePreviews(listingToEdit.allImages || []);
                setDescriptionCharCount(listingToEdit.fullDescription?.length || listingToEdit.description?.length || 0);
            } else {
                console.error('Оголошення для редагування не знайдено:', listingId);
                navigate('/add-listing'); // Якщо оголошення не знайдено, переходимо в режим створення
            }
        } else {
            // Скидаємо форму, якщо переходимо в режим створення з редагування
            setFormData(initialFormData);
            setImagePreviews([]);
            setDescriptionCharCount(0);
        }
    }, [listingId, isEditMode, navigate]); // Залежності useEffect

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
        // Фільтруємо вже існуючі прев'юшки, щоб не додавати їх двічі, якщо вони вже є
        const currentImageCount = imagePreviews.length;
        const filesToProcess = files.slice(0, MAX_IMAGES - currentImageCount);

        const newPreviews = [];
        filesToProcess.forEach((file) => {
            newPreviews.push(URL.createObjectURL(file));
        });

        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        // Важливо: для редагування ми зберігаємо URL-и, а не File об'єкти
        // Тому formData.images не потрібен для збереження File об'єктів
    };

    const handleRemoveImage = (indexToRemove) => {
        // Якщо це URL, ми відкликаємо його
        if (imagePreviews[indexToRemove].startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviews[indexToRemove]);
        }
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Забезпечуємо, що завжди є хоча б одне зображення
        const finalImageUrls = imagePreviews.length > 0
            ? imagePreviews
            : ['https://via.placeholder.com/600x400?text=Listing+Image'];

        const commonListingData = {
            title: formData.title,
            housingType: formData.housingType,
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
            imageUrl: finalImageUrls[0], // Перше зображення як основне
            allImages: finalImageUrls, // Всі зображення
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            guests: formData.guests,
            // Owner та Reviews додаємо лише при створенні нового оголошення,
            // при редагуванні вони вже повинні бути в існуючому об'єкті
        };

        let storedListings = JSON.parse(localStorage.getItem('listings')) || [];

        if (isEditMode) {
            // Режим редагування: знаходимо оголошення і оновлюємо його
            const updatedListings = storedListings.map(item => {
                if (String(item.id) === listingId) {
                    return {
                        ...item, // Зберігаємо існуючі поля (наприклад, rating, reviews, owner), якщо вони не змінюються через форму
                        ...commonListingData,
                        // Переконаємося, що rating, reviews, owner зберігаються, якщо вони не оновлюються через форму
                        rating: item.rating || 0,
                        reviews: item.reviews || [],
                        owner: item.owner || { name: 'Невідомо', phone: 'Невідомо' }, // Дефолтне значення, якщо немає
                    };
                }
                return item;
            });
            localStorage.setItem('listings', JSON.stringify(updatedListings));
            alert('Оголошення успішно оновлено!');
            navigate(`/listing/${listingId}`); // Повертаємося на сторінку деталей
        } else {
            // Режим створення: додаємо нове оголошення
            const newListing = {
                id: generateUniqueId(),
                ...commonListingData,
                rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // Випадковий рейтинг для нового
                reviewCount: Math.floor(Math.random() * 50) + 5,
                publishedDate: new Date().toLocaleDateString('uk-UA'),
                owner: {
                    name: 'Новий Власник',
                    phone: '+380998887766',
                    avatarUrl: 'https://via.placeholder.com/60x60/CCCCCC/FFFFFF?text=NV',
                    registrationDate: new Date().toLocaleDateString('uk-UA'),
                },
                reviews: [],
            };
            const updatedListings = [newListing, ...storedListings];
            localStorage.setItem('listings', JSON.stringify(updatedListings));
            alert('Оголошення успішно додано!');
            navigate('/'); // Перенаправляємо на головну сторінку
        }
    };

    return (
        <div className={styles.addListingPage}>
            <div className={styles.pageContentWrapper}>
                <h1 className={styles.pageTitle}>{pageTitle}</h1> {/* Оновлений заголовок */}
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
                        {submitButtonText} {/* Оновлений текст кнопки */}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddListingPage;