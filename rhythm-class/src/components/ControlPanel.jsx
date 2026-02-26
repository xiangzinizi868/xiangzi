import React from 'react';
import { useRhythm } from '../context/RhythmContext';
import { playSound } from '../utils/audio';

const ControlPanel = () => {
  const { state, dispatch, ACTIONS } = useRhythm();
  
  // 处理播放/暂停
  const handlePlayPause = () => {
    if (state.isPlaying) {
      // 暂停播放
      if (state.timerId) {
        clearInterval(state.timerId);
      }
      dispatch({ type: ACTIONS.TOGGLE_PLAY });
    } else {
      // 开始播放
      startPlaying();
    }
  };
  
  // 开始播放逻辑
  const startPlaying = () => {
    const interval = 60000 / state.bpm; // 计算每拍间隔时间
    
    const playNextBeat = () => {
      const currentBeat = state.beats[state.currentPlayIndex];
      if (currentBeat.action !== 'rest') {
        playSound(currentBeat.action, state.isMuted, state.volume); // 传递静音状态和音量
      }
      
      // 更新当前播放索引，使用节拍总数而不是固定值
      dispatch({ 
        type: ACTIONS.SET_CURRENT_INDEX, 
        payload: (state.currentPlayIndex + 1) % state.beats.length 
      });
    };
    
    // 立即播放当前节拍
    playNextBeat();
    
    // 设置定时器
    const timerId = setInterval(playNextBeat, interval);
    dispatch({ type: ACTIONS.SET_TIMER_ID, payload: timerId });
    dispatch({ type: ACTIONS.TOGGLE_PLAY });
  };
  
  // 处理 BPM 变化
  const handleBPMChange = (e) => {
    const newBPM = parseInt(e.target.value);
    // 确保 BPM 在有效范围内
    if (newBPM >= 40 && newBPM <= 208) {
      // 这里需要更新 BPM，但是我们没有直接的 SET_BPM action，所以需要计算需要增加或减少的次数
      let currentBPM = state.bpm;
      while (currentBPM < newBPM) {
        dispatch({ type: ACTIONS.INCREMENT_BPM });
        currentBPM += 5;
      }
      while (currentBPM > newBPM) {
        dispatch({ type: ACTIONS.DECREMENT_BPM });
        currentBPM -= 5;
      }
      // 如果正在播放，重新启动定时器以应用新的 BPM
      if (state.isPlaying) {
        if (state.timerId) {
          clearInterval(state.timerId);
        }
        startPlaying();
      }
    }
  };
  
  // 处理时间签名变化
  const handleTimeSignatureChange = (e) => {
    const newTimeSignature = e.target.value;
    dispatch({ type: ACTIONS.SET_TIME_SIGNATURE, payload: newTimeSignature });
  };
  
  // 处理音量变化
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: ACTIONS.SET_VOLUME, payload: newVolume });
  };
  
  // 处理静音切换
  const handleToggleMute = () => {
    dispatch({ type: ACTIONS.TOGGLE_MUTE });
  };
  
  // 处理重置
  const handleReset = () => {
    if (state.timerId) {
      clearInterval(state.timerId);
    }
    dispatch({ type: ACTIONS.RESET });
  };
  
  return (
    <div className="control-panel">
      <button 
        className={`play-pause-btn ${state.isPlaying ? 'playing' : ''}`}
        onClick={handlePlayPause}
        aria-label={state.isPlaying ? '暂停' : '播放'}
      >
        {state.isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div className="status-display">
        {state.isPlaying ? 'PLAYING' : 'WAIT'}
      </div>
      
      <div className="bpm-controls">
        <span className="bpm-label">BPM</span>
        <div className="bpm-display">{state.bpm}</div>
        <input
          type="range"
          className="bpm-slider"
          min="40"
          max="208"
          step="5"
          value={state.bpm}
          onChange={handleBPMChange}
          aria-label="BPM 控制"
        />
        <div className="bpm-range">
          <span>SLOW</span>
          <span>FAST</span>
        </div>
      </div>
      
      <div className="control-buttons">
        <div className="time-signature-controls">
          <select
            id="timeSignature"
            value={state.timeSignature}
            onChange={handleTimeSignatureChange}
            className="time-signature-select"
            aria-label="时间签名"
          >
            <option value="2/4">2/4</option>
            <option value="3/4">3/4</option>
            <option value="4/4">4/4</option>
            <option value="6/8">6/8</option>
          </select>
        </div>
        <div className="volume-controls">
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.05"
            value={state.volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="音量控制"
          />
        </div>
        <button 
          className={`control-btn ${state.isMuted ? 'active' : ''}`}
          onClick={handleToggleMute}
          aria-label={state.isMuted ? '取消静音' : '静音'}
        >
          {state.isMuted ? '🔊' : '🔇'}
        </button>
        <button 
          className="control-btn"
          onClick={handleReset}
          aria-label="重置"
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
