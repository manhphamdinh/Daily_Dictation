import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";
import { useState, useEffect, useContext, useRef } from "react";
import styles from "./Dictation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateBack, faEllipsis, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { API_URL } from '../../utils/constants'


import DictationArea from "../../components/DictationArea";
import { KeyProvider } from "../../store/KeyProvider";

function Dictation() {
    const { topicSlug, lessonSlug } = useParams();
    const navigate = useNavigate();
    const { isLogin, token } = useContext(AuthContext);
    const [topic, setTopic] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [like, setLike] = useState(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [lessonSentences, setLessonSentences] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const topicRes = await fetch(`${API_URL}/topics/${topicSlug}`)
                const topicData = await topicRes.json()

                const lessonRes = await fetch(`${API_URL}/topics/lessons/${lessonSlug}`)
                const lessonData = await lessonRes.json()

                const sentenceRes = await fetch(`${API_URL}/topics/${lessonSlug}/sentences`)
                const sentenceData = await sentenceRes.json()

                setTopic(topicData)
                setLesson(lessonData)
                setLessonSentences(sentenceData)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
    }, [topicSlug, lessonSlug]);


    const storageKey = lesson ? `lesson_progress_${lesson._id}` : null;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedSentences, setCompletedSentences] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Load progress khi lesson thay đổi
    useEffect(() => {
        if (!storageKey) return;

        const loadProgress = async () => {
            if (!isLogin) {
                const savedIndex = sessionStorage.getItem(storageKey);
                const savedCompleted = sessionStorage.getItem(`${storageKey}_completed`);

                setCurrentIndex(savedIndex ? parseInt(savedIndex, 10) : 0);
                setCompletedSentences(savedCompleted ? JSON.parse(savedCompleted) : []);

            } else {
                try {

                    const res = await fetch(`${API_URL}/progress/${lessonSlug}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const data = await res.json();

                    if (data) {
                        setLike(data.isLiked);
                        setCompletedSentences(data.completedSentences || []);
                        setCurrentIndex(
                            data.currentSentence != null ? data.currentSentence + 1 : 1
                        );
                        setStatus(data.status);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };

        loadProgress();
    }, [storageKey, isLogin]);

    // Save progress
    useEffect(() => {
        if (!storageKey || isLogin) return;

        sessionStorage.setItem(storageKey, currentIndex.toString());
        sessionStorage.setItem(
            `${storageKey}_completed`,
            JSON.stringify(completedSentences)
        );
    }, [currentIndex, completedSentences, storageKey, isLogin]);

    const clearProgress = () => {
        if (!storageKey) return;
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(`${storageKey}_completed`);
    };

    const handleSentenceCorrect = async () => {
        setCompletedSentences(prev =>
            prev.includes(currentIndex) ? prev : [...prev, currentIndex]
        );

        // 👇 nếu chưa login → dùng sessionStorage
        if (!isLogin) return;

        // 👇 nếu đã login → gọi API
        try {
            await fetch(`${API_URL}/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    lessonId: lesson._id,
                    sentenceOrder: currentIndex,
                    totalSentences: lessonSentences.length
                })
            });
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    const handleNextSentence = () => {
        if (currentIndex < lessonSentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            clearProgress();
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePreviousSentence = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNextSentenceArrow = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const handleBackToAllTopics = () => {
        clearProgress();
        navigate(`/exercises`);
    };

    const handleReviewExercise = () => {
        clearProgress();
        setCurrentIndex(0);
        setCompletedSentences([]);
    };

    const handleJump = (value) => {
        if (value >= 0 && value < lessonSentences.length) {
            setCurrentIndex(value);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleReplay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSwitchLanguage = (currentLang) => {
        // Cycle through available languages
        const languages = ["Vietnamese", "Japnese", "Chinese", "French", "German", "Spanish", "Russian"];
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];
        
        // Update settings
        // Note: This would need to be implemented to actually change the translation language
        console.log('Switching to language:', nextLang);
        // You might need to dispatch an event or update state to change the displayed translation
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

                // ✅ reset UI ngay lập tức
                setCurrentIndex(0);
                setCompletedSentences([]);

                // nếu dùng sessionStorage
                clearProgress();
                setOpen(false);
            }
        } catch (error) {
            console.error("Error fetching topics:", error)
        }
    }

    const handleLike = async () => {
        try {
            const res = await fetch(`${API_URL}/progress/${lesson._id}/like`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            )
            const data = await res.json();

            if (data.success) {
                if (data.isLiked == true) {
                    console.log("Add to favourite list successfully!!!");
                } else {console.log("Removed from favourite list!!!");}
                setLike(data.isLiked);
                setOpen(false);
            }
        } catch (error) {
            console.error("Error fetching topics:", error)
        }
    }

    if (!topic) return <p>Loading...</p>

    if (!lesson) return <p>Loading...</p>

    if (!lessonSentences) return <p>Loading...</p>

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <span
                    onClick={handleBackToAllTopics}
                    className={styles.breadcrumbLink}
                    style={{ cursor: "pointer" }}
                >
                    All topics
                </span>

                <span className={styles.separator}>/</span>

                <Link
                    to={`/exercises/${topic?.slug}`}
                    className={styles.breadcrumbLink}
                >
                    {topic?.title}
                </Link>

                <span className={styles.separator}>/</span>

                <span className={styles.current}>
                    {lesson?.title}
                </span>
            </div>

            <div className={styles.dictationPage}>
                <div>
                    {(status == "completed") || (status == "reviewing") ? <FontAwesomeIcon icon={faStarSolid} className={`${styles.starIcon} ${styles.complete}`} />
                        : <FontAwesomeIcon icon={faStarRegular} className={styles.starIcon} />}

                    <p className={styles.bigTitle}>
                        {lesson?.title}
                    </p>

                    <p className={styles.level}>
                        Vocab level: {lesson?.level}
                    </p>

                    <div ref={dropdownRef}>
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            className={styles.ellipsisIcon}
                            onClick={() => setOpen(!open)}
                        />
                        {open && (
                            <div className={styles.menu} >
                                <ul>
                                    <li onClick={(e) => {
                                            e.stopPropagation();
                                            handleReset()
                                        }}>
                                        <FontAwesomeIcon icon={faArrowRotateBack} className={styles.resetIcon}  />
                                        <p>Reset (keep the star)</p>
                                    </li>
                                    <li onClick={(e) => {
                                            e.stopPropagation();
                                            handleLike();
                                        }}>
                                        <FontAwesomeIcon icon={faHeart} className={styles.resetIcon} />
                                        {like ? <p>Remove from favourite list</p> : <p>Add to favourite list</p>}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <p className={styles.subtitle}>{lesson?.subtitle}</p>
            </div>

            <KeyProvider
                onPlayPause={handlePlayPause}
                onReplay={handleReplay}
                onSwitchLanguage={handleSwitchLanguage}
            >
                <DictationArea
                    currentSentence={lessonSentences[currentIndex]}
                    onNext={handleNextSentence}
                    onPrevious={handlePreviousSentence}
                    onNextArrow={handleNextSentenceArrow}
                    onCorrect={handleSentenceCorrect}
                    currentIndex={currentIndex}
                    lessonSentences={lessonSentences}
                    isCompleted={completedSentences.includes(currentIndex)}
                    onReview={handleReviewExercise}
                    onJump={handleJump}
                    isVideo={topic?.isVideo}
                    src={lesson?.audioUrl}
                    audioRef={audioRef}
                    onPlayStateChange={setIsPlaying}
                />
            </KeyProvider>
        </div>
    );
}

export default Dictation;