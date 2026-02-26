import React, { useState } from 'react';
import { useRhythm } from '../../context/RhythmContext';
import { useNotification } from '../../context/NotificationContext';

const SavedRhythms = () => {
  const { state, dispatch, ACTIONS } = useRhythm();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const handleSaveRhythm = () => {
    if (saveName.trim()) {
      dispatch({ 
        type: ACTIONS.SAVE_RHYTHM, 
        payload: { name: saveName.trim() }
      });
      showSuccess('节奏保存成功！');
      setSaveName('');
      setShowSaveModal(false);
    } else {
      showWarning('请输入节奏名称');
    }
  };

  const handleLoadRhythm = (id) => {
    dispatch({ type: ACTIONS.LOAD_SAVED_RHYTHM, payload: id });
    showSuccess('节奏加载成功！');
  };

  const handleDeleteRhythm = (id) => {
    if (window.confirm('确定要删除这个节奏吗？')) {
      dispatch({ type: ACTIONS.DELETE_SAVED_RHYTHM, payload: id });
      showInfo('节奏已删除');
    }
  };
  
  return (
    <div className="saved-rhythms">
      <div className="saved-rhythms-header">
        <h3>保存的节奏</h3>
        <button 
          className="save-btn"
          onClick={() => setShowSaveModal(true)}
        >
          保存当前节奏
        </button>
      </div>
      
      {state.savedRhythms.length === 0 ? (
        <p className="no-saved-rhythms">还没有保存的节奏</p>
      ) : (
        <div className="saved-list">
          {state.savedRhythms.map(rhythm => (
            <div key={rhythm.id} className="saved-item">
              <div className="saved-item-info">
                <h4>{rhythm.name}</h4>
                <p className="saved-item-meta">
                  BPM: {rhythm.bpm} | 创建于: {new Date(rhythm.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="saved-item-actions">
                <button 
                  className="load-btn"
                  onClick={() => handleLoadSavedRhythm(rhythm.id)}
                >
                  加载
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteSavedRhythm(rhythm.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 保存节奏模态框 */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>保存节奏</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="输入节奏名称"
              className="save-name-input"
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowSaveModal(false)}
              >
                取消
              </button>
              <button 
                className="confirm-btn"
                onClick={handleSaveRhythm}
                disabled={!saveName.trim()}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRhythms;
