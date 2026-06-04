import { useState, useEffect, useCallback } from 'react';
import styles from './Dictionary.module.scss';
import { API_URL } from '../../../utils/constants'


function WordChip({ token, activeId, setActiveId, chipId }) {
  const [data, setData] = useState(null);
  const clean = token.replace(/[.,!?;:""]/g, '').toLowerCase();
  const isPunct = /^[.,!?;:""-]+$/.test(token);
  const open = activeId === chipId;

  const fetchData = useCallback(async () => {
    if (data && data !== 'loading') return;
    setData('loading');
    try {
      const res = await fetch(`${API_URL}/dictionary?word=${encodeURIComponent(clean)}`);
      setData(await res.json());
    } catch {
      setData({ ukIpa: null, usIpa: null, translation: null });
    }
  }, [clean, data]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (open) {
      setActiveId(null);
    } else {
      fetchData();
      setActiveId(chipId);
    }
  };

  const speak = (e, accent) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = accent === 'uk' ? 'en-GB' : 'en-US';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  if (isPunct) return <span className={styles.punct}>{token}</span>;

  return (
    <span className={styles.chip}>
      <button
        className={`${styles.wordBtn} ${open ? styles.active : ''}`}
        onClick={handleClick}
      >
        {token}
      </button>

      {open && (
        <div className={styles.tooltip} onClick={e => e.stopPropagation()}>
          <div className={styles.ttArrow} />
          <p className={styles.ttWord}>{clean}</p>

          {data === 'loading' ? (
            <p className={styles.ttLoading}>Loading...</p>
          ) : (
            <>
              <div className={styles.ttBtns}>
                <button className={styles.ttAccentBtn} onClick={e => speak(e, 'uk')}>
                  UK <span className={styles.speakerIcon}>🔊</span>
                </button>
                <button className={styles.ttAccentBtn} onClick={e => speak(e, 'us')}>
                  US <span className={styles.speakerIcon}>🔊</span>
                </button>
              </div>

              <div className={styles.ttDivider} />
              <p className={styles.ttIpaTitle}>IPA for <strong>{clean}</strong></p>
              <p className={styles.ttIpaRow}>
                {data?.ukIpa && <>UK <span className={styles.ipa}>{data.ukIpa}</span></>}
                {data?.ukIpa && data?.usIpa && '   '}
                {data?.usIpa && <>US <span className={styles.ipa}>{data.usIpa}</span></>}
                {!data?.ukIpa && !data?.usIpa && <span className={styles.ttNone}>—</span>}
              </p>

              <div className={styles.ttDivider} />
              <p className={styles.ttTransLabel}>Translation</p>
              <p className={styles.ttTrans}>{data?.translation || '—'}</p>
            </>
          )}
        </div>
      )}
    </span>
  );
}

export default function Dictionary({ sentence }) {
  const [activeId, setActiveId] = useState(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const close = () => setActiveId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  if (!sentence) return null;

  return (
    <div className={styles.panel}>
      <p className={styles.label}>Pronunciation</p>
      <div className={styles.wordsRow}>
        {sentence.split(' ').map((token, i) => (
          <WordChip
            key={i}
            chipId={i}
            token={token}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </div>
    </div>
  );
}