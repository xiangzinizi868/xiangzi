import React, { useEffect, useRef } from 'react';
import Measure from './Measure';
import { useRhythm } from '../context/RhythmContext';

const RhythmGrid = () => {
  const { state } = useRhythm();
  const rhythmGridRef = useRef(null);
  
  // 自动滚动到当前播放的小节
  useEffect(() => {
    if (state.isPlaying && rhythmGridRef.current) {
      // 计算当前播放的小节索引（0-3）
      const currentMeasureIndex = Math.floor(state.currentPlayIndex / 4);
      
      // 获取对应的小节元素
      const measureElement = rhythmGridRef.current.children[currentMeasureIndex];
      if (measureElement) {
        // 平滑滚动到当前小节，使其位于视野中央
        measureElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [state.currentPlayIndex, state.isPlaying]);
  
  // 生成4个小节
  return (
    <div className="rhythm-grid" ref={rhythmGridRef}>
      {[0, 1, 2, 3].map(measureIndex => (
        <Measure 
          key={measureIndex} 
          measureIndex={measureIndex} 
          beats={state.beats}
        />
      ))}
    </div>
  );
};

export default RhythmGrid;
