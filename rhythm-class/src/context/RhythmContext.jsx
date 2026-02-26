import React, { createContext, useReducer, useContext, useEffect } from 'react';

// 预设节奏库
const PRESET_RHYTHMS = {
  basic: {
    name: '基础节奏',
    description: '适合初学者的基础四拍节奏',
    beats: Array(16).fill().map((_, index) => ({
      action: index < 4 ? 'clap' : 'rest',
      index
    }))
  },
  syncopated: {
    name: '切分节奏',
    description: '带有切分音的节奏，增加动感',
    beats: [
      { action: 'clap', index: 0 },
      { action: 'rest', index: 1 },
      { action: 'clap', index: 2 },
      { action: 'rest', index: 3 },
      { action: 'rest', index: 4 },
      { action: 'clap', index: 5 },
      { action: 'rest', index: 6 },
      { action: 'clap', index: 7 },
      { action: 'clap', index: 8 },
      { action: 'rest', index: 9 },
      { action: 'clap', index: 10 },
      { action: 'rest', index: 11 },
      { action: 'rest', index: 12 },
      { action: 'clap', index: 13 },
      { action: 'rest', index: 14 },
      { action: 'clap', index: 15 }
    ]
  },
  drumPattern: {
    name: '鼓点模式',
    description: '模拟架子鼓的节奏模式',
    beats: [
      { action: 'clap', index: 0 },
      { action: 'desk', index: 1 },
      { action: 'clap', index: 2 },
      { action: 'desk', index: 3 },
      { action: 'desk', index: 4 },
      { action: 'rest', index: 5 },
      { action: 'clap', index: 6 },
      { action: 'desk', index: 7 },
      { action: 'clap', index: 8 },
      { action: 'desk', index: 9 },
      { action: 'clap', index: 10 },
      { action: 'desk', index: 11 },
      { action: 'desk', index: 12 },
      { action: 'rest', index: 13 },
      { action: 'clap', index: 14 },
      { action: 'desk', index: 15 }
    ]
  }
};

// 初始状态
const initialState = {
  beats: Array(16).fill().map((_, index) => ({
    action: index < 4 ? 'clap' : 'rest', // 默认前4个节拍为拍手
    index
  })),
  isPlaying: false,
  currentPlayIndex: 0,
  timerId: null,
  bpm: 100,
  isMuted: false,
  volume: 0.7, // 新增：音量控制（0-1）
  timeSignature: '4/4', // 新增：时间签名
  measures: 4, // 新增：小节数
  darkMode: false, // 新增：深色模式状态
  language: 'zh', // 新增：语言状态
  currentPreset: null, // 新增：当前使用的预设
  savedRhythms: [], // 新增：保存的节奏
  shareUrl: null // 新增：分享链接
};

// 动作类型
const ACTIONS = {
  TOGGLE_BEAT: 'TOGGLE_BEAT',
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  SET_TIMER_ID: 'SET_TIMER_ID',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  RESET: 'RESET',
  INCREMENT_BPM: 'INCREMENT_BPM',
  DECREMENT_BPM: 'DECREMENT_BPM',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_VOLUME: 'SET_VOLUME', // 新增：设置音量
  SET_TIME_SIGNATURE: 'SET_TIME_SIGNATURE', // 新增：设置时间签名
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE', // 新增：切换深色模式
  SET_LANGUAGE: 'SET_LANGUAGE', // 新增：设置语言
  LOAD_PRESET: 'LOAD_PRESET', // 新增：加载预设节奏
  SAVE_RHYTHM: 'SAVE_RHYTHM', // 新增：保存节奏
  LOAD_SAVED_RHYTHM: 'LOAD_SAVED_RHYTHM', // 新增：加载保存的节奏
  DELETE_SAVED_RHYTHM: 'DELETE_SAVED_RHYTHM', // 新增：删除保存的节奏
  GENERATE_SHARE_URL: 'GENERATE_SHARE_URL' // 新增：生成分享链接
};

// 获取下一个动作状态
const getNextAction = (currentAction) => {
  const actions = ['rest', 'clap', 'desk', 'snare', 'bass', 'hihat'];
  const currentIndex = actions.indexOf(currentAction);
  return actions[(currentIndex + 1) % actions.length];
};

// 状态管理 Reducer
const rhythmReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_BEAT:
      return {
        ...state,
        beats: state.beats.map(beat => 
          beat.index === action.payload 
            ? { 
                ...beat, 
                action: getNextAction(beat.action) 
              } 
            : beat
        )
      };
    case ACTIONS.TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    case ACTIONS.SET_TIMER_ID:
      return {
        ...state,
        timerId: action.payload
      };
    case ACTIONS.SET_CURRENT_INDEX:
      return {
        ...state,
        currentPlayIndex: action.payload
      };
    case ACTIONS.RESET:
      return {
        ...initialState,
        darkMode: state.darkMode, // 保持深色模式状态
        language: state.language, // 保持语言状态
        savedRhythms: state.savedRhythms, // 保持保存的节奏
        volume: state.volume // 保持音量状态
      };
    case ACTIONS.INCREMENT_BPM:
      return {
        ...state,
        bpm: Math.min(state.bpm + 5, 208)
      };
    case ACTIONS.DECREMENT_BPM:
      return {
        ...state,
        bpm: Math.max(state.bpm - 5, 40)
      };
    case ACTIONS.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted
      };
    case ACTIONS.SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      };
    case ACTIONS.SET_TIME_SIGNATURE:
      const newTimeSignature = action.payload;
      // 根据时间签名计算节拍数（以4分音符为一拍，4小节）
      const beatsPerMeasure = parseInt(newTimeSignature.split('/')[0]);
      const totalBeats = beatsPerMeasure * 4; // 4小节
      // 重新生成节拍数组
      const newBeats = Array(totalBeats).fill().map((_, index) => ({
        action: index < beatsPerMeasure ? 'clap' : 'rest', // 默认第一小节为拍手
        index
      }));
      return {
        ...state,
        timeSignature: newTimeSignature,
        beats: newBeats,
        currentPlayIndex: 0 // 重置播放索引
      };
    case ACTIONS.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode
      };
    case ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    case ACTIONS.LOAD_PRESET:
      return {
        ...state,
        beats: PRESET_RHYTHMS[action.payload].beats,
        currentPreset: action.payload
      };
    case ACTIONS.SAVE_RHYTHM:
      const newSavedRhythm = {
        id: Date.now().toString(),
        name: action.payload.name,
        beats: state.beats,
        bpm: state.bpm,
        createdAt: new Date().toISOString()
      };
      const updatedSavedRhythms = [...state.savedRhythms, newSavedRhythm];
      // 保存到 localStorage
      localStorage.setItem('savedRhythms', JSON.stringify(updatedSavedRhythms));
      return {
        ...state,
        savedRhythms: updatedSavedRhythms
      };
    case ACTIONS.LOAD_SAVED_RHYTHM:
      const savedRhythm = state.savedRhythms.find(rhythm => rhythm.id === action.payload);
      return {
        ...state,
        beats: savedRhythm ? savedRhythm.beats : state.beats,
        bpm: savedRhythm ? savedRhythm.bpm : state.bpm,
        currentPreset: null
      };
    case ACTIONS.DELETE_SAVED_RHYTHM:
      const filteredRhythms = state.savedRhythms.filter(rhythm => rhythm.id !== action.payload);
      // 更新 localStorage
      localStorage.setItem('savedRhythms', JSON.stringify(filteredRhythms));
      return {
        ...state,
        savedRhythms: filteredRhythms
      };
    case ACTIONS.GENERATE_SHARE_URL:
      // 生成分享链接：将节奏数据编码为 URL 参数
      const rhythmData = {
        beats: state.beats,
        bpm: state.bpm
      };
      const encodedData = btoa(JSON.stringify(rhythmData));
      const shareUrl = `${window.location.origin}${window.location.pathname}?rhythm=${encodedData}`;
      return {
        ...state,
        shareUrl
      };
    default:
      return state;
  }
};

// 创建上下文
const RhythmContext = createContext();

// 上下文提供者组件
export const RhythmProvider = ({ children }) => {
  // 从 localStorage 加载保存的节奏
  const loadSavedRhythms = () => {
    try {
      const saved = localStorage.getItem('savedRhythms');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved rhythms:', error);
      return [];
    }
  };

  // 从 URL 参数加载分享的节奏
  const loadSharedRhythm = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rhythmParam = urlParams.get('rhythm');
      if (rhythmParam) {
        const decodedData = JSON.parse(atob(rhythmParam));
        return decodedData;
      }
    } catch (error) {
      console.error('Failed to load shared rhythm:', error);
    }
    return null;
  };

  // 初始化状态，包含从 localStorage 加载的数据
  const initialStateWithSaved = {
    ...initialState,
    savedRhythms: loadSavedRhythms()
  };

  // 检查是否有分享的节奏
  const sharedRhythm = loadSharedRhythm();
  if (sharedRhythm) {
    initialStateWithSaved.beats = sharedRhythm.beats;
    if (sharedRhythm.bpm) {
      initialStateWithSaved.bpm = sharedRhythm.bpm;
    }
  }

  const [state, dispatch] = useReducer(rhythmReducer, initialStateWithSaved);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (state.timerId) {
        clearInterval(state.timerId);
      }
    };
  }, [state.timerId]);

  // 应用深色模式
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [state.darkMode]);

  return (
    <RhythmContext.Provider value={{ 
      state, 
      dispatch, 
      ACTIONS,
      PRESET_RHYTHMS // 导出预设节奏库
    }}>
      {children}
    </RhythmContext.Provider>
  );
};

// 自定义钩子，方便使用上下文
export const useRhythm = () => {
  const context = useContext(RhythmContext);
  if (!context) {
    throw new Error('useRhythm must be used within a RhythmProvider');
  }
  return context;
};
