import React, { useState } from 'react';
import AuthFormContainer from '../../components/auth/AuthFormContainer/AuthFormContainer';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './SignInPage.module.css'; // <--- ДОДАЙТЕ ЦЕЙ РЯДОК

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Дані для входу:', formData);
    // Після успішного входу можна перенаправити користувача, наприклад, на головну сторінку:
    // navigate('/');
  };

  const handleGoogleAuth = () => {
    console.log('Вхід через Google');
  };

  const handleFacebookAuth = () => {
    console.log('Вхід через Facebook');
  };

  return (
    <AuthFormContainer
      title="Увійти"
      isSignUp={false}
      onGoogleAuth={handleGoogleAuth}
      onFacebookAuth={handleFacebookAuth}
    >
      <form onSubmit={handleSubmit}>
        <Input
          icon={FiMail}
          type="email"
          placeholder="Електронна пошта"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          icon={FiLock}
          type="password"
          placeholder="Пароль"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/forgot-password" className={styles.forgotPasswordLink}>
            Забули пароль?
          </Link>
        </div>
        <Button type="submit" variant="primary">
          Увійти
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignInPage;