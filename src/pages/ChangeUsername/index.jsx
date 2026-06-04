import styles from './ChangeUsername.module.scss';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'


function ChangeUsername() {
  const { user, token, loading, refreshUser } = useContext(AuthContext);
  const [newUsername, setUsername] = useState('');
  const navigate = useNavigate();

  // ✅ sync khi user load xong
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile/change-username`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      // 🔥 cập nhật lại user toàn app
      await refreshUser();

      // 🔥 UX tốt hơn
      alert("Username updated successfully!");

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
          Change display name
        </h1>

        <p>Username</p>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangeUsername;