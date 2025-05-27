import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Імпортуємо useNavigate для перенаправлення
import AuthFormContainer from "../../components/auth/AuthFormContainer/AuthFormContainer"; // Переконайтеся, що шлях правильний
import Input from "../../components/common/Input/Input"; // Переконайтеся, що шлях правильний
import Button from "../../components/common/Button/Button"; // Переконайтеся, що шлях правильний
import { FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./SignInPage.module.css";

import { useAuth } from "../../context/AuthContext"; // <--- ІМПОРТУЄМО useAuth ХУК

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null); // Стан для зберігання помилок
  const [loading, setLoading] = useState(false); // Стан для індикатора завантаження

  const { login } = useAuth(); // <--- ОТРИМУЄМО ФУНКЦІЮ login З AuthContext
  const navigate = useNavigate(); // Ініціалізуємо useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    // Робимо функцію асинхронною
    e.preventDefault();
    setError(null); // Скидаємо попередні помилки
    setLoading(true); // Встановлюємо стан завантаження

    try {
      // Викликаємо функцію login з AuthContext, передаючи email та password
      const success = await login(formData.email, formData.password);

      if (success) {
        // Якщо вхід успішний, перенаправляємо на головну сторінку
        navigate("/");
      } else {
        // Якщо вхід не успішний (наприклад, невірні облікові дані)
        setError("Невірний логін або пароль.");
      }
    } catch (err) {
      // Обробка інших помилок (наприклад, проблеми з мережею, помилки бекенду)
      setError("Виникла помилка під час входу. Будь ласка, спробуйте ще раз.");
      console.error("Помилка при спробі входу:", err);
    } finally {
      setLoading(false); // Завжди скидаємо стан завантаження, незалежно від успіху/помилки
    }
  };

  const handleGoogleAuth = () => {
    console.log("Вхід через Google (не реалізовано)");
    alert("Вхід через Google поки не реалізовано."); // Для тесту
  };

  const handleFacebookAuth = () => {
    console.log("Вхід через Facebook (не реалізовано)");
    alert("Вхід через Facebook поки не реалізовано."); // Для тесту
  };

  return (
    <AuthFormContainer
      title="Увійти"
      isSignUp={false}
      onGoogleAuth={handleGoogleAuth}
      onFacebookAuth={handleFacebookAuth}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </p>
        )}{" "}
        {/* Відображення помилки */}
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
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <Link to="/forgot-password" className={styles.forgotPasswordLink}>
            Забули пароль?
          </Link>
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {" "}
          {/* Вимикаємо кнопку під час завантаження */}
          {loading ? "Вхід..." : "Увійти"} {/* Змінюємо текст кнопки */}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignInPage;
