// 头发分析工具 - H5版

// 百度AI配置
const BAIDU_CONFIG = {
  // 这里需要填写你的百度AI API Key
  // 由于前端暴露密钥不安全，建议使用代理服务器
  // 这里使用免费的公共代理或模拟数据
  useProxy: true,
  proxyUrl: 'https://api.allorigins.win/raw?url=' // 免费CORS代理
};

/**
 * 分析头发图片
 * @param {File} imageFile - 图片文件
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeHair(imageFile) {
  // 由于百度AI需要服务端调用（密钥不能暴露在前端），
  // 这里提供几种解决方案：
  
  // 方案1: 使用模拟数据（当前默认）
  // return getMockResult();
  
  // 方案2: 调用自建代理服务器（需要部署）
  // return analyzeWithProxy(imageFile);
  
  // 方案3: 使用第三方图像识别API（如果有免费的）
  // return analyzeWithThirdParty(imageFile);
  
  // 目前使用模拟数据 + 随机化，让每次结果略有不同
  return getSimulatedResult();
}

/**
 * 获取模拟分析结果（带一定随机性）
 */
function getSimulatedResult() {
  const hairTypes = ['油性', '干性', '中性', '混合'];
  const scalpStates = ['健康', '偏油', '偏干', '敏感', '有头屑'];
  
  // 根据权重随机选择，让"健康"和"中性"概率更高
  const hairWeights = [0.25, 0.25, 0.35, 0.15]; // 油性, 干性, 中性, 混合
  const scalpWeights = [0.4, 0.2, 0.2, 0.1, 0.1]; // 健康, 偏油, 偏干, 敏感, 有头屑
  
  const hairType = weightedRandom(hairTypes, hairWeights);
  const scalpState = weightedRandom(scalpStates, scalpWeights);
  
  // 根据发质和头皮状态计算健康评分
  let healthScore = 3;
  if (scalpState === '健康') healthScore += 1;
  if (scalpState === '敏感' || scalpState === '有头屑') healthScore -= 1;
  if (hairType === '中性') healthScore += 0.5;
  
  healthScore = Math.max(1, Math.min(5, Math.round(healthScore)));
  
  return {
    hairType,
    scalpState,
    healthScore,
    confidence: Math.floor(Math.random() * 15) + 80, // 80-95%
    analysisTime: new Date().toLocaleString('zh-CN'),
    isMock: true
  };
}

/**
 * 加权随机选择
 */
function weightedRandom(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

/**
 * 获取护理建议
 */
function getSuggestions(hairType, scalpState) {
  const suggestions = {};
  
  // 洗发建议
  suggestions.wash = getWashSuggestion(hairType, scalpState);
  
  // 护理建议
  suggestions.care = getCareSuggestion(hairType, scalpState);
  
  // 饮食建议
  suggestions.diet = getDietSuggestion(hairType);
  
  // 生活习惯
  suggestions.lifestyle = getLifestyleSuggestion(hairType, scalpState);
  
  return suggestions;
}

function getWashSuggestion(hairType, scalpState) {
  const suggestions = {
    '油性': {
      '健康': '建议每天或隔天洗头，使用温和的控油洗发水。水温控制在38-40度。',
      '偏油': '建议每天洗头，选择清爽控油型洗发水。重点清洁头皮，避免护发素接触头皮。',
      '敏感': '建议隔天洗头，选择温和无刺激的控油洗发水。避免含硫酸盐的强清洁成分。',
      '有头屑': '建议每天洗头，使用去屑控油洗发水。按摩头皮3-5分钟。'
    },
    '干性': {
      '健康': '建议2-3天洗一次头，使用滋润保湿型洗发水。可以搭配护发素或发膜。',
      '偏干': '建议2-3天洗一次头，选择深层滋润洗发水。洗后务必使用护发素。',
      '敏感': '建议2-3天洗一次头，使用温和滋润型洗发水。避免含酒精、香精的产品。',
      '有头屑': '建议2天洗一次头，使用滋润去屑洗发水。配合头皮精华滋润。'
    },
    '中性': {
      '健康': '建议2-3天洗一次头，使用温和平衡型洗发水即可。',
      '偏油': '建议隔天洗头，选择清爽平衡型洗发水。注意清洁头皮。',
      '偏干': '建议2-3天洗一次头，使用保湿平衡型洗发水。',
      '敏感': '建议2-3天洗一次头，使用温和无刺激洗发水。'
    },
    '混合': {
      '健康': '建议隔天洗头，使用平衡型洗发水。发根重点清洁，发梢注意保湿。',
      '偏油': '建议每天或隔天洗头，选择控油平衡洗发水。分区护理。',
      '偏干': '建议2-3天洗一次头，使用保湿平衡洗发水。',
      '敏感': '建议隔天洗头，使用温和平衡洗发水。'
    }
  };
  
  return suggestions[hairType]?.[scalpState] || suggestions[hairType]?.['健康'] || '建议2-3天洗一次头，使用温和洗发水。';
}

function getCareSuggestion(hairType, scalpState) {
  const suggestions = {
    '油性': {
      '健康': '定期使用头皮清洁产品，每周1次深层清洁。避免频繁用手触摸头发。',
      '偏油': '每周使用1-2次头皮磨砂膏。避免使用过于滋润的护发产品。',
      '敏感': '选择温和的头皮护理产品，避免含酒精成分。',
      '有头屑': '使用专门的去屑护理产品，定期去角质。'
    },
    '干性': {
      '健康': '每周使用1-2次发膜或深层护理。吹头发前使用隔热喷雾。',
      '偏干': '每周使用2-3次深层滋润发膜。发梢每天使用护发精油。',
      '敏感': '使用温和的护发产品，可以尝试天然植物油护理。',
      '有头屑': '滋润头皮的同时去屑，使用含保湿成分的去屑产品。'
    },
    '中性': {
      '健康': '保持常规护理即可，每周1次发膜护理。注意防晒。',
      '偏油': '重点护理头皮，使用清爽型护理产品。',
      '偏干': '加强发梢护理，使用滋润型护发素。',
      '敏感': '使用温和的护理产品，避免频繁染烫。'
    },
    '混合': {
      '健康': '分区护理是关键：头皮使用清爽产品，发梢使用滋润产品。',
      '偏油': '头皮使用控油产品，发梢使用滋润精油。',
      '偏干': '头皮适度清洁，发梢重点滋润。',
      '敏感': '选择温和的护理产品，头皮使用舒缓精华。'
    }
  };
  
  return suggestions[hairType]?.[scalpState] || suggestions[hairType]?.['健康'] || '定期使用护发素或发膜，保持头发滋润。';
}

function getDietSuggestion(hairType) {
  const suggestions = {
    '油性': '减少高糖、高脂肪食物摄入，多吃蔬菜水果。补充维生素B族，有助于调节皮脂分泌。',
    '干性': '增加优质脂肪摄入，如坚果、牛油果、深海鱼类。补充维生素A、E。',
    '中性': '保持均衡饮食，多摄入蛋白质、维生素和矿物质。',
    '混合': '均衡饮食，既要控制油脂摄入，又要保证足够的营养。'
  };
  
  return suggestions[hairType] || '保持均衡饮食，多吃富含蛋白质的食物。';
}

function getLifestyleSuggestion(hairType, scalpState) {
  const suggestions = {
    '油性': {
      '健康': '保持规律作息，避免熬夜。减少压力，枕套每周更换。',
      '偏油': '避免熬夜，保证充足睡眠。减少用手触摸头发和头皮。',
      '敏感': '避免过度紧张和压力。注意防晒，避免头皮晒伤。',
      '有头屑': '保持头皮清洁干燥，避免潮湿环境。减少压力。'
    },
    '干性': {
      '健康': '保持充足睡眠，有助于头发修复。避免频繁使用高温造型工具。',
      '偏干': '保证每天7-8小时睡眠。减少染烫频率。',
      '敏感': '避免过度清洁和摩擦。选择柔软的枕套。',
      '有头屑': '保持头皮适度滋润，避免过度干燥。'
    },
    '中性': {
      '健康': '保持规律作息和健康生活方式。适度运动促进血液循环。',
      '偏油': '注意清洁，避免油脂堆积。',
      '偏干': '适当增加室内湿度。',
      '敏感': '避免使用刺激性强的产品。'
    },
    '混合': {
      '健康': '保持均衡的生活方式，注意头发分区护理。',
      '偏油': '重点注意头皮清洁，避免油脂堆积。',
      '偏干': '平衡护理是关键。',
      '敏感': '温和护理，避免刺激。'
    }
  };
  
  return suggestions[hairType]?.[scalpState] || suggestions[hairType]?.['健康'] || '保持规律作息，避免熬夜。';
}

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeHair,
    getSuggestions
  };
}