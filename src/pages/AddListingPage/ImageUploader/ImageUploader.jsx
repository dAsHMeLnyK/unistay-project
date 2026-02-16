import React from 'react';
import { FiPlus, FiX, FiLoader } from 'react-icons/fi';
import styles from './ImageUploader.module.css';

const ImageUploader = ({ imageUrls, setImageUrls, isUploading, setIsUploading }) => {
    const CLOUD_NAME = "dmgawz7me";
    const UPLOAD_PRESET = "listing_images";

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
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
                    { method: "POST", body: data }
                );
                const fileData = await response.json();
                if (fileData.secure_url) {
                    uploadedLinks.push(fileData.secure_url);
                }
            } catch (error) {
                console.error("Помилка завантаження фото:", error);
                alert(`Не вдалося завантажити файл ${file.name}`);
            }
        }

        setImageUrls(prev => [...prev, ...uploadedLinks]);
        setIsUploading(false);
    };

    const removeImage = (indexToRemove) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={styles.uploaderContainer}>
            <div className={styles.imageGrid}>
                {imageUrls.map((url, index) => (
                    <div key={index} className={styles.imageItem}>
                        <img src={url} alt={`Preview ${index}`} className={styles.previewImage} />
                        <button 
                            type="button" 
                            className={styles.removeBtn} 
                            onClick={() => removeImage(index)}
                            title="Видалити фото"
                        >
                            <FiX />
                        </button>
                    </div>
                ))}

                <label className={`${styles.addBtn} ${isUploading ? styles.disabled : ''}`}>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        hidden 
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <div className={styles.loaderWrapper}>
                            <FiLoader className={styles.loaderIcon} />
                            <span>Завантаження...</span>
                        </div>
                    ) : (
                        <>
                            <FiPlus className={styles.plusIcon} />
                            <span>Додати фото</span>
                        </>
                    )}
                </label>
            </div>
            <p className={styles.hint}>* Можна завантажити кілька фото одночасно</p>
        </div>
    );
};

export default ImageUploader;