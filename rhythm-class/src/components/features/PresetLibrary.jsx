import React from 'react';
import { useRhythm } from '../../context/RhythmContext';

const PresetLibrary = () => {
  const { state, dispatch, ACTIONS, PRESET_RHYTHMS } = useRhythm();
  
  const handleLoadPreset = (presetKey) => {
    dispatch({ type: ACTIONS.LOAD_PRESET, payload: presetKey });
  };
  
  return (
    <div className="preset-library">
      <h3>预设节奏库</h3>
      <div className="preset-list">
        {Object.entries(PRESET_RHYTHMS).map(([key, preset]) => (
          <div 
            key={key} 
            className={`preset-item ${state.currentPreset === key ? 'active' : ''}`}
            onClick={() => handleLoadPreset(key)}
          >
            <h4>{preset.name}</h4>
            <p>{preset.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetLibrary;
