import React from 'react';
import Beat from './Beat';
import { useRhythm } from '../context/RhythmContext';

const Measure = ({ measureIndex, beats }) => {
  const { state } = useRhythm();
  
  // 计算当前小节的起始和结束索引
  const startIndex = measureIndex * 4;
  const endIndex = startIndex + 4;
  
  // 过滤出当前小节的节拍点
  const measureBeats = beats.filter(beat => 
    beat.index >= startIndex && beat.index < endIndex
  );
  
  return (
    <div className="measure">
      <div className="measure-header">
        <div className="measure-number">{measureIndex + 1}</div>
      </div>
      <div className="beat-grid">
        {measureBeats.map(beat => (
          <Beat 
            key={beat.index} 
            beat={beat} 
            isActive={state.currentPlayIndex === beat.index}
            beatNumber={beat.index - startIndex + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Measure;
