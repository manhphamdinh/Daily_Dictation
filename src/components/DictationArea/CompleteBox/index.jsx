import styles from './Complete.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import confetti from "canvas-confetti";

function CompleteBox({ onReview }) {

    confetti({
        particleCount: 20,
        angle: 60,
        spread: 100,
        scalar: 2,
        origin: { x: 0 },
        startVelocity: 70,
        colors: [
            "#ff0000",
            "#ffcc00",
            "#00ff00",
            "#0099ff",
            "#cc00ff"
        ]
    });

    confetti({
        particleCount: 20,
        angle: 120,
        spread: 100,
        scalar: 2,
        origin: { x: 1 },
        startVelocity: 70,
        colors: [
            "#ff0000",
            "#ffcc00",
            "#00ff00",
            "#0099ff",
            "#cc00ff"
        ]
    });

    return (
        <div className={styles.completeBox}>
            <p className={styles.title}>You have completed this exercise, good job!</p>
            <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} />
            <div className={styles.buttons}>
                <button className={styles.next}>Next exercise</button>
                <button className={styles.review} onClick={onReview}>
                    Review this exercise
                </button>
            </div>
        </div>
    );
}

export default CompleteBox;