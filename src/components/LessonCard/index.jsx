import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";import styles from './LessonCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { API_URL } from '../../utils/constants'
import diamondImg from '../../assets/images/diamond.png'



function LessonCard({ lesson, topic, progress, onReset, status }) {

    const { token } = useContext(AuthContext);

    const handleReset = async () => {
        const confirmReset = window.confirm("Are you sure you want to reset this exercise?");
        if (!confirmReset) return;
        try {
            const res = await fetch(`${API_URL}/progress/${lesson._id}/reset`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            )
            const data = await res.json();

            if (data.success) {
                console.log("Reset successfully!!!");
            }

            onReset(lesson._id);
        } catch (error) {
            console.error("Error fetching topics:", error)
        }
    }

    return (
        <div className={styles.outer}>
            <Link to={`/exercises/${topic.slug}/${lesson.slug}`} className={styles.container}>

                <div className={styles.iconContainer}>
                    {(status == "completed") || (status == "reviewing") ? <FontAwesomeIcon icon={faStarSolid} className={`${styles.icon} ${styles.complete}`} />
                        : <FontAwesomeIcon icon={faStarRegular} className={styles.icon} />}
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>{lesson.title}</p>
                    <p className={styles.subtitle}>{lesson.subtitle}</p>
                    <div className={styles.row}>
                        <p className={styles.sentenceCount}>{lesson.sentenceCount} parts</p>
                        <FontAwesomeIcon icon={faCircle} className={styles.circle} />
                        <p className={styles.level}>Vocab level: {lesson.level}</p>
                    </div>

                </div>
                {lesson.isPremium && <div className={styles.diamondContainer}>
                    <img src={diamondImg} alt="" className={styles.diamond} />
                </div>}
            </Link>
            {progress > 0 &&
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                    <FontAwesomeIcon icon={faXmark} className={styles.icon} onClick={handleReset}></FontAwesomeIcon>
                </div>}
        </div>
    );
}

export default LessonCard;