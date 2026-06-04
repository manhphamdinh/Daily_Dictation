import styles from './Translation.module.scss';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../utils/constants'


function Translation({ text, target }) {

    const [translation, setTranslation] = useState("");
    useEffect(() => {
        if (!text) return;
    
            const fetchTranslation = async () => {
                try {
                    const res = await fetch(`${API_URL}/translation?text=${encodeURIComponent(text)}&from=en&to=${target}`, {
                        method: "GET",
                    })
                    
                    const data = await res.json();
                    
                    setTranslation(data.translation);
                    
                } catch (error) {
                    console.error("Error fetching translation:", error)
                }
            }
    
            fetchTranslation()
        }, [text])

        

    if (!translation) {
        return (
            <div className={styles.translationBox}>
                <p className={styles.title}>Translation</p>
                <p className={styles.translation}>Loading translation...</p>
            </div>
        );
    }

    return (
        <div className={styles.translationBox}>
            <p className={styles.title}>Translation</p>
            <p className={styles.translation}>{translation}</p>
        </div>
    );
}

export default Translation;