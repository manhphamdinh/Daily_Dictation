import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./TopicCard.module.scss"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Link } from 'react-router-dom'


function TopicCard({ props }) {
    const [showDescription, setShowDescription] = useState(false)

    const toggleDescription = () => {
        setShowDescription(!showDescription)
    }

    return (
        <div className={styles.card}>
            <div className={styles.appear}>
                <Link to={`/exercises/${props.slug}`} className={`${styles.imgContainer} ${styles.link}`}>
                    <img src={props.image} alt={props.title} />
                </Link>

                <div className={styles.information}>
                    <Link to={`/exercises/${props.slug}`} className={`${styles.row} ${styles.link}`}>
                        <span>{props.title}</span>
                        {props.isVideo && <div className={styles.video}>
                            <p>Video</p>
                        </div>}
                    </Link>
                    <p>
                        Levels: {props.levels[0]} - {props.levels[props.levels.length - 1]}
                    </p>
                    <div className={styles.row}>
                        <p>{props.lessonsCount} lessons</p>
                        <p onClick={toggleDescription} className={styles.ellipsis}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </p>
                    </div>
                </div>
            </div>
            {showDescription && (
                <div className={styles.hidden}>
                    <p>{props.description}</p>
                </div>
            )}
        </div>
    )
}

export default TopicCard