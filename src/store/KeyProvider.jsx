import { createContext, useContext, useEffect, useCallback } from 'react';
import { useSettings } from '../components/DictationArea/SettingModal/index.jsx';

// Tạo context
const KeyContext = createContext();

// Hook để sử dụng context
export const useKeyActions = () => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error('useKeyActions must be used within a KeyProvider');
  }
  return context;
};

// Provider component
export const KeyProvider = ({ children, onPlayPause, onReplay, onSwitchLanguage }) => {
  const { settings } = useSettings();

  // Function to handle key down
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, altKey, shiftKey } = event;

    // Prevent default for our handled keys
    let shouldPreventDefault = false;

    // Check for play/pause key
    const playPauseKey = settings.playPauseKey;
    if (playPauseKey === 'Ctrl' && ctrlKey && !altKey && !shiftKey) {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'Alt' && altKey && !ctrlKey && !shiftKey) {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'Shift' && shiftKey && !ctrlKey && !altKey) {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'Tab' && key === 'Tab') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'Enter' && key === 'Enter') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === '` (backtick)' && key === 'Backquote') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'Space' && key === ' ') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'P' && key === 'KeyP') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    } else if (playPauseKey === 'K' && key === 'KeyK') {
      onPlayPause && onPlayPause();
      shouldPreventDefault = true;
    }

    // Check for replay key
    const replayKey = settings.replayKey;
    if (replayKey === 'Ctrl' && ctrlKey && !altKey && !shiftKey) {
      onReplay && onReplay();
      shouldPreventDefault = true;
    } else if (replayKey === 'Alt' && altKey && !ctrlKey && !shiftKey) {
      onReplay && onReplay();
      shouldPreventDefault = true;
    } else if (replayKey === 'Shift' && shiftKey && !ctrlKey && !altKey) {
      onReplay && onReplay();
      shouldPreventDefault = true;
    } else if (replayKey === 'Tab' && key === 'Tab') {
      onReplay && onReplay();
      shouldPreventDefault = true;
    } else if (replayKey === 'Enter' && key === 'Enter') {
      onReplay && onReplay();
      shouldPreventDefault = true;
    }

    // For language switching, we might need a different key or combination
    // For now, let's assume a default key like 'L' for language switch
    if (key === 'KeyL') {
      onSwitchLanguage && onSwitchLanguage(settings.translationlanguage);
      shouldPreventDefault = true;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [settings, onPlayPause, onReplay, onSwitchLanguage]);

  // Add event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Context value
  const value = {
    settings,
    // Có thể thêm các functions khác nếu cần
  };

  return (
    <KeyContext.Provider value={value}>
      {children}
    </KeyContext.Provider>
  );
};