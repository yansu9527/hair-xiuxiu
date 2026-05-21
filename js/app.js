// 头发秀秀 - 高端版主程序

// 页面切换
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

function showHomePage() {
  showPage('home-page');
}

function showUploadPage() {
  showPage('upload-page');
}

// 上传相关
let selectedImage = null;

function triggerUpload() {
  if (!selectedImage) {
    takePhoto();
  }
}

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
    const previewImage = document.getElementById('preview-image');
    const placeholder = document.getElementById('upload-placeholder');
    const container = document.getElementById('upload-container');
    
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
    placeholder.style.display = 'none';
    container.classList.add('has-image');
    
    document.getElementById('upload-buttons').style.display = 'none';
    document.getElementById('upload-actions').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  selectedImage = null;
  document.getElementById('file-input').value = '';
  
  const previewImage = document.getElementById('preview-image');
  const placeholder = document.getElementById('upload-placeholder');
  const container = document.getElementById('upload-container');
  
  previewImage.style.display = 'none';
  placeholder.style.display = 'block';
  container.classList.remove('has-image');
  
  document.getElementById('upload-buttons').style.display = 'block';
  document.getElementById('upload-actions').style.display = 'none';
}

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
  
  // 执行分析
  try {
    const result = await analyzeHair(selectedImage);
    showResult(result);
  } catch (error) {
    console.error('分析失败:', error);
    const mockResult = getSimulatedResult();
    showResult(mockResult);
  }
}

// 模拟分析进度
async function simulateAnalysis() {
  const steps = [
    { progress: 0, end: 35, duration: 1200, title: '正在识别图像特征', desc: 'AI正在提取头发影像特征' },
    { progress: 35, end: 75, duration: 1500, title: '正在分析发质状况', desc: '深度学习模型分析中' },
    { progress: 75, end: 100, duration: 800, title: '正在生成护理方案', desc: '匹配最佳护理建议' }
  ];

  updateStep(1, false, true);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    
    document.getElementById('status-title').textContent = step.title;
    document.getElementById('status-desc').textContent = step.desc;
    
    await updateProgress(step.progress, step.end, step.duration);
    
    if (i < steps.length - 1) {
      updateStep(i + 1, true, false);
      updateStep(i + 2, false, true);
    }
  }
  
  updateStep(3, true, false);
}

function updateProgress(start, end, duration) {
  return new Promise(resolve => {
    const startTime = Date.now();
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(start + (elapsed / duration) * (end - start), end);
      
      document.getElementById('progress-fill').style.width = progress + '%';
      document.getElementById('progress-percent').textContent = Math.floor(progress) + '%';
      
      if (progress < end) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    };
    update();
  });
}

function updateStep(stepNum, completed, active) {
  const step = document.querySelector(`[data-step="${stepNum}"]`);
  if (!step) return;
  
  step.classList.remove('completed', 'active');
  if (completed) step.classList.add('completed');
  if (active) step.classList.add('active');
}

// 显示结果
function showResult(result) {
  showPage('result-page');
  
  // 日期
  document.getElementById('result-date').textContent = result.analysisTime;
  
  // 置信度
  document.getElementById('confidence-badge').textContent = '置信度 ' + result.confidence + '%';
  
  // 分数动画
  animateScore(result.healthScore);
  
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
  document.getElementById('score-evaluation').textContent = getHealthEvaluate(result.healthScore);
  
  // 发质和头皮
  const hairTypeEl = document.getElementById('hair-type');
  hairTypeEl.textContent = result.hairType;
  hairTypeEl.className = 'result-tag ' + getHairTypeClass(result.hairType);
  
  const scalpStateEl = document.getElementById('scalp-state');
  scalpStateEl.textContent = result.scalpState;
  scalpStateEl.className = 'result-tag ' + getScalpStateClass(result.scalpState);
  
  // 描述
  document.getElementById('result-description').textContent = 
    getTypeDescription(result.hairType, result.scalpState);
  
  // 建议
  const suggestions = getSuggestions(result.hairType, result.scalpState);
  
  if (suggestions.wash) {
    document.getElementById('suggestion-wash').textContent = suggestions.wash;
  }
  if (suggestions.care) {
    document.getElementById('suggestion-care').textContent = suggestions.care;
  }
  if (suggestions.diet) {
    document.getElementById('suggestion-diet').textContent = suggestions.diet;
  }
  if (suggestions.lifestyle) {
    document.getElementById('suggestion-lifestyle').textContent = suggestions.lifestyle;
  }
}

// 分数动画
function animateScore(score) {
  document.getElementById('score-value').textContent = score;
  
  const circle = document.getElementById('score-progress');
  const circumference = 440;
  const offset = circumference - (score / 5) * circumference;
  
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);
}

function getHealthEvaluate(score) {
  const evaluates = {
    5: '非常健康！您的头发状态很棒，继续保持',
    4: '比较健康，注意日常护理即可',
    3: '状态一般，建议针对性护理',
    2: '需要关注，建议改善护理习惯',
    1: '需要重视，建议咨询专业医生'
  };
  return evaluates[score] || '请根据建议进行护理';
}

function getHairTypeClass(type) {
  const classes = {
    '油性': 'tag-oily',
    '干性': 'tag-dry',
    '中性': 'tag-normal',
    '混合': 'tag-mixed'
  };
  return classes[type] || 'tag-normal';
}

function getScalpStateClass(state) {
  const classes = {
    '健康': 'tag-healthy',
    '偏油': 'tag-warning',
    '偏干': 'tag-dry',
    '敏感': 'tag-danger',
    '有头屑': 'tag-warning'
  };
  return classes[state] || 'tag-healthy';
}

function getTypeDescription(hairType, scalpState) {
  const descriptions = {
    '油性': {
      '健康': '您的头皮油脂分泌较旺盛，但头皮整体健康。建议选择控油型洗发水，保持头皮清爽，避免油脂堆积导致毛孔堵塞。',
      '偏油': '头皮油脂分泌过多，可能导致头发扁塌、缺乏蓬松感。建议每天或隔天洗头，避免使用过于滋润的护发产品，重点清洁头皮。',
      '敏感': '油性头皮伴随敏感，需要温和清洁。建议选择温和的控油洗发水，避免含硫酸盐的强清洁成分，防止过度清洁导致屏障受损。',
      '有头屑': '油性头皮容易产生头屑，建议选用去屑控油洗发水，注意头皮清洁，避免抓挠，保持头皮清爽干燥。'
    },
    '干性': {
      '健康': '您的发质偏干，但头皮健康。建议加强发丝保湿护理，定期使用发膜，避免高温造型，保持头发水分平衡。',
      '偏干': '头皮和发质都偏干，需要滋润护理。建议2-3天洗一次头，使用滋润型洗护产品，洗后务必使用护发素，发梢可涂抹护发精油。',
      '敏感': '干性头皮容易敏感，需要特别呵护。建议选择温和滋润的洗发水，避免刺激成分，可以尝试天然植物油进行深度护理。',
      '有头屑': '干性头屑需要滋润去屑，建议选用滋润型去屑洗发水，避免过度清洁，配合头皮精华滋润，保持头皮水油平衡。'
    },
    '中性': {
      '健康': '恭喜！您的头发状态非常理想，头皮和发质都处于健康平衡状态。保持当前的护理习惯即可，注意定期护理维持良好状态。',
      '偏油': '整体发质健康，但头皮略油。建议适当调整洗头频率，保持头皮清爽，避免油脂堆积影响发质。',
      '偏干': '整体发质健康，但略显干燥。建议适当增加保湿护理，使用滋润型护发素，定期做发膜护理。',
      '敏感': '发质健康但头皮敏感，建议选择温和的洗护产品，避免含刺激性成分，注意防晒和外界刺激。'
    },
    '混合': {
      '健康': '您的头皮属于混合型，发根偏油发梢偏干。建议分区护理，针对性解决问题，头皮控油的同时发梢加强保湿。',
      '偏油': '混合型偏油，发根油腻但发梢可能干燥。建议重点清洁头皮，发梢加强保湿，使用清爽型洗发水配合滋润护发素。',
      '偏干': '混合型偏干，需要平衡护理。建议选择平衡型洗发水，发梢使用护发精油，避免过度清洁导致头皮干燥。',
      '敏感': '混合型头皮敏感，需要温和护理。建议选择温和配方，避免刺激，分区护理时注意产品选择。'
    }
  };
  
  return (descriptions[hairType] && descriptions[hairType][scalpState]) 
    || descriptions[hairType]?.['健康'] 
    || '根据您的发质特点，我们为您提供了专属护理建议，帮助您改善头发健康状况。';
}

// 重新开始
function restart() {
  selectedImage = null;
  document.getElementById('file-input').value = '';
  
  const previewImage = document.getElementById('preview-image');
  const placeholder = document.getElementById('upload-placeholder');
  const container = document.getElementById('upload-container');
  
  previewImage.style.display = 'none';
  placeholder.style.display = 'block';
  container.classList.remove('has-image');
  
  document.getElementById('upload-buttons').style.display = 'block';
  document.getElementById('upload-actions').style.display = 'none';
  
  // 重置进度
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('progress-percent').textContent = '0%';
  document.getElementById('score-progress').style.strokeDashoffset = 440;
  
  // 重置步骤
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('completed', 'active');
  });
  document.querySelector('[data-step="1"]').classList.add('active');
  
  showHomePage();
}

// 分享结果
function shareResult() {
  if (navigator.share) {
    navigator.share({
      title: '头发秀秀 - 我的发质分析报告',
      text: '我刚用头发秀秀做了AI发质分析，快来看看！',
      url: window.location.href
    });
  } else {
    // 复制链接
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('链接已复制，可以分享给朋友了！');
    });
  }
}
