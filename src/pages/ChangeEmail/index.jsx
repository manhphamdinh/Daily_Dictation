import styles from './ChangeEmail.module.scss';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'


function ChangeEmail() {
  const { user, token, loading, refreshUser } = useContext(AuthContext);
  const [newEmail, setEmail] = useState('');
  const navigate = useNavigate();

  // ✅ sync khi user load xong
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile/change-email`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      // 🔥 cập nhật lại user toàn app
      await refreshUser();

      // 🔥 UX tốt hơn
      alert("Email updated successfully!");

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
          Update your email address
        </h1>

        <p>Email</p>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangeEmail;