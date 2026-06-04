import styles from './DictationArea.module.scss';
import { useState, useRef, useEffect } from 'react';
import TypeBox from './TypeBox/index.jsx';
import TypeBoxVideo from './TypeBoxVideo/index.jsx';
import { API_URL } from '../../utils/constants'
import Transcript from './Transcript/index.jsx';
import TranscriptVideo from './TranscriptVideo/index.jsx';


function DictationArea({ onJump, currentSentence, onNext, currentIndex, lessonSentences, onPrevious, onNextArrow, onCorrect, isCompleted, onReview, isVideo, src, audioRef, onPlayStateChange }) {


    const [dictation, setDictation] = useState(true);
    const [transcript, setTranscript] = useState(false);

    const handleClick = () => {
        if (!dictation) {
            setDictation(true);
            setTranscript(false);
        } else {
            setDictation(false);
            setTranscript(true);
        }
    };


    // Hàm chuẩn hóa text (giữ nguyên dấu câu để so sánh chính xác)
    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <p className={dictation ? styles.active : styles.inactive} onClick={() => handleClick()}>
                    Dictation
                </p>
                <p className={transcript ? styles.active : styles.inactive} onClick={() => handleClick()}>
                    Full transcript
                </p>
            </div>

            {dictation && (
                <div className={styles.mainContainer}>
                    {isVideo ? (
                        <TypeBoxVideo
                            currentSentence={currentSentence}
                            onNext={onNext}
                            currentIndex={currentIndex}
                            lessonSentences={lessonSentences}
                            onPrevious={onPrevious}
                            onNextArrow={onNextArrow}
                            onCorrect={onCorrect}
                            isCompleted={isCompleted}
                            dictation={dictation}
                            onReview={onReview}
                            onJump={onJump}
                            audioRef={audioRef}
                            onPlayStateChange={onPlayStateChange}
                            src={src} />
                    ) : (
                        <TypeBox
                            currentSentence={currentSentence}
                            onNext={onNext}
                            currentIndex={currentIndex}
                            lessonSentences={lessonSentences}
                            onPrevious={onPrevious}
                            onNextArrow={onNextArrow}
                            onCorrect={onCorrect}
                            isCompleted={isCompleted}
                            dictation={dictation}
                            onReview={onReview}
                            onJump={onJump}
                            audioRef={audioRef}
                            onPlayStateChange={onPlayStateChange}
                            src={src} />
                    )}


                </div>
            )
            }

            {transcript && (
                <div className={styles.mainContainer}>
                    {transcript && isVideo ? (
                        <TranscriptVideo
                            sentences={lessonSentences}
                            lessonAudioUrl={src}
                        />
                    ) : (
                        <Transcript
                            sentences={lessonSentences}
                            lessonAudioUrl={src}
                        />
                    )}
                </div>)}

        </div>
    );
}

export default DictationArea;