import styles from "./Exercises.module.scss"
import TopicCard from "../../components/TopicCard"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../store/AuthContext";
import storyImg from '../../assets/images/stories.jpg';
import conImg from '../../assets/images/conversation.jpg';
import fairyTalesImg from '../../assets/images/fairy-tales.jpeg';
import toeicImg from '../../assets/images/toeic.jpg';
import ieltsImg from '../../assets/images/ielts.jpg';
import youtubeImg from '../../assets/images/youtube.jpg';
import newsImg from '../../assets/images/news.jpeg';
import tedImg from '../../assets/images/ted.jpeg';
import toeflImg from '../../assets/images/toefl.jpg';
import oetImg from '../../assets/images/oet.jpeg';
import ipaImg from '../../assets/images/ipa.jpeg';
import numbersImg from '../../assets/images/numbers.jpg';
import namesImg from '../../assets/images/names.jpg';
import { API_URL } from '../../utils/constants'



function Exercises() {

    const [topics, setTopics] = useState([])

    useEffect(() => {
        document.title = "All topics"

        const fetchTopics = async () => {
            try {
                const res = await fetch(`${API_URL}/topics`)
                const data = await res.json()
                setTopics(data)
            } catch (error) {
                console.error("Error fetching topics:", error)
            }
        }

        fetchTopics()
    }, [])

    const imageMap = {
        storyImg,
        conImg,
        fairyTalesImg,
        toeicImg,
        ieltsImg,
        youtubeImg,
        newsImg,
        tedImg,
        toeflImg,
        oetImg,
        ipaImg,
        numbersImg,
        namesImg
    }

    return (
        <div>
            <p className={styles.bigTitle}>All topics</p>

            <div className={styles.topicsContainer}>
                {topics.map((topic) => (
                    <TopicCard
                        key={topic._id}
                        props={{
                            title: topic.title,
                            image: imageMap[topic.image],
                            levels: topic.levels,
                            lessonsCount: topic.lessonCount,
                            slug: topic.slug,
                            description: topic.description,
                            isVideo: topic.isVideo,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default Exercises