import { useRef, useState, useEffect } from 'react';
import styles from './Transcript.module.scss';

function Transcript({ sentences = [], lessonAudioUrl }) {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeSentenceId, setActiveSentenceId] = useState(null);
    const sentenceRefs = useRef({});

    // Theo dõi thời gian audio → tìm câu đang active
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const t = audio.currentTime;
            setCurrentTime(t);

            const active = sentences.find(
                (s) => t >= s.startTime && t < s.endTime
            );
            if (active && active._id !== activeSentenceId) {
                setActiveSentenceId(active._id);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }, [sentences, activeSentenceId]);

    // Auto-scroll đến câu active
    useEffect(() => {
        if (!activeSentenceId) return;
        const el = sentenceRefs.current[activeSentenceId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeSentenceId]);

    // Click vào câu → seek audio đến startTime
    const handleSentenceClick = (sentence) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = sentence.startTime;
        audio.play();
        setActiveSentenceId(sentence._id);
    };

    return (
        <div className={styles.wrapper}>
            {/* Cột trái — Audio player */}
            <div className={styles.playerCol}>
                <div className={styles.playerSticky}>
                    <p className={styles.playerLabel}>Full audio</p>
                    <audio
                        ref={audioRef}
                        src={lessonAudioUrl}
                        controls
                        className={styles.audio}
                    />
                    <p className={styles.hint}>Click to jump to the target sentence.</p>
                </div>
            </div>

            {/* Cột phải — Danh sách câu */}
            <div className={styles.sentenceCol}>
                {sentences.map((sentence) => {
                    const isActive = sentence._id === activeSentenceId;
                    return (
                        <div
                            key={sentence._id}
                            ref={(el) => (sentenceRefs.current[sentence._id] = el)}
                            className={`${styles.sentenceRow} ${isActive ? styles.active : ''}`}
                            onClick={() => handleSentenceClick(sentence)}
                        >
                            <span className={styles.order}>{sentence.order}</span>
                            <span className={styles.text}>{sentence.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Transcript;
