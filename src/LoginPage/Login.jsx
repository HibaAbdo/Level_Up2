import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';
import './Login.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import rook from '../assets/LoginIcons/Rook.png';
import king from '../assets/LoginIcons/King.png';
import bishop from '../assets/LoginIcons/Bishop.png';
import queen from '../assets/LoginIcons/Queen.png';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isUserFocused, setIsUserFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username && !password) {
      setMessage('أدخل اسم المستخدم وكلمة المرور');
      return;
    }
    if (!username) {
      setMessage('أدخل اسم المستخدم');
      return;
    }
    if (!password) {
      setMessage('أدخل كلمة المرور');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      // localStorage.setItem('token', response.data.token); // إذا كنت تستخدم JWT

      setMessage('');
      navigate('/mytournaments');
    } catch (error) {
      setMessage('فشل تسجيل الدخول، تأكد من البيانات');
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <PageLayout>
      <div className="login-wrapper">
        <div className="login-container">
          {/* ✅ الأيقونات داخل مربع تسجيل الدخول */}
          <img src={rook} className="corner-piece bottom-right" alt="قلعة" />
          <img src={king} className="corner-piece top-right" alt="ملك" />
          <img src={bishop} className="corner-piece bottom-left" alt="فيل" />
          <img src={queen} className="corner-piece top-left" alt="وزير" />

      

          <div className="login-header">
            <h2>تسجيل الدخول</h2>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                id="username"
                placeholder="webguild"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsUserFocused(true)}
                onBlur={() => setIsUserFocused(username.length > 0)}
              />
              <label htmlFor="username" className={isUserFocused || username ? "label-active" : ""}>
                اسم المستخدم
              </label>
            </div>

            <div className="input-group password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPassFocused(true)}
                onBlur={() => setIsPassFocused(password.length > 0)}
              />
              <label htmlFor="password" className={isPassFocused || password ? "label-active" : ""}>
                كلمة شطرنج المرور
              </label>
              <FontAwesomeIcon
                icon={passwordVisible ? faEye : faEyeSlash}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>

            <button type="submit" className="login-btn">الدخول</button>
          </form>

          {message && <p>{message}</p>}
        </div>
      </div>
    </PageLayout>
  );
}

export default Login;
