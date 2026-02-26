import React, { useState, useEffect } from 'react';
import { RhythmProvider } from './context/RhythmContext';
import { NotificationProvider } from './context/NotificationContext';
import RhythmGrid from './components/RhythmGrid';
import ControlPanel from './components/ControlPanel';
import Navigation from './components/features/Navigation';
import PresetLibrary from './components/features/PresetLibrary';
import SavedRhythms from './components/features/SavedRhythms';
import ShareRhythm from './components/features/ShareRhythm';
import Settings from './components/features/Settings';
import Tutorial from './components/features/Tutorial';
import { preloadAudio } from './utils/audio';
import './App.css';

function App() {
  // 预加载音频
  useEffect(() => {
    preloadAudio();
  }, []);

  // 导航状态
  const [activeTab, setActiveTab] = useState('editor');

  // 渲染当前选中的标签内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div className="editor-content">
            <RhythmGrid />
          </div>
        );
      case 'presets':
        return <PresetLibrary />;
      case 'saved':
        return <SavedRhythms />;
      case 'share':
        return <ShareRhythm />;
      case 'settings':
        return <Settings />;
      case 'tutorial':
        return <Tutorial />;
      default:
        return (
          <div className="editor-content">
            <RhythmGrid />
          </div>
        );
    }
  };

  return (
    <NotificationProvider>
      <RhythmProvider>
        <div className="app">
          <header className="app-header">
            <h1>律动课堂</h1>
            <div className="header-actions">
              <button className="add-rhythm-btn" aria-label="添加节奏">+</button>
              <div className="user-profile">
                <span>用户</span>
                <div className="user-avatar">U</div>
              </div>
            </div>
          </header>
          
          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <main className="app-main">
            {renderTabContent()}
          </main>
          
          {/* 只有在编辑器标签页显示控制面板 */}
          {activeTab === 'editor' && (
            <footer className="app-footer">
              <ControlPanel />
            </footer>
          )}
        </div>
      </RhythmProvider>
    </NotificationProvider>
  );
}

export default App;
