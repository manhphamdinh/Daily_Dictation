import styles from './TypeBoxVideo.module.scss';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCircleCheck, faGear, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import VideoPlayer from '../VideoPlayer/index.jsx';
import CompleteBox from '../CompleteBox/index.jsx';
import Translation from '../Translation/index.jsx';
import Dictionary from '../Dictionary/index.jsx';
import SettingBar from '../SettingBar/index.jsx';

function TypeBoxVideo({ onJump, currentSentence, onNext, currentIndex, lessonSentences, onPrevious, onNextArrow, onCorrect, isCompleted, dictation, onReview, src }) {

    const [userInput, setUserInput] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [feedback, setFeedback] = useState('');

    const videoPlayerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [targetEndTime, setTargetEndTime] = useState(null);

    const handlePlayerReady = () => {
        setPlayerReady(true);
    };

    useEffect(() => {
        if (isCompleted) {
            // Câu đã làm đúng → tự động điền đáp án
            const correctText = currentSentence?.text || "";
            setUserInput(correctText);
            setIsChecked(true);
            setIsCorrect(true);
            setFeedback('Correct');
        } else {
            // Reset về trạng thái mới
            setUserInput('');
            setIsChecked(false);
            setIsCorrect(false);
            setFeedback('');

            // Auto focus
            // if (textareaRef.current && dictation) {
            //     textareaRef.current.focus();
            // }
        }
    }, [currentSentence, isCompleted]);

    useEffect(() => {
        if (currentSentence?.endTime !== undefined && !Number.isNaN(Number(currentSentence.endTime))) {
            setTargetEndTime(Number(currentSentence.endTime));
        } else {
            setTargetEndTime(null);
        }
    }, [currentSentence]);

    // Seek to startTime when currentIndex changes or the player becomes ready
    useEffect(() => {
        if (!videoPlayerRef.current || !playerReady || currentSentence?.startTime === undefined) {
            return;
        }

        const seekAndPlay = () => {
            videoPlayerRef.current.pauseVideo();
            videoPlayerRef.current.seekTo(Number(currentSentence.startTime), true);
            videoPlayerRef.current.playVideo();
        };

        const seekTimeout = setTimeout(() => {
            seekAndPlay();
        }, 100); // Small delay to ensure pause takes effect

        const retryTimeout = setTimeout(() => {
            const playerState = videoPlayerRef.current.getPlayerState?.();
            if (playerState !== 1) {
                videoPlayerRef.current.playVideo();
            }
        }, 350);

        return () => {
            clearTimeout(seekTimeout);
            clearTimeout(retryTimeout);
        };
    }, [currentIndex, currentSentence, playerReady]);

    // Pause at sentence endTime whenever the current sentence changes
    useEffect(() => {
        if (!videoPlayerRef.current || targetEndTime === null || !playerReady) {
            return;
        }

        const intervalId = setInterval(() => {
            const currentTime = videoPlayerRef.current.getCurrentTime?.();

            if (typeof currentTime !== 'number' || Number.isNaN(currentTime)) {
                return;
            }

            if (currentTime >= targetEndTime - 0.05) {
                videoPlayerRef.current.pauseVideo();
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, [targetEndTime, currentSentence, playerReady]);

    const standardizeText = (text) => {
        if (!text) return '';

        return text
            .toLowerCase() // Chuyển về chữ thường
            .trim() // Xóa khoảng trắng đầu/cuối
            .replace(/[.,!?;:'"(){}[\]\-—–_]/g, '') // Xóa dấu câu
            .replace(/\s+/g, ' ') // Chuẩn hóa nhiều space thành 1 space
            .replace(/['`´]/g, '') // Xóa dấu nháy đơn các kiểu
    };

    // Hàm render input với underline
    const renderInputWithUnderlines = () => {
        if (!isChecked || isCorrect) {
            return null;
        }

        const correctText = currentSentence?.text;

        const standardizedCorrect = standardizeText(correctText);
        const correctWordsStandardized = standardizedCorrect.split(' ');

        // userInput đã là đáp án gốc sau khi check
        const userWordsOriginal = userInput.split(' ');
        const standardizedUser = standardizeText(userInput);
        const userWords = standardizedUser.split(' ');

        return (
            <div className={styles.highlightedInput}>
                {userWordsOriginal.map((word, wordIndex) => {
                    const userWordStandardized = userWords[wordIndex];
                    const correctWordStandardized = correctWordsStandardized[wordIndex];

                    // So sánh để tìm lỗi
                    if (userWordStandardized === correctWordStandardized) {
                        // Đúng - không highlight
                        return (
                            <span key={wordIndex} className={styles.correctWordInline}>
                                {word}{' '}
                            </span>
                        );
                    }

                    // Tính charErrors
                    const charErrors = [];
                    const maxCharLength = Math.max(userWordStandardized?.length || 0, correctWordStandardized?.length || 0);
                    for (let j = 0; j < maxCharLength; j++) {
                        if (userWordStandardized?.[j] !== correctWordStandardized?.[j]) {
                            charErrors.push(j);
                        }
                    }

                    // Nếu từ sai hoàn toàn - underline vàng
                    if (charErrors.length > 0) {
                        return (
                            <span key={wordIndex} className={styles.wrongWordYellow}>
                                {Array.from(word).map((char, charIndex) => {
                                    const hasCharError = charErrors.includes(charIndex);
                                    return (
                                        <span
                                            key={charIndex}
                                            className={hasCharError ? styles.wrongCharRed : ''}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}
                                {' '}
                            </span>
                        );
                    }

                    // Nếu chỉ có vài ký tự sai - underline đỏ từng ký tự
                    return (
                        <span key={wordIndex}>
                            {Array.from(word).map((char, charIndex) => {
                                const hasCharError = charErrors.includes(charIndex);
                                return (
                                    <span
                                        key={charIndex}
                                        className={hasCharError ? styles.wrongCharRed : ''}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                            {' '}
                        </span>
                    );
                })}
            </div>
        );
    };

    // Hàm render đáp án với từ in đậm và ký tự còn lại là *
    const renderMaskedAnswer = () => {
        if (!isChecked || isCorrect) return null;

        const correctText = currentSentence?.text;
        const correctWordsOriginal = correctText.split(' '); // Giữ nguyên gốc

        const standardizedCorrect = standardizeText(correctText);
        const correctWordsStandardized = standardizedCorrect.split(' ');

        const standardizedUser = standardizeText(userInput);
        const userWords = standardizedUser.split(' ');

        // Tìm vị trí từ sai đầu tiên
        let firstErrorIndex = -1;
        for (let i = 0; i < userWords.length; i++) {
            if (userWords[i] !== correctWordsStandardized[i]) {
                firstErrorIndex = i;
                break;
            }

            if (i < correctWordsStandardized.length && i === userWords.length - 1) {
                firstErrorIndex = i + 1;
                break;
            }
        }

        // Nếu không có lỗi nhưng user viết thiếu
        if (firstErrorIndex === -1 && userWords.length < correctWordsStandardized.length) {
            firstErrorIndex = userWords.length;
        }

        return (
            <div className={styles.correctAnswerMasked}>
                {correctWordsOriginal.map((word, wordIndex) => {
                    // Trước từ sai → hiển thị nguyên gốc
                    if (firstErrorIndex === -1 || wordIndex < firstErrorIndex) {
                        return (
                            <span key={wordIndex} className={styles.normalWord}>
                                {word}{' '}
                            </span>
                        );
                    }

                    // Từ sai đầu tiên → in đậm (nguyên gốc)
                    if (wordIndex === firstErrorIndex) {
                        return (
                            <span key={wordIndex}>
                                <strong className={styles.boldWord}>{word}</strong>
                                {' '}
                            </span>
                        );
                    }

                    // Sau từ sai → ẩn (tính length theo từ chuẩn hóa)
                    const standardizedWord = correctWordsStandardized[wordIndex] || '';
                    return (
                        <span key={wordIndex} className={styles.maskedWord}>
                            {'*'.repeat(standardizedWord.length)}{' '}
                        </span>
                    );
                })}
            </div>
        );
    };

    // Hàm xử lý khi nhấn Check
    const handleCheck = () => {
        if (!userInput.trim()) {
            setFeedback('Please type something first!');
            setIsChecked(true);
            setIsCorrect(false);
            return;
        }

        const correctText = currentSentence?.text;
        const standardizedUser = standardizeText(userInput);
        const standardizedCorrect = standardizeText(correctText);

        const isMatch = standardizedUser === standardizedCorrect;

        setIsChecked(true);
        setIsCorrect(isMatch);

        if (isMatch) {
            setFeedback('You are correct!');
            // Khi đúng → set thành đáp án gốc HOÀN CHỈNH
            setUserInput(correctText);
            // ✅ GỌI CALLBACK KHI LÀM ĐÚNG
            if (onCorrect) {
                onCorrect();
            }
        } else {
            setFeedback('Incorrect');
            // Khi sai → chỉ convert từ ĐÚNG, giữ nguyên từ SAI
            const userWordsOriginal = userInput.split(' ');
            const correctWordsOriginal = correctText.split(' ');

            const standardizedUserWords = standardizedUser.split(' ');
            const standardizedCorrectWords = standardizedCorrect.split(' ');

            // Convert từng từ
            const convertedWords = userWordsOriginal.map((userWord, index) => {
                const userWordStandardized = standardizedUserWords[index];
                const correctWordStandardized = standardizedCorrectWords[index];

                // Nếu từ này ĐÚNG → convert sang gốc
                if (userWordStandardized === correctWordStandardized) {
                    return correctWordsOriginal[index];
                }

                // Nếu từ này SAI hoặc CHƯA HOÀN CHỈNH → giữ nguyên
                return userWord;
            });

            setUserInput(convertedWords.join(' '));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // không xuống dòng
            handleCheck();
        }
    };

    // Hàm xử lý Skip - điền full đáp án
    const handleSkip = () => {
        const correctText = currentSentence?.text || "";

        // Điền full đáp án vào textarea
        setUserInput(correctText);

        // Set trạng thái như đã check đúng
        setIsChecked(true);
        setFeedback('Correct');
        if (onCorrect) {
            onCorrect();
        }
    };

    const textareaRef = useRef(null); // Ref cho textarea

    // 3. Tự focus SAU KHI CHUYỂN CÂU BẰNG NEXT (từ câu trước)
    useEffect(() => {
        if (dictation && !isCompleted && textareaRef.current) {
            // Chỉ focus khi chuyển câu bằng Next (không focus khi jump hoặc lần đầu)
            // Vì jump đã reset currentSentence → ta dùng một flag hoặc kiểm tra userInput rỗng
            if (userInput === '' && !isChecked) { // điều kiện an toàn: câu mới, chưa check
                setTimeout(() => {
                    // textareaRef.current.focus();
                    // console.log('Focus sau khi next từ câu trước');
                }, 100);
            }
        }
    }, [currentSentence, dictation, isCompleted, userInput, isChecked]);

    // Hàm tìm vị trí ký tự sai đầu tiên
    const findFirstErrorPosition = () => {
        const correctText = currentSentence?.text;

        // So sánh dựa trên text đã chuẩn hóa
        const standardizedUser = standardizeText(userInput);
        const standardizedCorrect = standardizeText(correctText);

        const userWords = standardizedUser.split(' ');
        const correctWords = standardizedCorrect.split(' ');

        // Nhưng tính position dựa trên userInput GỐC (sau khi đã convert)
        const userWordsOriginal = userInput.split(' ');

        let position = 0;

        for (let i = 0; i < userWords.length; i++) {
            const userWord = userWords[i];
            const correctWord = correctWords[i];

            if (userWord !== correctWord) {
                // Tìm ký tự sai đầu tiên trong từ này
                for (let j = 0; j < Math.max(userWord.length, correctWord.length); j++) {
                    if (userWord[j] !== correctWord[j]) {
                        // Position = tổng length các từ trước + vị trí ký tự sai + 1
                        return position + j + 1; // +1 để cursor sau ký tự sai
                    }
                }
            }

            // Cộng thêm length của từ hiện tại + 1 (space)
            position += userWordsOriginal[i].length + 1;
        }

        // Nếu không có lỗi nhưng chưa hoàn thành → focus vào cuối
        if (userWords.length < correctWords.length) {
            return userInput.length; // Cuối cùng
        }

        return -1; // Không có lỗi
    };

    // Auto focus khi check
    useEffect(() => {
        if (isChecked && !isCorrect && textareaRef.current) {
            const errorPos = findFirstErrorPosition();

            if (errorPos !== -1) {
                // Focus vào textarea
                textareaRef.current.focus();

                // Set cursor position ngay sau ký tự sai
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.setSelectionRange(errorPos, errorPos);
                    }
                }, 0);
            }
        }
    }, [isChecked, isCorrect, userInput]);

    // 3. Tự focus SAU KHI CHUYỂN CÂU BẰNG NEXT (từ câu trước)
    useEffect(() => {
        if (dictation && !isCompleted && textareaRef.current) {
            // Chỉ focus khi chuyển câu bằng Next (không focus khi jump hoặc lần đầu)
            // Vì jump đã reset currentSentence → ta dùng một flag hoặc kiểm tra userInput rỗng
            if (userInput === '' && !isChecked) { // điều kiện an toàn: câu mới, chưa check
                setTimeout(() => {
                    textareaRef.current.focus();
                    // console.log('Focus sau khi next từ câu trước');
                }, 100);
            }
        }
    }, [currentSentence, dictation, isCompleted, userInput, isChecked]);

    return (
        <div>
            {dictation && currentIndex === lessonSentences.length ? <CompleteBox onReview={onReview} /> : (<div>
                <div className={styles.row}>
                    <VideoPlayer ref={videoPlayerRef} src={src} onPlayerReady={handlePlayerReady} />

                    <div className={styles.column}>
                        <SettingBar
                            currentIndex={currentIndex}
                            lessonSentences={lessonSentences}
                            onPrevious={onPrevious}
                            onNextArrow={onNextArrow}
                            onJump={onJump}
                            onNext={onNext}
                        />

                        <div className={styles.mainContent}>
                            <div className={styles.inputColumn}>
                                <div className={styles.inputWrapper}>
                                    {/* Background layer - hiển thị highlight */}
                                    {isChecked && !isCorrect && (
                                        <div className={styles.inputBoxHighlighted}>
                                            {renderInputWithUnderlines()}
                                        </div>
                                    )}
                                    {/* Foreground layer - textarea */}
                                    <textarea
                                        ref={textareaRef} // Thêm ref
                                        className={`${styles.inputBox} ${isChecked && !isCorrect ? styles.inputBoxTransparent : ''}`}
                                        placeholder="Type what you hear..."
                                        value={userInput}
                                        onChange={(e) => {
                                            setUserInput(e.target.value);
                                            // Khi user gõ → ẩn feedback và highlight
                                            setIsChecked(false);
                                            setIsCorrect(false);
                                            setFeedback('');
                                        }}
                                        onKeyDown={handleKeyDown}
                                        spellCheck={false}
                                    />
                                </div>
                                {isChecked ?
                                    <div className={styles.feedbackAndButtons}>
                                        <div className={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
                                            {isCorrect ?
                                                <div className={styles.icon}>
                                                    <FontAwesomeIcon icon={faCircleCheck} className={`${styles.check}`} />
                                                </div> :
                                                <div className={styles.icon}>
                                                    <FontAwesomeIcon icon={faTriangleExclamation} className={`${styles.icon} ${styles.incorrect}`} />
                                                </div>}{feedback}
                                        </div>
                                        {isCorrect ?
                                            <button
                                                className={styles.nextButton}
                                                onClick={onNext}
                                            >
                                                Next
                                            </button> :
                                            <button
                                                className={styles.skipButton}
                                                onClick={handleSkip}
                                            >
                                                Skip
                                            </button>}
                                    </div> : <div className={styles.buttons}>
                                        <button
                                            className={styles.checkButton}
                                            onClick={handleCheck}
                                        >
                                            Check
                                        </button>
                                        <button
                                            className={styles.skipButton}
                                            onClick={handleSkip}
                                        >
                                            Skip
                                        </button>
                                    </div>}
                                {/* Hiển thị đáp án với mask */}
                                {isChecked && !isCorrect && (
                                    <div className={styles.answerSection}>
                                        {renderMaskedAnswer()}
                                    </div>
                                )}

                            </div>
                            {isChecked && isCorrect && (
                                <div className={styles.answerSection}>
                                    <Translation text={currentSentence?.text} target="vi" />
                                    <Dictionary sentence={currentSentence?.text} />
                                </div>
                            )}

                        </div>
                    </div>


                </div>

            </div>)}


        </div>
    )
};

export default TypeBoxVideo;