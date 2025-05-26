import React, { useState } from 'react';
import AuthFormContainer from '../../components/auth/AuthFormContainer/AuthFormContainer';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { FiUser, FiMail, FiLock } from 'react-icons/fi'; // Імпортуємо іконки

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '', // Додамо прізвище, якщо потрібно
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут буде логіка відправки даних на API для реєстрації
    console.log('Дані для реєстрації:', formData);

    if (formData.password !== formData.confirmPassword) {
      alert('Паролі не співпадають!');
      return;
    }
    // Після успішної реєстрації можна перенаправити користувача
    // navigate('/signin');
  };

  const handleGoogleAuth = () => {
    console.log('Реєстрація через Google');
    // Логіка для реєстрації через Google
  };

  const handleFacebookAuth = () => {
    console.log('Реєстрація через Facebook');
    // Логіка для реєстрації через Facebook
  };

  return (
    <AuthFormContainer
      title="Створити акаунт"
      isSignUp={true} // Ця сторінка є реєстрацією
      onGoogleAuth={handleGoogleAuth}
      onFacebookAuth={handleFacebookAuth}
    >
      <form onSubmit={handleSubmit}>
        <Input
          icon={FiUser}
          type="text"
          placeholder="Ім'я"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          icon={FiUser}
          type="text"
          placeholder="Прізвище"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
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
        <Input
          icon={FiLock}
          type="password"
          placeholder="Підтвердити пароль"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="primary">
          Зареєструватися
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignUpPage;