import React from 'react';
import { useRhythm } from '../../context/RhythmContext';

const Settings = () => {
  const { state, dispatch, ACTIONS } = useRhythm();
  
  const handleLanguageChange = (language) => {
    dispatch({ type: ACTIONS.SET_LANGUAGE, payload: language });
  };
  
  const handleDarkModeToggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });
  };
  
  return (
    <div className="settings">
      <h3>设置</h3>
      
      <div className="setting-group">
        <h4>语言 / Language</h4>
        <div className="language-buttons">
          <button 
            className={`language-btn ${state.language === 'zh' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('zh')}
          >
            中文
          </button>
          <button 
            className={`language-btn ${state.language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
        </div>
      </div>
      
      <div className="setting-group">
        <h4>主题 / Theme</h4>
        <div className="dark-mode-toggle">
          <span>{state.darkMode ? '深色模式' : '亮色模式'}</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={state.darkMode}
              onChange={handleDarkModeToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
