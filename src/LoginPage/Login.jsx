import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isUserFocused, setIsUserFocused] = useState(false);
    const [isPassFocused, setIsPassFocused] = useState(false);
    const navigate = useNavigate(); // ADD THIS

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async () => {
        // Check if username or password is empty
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
            // FAKE LOGIN: Assume always success for now
            setMessage('تم تسجيل الدخول');
            localStorage.setItem('isLoggedIn', 'true'); // Save login status
            navigate('/mytournaments'); // Redirect to tournaments page
            
            // Later, replace this block with real API call
        } catch (error) {
            setMessage('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى لاحقاً.');
        }
    };
    
    
    

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>تسجيل الدخول</h2>

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
                    <label
                        htmlFor="username"
                        className={isUserFocused || username ? "label-active" : ""}
                    >
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
                    <label
                        htmlFor="password"
                        className={isPassFocused || password ? "label-active" : ""}
                    >
                        كلمة المرور
                    </label>
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEye : faEyeSlash}
                        className="eye-icon"
                        onClick={togglePasswordVisibility}
                    />
                </div>

                <button className="login-btn" onClick={handleLogin}>
                    الدخول
                </button>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Login;
