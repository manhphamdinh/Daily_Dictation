import Header from "../Header";
import Footer from "../Footer";
import styles from "./DefaultLayout.module.scss"

function DefaultLayout({children}) {
    return ( 
        <div className={styles.wrapper}>
            <Header />
                <div className={styles.content}>
                    {children}
                </div>
            <Footer />
        </div>
     );
}

export default DefaultLayout;