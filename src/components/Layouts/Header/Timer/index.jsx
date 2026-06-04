import { useEffect, useRef, useState } from 'react'
import styles from './Timer.module.scss'
import { API_URL } from '../../../../utils/constants'


export default function Timer({ token, user }) {
  const [seconds, setSeconds] = useState(0)

  const startRef = useRef(Date.now())
  const baseSecondsRef = useRef(0)
  const tickRef = useRef(null)

    // Fetch tổng hôm nay — chỉ chạy khi login
  useEffect(() => {
    if (!token || !user) return

    const today = new Date().toLocaleDateString("en-CA") // tránh lệch timezone

    fetch(`${API_URL}/learning-sessions/activity?days=1&userId=${user._id}`)
      .then((r) => r.json())
      .then((data) => {
        const todayData = data.find(
          (d) => d.date?.slice(0, 10) === today
        )

        baseSecondsRef.current = todayData
          ? todayData.activeSeconds
          : 0

        setSeconds(baseSecondsRef.current)
      })
  }, [token, user])

  useEffect(() => {
    if (!token || !user) return

    const startTick = () => {
      if (tickRef.current) clearInterval(tickRef.current)

      startRef.current = Date.now()

      tickRef.current = setInterval(() => {
        const elapsed = Math.round(
          (Date.now() - startRef.current) / 1000
        )
        setSeconds(baseSecondsRef.current + elapsed)
      }, 1000)
    }

    const flush = async (elapsed) => {
      if (elapsed < 5) return

      await fetch(`${API_URL}/learning-sessions/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activeSeconds: elapsed }),
      })

      await fetch(`${API_URL}/auth/profile/streak`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      })

      baseSecondsRef.current += elapsed
    }

    startTick()

    const handleVisibility = () => {
      if (document.hidden) {
        const elapsed = Math.round(
          (Date.now() - startRef.current) / 1000
        )
        flush(elapsed)
        clearInterval(tickRef.current)
      } else {
        startTick()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(tickRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [token, user])

  return <span className={styles.timer}>{Math.floor(seconds/60)} minutes</span>
}