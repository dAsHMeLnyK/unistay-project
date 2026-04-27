import React, { useState, useRef, useEffect } from 'react'; 
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import { FiHeart, FiMessageSquare, FiUser, FiLogOut, FiList, FiChevronDown } from 'react-icons/fi'; 
import styles from './Navbar.module.css'; 
import { useAuth } from '../../../context/AuthContext'; 
import { useListings } from '../../../context/ListingContext'; 
import Button from '../../common/Button/Button'; 
 
const Navbar = () => { 
    const { isAuthenticated, userId, userName, profileImage, logout } = useAuth(); 
    const { favoriteIds } = useListings(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Закриття меню при кліку поза ним
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate('/');
    };
 
    return ( 
        <nav className={styles.navbar}> 
            <div className={styles.navContainer}> 
                <Link to="/" className={styles.logo}> UniStay </Link> 
                 
                <div className={styles.navLinks}> 
                    <NavLink to="/listings" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}> 
                        Переглянути оголошення 
                    </NavLink> 
                    <NavLink to="/add-listing" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}> 
                        Додати оголошення 
                    </NavLink> 
                </div> 
 
                <div className={styles.userActions}> 
                    {isAuthenticated && ( 
                        <Link to="/messages" className={styles.iconLink} title="Повідомлення"> 
                            <div className={styles.iconContainer}> 
                                <FiMessageSquare className={styles.navIcon} /> 
                            </div> 
                        </Link> 
                    )} 
 
                    <Link to="/favorites" className={styles.iconLink} title="Обране"> 
                        <div className={styles.iconContainer}> 
                            <FiHeart className={styles.navIcon} fill="var(--accent-color)" /> 
                            {favoriteIds.length > 0 && <span className={styles.badge}>{favoriteIds.length}</span>} 
                        </div> 
                    </Link> 
 
                    {isAuthenticated ? ( 
                        <div className={styles.profileMenuContainer} ref={menuRef}>
                            <div className={styles.profileToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <div className={styles.navAvatar}>
                                    {profileImage ? (
                                        <img src={profileImage} alt={userName} />
                                    ) : (
                                        userName?.charAt(0).toUpperCase() || <FiUser />
                                    )}
                                </div>
                                <FiChevronDown className={`${styles.chevron} ${isMenuOpen ? styles.rotate : ''}`} />
                            </div>

                            {isMenuOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <strong>{userName || 'Користувач'}</strong>
                                    </div>
                                    <hr />
                                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                        <FiUser /> Мій профіль
                                    </Link>
                                    <Link to="/my-listings" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                        <FiList /> Мої оголошення
                                    </Link>
                                    <hr />
                                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                                        <FiLogOut /> Вийти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : ( 
                        <div className={styles.authButtons}> 
                            <Link to="/signin"> 
                                <Button variant="outline" className={styles.navButton}>Вхід</Button> 
                            </Link> 
                            <Link to="/signup"> 
                                <Button variant="primary" className={styles.navButton}>Реєстрація</Button> 
                            </Link> 
                        </div> 
                    )} 
                </div> 
            </div> 
        </nav> 
    ); 
}; 
 
export default Navbar;