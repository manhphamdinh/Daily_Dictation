import { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../../../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from '../../../../utils/constants'



function Dropdown({ children, category }) {
    const [open, setOpen] = useState(false);
    const [progresses, setProgresses] = useState([]);

    const dropdownRef = useRef(null);

    const { logout, user, token } = useContext(AuthContext);

    const navigate = useNavigate();
    useEffect(() => {
        if (open && category === "in-progress") {
            const fetchProgress = async () => {
                try {
                    const res = await fetch(`${API_URL}/progress`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    const data = await res.json();

                    const inprogress = data.filter(p => (p.status === "in-progress") || (p.status === "reviewing"));

                    if (Array.isArray(inprogress)) {
                        setProgresses(inprogress);
                    } else {
                        setProgresses([]);
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            fetchProgress();
        }
    }, [open, category]);

    const handleReset = async (lessonId) => {
        const confirmReset = window.confirm("Are you sure you want to reset this exercise?");
        if (!confirmReset) return;
        try {
            const res = await fetch(`${API_URL}/progress/${lessonId}/reset`, {
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
            }

            setProgresses(prev => ({
                ...prev,
                [lessonId]: 0
            }));
        } catch (error) {
            console.error("Error fetching topics:", error)
        }
    }



    const handleLogout = () => {
        logout();
        navigate("/");
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

    return (
        <div className={styles.wrapper} ref={dropdownRef}>
            <div className={styles.container} onClick={() => setOpen(!open)}>
                {children}
            </div>

            {open && category === "in-progress" && (
                <div className={styles.menu}>
                    <ul>
                        {!Array.isArray(progresses) || progresses.length === 0 ? (
                            <li>No lessons in progress</li>
                        ) : (
                            progresses.map((item) => {
                                const title = item.lessonId?.title || "Unknown";
                                const percent = item.lessonId?.sentenceCount
                                    ? Math.round((item.completedSentences.length / item.lessonId.sentenceCount) * 100)
                                    : 0;

                                return (
                                    <li
                                        key={item._id}
                                    >
                                        <div className={styles.row}>
                                            <div className={styles.title} onClick={() => {
                                                setOpen(false);
                                                navigate(`/exercises/${item.lessonId?.groupId?.topicId?.slug}/${item.lessonId?.slug}`);
                                            }}>{title}</div>
                                            <FontAwesomeIcon icon={faXmark} className={styles.icon} onClick={() => handleReset(item.lessonId._id)} />
                                        </div>
                                        <div className={styles.progress}>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}

            {open && category === "general" && (
                <div className={styles.menu}>
                    <ul>
                        <li onClick={() => {
                            setOpen(false);
                            navigate(`/profile/${user?._id}`)
                        }}>Public profile</li>
                        <li onClick={() => {
                            setOpen(false);
                            navigate(`/user/account-information`)
                        }}>Account information</li>
                        <li>Upgrade</li>
                        <li>Notifications</li>
                        <li>Comments</li>
                        <li onClick={() => {
                            setOpen(false);
                            navigate(`/user/favourite-lessons`)
                        }}>Favourite lessons</li>
                        <li onClick={() => {
                            setOpen(false);
                            navigate(`/user/change-password`)
                        }}>Change password</li>
                        <li onClick={() => {
                            setOpen(false);
                            navigate(`/user/change-email`)
                        }}>Change email</li>
                        <li onClick={() => handleLogout()}>Logout</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Dropdown;