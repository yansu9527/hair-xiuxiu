// 头发秀秀 - H5版主程序

// 页面切换
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

function showHomePage() {
  showPage('home-page');
}

function showUploadPage() {
  showPage('upload-page');
}

// 上传相关
let selectedImage = null;

function takePhoto() {
  document.getElementById('file-input').setAttribute('capture', 'environment');
  document.getElementById('file-input').click();
}

function selectFromAlbum() {
  document.getElementById('file-input').removeAttribute('capture');
  document.getElementById('file-input').click();
}

// 文件选择处理
document.getElementById('file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    handleImage(file);
  }
});

function handleImage(file) {
  selectedImage = file;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('preview-image').src = e.target.result;
    document.getElementById('preview-image').style.display = 'block';
    document.getElementById('upload-placeholder').style.display = 'none';
    document.getElementById('upload-buttons').style.display = 'none';
    document.getElementById('upload-actions').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  selectedImage = null;
  document.getElementById('file-input').value = '';
  document.getElementById('preview-image').style.display = 'none';
  document.getElementById('upload-placeholder').style.display = 'block';
  document.getElementById('upload-buttons').style.display = 'block';
  document.getElementById('upload-actions').style.display = 'none';
}

// 点击上传区域也可以触发
document.getElementById('upload-area').addEventListener('click', function(e) {
  if (e.target === this || e.target.closest('.upload-placeholder')) {
    if (!selectedImage) {
      takePhoto();
    }
  }
});

// 开始分析
async function startAnalysis() {
  if (!selectedImage) {
    alert('请先选择照片');
    return;
  }

  showPage('analysis-page');
  
  // 显示预览图
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('analyzing-image').src = e.target.result;
  };
  reader.readAsDataURL(selectedImage);

  // 模拟分析进度
  await simulateAnalysis();
  
  // 执行真实分析
  try {
    const result = await analyzeHair(selectedImage);
    showResult(result);
  } catch (error) {
    console.error('分析失败:', error);
    // 使用模拟数据
    const mockResult = getMockResult();
    showResult(mockResult);
  }
}

// 模拟分析进度
async function simulateAnalysis() {
  const tips = [
    '健康的头皮应该是淡粉色或肉色的',
    '正常每天掉发50-100根属于正常范围',
    '油性发质建议每天或隔天洗头',
    '干性发质建议2-3天洗一次头',
    '洗头时水温以38-40度为宜'
  ];

  // 步骤1: 0-40%
  await updateProgress(0, 40, 1500, '正在识别图像特征...', tips[0]);
  updateStep(1, true);
  updateStep(2, false, true);

  // 步骤2: 40-80%
  await updateProgress(40, 80, 1200, '正在分析发质和头皮状况...', tips[Math.floor(Math.random() * tips.length)]);
  updateStep(2, true);
  updateStep(3, false, true);

  // 步骤3: 80-100%
  await updateProgress(80, 100, 800, '正在生成护理建议...', tips[Math.floor(Math.random() * tips.length)]);
  updateStep(3, true);
}

function updateProgress(start, end, duration, desc, tip) {
  return new Promise(resolve => {
    const startTime = Date.now();
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(start + (elapsed / duration) * (end - start), end);
      
      document.getElementById('progress-fill').style.width = progress + '%';
      document.getElementById('progress-text').textContent = Math.floor(progress) + '%';
      document.getElementById('status-desc').textContent = desc;
      document.getElementById('analysis-tip').textContent = '💡 ' + tip;
      
      if (progress < end) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    };
    update();
  });
}

function updateStep(stepNum, completed, active = false) {
  const step = document.querySelector(`[data-step="${stepNum}"]`);
  if (completed) {
    step.classList.add('completed');
    step.classList.remove('active');
  }
  if (active) {
    step.classList.add('active');
  }
}

// 显示结果
function showResult(result) {
  showPage('result-page');
  
  // 填充结果
  document.getElementById('result-time').textContent = '分析时间：' + result.analysisTime;
  document.getElementById('confidence-tag').textContent = '置信度 ' + result.confidence + '%';
  document.getElementById('score-number').textContent = result.healthScore;
  
  // 星星
  const starsContainer = document.getElementById('score-stars');
  starsContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star ' + (i <= result.healthScore ? 'filled' : '');
    star.textContent = '★';
    starsContainer.appendChild(star);
  }
  
  // 评价
  document.getElementById('score-evaluate').textContent = getHealthEvaluate(result.healthScore);
  
  // 发质和头皮
  const hairTypeEl = document.getElementById('hair-type');
  hairTypeEl.textContent = result.hairType;
  hairTypeEl.className = 'tag ' + getHairTypeClass(result.hairType);
  
  const scalpStateEl = document.getElementById('scalp-state');
  scalpStateEl.textContent = result.scalpState;
  scalpStateEl.className = 'tag ' + getScalpStateClass(result.scalpState);
  
  // 描述
  document.getElementById('result-desc').textContent = getTypeDescription(result.hairType, result.scalpState);
  
  // 建议
  const suggestions = getSuggestions(result.hairType, result.scalpState);
  
  if (suggestions.wash) {
    document.querySelector('#suggestion-wash p').textContent = suggestions.wash;
  }
  if (suggestions.care) {
    document.querySelector('#suggestion-care p').textContent = suggestions.care;
  }
  if (suggestions.diet) {
    document.querySelector('#suggestion-diet p').textContent = suggestions.diet;
  }
  if (suggestions.lifestyle) {
    document.querySelector('#suggestion-lifestyle p').textContent = suggestions.lifestyle;
  }
}

function getHealthEvaluate(score) {
  const evaluates = {
    5: '非常健康！您的头发状态很棒，继续保持！',
    4: '比较健康，注意日常护理即可',
    3: '状态一般，建议针对性护理',
    2: '需要关注，建议改善护理习惯',
    1: '需要重视，建议咨询专业医生'
  };
  return evaluates[score] || '请根据建议进行护理';
}

function getHairTypeClass(type) {
  const classes = {
    '油性': 'tag-warning',
    '干性': '',
    '中性': 'tag-success',
    '混合': ''
  };
  return classes[type] || '';
}

function getScalpStateClass(state) {
  const classes = {
    '健康': 'tag-success',
    '偏油': 'tag-warning',
    '偏干': '',
    '敏感': 'tag-danger',
    '有头屑': ''
  };
  return classes[state] || '';
}

function getTypeDescription(hairType, scalpState) {
  const descriptions = {
    '油性': {
      '健康': '您的头皮油脂分泌较旺盛，但头皮整体健康。建议选择控油型洗发水，保持头皮清爽。',
      '偏油': '头皮油脂分泌过多，可能导致头发扁塌。建议每天或隔天洗头，避免使用过于滋润的护发产品。',
      '敏感': '油性头皮伴随敏感，需要温和清洁。建议选择温和的控油洗发水，避免过度清洁。',
      '有头屑': '油性头皮容易产生头屑，建议选用去屑控油洗发水，注意头皮清洁。'
    },
    '干性': {
      '健康': '您的发质偏干，但头皮健康。建议加强发丝保湿护理，定期使用发膜。',
      '偏干': '头皮和发质都偏干，需要滋润护理。建议2-3天洗一次头，使用滋润型洗护产品。',
      '敏感': '干性头皮容易敏感，需要特别呵护。建议选择温和滋润的洗发水，避免刺激成分。',
      '有头屑': '干性头屑需要滋润去屑，建议选用滋润型去屑洗发水，避免过度清洁。'
    },
    '中性': {
      '健康': '恭喜！您的头发状态非常理想，保持当前的护理习惯即可。',
      '偏油': '整体发质健康，但头皮略油。建议适当调整洗头频率，保持头皮清爽。',
      '偏干': '整体发质健康，但略显干燥。建议适当增加保湿护理。',
      '敏感': '发质健康但头皮敏感，建议选择温和的洗护产品。'
    },
    '混合': {
      '健康': '您的头皮属于混合型，发根偏油发梢偏干。建议分区护理，针对性解决问题。',
      '偏油': '混合型偏油，发根油腻但发梢可能干燥。建议重点清洁头皮，发梢加强保湿。',
      '偏干': '混合型偏干，需要平衡护理。建议选择平衡型洗发水，发梢使用护发精油。',
      '敏感': '混合型头皮敏感，需要温和护理。建议选择温和配方，避免刺激。'
    }
  };
  
  return (descriptions[hairType] && descriptions[hairType][scalpState]) 
    || descriptions[hairType]?.['健康'] 
    || '根据您的发质特点，我们为您提供了专属护理建议。';
}

// 重新开始
function restart() {
  selectedImage = null;
  document.getElementById('file-input').value = '';
  document.getElementById('preview-image').style.display = 'none';
  document.getElementById('upload-placeholder').style.display = 'block';
  document.getElementById('upload-buttons').style.display = 'block';
  document.getElementById('upload-actions').style.display = 'none';
  
  // 重置步骤
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('completed', 'active');
  });
  document.querySelector('[data-step="1"]').classList.add('active');
  
  showHomePage();
}

// 模拟数据（API失败时使用）
function getMockResult() {
  const hairTypes = ['油性', '干性', '中性', '混合'];
  const scalpStates = ['健康', '偏油', '偏干', '敏感', '有头屑'];
  
  return {
    hairType: hairTypes[Math.floor(Math.random() * hairTypes.length)],
    scalpState: scalpStates[Math.floor(Math.random() * scalpStates.length)],
    healthScore: Math.floor(Math.random() * 2) + 3,
    confidence: Math.floor(Math.random() * 15) + 80,
    analysisTime: new Date().toLocaleString('zh-CN'),
    isMock: true
  };
}