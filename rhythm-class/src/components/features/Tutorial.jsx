import React, { useState } from 'react';

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: '欢迎使用律动课堂',
      content: '律动课堂是一个用于节奏训练和创作的工具。通过本教程，您将了解如何使用各种功能来创建和分享您的节奏。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Rhythm%20class%20interface%20with%20beat%20grid%20and%20control%20panel&image_size=square_hd'
    },
    {
      title: '创建节奏',
      content: '点击节拍点来切换不同的声音类型（休息、拍手、桌面敲击、军鼓、底鼓、踩镲）。节拍点会根据您选择的声音类型显示不同的颜色。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Rhythm%20beat%20grid%20with%20different%20colored%20beat%20points&image_size=square_hd'
    },
    {
      title: '播放控制',
      content: '使用播放/暂停按钮来播放您创建的节奏，调整BPM来改变速度，使用静音按钮来关闭声音。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Control%20panel%20with%20play%20pause%20buttons%20and%20BPM%20control&image_size=square_hd'
    },
    {
      title: '音量控制',
      content: '使用音量滑块来调整整体音量，从0%到100%。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Volume%20control%20slider%20in%20audio%20interface&image_size=square_hd'
    },
    {
      title: '时间签名',
      content: '选择不同的时间签名（2/4、3/4、4/4、6/8）来创建不同风格的节奏。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Time%20signature%20selector%20with%20different%20time%20signatures&image_size=square_hd'
    },
    {
      title: '预设节奏',
      content: '浏览预设节奏库，选择一个预设来快速开始创作，或作为灵感来源。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Preset%20rhythm%20library%20interface&image_size=square_hd'
    },
    {
      title: '保存节奏',
      content: '将您创作的节奏保存到本地存储，以便以后使用。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Save%20rhythm%20interface%20with%20save%20button&image_size=square_hd'
    },
    {
      title: '分享节奏',
      content: '生成一个分享链接，将您的节奏分享给朋友或同事。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Share%20rhythm%20interface%20with%20share%20link&image_size=square_hd'
    },
    {
      title: '设置',
      content: '在设置中切换语言（中文/英文）和深色模式，根据您的偏好自定义界面。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Settings%20interface%20with%20language%20and%20dark%20mode%20options&image_size=square_hd'
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tutorial">
      <h3>使用教程</h3>
      <div className="tutorial-content">
        <div className="tutorial-step">
          <div className="tutorial-step-header">
            <h4>{tutorialSteps[currentStep].title}</h4>
            <div className="tutorial-step-indicator">
              {tutorialSteps.map((_, index) => (
                <span 
                  key={index} 
                  className={`step-dot ${index === currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="tutorial-step-body">
            <div className="tutorial-image">
              <img src={tutorialSteps[currentStep].image} alt={tutorialSteps[currentStep].title} />
            </div>
            <p>{tutorialSteps[currentStep].content}</p>
          </div>
        </div>
        <div className="tutorial-controls">
          <button 
            className="tutorial-btn prev-btn" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
          >
            上一步
          </button>
          <button 
            className="tutorial-btn next-btn" 
            onClick={handleNext} 
            disabled={currentStep === tutorialSteps.length - 1}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;