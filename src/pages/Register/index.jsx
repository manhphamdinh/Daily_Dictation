import styles from './Register.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'
import gicon from '../../assets/images/gicon.svg'

function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    


    const handleRegister = async () => {

        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                username,
                password
            })
        });

        const data = await res.json();

        if(data.success){
            alert("Register success");
            navigate("/login");
        }else{
            alert(data.message);
        }

    };

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginForm}>
                <h1 style={{ textAlign: 'center' }}>Create an account</h1>
                <div className={styles.Google}>
                    <img src={gicon} alt="Google Register" />
                    <p>Register with Google</p>
                </div>
                <hr />
                <h2 style={{ marginTop: '20px' }}>Or enter your information</h2>
                <p>Username</p>
                <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <p>Email</p>
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                <p>Password</p>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button className={styles.loginButton} onClick={handleRegister}>
                    Register
                </button>
                <div style={{ marginTop: '30px'}}>
                    <div className={styles.forgotPassword}>
                        <p>Had an account already?</p>
                        <a href="/login">Login here</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register