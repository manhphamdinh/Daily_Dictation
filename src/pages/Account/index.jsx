// Account.jsx
import styles from "./Account.module.scss";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

function Account() {
  const {  user } = useContext(AuthContext);
  const navigate = useNavigate();


  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Account information</h1>

      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.label}>Account Type</div>
          <div className={styles.value}>
            {user.accountType}
            <span className={styles.link}>Upgrade Now</span>
            <span className={styles.link}>View Purchases</span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Email</div>
          <div className={styles.value}>
            {user.email}
            <span
              className={styles.link}
              onClick={() => navigate("/user/change-email")}
            >
              Edit
            </span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Display name</div>
          <div className={styles.value}>
            {user.username}
            <span
              className={styles.link}
              onClick={() => navigate("/user/change-username")}
            >
              Edit
            </span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Password</div>
          <div className={styles.value}>
            <span
              className={styles.link}
              onClick={() => navigate("/user/change-password")}
            >
              Change password
            </span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Google login</div>
          <div className={styles.value}>
            <span className={styles.badge}>Yes</span>
            <span className={styles.link}>Disconnect</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;