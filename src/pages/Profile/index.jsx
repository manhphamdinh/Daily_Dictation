import styles from './Profile.module.scss';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../store/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import ActivityChart from '../../components/ActivityChart/index.jsx';
import { API_URL } from '../../utils/constants'


function getFirstLetterOfLastName(fullName) {
	if (!fullName) return "";

	const words = fullName.trim().split(" ");
	const lastName = words[words.length - 1];

	return lastName.charAt(0).toUpperCase();
}

function stringToColor(str = "") {
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += value.toString(16).padStart(2, "0");
	}

	return color;
}

function getTextColor(bgColor) {
	// bỏ dấu #
	const color = bgColor.substring(1);

	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);

	// tính độ sáng (luminance)
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness > 150 ? "#000" : "#fff";
}

function Profile() {

	const { token } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const { userId } = useParams();

	useEffect(() => {
		if (!userId) return

		const loadUser = async () => {
			try {
				// 1. cập nhật totalMinutes
				await fetch(`${API_URL}/auth/profile/total-minutes`, {
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				// 2. cập nhật totalLessons
				await fetch(`${API_URL}/auth/profile/total-lessons`, {
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				// 3. fetch lại user
				const res = await fetch(`${API_URL}/auth/profile/${userId}`)
				const data = await res.json()

				setUser(data.data.user)

			} catch (error) {
				console.error("Error fetching profile:", error)
			}
		}

		loadUser()
	}, [userId, token])

	if (!user) return <p>Loading...</p>

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.nameContainer}>
					<div className={styles.avatar} style={{
						backgroundColor: stringToColor(user?.id),
						color: getTextColor(stringToColor(user?.id)),
					}}>
						{user?.avartar == null && <h1>{getFirstLetterOfLastName(user?.username)}</h1>}

					</div>

					<div className={styles.column}>
						<h1>{user?.username}</h1>
						<p className={styles.userId}>#{user?.id}</p>
					</div>
				</div>

				<div className={styles.statistic}>
					<ul>
						<li>
							<p className={styles.lightText}>Join date:</p>
							<p className={styles.boldText}>{new Date(user.createdAt).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}</p>
						</li>

						<li>
							<p className={styles.lightText}>Last active:</p>
							<p className={styles.boldText}>{new Date(user.lastActive).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}</p>
						</li>

						<li>
							<p className={styles.lightText}>Lesson completions:</p>
							<p className={styles.boldText}>{user?.totalLessons}</p>
						</li>

						<li>
							<p className={styles.lightText}>Streak:</p>
							<p className={styles.boldText}>{user.streak} days</p>
						</li>
					</ul>

					<ul>
						<li>
							<p className={styles.lightText}>Active days:</p>
							<p className={styles.boldText}>{user.activeDays} days</p>
						</li>

						<li>
							<p className={styles.lightText}>Active times:</p>
							<p className={styles.boldText}>{(user.totalMinutes / 60).toFixed(1)} hours</p>
						</li>

						<li>
							<p className={styles.lightText}>Last 7 days:</p>
							<p className={styles.boldText}>{user?.last7Days} hours</p>
						</li>

						<li>
							<p className={styles.lightText}>Last 30 days:</p>
							<p className={styles.boldText}>{user?.last30Days} hours</p>
						</li>
					</ul>

				</div>
				<ActivityChart userId={userId} />
				<div>

				</div>
			</div>
		</div>
	)
}

export default Profile
