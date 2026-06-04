import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./SettingModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "dictation_settings";

const SETTINGS_CONFIG = [
  {
    key: "replayKey",
    label: "Replay Key",
    options: ["Ctrl", "Alt", "Shift"],
    default: "Ctrl",
  },
  {
    key: "playPauseKey",
    label: "Play / Pause Key",
    options: ["` (backtick)"],
    default: "` (backtick)",
  },
  {
    key: "autoReplay",
    label: "Auto Replay",
    options: ["No", "1 time", "2 times", "3 times", "4 times", "5 times"],
    default: "No",
  },
  {
    key: "secondsBetweenReplays",
    label: "Seconds between replays",
    options: ["0.5", "1", "1.5", "2", "3"],
    default: "0.5",
  },
  // {
  //   key: "wordSuggestions",
  //   label: "Word suggestions",
  //   options: ["Disabled", "Enabled"],
  //   default: "Disabled",
  // },
   {
    key: "translationlanguage",
    label: "Translation Language",
    options: [ "Vietnamese", "Japnese", "Chinese", "Spanish"],
    default: "Vietnamese",
  },
];

const DEFAULT_SETTINGS = Object.fromEntries(
  SETTINGS_CONFIG.map((c) => [c.key, c.default])
);

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge với default để không thiếu key khi có setting mới
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (_) { }
  return { ...DEFAULT_SETTINGS };
}

function persistSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  // Dispatch để các component khác (DictationPlayer) lắng nghe
  window.dispatchEvent(
    new CustomEvent("dictation-settings-changed", { detail: settings })
  );
}

// ─── Custom Hook: useSettings ─────────────────────────────────────────────────

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      persistSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    persistSettings({ ...DEFAULT_SETTINGS });
  }, []);

  // Sync nếu tab khác thay đổi localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setSettings(loadSettings());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { settings, updateSetting, resetSettings };
}

function SettingRow({ config, value, onChange }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.row}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.rowLabel}>
        <span className={styles.labelText}>{config.label}</span>
        <span className={styles.descText}>{config.description}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(config.key, e.target.value)}
        className={styles.select}
        aria-label={config.label}
      >
        {config.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Main Component: SettingsModal ────────────────────────────────────────────

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { settings, updateSetting, resetSettings } = useSettings();
  const savedTimer = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleChange = (key, value) => {
    updateSetting(key, value);
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  };

  // Đóng khi click overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  // Đóng khi nhấn Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className={styles.setting} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faGear} className={styles.icon} />
        <p>Setting</p>
      </div>

      {/* Modal */}
      {open && mounted && createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Settings">
          <div className={styles.modal} ref={modalRef}>

            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <FontAwesomeIcon icon={faGear} className={styles.icon} style={{fontSize: "25px"}}/>
                <h2 className={styles.headerTitle}>Settings</h2>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className={styles.body}>
              {SETTINGS_CONFIG.map((cfg) => (
                <SettingRow
                  key={cfg.key}
                  config={cfg}
                  value={settings[cfg.key]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button className={styles.resetBtn} onClick={handleReset}>
                Reset to defaults
              </button>
              <div className={`${styles.savedBadge} ${saved ? styles.saved : ''}`}>
                Saved automatically
              </div>
            </div>

          </div>
        </div>,
        document.body
      )
      }
    </>
  );
}