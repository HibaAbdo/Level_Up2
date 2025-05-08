import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import logo from '../assets/logoshah.png';
import rook from '../assets/قلعة.png';
import king from '../assets/ملك.png';
import bishop from '../assets/فيل.png';
import queen from '../assets/وزير.png';
import knight from '../assets/حصان.png';

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

  const handleLogin = () => {
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

    setMessage('تم تسجيل الدخول');
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/mytournaments');
  };

  return (
    <div className="login-wrapper">

      <div className="login-container">
        {/* ✅ عنوان و لوجو */}
        <div className="login-header">
          <h2>تسجيل الدخول</h2>
        </div>

        {/* ✅ القطع على الأطراف */}
        <img src={rook} className="corner-piece bottom-right" alt="قلعة" />
        <img src={king} className="corner-piece top-right" alt="ملك" />
        <img src={bishop} className="corner-piece bottom-left" alt="فيل" />
        <img src={queen} className="corner-piece top-left" alt="وزير" />

        {/* ✅ نموذج الإدخال */}
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
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPassFocused(true)}
            onBlur={() => setIsPassFocused(password.length > 0)}
          />
          <label htmlFor="password" className={isPassFocused || password ? "label-active" : ""}>
            كلمة المرور
          </label>
          <FontAwesomeIcon
            icon={passwordVisible ? faEye : faEyeSlash}
            className="eye-icon"
            onClick={togglePasswordVisibility}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>الدخول</button>
        {message && <p>{message}</p>}
      </div>
    </div>


  );
}

export default Login;
