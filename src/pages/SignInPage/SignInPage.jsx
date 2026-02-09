import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthFormContainer from "../../components/auth/AuthFormContainer/AuthFormContainer";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { FiMail, FiLock } from "react-icons/fi";
import styles from "./SignInPage.module.css";
import { useAuth } from "../../context/AuthContext";

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Будь ласка, введіть коректну електронну адресу.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Пароль повинен містити не менше 8 символів.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/");
      } else {
        setError("Невірний логін або пароль.");
      }
    } catch (err) {
      const serverMessage = err.response?.data?.Message || err.response?.data?.message;
      setError(serverMessage || "Виникла помилка під час входу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer
      title="Увійти"
      isSignUp={false}
      onGoogleAuth={() => alert("Вхід через Google поки не реалізовано.")}
      onFacebookAuth={() => alert("Вхід через Facebook поки не реалізовано.")}
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className={styles.errorContainer}>{error}</div>}

        <Input
          icon={FiMail}
          type="email"
          placeholder="Електронна пошта"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          icon={FiLock}
          type="password"
          placeholder="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className={styles.forgotPasswordWrapper}>
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