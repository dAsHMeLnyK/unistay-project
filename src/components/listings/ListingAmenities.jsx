// src/components/listings/ListingAmenities.jsx
import React from 'react';
import styles from './ListingAmenities.module.css';

const amenityMap = {
  'Wi-Fi': '&#x1F4F6;', // Wi-Fi
  'Кухня': '&#x1F373;', // Сковорода/кухня
  'Пральна машина': '&#x1F9FC;', // Пральна машина
  'Балкон': '&#x1F307;', // Балкон/вид
  'Кондиціонер': '&#x2744;&#xFE0F;', // Сніжинка/кондиціонер
  'Мікрохвильова піч': '&#x1F374;', // Мікрохвильовка
  'Плита': '&#x1F525;', // Вогонь/плита
  'Холодильник': '&#x2744;&#xFE0F;', // Сніжинка/холодильник
  'Парковка': '&#x1F697;', // Автомобіль
  'Сад': '&#x1F33F;', // Дерево/сад
  'Духова піч': '&#x1F36A;', // Печиво/духовка
  'Електрочайник': '&#x2615;', // Чашка чаю
};

const ListingAmenities = ({ amenities }) => {
  return (
    <div className={styles.listingAmenities}>
      <h2 className={styles.sectionTitle}>Зручності</h2>
      <ul className={styles.amenitiesList}>
        {amenities.map((amenity, index) => (
          <li key={index} className={styles.amenityItem}>
            <span
              className={styles.amenityIcon}
              dangerouslySetInnerHTML={{ __html: amenityMap[amenity] || '&#x25CF;' }} // Запасний маркер
            ></span>
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListingAmenities;