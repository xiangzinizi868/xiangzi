// 音频处理工具

// 音频上下文
let audioContext = null;

// 音量控制
let volume = 0.7; // 默认音量 70%

// 音频缓冲区
const audioBuffers = {
  clap: null,
  desk: null,
  snare: null,  // 新增：军鼓
  bass: null,   // 新增：底鼓
  hihat: null   // 新增：踩镲
};

// 初始化音频上下文
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// 加载音频文件
const loadAudio = async (url, key) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = initAudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBuffers[key] = audioBuffer;
    return true;
  } catch (error) {
    console.error(`Failed to load audio ${key}:`, error);
    // 创建合成声音作为 fallback
    createSyntheticSound(key);
    return false;
  }
};

// 创建合成声音作为 fallback
const createSyntheticSound = (key) => {
  const audioCtx = initAudioContext();
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  switch (key) {
    case 'clap':
      // 拍手声模拟
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.05));
      }
      break;
    case 'desk':
      // 桌面敲击声模拟
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.03));
      }
      break;
    case 'snare':
      // 军鼓声模拟
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.04));
      }
      break;
    case 'bass':
      // 底鼓声模拟
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(i * 50 * Math.PI * 2 / audioCtx.sampleRate) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
      }
      break;
    case 'hihat':
      // 踩镲声模拟
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02));
      }
      break;
    default:
      // 默认声音
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(i * 440 * Math.PI * 2 / audioCtx.sampleRate) * Math.exp(-i / (audioCtx.sampleRate * 0.1));
      }
  }
  
  audioBuffers[key] = buffer;
};

// 播放音频 - 新增音量控制
export const playSound = (action, isMuted = false, volumeLevel = volume) => {
  if (isMuted) {
    return; // 静音状态下不播放
  }
  
  if (!audioBuffers[action]) {
    console.warn(`Audio buffer for ${action} not loaded, creating synthetic sound`);
    createSyntheticSound(action);
  }

  try {
    const audioCtx = initAudioContext();
    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();
    
    source.buffer = audioBuffers[action];
    gainNode.gain.value = volumeLevel;
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// 设置音量
export const setVolume = (newVolume) => {
  volume = Math.max(0, Math.min(1, newVolume)); // 限制在 0-1 之间
};

// 获取当前音量
export const getVolume = () => {
  return volume;
};

// 预加载音频
const preloadAudio = async () => {
  console.log('Preloading audio...');
  // 尝试加载真实音频文件，如果失败则使用合成声音
  // 在真实环境中，你需要添加实际的音频文件并加载它们
  // await loadAudio('/src/sounds/clap.mp3', 'clap');
  // await loadAudio('/src/sounds/desk.mp3', 'desk');
  // await loadAudio('/src/sounds/snare.mp3', 'snare');
  // await loadAudio('/src/sounds/bass.mp3', 'bass');
  // await loadAudio('/src/sounds/hihat.mp3', 'hihat');
  
  // 为所有声音类型创建合成声音作为 fallback
  Object.keys(audioBuffers).forEach(key => {
    if (!audioBuffers[key]) {
      createSyntheticSound(key);
    }
  });
};

export { preloadAudio };
