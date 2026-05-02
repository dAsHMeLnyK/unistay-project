import React from 'react'; 
import { useNavigate } from 'react-router-dom'; // Додаємо навігацію
import { FiMap, FiInfo } from 'react-icons/fi'; // Додаємо іконки
import styles from './InfrastructureSection.module.css'; 
 
const InfrastructureSection = ({ locationComparison }) => { 
    const navigate = useNavigate(); // Ініціалізуємо хук

    return ( 
        <section className={styles.section}> 
            <h3 className={styles.sectionTitle}>Інфраструктура та відстані</h3> 
            
            {/* НОВИЙ БЛОК: Банер з поясненням і кнопкою */}
            <div className={styles.mapBanner}>
                <div className={styles.bannerText}>
                    <FiInfo size={20} className={styles.infoIcon} />
                    <div>
                        <strong>Візуалізація відстаней</strong>
                        <p>Натисніть на карту, щоб наочно порівняти розташування цих об'єктів відносно ключових локацій міста за допомогою інтерактивних ліній.</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/explore-map')} 
                    className={styles.mapButton}
                >
                    <FiMap size={18} />
                    Відкрити карту
                </button>
            </div>

            <div className={styles.locationGrid}> 
                {locationComparison.landmarkComparisons.map((landmark, idx) => { 
                    const maxDist = Math.max(landmark.listing1DistanceKm, landmark.listing2DistanceKm, 1); 
                    const width1 = (1 - landmark.listing1DistanceKm / (maxDist * 1.2)) * 100; 
                    const width2 = (1 - landmark.listing2DistanceKm / (maxDist * 1.2)) * 100; 
 
                    return ( 
                        <div key={idx} className={styles.landmarkRow}> 
                            <div className={styles.landmarkName}>{landmark.landmarkName}</div> 
                            <div className={styles.barsContainer}> 
                                <div className={styles.barWrapper}> 
                                    <span className={styles.distValue}>{landmark.listing1DistanceKm} км</span> 
                                    <div className={styles.track}> 
                                        <div  
                                            className={`${styles.fill} ${landmark.closerListing === 0 ? styles.winnerFill : ''}`}  
                                            style={{ width: `${width1}%` }} /* ВИПРАВЛЕНО СИНТАКСИС */
                                        /> 
                                    </div> 
                                </div> 
 
                                <div className={`${styles.barWrapper} ${styles.reverse}`}> 
                                    <span className={styles.distValue}>{landmark.listing2DistanceKm} км</span> 
                                    <div className={styles.track}> 
                                        <div  
                                            className={`${styles.fill} ${landmark.closerListing === 1 ? styles.winnerFill : ''}`}  
                                            style={{ width: `${width2}%` }} /* ВИПРАВЛЕНО СИНТАКСИС */
                                        /> 
                                    </div> 
                                </div> 
                            </div> 
                        </div> 
                    ); 
                })} 
            </div> 
        </section> 
    ); 
}; 
 
export default InfrastructureSection;