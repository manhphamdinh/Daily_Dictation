import styles from './ChangePassword.module.scss';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'


function ChangePassword() {
    const { user, token, loading, refreshUser } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/profile/change-password`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Update failed");
            }

            // 🔥 cập nhật lại user toàn app
            await refreshUser();

            // 🔥 UX tốt hơn
            alert("Password updated successfully!");

            navigate("/user/account-information");

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <h3>No user</h3>;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 style={{ textAlign: 'center' }}>
                    Change password
                </h1>

                <p>Current password</p>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <p>New password</p>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className={styles.button} onClick={handleSubmit}>
                    Submit
                </button>

                <div style={{ marginTop: '30px' }}>
                    <div className={styles.forgotPassword}>
                        <p>Forgot your password?</p>
                        <a href="/forgot-password">Click here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;