import { useEffect, useState } from 'react'
import styles from './ActivityChart.module.scss'
import { API_URL } from '../../utils/constants'


function groupByInterval(data, totalDays, intervalDays) {

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-CA")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lookup = {}

    data.forEach(({ date, activeSeconds }) => {
        const key = formatDate(date)
        lookup[key] = activeSeconds
    })

    const slots = []
    let cursor = new Date(today)
    cursor.setDate(cursor.getDate() - totalDays + 1)

    while (cursor <= today) {
        const slotStart = new Date(cursor)
        let slotSeconds = 0

        for (let i = 0; i < intervalDays; i++) {
            const d = new Date(cursor)
            d.setDate(d.getDate() + i)
            slotSeconds += lookup[d.toISOString().slice(0, 10)] || 0
        }
        slots.push({
            label: slotStart.toISOString().slice(0, 10),
            activeHours: Math.round((slotSeconds / 3600) * 10) / 10, // ✅ convert ở đây
        })
        cursor.setDate(cursor.getDate() + intervalDays)
    }

    return slots.reverse()
}

function getXTicks(maxVal) {
    if (maxVal === 0) return [0]
    const step = maxVal <= 1 ? 0.1 : maxVal <= 3 ? 0.5 : 1
    const ticks = []
    for (let v = 0; ; v += step) {
        const t = Math.round(v * 10) / 10
        ticks.push(t)
        if (t >= maxVal || ticks.length > 10) break
    }
    return ticks
}

// intervalDays có thể là: 1, 2, 4, 7
const INTERVALS = [1, 2, 4]

export default function ActivityChart({ userId }) {
    const [rawData, setRawData] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const days = 30
    const [intervalIdx, setIntervalIdx] = useState(2) // mặc định 4 ngày/nhóm

    const intervalDays = INTERVALS[intervalIdx]

    useEffect(() => {
        if (!userId) return
        setLoading(true)
        fetch(`${API_URL}/learning-sessions/activity?days=30&userId=${userId}`)
            .then((r) => r.json())
            .then(setRawData)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [userId, days])

    const data = groupByInterval(rawData, days, intervalDays)

    const maxHours = Math.max(...data.map((d) => d.activeHours), 0.1)
    const xTicks = getXTicks(maxHours)
    const xMax = xTicks[xTicks.length - 1]

    const ROW_H = 18
    const ROW_GAP = 0
    const LABEL_W = 120
    const PAD_RIGHT = 16
    const PAD_TOP = 8
    const XAXIS_H = 20
    const BAR_H = 7
    const barMaxW = 400

    const chartH = PAD_TOP + data.length * (ROW_H + ROW_GAP) + XAXIS_H

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.title}>
                    <span className={styles.dot} />
                    Active time (hours)
                </span>

                <div className={styles.controls}>
                    <button
                        className={styles.zoomBtn}
                        title="Zoom out"
                        disabled={intervalIdx === INTERVALS.length - 1}
                        onClick={() => setIntervalIdx((i) => Math.min(i + 1, INTERVALS.length - 1))}
                    >
                        −
                    </button>
                    <button
                        className={styles.zoomBtn}
                        title="Zoom in"
                        disabled={intervalIdx === 0}
                        onClick={() => setIntervalIdx((i) => Math.max(i - 1, 0))}
                    >
                        +
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading…</div>
            ) : (
                <div className={styles.chartScroll}>
                    <svg
                        width="100%"
                        viewBox={`0 0 ${LABEL_W + barMaxW + PAD_RIGHT} ${chartH}`}
                        className={styles.svg}
                    >
                        {/* Grid lines + trục X */}
                        {xTicks.map((tick) => {
                            const x = LABEL_W + (tick / xMax) * barMaxW
                            return (
                                <g key={tick}>
                                    <line
                                        x1={x} y1={PAD_TOP}
                                        x2={x} y2={PAD_TOP + data.length * (ROW_H + ROW_GAP) - ROW_GAP}
                                        stroke={tick === 0 ? '#ccc' : '#ebebeb'}
                                        strokeWidth="1"
                                        strokeDasharray={tick === 0 ? 'none' : '3 3'}
                                    />
                                    <text x={x} y={chartH - 4} textAnchor="middle" fontSize="10" fill="#aaa">
                                        {tick}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Rows */}
                        {data.map((slot, i) => {
                            const y = PAD_TOP + i * (ROW_H + ROW_GAP)
                            const barW = xMax > 0 ? (slot.activeHours / xMax) * barMaxW : 0
                            const isHovered = hoveredIndex === i

                            return (
                                <g
                                    key={slot.label}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{ cursor: 'default' }}
                                >
                                    <text
                                        x={LABEL_W - 6} y={y + ROW_H / 2}
                                        textAnchor="end" dominantBaseline="middle"
                                        fontSize="11" fill="#888"
                                    >
                                        {slot.label} - {slot.activeHours.toFixed(1)}
                                    </text>

                                    {barW > 0 && (
                                        <rect
                                            x={LABEL_W} y={y + (ROW_H - BAR_H) / 2}
                                            width={barW} height={BAR_H}
                                            fill={isHovered ? '#42a5f5' : '#90caf9'}
                                            rx="1"
                                            style={{ transition: 'fill 0.1s' }}
                                        />
                                    )}

                                    {isHovered && slot.activeHours > 0 && (
                                        <g>
                                            <rect
                                                x={LABEL_W + barW + 6}
                                                y={y + (ROW_H - 16) / 2}
                                                width={40} height={16}
                                                rx="3" fill="#1565c0"
                                            />
                                            <text
                                                x={LABEL_W + barW + 26}
                                                y={y + ROW_H / 2}
                                                textAnchor="middle" dominantBaseline="middle"
                                                fontSize="10" fill="#fff"
                                            >
                                                {slot.activeHours.toFixed(1)}h
                                            </text>
                                        </g>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                </div>
            )}
        </div>
    )
}