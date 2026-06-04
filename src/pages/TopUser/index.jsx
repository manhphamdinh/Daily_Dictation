import styles from './TopUser.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants'


function getFirstLetterOfLastName(fullName) {
    if (!fullName) return "";

    const words = fullName.trim().split(" ");
    const lastName = words[words.length - 1];

    return lastName.charAt(0).toUpperCase();
}

function stringToColor(str = "") {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += value.toString(16).padStart(2, "0");
    }

    return color;
}

function getTextColor(bgColor) {
    // bỏ dấu #
    const color = bgColor.substring(1);

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // tính độ sáng (luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 150 ? "#000" : "#fff";
}


function TopUser() {
    const naviagte = useNavigate();
    const [topUsers7, setTopUsers7] = useState([]);
    const [topUsers30, setTopUsers30] = useState([]);

    const fetchTopUsers = async (sortBy, setState) => {
        try {
            const res = await fetch(`${API_URL}/auth/users?sortBy=${sortBy}`);
            const data = await res.json();
            if (data.success) {
                setState(data.data);
            }
        } catch (error) {
            console.error("Error fetching top users:", error);
        }
    };

    useEffect(() => {
        fetchTopUsers("last7Days", setTopUsers7);
        fetchTopUsers("last30Days", setTopUsers30);
    }, []);

    const getUnit = () => {
        return 'hours';
    };

    const renderUsers = (users, key) => (
        <div className={styles.userList}>
            <div style={{ fontWeight: "bold" }} className={styles.userItem}>
                <span className={styles.rank}>#</span>
                <span className={styles.usernameHeader}>Username</span>
                <span>Active time
                </span>
            </div>
            {users.map((user, index) => (
                <div key={user._id} className={styles.userItem}>
                    <span className={styles.rank}>{index + 1}</span>
                    <div className={styles.avatar} style={{
                        backgroundColor: stringToColor(user?._id),
                        color: getTextColor(stringToColor(user?._id)),
                    }}>
                        {user?.avartar == null && <p>{getFirstLetterOfLastName(user?.username)}</p>}

                    </div>
                    <span className={styles.username} onClick={() => naviagte(`/profile/${user._id}`)}>{user.username}</span>
                    <span>
                        {Math.floor(user[key])}+ {getUnit()}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.outer}>
            <div className={styles.topUserWrapper}>
                <h1>Top 30 users in the last 7 days</h1>
                {renderUsers(topUsers7, "last7Days")}
            </div>

            <div className={styles.topUserWrapper}>
                <h1>Top 30 users in the last 30 days</h1>
                {renderUsers(topUsers30, "last30Days")}
            </div>
        </div>
    );
}

export default TopUser;