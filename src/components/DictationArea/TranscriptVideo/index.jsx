import { useEffect, useRef, useState } from 'react';
import styles from './TranscriptVideo.module.scss';
import VideoPlayer from '../VideoPlayer/index.jsx';

const parseYouTubeVideoId = (url = '') => {
    if (!url) return null;
    const trimmed = url.trim();
    const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
};

function TranscriptVideo({ sentences = [], lessonAudioUrl = '' }) {
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeSentenceId, setActiveSentenceId] = useState(null);
    const sentenceRefs = useRef({});
    const intervalRef = useRef(null);
    const videoId = parseYouTubeVideoId(lessonAudioUrl);

    useEffect(() => {
        if (!player) return;

        const updateCurrentTime = () => {
            if (player && player.getCurrentTime) {
                const time = player.getCurrentTime();
                setCurrentTime(time);
            }
        };

        intervalRef.current = window.setInterval(updateCurrentTime, 250);
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [player]);

    useEffect(() => {
        if (!sentences || !sentences.length) return;

        const active = sentences.find(
            (sentence) => currentTime >= sentence.startTime && currentTime < sentence.endTime
        );

        if (active) {
            setActiveSentenceId(active._id);
        } else {
            setActiveSentenceId(null);
        }
    }, [currentTime, sentences]);

    useEffect(() => {
        if (!activeSentenceId) return;
        const element = sentenceRefs.current[activeSentenceId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeSentenceId]);

    const handleSentenceClick = (sentence) => {
        if (!player || !player.seekTo) return;
        player.seekTo(sentence.startTime, true);
        if (player.playVideo) {
            player.playVideo();
        }
        setActiveSentenceId(sentence._id);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.videoCol}>
                <div className={styles.videoSticky}>
                    <p className={styles.playerLabel}>Full transcript</p>
                    <div className={styles.videoFrame}>
                        {videoId ? (
                            <VideoPlayer
                                src={lessonAudioUrl}
                                onPlayerReady={(playerInstance) => setPlayer(playerInstance)}
                            />
                        ) : (
                            <div className={styles.invalidUrl}>
                                Invalid YouTube URL. Please pass a valid video link.
                            </div>
                        )}
                    </div>
                    <p className={styles.hint}>Click a sentence to jump to its part of the video.</p>
                </div>
            </div>

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

export default TranscriptVideo;
