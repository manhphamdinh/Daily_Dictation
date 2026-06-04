import classNames from 'classnames/bind';
import styles from "./Header.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faSortDown, faStarHalfStroke, faSun } from '@fortawesome/free-solid-svg-icons';
import { faClock, faRectangleList, faStarHalf } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../store/AuthContext.jsx';

import Dropdown from './Dropdown/Dropdown.jsx';
import Timer from './Timer/index.jsx'

import logoImg from '../../../assets/images/4.jpg'
import diamondImg from '../../../assets/images/diamond.png'


const cx = classNames.bind(styles);

function Header() {
    const { isLogin, user, token } = useContext(AuthContext);

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.inner}>
                    <Link to="/" className={styles.logoContainer}>
                        <img src={logoImg} alt="" className={styles.logo} />
                        <h1 className={styles.name}>ailyDictation</h1>
                    </Link>
                    <div className={styles.navbar}>
                        <li className={styles.hoverBox}><Link to="/exercises">All exercises</Link></li>
                        <li className={styles.hoverBox}><Link to="/top-users">Top users</Link></li>
                        <li className={styles.hoverBox}>Other lessons <FontAwesomeIcon icon={faSortDown} className={styles.icon} /></li>
                    </div>
                </div>
            </div>
            <div className={styles.wrapper}>
                {isLogin ?
                    <div className={styles.inner}>
                        <div className={cx('logoContainer', 'icon')}>
                            <FontAwesomeIcon icon={faClock} />
                            <Timer token = {token} user = {user}/>
                        </div>
                        <div className={styles.navbar}>
                            <li className={`${styles.hoverBox}`}>
                                <img src={diamondImg} alt="" className={styles.diamond} />
                                <p className={styles.upgrade}>Upgrade</p></li>
                            <Dropdown category = {"in-progress"}>
                                <li className={styles.hoverBox}><FontAwesomeIcon icon={faStarHalfStroke} className={styles.icon} /> In-progress <FontAwesomeIcon icon={faSortDown} className={styles.icon} /></li>
                            </Dropdown>
                            <li className={styles.hoverBox}><FontAwesomeIcon icon={faRectangleList} className={styles.icon} /> Notes</li>
                            <Dropdown category = {"general"}>
                                <li className={styles.hoverBox}><FontAwesomeIcon icon={faCircleUser} className={styles.icon} />{user?.username} <FontAwesomeIcon icon={faSortDown} className={styles.icon} /></li>
                            </Dropdown>
                            <li className={styles.hoverBox}><FontAwesomeIcon icon={faSun} className={styles.icon} /> <FontAwesomeIcon icon={faSortDown} className={styles.icon} /></li>

                        </div>
                    </div> :
                    <div className={styles.inner}>
                        <div className={styles.navbar}>
                            <li className={styles.hoverBox}><Link to="/login">Login</Link></li>
                            <li className={styles.hoverBox}><Link to="/register">Register</Link></li>
                            <li className={styles.hoverBox}><FontAwesomeIcon icon={faSun} className={styles.icon} /> <FontAwesomeIcon icon={faSortDown} className={styles.icon} /></li>
                        </div>
                    </div>}
            </div>
        </>);
}

export default Header;