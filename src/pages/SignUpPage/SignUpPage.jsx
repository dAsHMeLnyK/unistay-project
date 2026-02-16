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
    phoneNumber: '+380'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      if (!value.startsWith('+380')) return;
      const phoneDigits = value.slice(4).replace(/\D/g, '');
      if (phoneDigits.length > 9) return; 
      setFormData({ ...formData, [name]: '+380' + phoneDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають!');
      return;
    }

    setLoading(true);
    try {
      await UserService.create({
        ...formData,
        phoneNumber: formData.phoneNumber === '+380' ? null : formData.phoneNumber
      });
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer title="Створити акаунт" isSignUp={true}>
      <form onSubmit={handleSubmit}>
        {error && <div className="system-error">{error}</div>}
        
        <Input icon={FiUser} placeholder="Ім'я" name="firstName" value={formData.firstName} onChange={handleChange} required />
        <Input icon={FiUser} placeholder="Прізвище" name="lastName" value={formData.lastName} onChange={handleChange} required />
        <Input icon={FiMail} type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
        <Input icon={FiPhone} type="tel" placeholder="Телефон" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        <Input icon={FiLock} type="password" placeholder="Пароль" name="password" value={formData.password} onChange={handleChange} required />
        <Input icon={FiLock} type="password" placeholder="Підтвердіть пароль" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Створення...' : 'Зареєструватися'}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignUpPage;