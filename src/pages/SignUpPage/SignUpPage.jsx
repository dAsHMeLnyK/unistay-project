import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthFormContainer from '../../components/auth/AuthFormContainer/AuthFormContainer';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import UserService from '../../api/services/UserService';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '+380' // Початкова маска
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Логіка маски для телефону
    if (name === 'phoneNumber') {
      // Не дозволяємо видаляти префікс +380
      if (!value.startsWith('+380')) return;
      
      // Дозволяємо лише цифри після префікса (загалом до 13 символів з '+')
      const phoneDigits = value.slice(4).replace(/\D/g, '');
      if (phoneDigits.length > 9) return; 
      
      setFormData({ ...formData, [name]: '+380' + phoneDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Валідація згідно з вашим CreateUserCommandValidator на бекенді
    if (formData.password.length < 8) {
      setError('Пароль має містити щонайменше 8 символів.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають!');
      return;
    }

    setLoading(true);
    try {
      const createData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        // Якщо введено лише префікс, надсилаємо null
        phoneNumber: formData.phoneNumber === '+380' ? null : formData.phoneNumber,
        profileImage: null
      };

      await UserService.create(createData);
      alert('Реєстрація успішна! Тепер увійдіть у систему.');
      navigate('/signin');
    } catch (err) {
      // Перевіряємо різні варіанти структури помилки від бекенду
      const message = err.response?.data?.Message || 
                      err.response?.data?.message || 
                      'Помилка реєстрації. Перевірте дані.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer title="Створити акаунт" isSignUp={true}>
      <form onSubmit={handleSubmit}>
        {error && (
          <p style={{ 
            color: '#ff4d4d', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '5px', 
            textAlign: 'center',
            fontSize: '14px' 
          }}>
            {error}
          </p>
        )}
        
        <Input 
          icon={FiUser} 
          type="text" 
          placeholder="Ім'я" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          required 
        />
        <Input 
          icon={FiUser} 
          type="text" 
          placeholder="Прізвище" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          required 
        />
        <Input 
          icon={FiMail} 
          type="email" 
          placeholder="Email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <Input 
          icon={FiPhone} 
          type="tel" 
          placeholder="Телефон (+380...)" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
        />
        <Input 
          icon={FiLock} 
          type="password" 
          placeholder="Пароль (мін. 8 символів)" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <Input 
          icon={FiLock} 
          type="password" 
          placeholder="Підтвердіть пароль" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          required 
        />
        
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Створення...' : 'Зареєструватися'}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignUpPage;