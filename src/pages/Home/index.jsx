
import styles from "./Home.module.scss"
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import step1 from '../../assets/images/step1_homepage.png'
import step2 from '../../assets/images/step2_homepage.png'
import step3 from '../../assets/images/step3_homepage.svg'
import step4 from '../../assets/images/step4_homepage.png'


function Home() {
    const navigate = useNavigate()
    useEffect(() => {
            document.title = "English Listening Exercises - Practice for Free"
        }, [])
    return (
        <>
            <div className={styles.container1}>
                <div className={styles.intro}>
                    <p className={styles.bigTitle}>Practice English with dictation exercises</p>
                    <p>Dictation is a method to learn languages by listening and writing down what you hear. It is a highly effective method!</p>
                    <p style={{marginTop: "30px", marginBottom: "30px"}}>This website contains thousands of audio recordings & videos to help English learners practice easily and improve quickly.</p>
                    <button onClick={() => navigate('/exercises')}>Start Now</button>
                </div>
            </div >
            <hr />


            <div className={styles.container2}>
                <div>
                    <p className={styles.bigTitle}>How Practicing Dictation Improves Your English Skills</p>
                    <p>When practicing exercises at dailydictation.com, you will go through 4 main steps, all of them are equally important!</p>
                </div>

                <div className={styles.row}>
                    <div className={styles.stepholder}>
                        <img src={step1} alt="Listening step" />
                        <p className={styles.title}>1. Listen to the audio</p>
                        <p>Through the exercises, you will have to listen a lot; that's the key to improving your listening skills in any learning method.</p>
                    </div>
                    <div className={styles.stepholder}>
                        <img src={step2} alt="Type what you hear" />
                        <p className={styles.title}>2. Type what you hear</p>
                        <p>Typing what you hear forces you to focus on every detail which helps you become better at pronunciation, spelling and writing.</p>
                    </div>
                </div>
                
                <div className={styles.row}>
                    <div className={styles.stepholder}>
                        <img src={step3} alt="Check and correct" />
                        <p className={styles.title}>3. Check & correct</p>
                        <p>Error correction is important for your listening accuracy and reading comprehension, it's best to learn from mistakes.</p>
                    </div>
                    <div className={styles.stepholder}>
                        <img src={step4} alt="Reading out loud" />
                        <p className={styles.title}>4. Read it out loud</p>
                        <p>After completing a sentence, try to read it out loud. It will greatly improve your pronunciation & speaking skills!</p>
                    </div>
                </div>
            </div >

            <hr />

            <div className={styles.container3}>
                <div>
                    <p className={styles.bigTitle}>Frequently Asked Questions</p>
                </div>

                <div className={styles.row}>
                    <div >
                        <p className={styles.title}>Is this program free?</p>
                        <p>Yes, it's 100% FREE!</p>
                    </div>
                    <div >
                        <p className={styles.title}>Is this website for beginners?</p>
                        <p>Yes, it's designed for learners of all levels, from beginners to advanced speakers!</p>
                    </div>
                </div>
                
                <div className={styles.row}>
                    <div >
                        <p className={styles.title}>How long will it take to become fluent with this website?</p>
                        <p>It depends on how much time you spend practicing. Consistent daily practice for 15-30 minutes can lead to noticeable improvement in a few months.</p>
                    </div>
                    <div >
                        <p className={styles.title}>Will my speaking skills improve using this method?</p>
                        <p>Speaking and listening skills are related together, once you have better listening skills, it's much easier and faster to improve your speaking skills.
Also, you can try to read out loud what you hear, your skills will improve really quickly!</p>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Home