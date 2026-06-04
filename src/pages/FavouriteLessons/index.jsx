import styles from "./FavouriteLessons.module.scss"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../store/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../../utils/constants'


function FavouriteLessons() {
    const { token } = useContext(AuthContext);
    const [lessons, setLessons] = useState([]);
    const [status, setStatus] = useState({});

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(`${API_URL}/progress`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

                const data = await res.json();

                const likedLessons = data.filter(p => p.isLiked);

                setLessons(likedLessons);
                setStatus(likedLessons.reduce((acc, item) => {
                    acc[item.lessonId._id] = item.status;
                    return acc;
                }, {}));

            } catch (err) {
                console.error(err);
            }
        };

        if (token) {
            fetchProgress();
        }
    }, [token]);

    const handleLike = async (lessonId) => {
        const confirmDelete = window.confirm("Do you want to remove this lesson from favourites?");

        if (!confirmDelete) return;
        try {
            const res = await fetch(`${API_URL}/progress/${lessonId}/like`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            )
            const data = await res.json();

            if (data.success) {
                // 👉 nếu bị unlike → remove khỏi list luôn
                if (!data.isLiked) {
                    setLessons(prev => prev.filter(item => item.lessonId._id !== lessonId));
                } else {
                    // 👉 nếu like lại → update state
                    setLessons(prev =>
                        prev.map(item =>
                            item.lessonId._id === lessonId
                                ? { ...item, isLiked: true }
                                : item
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Error fetching topics:", error)
        }
    }

    if (status) {
        console.log(status);}

    return (
        <div className={styles.container}>
            <h1>Favourite lessons</h1>

            {lessons.length === 0 ? (
                <p>You don't have any favorite lessons yet.</p>
            ) : (
                <div className={styles.lessonList}>
                    {lessons.map(item => (
                        <div key={item._id} className={styles.lessonCard}>
                            {status[item.lessonId._id] === 'completed' || status[item.lessonId._id] === 'reviewing' ? 
                                <FontAwesomeIcon icon={faStarSolid} className={`${styles.icon} ${styles.complete}`} /> : 
                                <FontAwesomeIcon icon={faStarRegular} className={styles.icon} />}
                            
                            <p className={styles.title}>{item.lessonId?.title || "Lesson"}</p>
                            <div className={styles.button} onClick={() => { handleLike(item.lessonId._id) }}>
                                <p>remove</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FavouriteLessons;