import styles from './lessgroups.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { useState, useEffect, useContext } from 'react'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';

import LessonCard from '../LessonCard';
import { AuthContext } from '../../store/AuthContext';
import { API_URL } from '../../utils/constants'


function LessonGroups({ group, topic }) {

  const [lessons, setLessons] = useState([])
  const [progresses, setProgresses] = useState({});
  const [status, setStatus] = useState({});
  const { token } = useContext(AuthContext)

  useEffect(() => {

    const fetchLessons = async () => {
      try {
        const res = await fetch(`${API_URL}/topics/${group.slug}/lessons`)
        const data = await res.json();
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error)
      }
    }

    fetchLessons()
  }, [group.slug])

  useEffect(() => {
    const fetchProgresses = async () => {
      if (!token || lessons.length === 0) return;

      const progressData = {};
      const statusData = {};
      for (const lesson of lessons) {
        try {
          const res = await fetch(`${API_URL}/progress/${lesson.slug}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            const percentage = (data.completedSentences.length / lesson.sentenceCount);
            progressData[lesson._id] = percentage;
            statusData[lesson._id] = data.status;
          } else {
            progressData[lesson._id] = 0;
            statusData[lesson._id] = "not-started"; // not started
          }
        } catch (error) {
          console.error("Error fetching progress for lesson:", lesson.slug, error);
          progressData[lesson._id] = 0;
          statusData[lesson._id] = "not-started";
        }
      }
      setProgresses(progressData);
      setStatus(statusData);
    };

    fetchProgresses();
  }, [lessons, token])

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  }

  return (
    <div className={styles.container}>
      <div key={group._id} className={styles.card}>
        {expanded ?
          <div className={`${styles.header} ${styles.active}`} onClick={toggleExpand}>
            <p className={styles.title}>{group.title} ({group.year})</p>
            <FontAwesomeIcon icon={faAngleUp} className={styles.icon} />

          </div> : <div className={`${styles.header}`} onClick={toggleExpand}>
            <p className={styles.title}>{group.title} ({group.year})</p>
            <FontAwesomeIcon icon={faAngleDown} className={styles.icon} />
          </div>}


        {expanded && (
          <div className={styles.actions}>
            {lessons.map(lesson => (
              <LessonCard key={lesson._id} lesson={lesson} topic={topic} 
                          progress={progresses[lesson._id] || 0} 
                          status={status[lesson._id] || 0}
                          onReset={(lessonId) => {
                            setProgresses(prev => ({
                              ...prev,
                              [lessonId]: 0
                            }));
                          }} />
            ))}
          </div>
        )}
      </div>
    </div>

  )
}
export default LessonGroups



