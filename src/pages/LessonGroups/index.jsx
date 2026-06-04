import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LessonGroups from '../../components/LessonGroups'
import styles from './lessongroups.module.scss'
import { API_URL } from '../../utils/constants'


function LessonGroupsPage() {

    const { topicSlug } = useParams()

    const [topic, setTopic] = useState(null)
    const [groups, setGroups] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            try {

                const topicRes = await fetch(`${API_URL}/topics/${topicSlug}`)
                const topicData = await topicRes.json()

                const groupRes = await fetch(`${API_URL}/topics/${topicSlug}/lesson-groups`)
                const groupData = await groupRes.json()

                setTopic(topicData)
                setGroups(groupData)

                document.title = topicData.title

            } catch (error) {
                console.error(error)
            }
        }

        fetchData()

    }, [topicSlug])

    if (!topic) return <p>Loading...</p>

    return (
        <div>

            <div className={styles.breadcrumbs}>
                <Link to="/exercises" className={styles.breadcrumbLink}>All topics</Link>
                <span className={styles.separator}>/</span>
                <span className={styles.current}>{topic.title}</span>
            </div>

            <p className={styles.bigTitle}>{topic.title}</p>

            <div>
                {groups.map(group => (
                    <LessonGroups 
                        key={group.id} 
                        group={group}
                        topic={topic}  
                    />
                ))}
            </div>

        </div>
    )
}

export default LessonGroupsPage