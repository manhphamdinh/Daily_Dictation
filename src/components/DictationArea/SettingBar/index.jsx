import styles from './SettingBar.module.scss';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCircleCheck, faGear, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import SettingModal from '../SettingModal/index.jsx';

function SettingBar({ currentIndex, lessonSentences, onPrevious, onNextArrow, onJump }) {
    const [showJumpModal, setShowJumpModal] = useState(false);
    const [jumpValue, setJumpValue] = useState(currentIndex + 1);
    const modalRef = useRef(null);

    useEffect(() => {
        setJumpValue(currentIndex + 1);
    }, [currentIndex]);

    const handleJump = () => {
        const newIndex = parseInt(jumpValue, 10) - 1;
        if (!isNaN(newIndex) && newIndex >= 0 && newIndex < lessonSentences.length) {
            onJump(newIndex);
            console.log('Jumping to index:', newIndex);
            setShowJumpModal(false);
        } else {
            alert(`Please enter a number between 1 and ${lessonSentences.length}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowJumpModal(false);
            }
        };
        if (showJumpModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showJumpModal]);

return (
    <div className={styles.row}>
        <div className={styles.progress}>
            <FontAwesomeIcon
                icon={faArrowLeft}
                className={`${styles.arrow} ${currentIndex === 0 ? styles.disable : ''}`}
                onClick={() => {
                    if (currentIndex > 0 && onPrevious) {
                        onPrevious();
                    }
                }}
                style={{ cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            />
            <div onClick={() => setShowJumpModal(true)} className={styles.jump}>
                {showJumpModal ?
                    <div ref={modalRef} className={styles.jumpModal}>
                        <div className={styles.controlRow}>
                            <input
                                type="number"
                                autoFocus={true}
                                value={jumpValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || (Number(val) >= 1 && Number(val) <= lessonSentences.length)) {
                                        setJumpValue(val === '' ? '' : Number(val));
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                                className={styles.jumpInput}
                                min={1}
                                max={lessonSentences.length}
                            />
                        </div>
                    </div> : <>{currentIndex + 1}  </>}
                / {lessonSentences.length}
            </div>
            <FontAwesomeIcon
                icon={faArrowRight}
                className={`${styles.arrow} ${currentIndex === lessonSentences.length - 1 ? styles.disable : ''}`}
                onClick={() => {
                    if (currentIndex < lessonSentences.length - 1 && onNextArrow) {
                        onNextArrow();
                    }
                }}
                style={{ cursor: currentIndex === lessonSentences.length - 1 ? 'not-allowed' : 'pointer' }}
            />
        </div>
        <SettingModal />

    </div>
)
}

export default SettingBar;