import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthFormContainer from "../../components/auth/AuthFormContainer/AuthFormContainer";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { FiMail, FiLock } from "react-icons/fi";
import styles from "./SignInPage.module.css";
import { useAuth } from "../../context/AuthContext";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очищуємо помилку, коли користувач починає знову вводити дані
    if (error) setError(null);
  };

  const validateForm = () => {
    // Валідація Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Будь ласка, введіть коректну електронну адресу.");
      return false;
    }

    // Валідація пароля (згідно з вашим CreateUserCommandValidator)
    if (formData.password.length < 8) {
      setError("Пароль повинен містити не менше 8 символів.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Спочатку перевіряємо формат на фронтенді
    if (!validateForm()) return;

    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate("/");
      } else {
        // Зазвичай бекенд повертає 401 для невірних паролів
        setError("Невірний логін або пароль.");
      }
    } catch (err) {
      // Якщо бекенд повернув помилку з повідомленням
      const serverMessage = err.response?.data?.Message || err.response?.data?.message;
      setError(serverMessage || "Виникла помилка під час входу. Перевірте з'єднання з сервером.");
      console.error("Помилка при спробі входу:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Вхід через Google поки не реалізовано.");
  };

  const handleFacebookAuth = () => {
    alert("Вхід через Facebook поки не реалізовано.");
  };

  return (
    <AuthFormContainer
      title="Увійти"
      isSignUp={false}
      onGoogleAuth={handleGoogleAuth}
      onFacebookAuth={handleFacebookAuth}
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div style={{ 
            color: "#d93025", 
            backgroundColor: "#fde7e9", 
            padding: "10px", 
            borderRadius: "4px", 
            marginBottom: "15px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #f8c9cc"
          }}>
            {error}
          </div>
        )}

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
          {loading ? "Вхід..." : "Увійти"}
        </Button>
      </form>
    </AuthFormContainer>
  );
};

export default SignInPage;