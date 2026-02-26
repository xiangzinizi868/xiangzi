import React, { useState } from 'react';
import { useRhythm } from '../../context/RhythmContext';

const ShareRhythm = () => {
  const { state, dispatch, ACTIONS } = useRhythm();
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleGenerateShareUrl = () => {
    dispatch({ type: ACTIONS.GENERATE_SHARE_URL });
    setCopySuccess(false);
  };
  
  const handleCopyUrl = () => {
    if (state.shareUrl) {
      navigator.clipboard.writeText(state.shareUrl)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('无法复制链接:', err);
        });
    }
  };
  
  return (
    <div className="share-rhythm">
      <h3>分享节奏</h3>
      <p>生成一个链接，与他人分享当前的节奏配置</p>
      
      <div className="share-actions">
        <button 
          className="generate-btn"
          onClick={handleGenerateShareUrl}
        >
          生成分享链接
        </button>
        
        {state.shareUrl && (
          <div className="share-url-container">
            <input
              type="text"
              value={state.shareUrl}
              readOnly
              className="share-url-input"
            />
            <button 
              className="copy-btn"
              onClick={handleCopyUrl}
            >
              {copySuccess ? '已复制!' : '复制链接'}
            </button>
          </div>
        )}
      </div>
      
      {state.shareUrl && (
        <p className="share-info">
          当有人打开这个链接时，他们将看到与您当前相同的节奏配置。
        </p>
      )}
    </div>
  );
};

export default ShareRhythm;
