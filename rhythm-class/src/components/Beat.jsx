import React from 'react';
import { useRhythm } from '../context/RhythmContext';

const Beat = ({ beat, isActive, beatNumber }) => {
  const { dispatch, ACTIONS } = useRhythm();
  
  const handleClick = () => {
    dispatch({ type: ACTIONS.TOGGLE_BEAT, payload: beat.index });
  };
  
  const getBeatClass = () => {
    const classes = ['beat'];
    
    if (beat.action === 'clap') {
      classes.push('clap');
    } else if (beat.action === 'desk') {
      classes.push('desk');
    } else if (beat.action === 'snare') {
      classes.push('snare');
    } else if (beat.action === 'bass') {
      classes.push('bass');
    } else if (beat.action === 'hihat') {
      classes.push('hihat');
    } else {
      classes.push('rest');
    }
    
    if (isActive) {
      classes.push('active');
    }
    
    return classes.join(' ');
  };
  
  const getBeatText = () => {
    switch (beat.action) {
      case 'clap': return '拍手';
      case 'desk': return '拍桌';
      case 'snare': return '军鼓';
      case 'bass': return '底鼓';
      case 'hihat': return '踩镲';
      default: return '休息';
    }
  };
  
  return (
    <div className={getBeatClass()} onClick={handleClick}>
      <div className="beat-number">{beatNumber}</div>
      <span>{getBeatText()}</span>
    </div>
  );
};

export default Beat;
