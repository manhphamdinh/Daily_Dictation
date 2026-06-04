import styles from './Login.module.scss';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'


function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            login(data.data.token);
            navigate("/exercises");
        }
    };


    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginForm}>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                <div className={styles.Google}>
                    <img src="/google.svg" alt="Google Login" />
                    <p>Login with Google</p>
                </div>
                <hr />
                <h2 style={{ marginTop: '20px' }}>Or enter your information</h2>
                <p>Username or Email</p>
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
                <p>Password</p>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button className={styles.loginButton} onClick={handleLogin}>
                    Login
                </button>
                <div style={{ marginTop: '30px' }}>
                    <div className={styles.forgotPassword}>
                        <p>Forgot your password?</p>
                        <a href="/forgot-password">Click here</a>
                    </div>
                    <div className={styles.forgotPassword}>
                        <p>Haven't had an account?</p>
                        <a href="/register">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login