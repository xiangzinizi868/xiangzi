import React, { useState } from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'editor', name: '节奏编辑器' },
    { id: 'presets', name: '预设库' },
    { id: 'saved', name: '保存的节奏' },
    { id: 'share', name: '分享' },
    { id: 'tutorial', name: '教程' },
    { id: 'settings', name: '设置' }
  ];
  
  return (
    <nav className="navigation">
      <ul className="nav-tabs">
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
