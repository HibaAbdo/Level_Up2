import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import rook from '../assets/LoginIcons/rook.png';
import king from '../assets/LoginIcons/king.png';
import bishop from '../assets/LoginIcons/bishop.png';
import queen from '../assets/LoginIcons/queen.png';
import logo from '../assets/logoshah.png';

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

    console.log('Login response:', response.data);


    const { role } = response.data;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);

    setMessage('');

    // ✅ التوجيه حسب الدور
    if (role === 'arbiter') {
      navigate('/arbiter-rounds');
    } else if (role === 'ORGANIZER') {
      navigate('/mytournaments');
    } else {
      navigate('/arbiter-rounds');
    }

  } catch (error) {
    setMessage('فشل تسجيل الدخول، تأكد من البيانات');
    console.error('Login error:', error.response?.data || error.message);
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <img src={logo} alt="شطرنج القدس" className="login-logo" />
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
              كلمة المرور
            </label>
            <FontAwesomeIcon
              icon={passwordVisible ? faEye : faEyeSlash}
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>

          <button type="submit" className="login-btn">تسجيل الدخول</button>

          <button
            type="button"
            className="mini-link-button"
            onClick={() => navigate('/guests-home')}
          >
           الدخول كضيف
          </button>
        </form>

        <div className="chess-icons-bar">
          <div className="chess-icon-circle"><img src={rook} alt="قلعة" /></div>
          <div className="chess-icon-circle"><img src={bishop} alt="فيل" /></div>
          <div className="chess-icon-circle"><img src={queen} alt="وزير" /></div>
          <div className="chess-icon-circle"><img src={king} alt="ملك" /></div>
        </div>

        {message && <p className="login-error">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
