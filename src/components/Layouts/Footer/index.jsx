import styles from "./Footer.module.scss";
import appstoreImg from '../../../assets/images/appstore.svg'
import googleplayImg from '../../../assets/images/googleplay.svg'


function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* App Store Section */}
                <div className={styles.appStoreSection}>
                    <img src={appstoreImg} alt="Download on the App Store" className={styles.appStoreBadge} />
                    <img src={googleplayImg} alt="Get it on Google Play" className={styles.appStoreBadge} />
                </div>

                {/* Links Columns */}
                <div className={styles.linksContainer}>
                    {/* Column 1 */}
                    <div className={styles.column}>
                        <a href="/">Home</a>
                        <a href="/exercises">All exercises</a>
                        <a href="/expressions">English expressions</a>
                        <a href="/pronunciation">English pronunciation</a>
                        <a href="/fluentpal">FluentPal - English Speaking App</a>
                        <a href="/download">Download audio files</a>
                    </div>

                    {/* Column 2 */}
                    <div className={styles.column}>
                        <a href="/top-users">Top users</a>
                        <a href="/latest-comments">Latest comments</a>
                        <a href="/resources">Learning English resources</a>
                        <a href="/german">Practice German Listening</a>
                    </div>

                    {/* Column 3 */}
                    <div className={styles.column}>
                        <a href="/blog">Blog</a>
                        <a href="/contact">Contact</a>
                        <a href="/terms">Terms & rules</a>
                        <a href="/privacy">Privacy policy</a>
                    </div>

                    {/* Column 4 - Social */}
                    <div className={styles.column}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <span className={styles.icon}>f</span> Follow us on Facebook
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                            <span className={styles.icon}>♪</span> Follow us on TikTok
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
