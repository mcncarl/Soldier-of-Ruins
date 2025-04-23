const fs = require('fs');

// 替换词典 - 常见中文词汇和中英混合短语的替换
const replacementDict = {
  "使用Left/Right Arrow keys - Rotate the hexagon、Up/Down Arrow keys - Speed up falling、P - Pause game在这个3DEnvironment中Game": 
    "Use Left/Right Arrow keys to rotate the hexagon, Up/Down Arrow keys to speed up falling, P to pause the game in this 3D environment",
  
  "一款令人惊叹的HTML5/WebGL 3DRacingGame，在Future风格的高速赛道上Drive飞行器。完全使用开源技术构建，展示了浏览器中的高级3D渲染能力。": 
    "An amazing HTML5/WebGL 3D Racing Game on futuristic high-speed tracks. Built entirely with open source technology, showcasing advanced 3D rendering capabilities in browsers.",
  
  "FutureRacing，极速Experience": 
    "Future Racing, Ultimate Speed Experience",
  
  "H键 - Toggle help": 
    "H key - Toggle help",
  
  "Rotate the hexagon以match blocks of the same color，create combos并获得高分": 
    "Rotate the hexagon to match blocks of the same color, create combos and get high scores",
  
  "但full of challenge": 
    "but full of challenge",
  
  "A fascinating puzzle game based on hexagons，inspired by Russian blocks。": 
    "A fascinating puzzle game based on hexagons, inspired by Russian blocks.",
  
  "Easy to pick up，但full of challenge。": 
    "Easy to pick up, but full of challenge.",
  
  "使用Arrow keys/WASD - Drive, Space - Accelerate, H key - Toggle helpin this 3D game environment": 
    "Use Arrow keys/WASD to drive, Space to accelerate, H key to toggle help in this 3D game environment",
  
  "基于安卓Pattern Unlock的PuzzleGame, 需要猜测正确的连接Mode. 包含不同Difficulty级别, 既有趣又能锻炼思维能力.": 
    "A puzzle game based on Android's Pattern Unlock, requiring guessing the correct connection mode. Includes different difficulty levels, both fun and brain training.",
  
  "Unlock密码, Challenge大脑": 
    "Unlock patterns, Challenge your brain",
  
  "Mouse drag - 连接点": 
    "Mouse drag - Connect dots",
  
  "Click - 选择Options": 
    "Click - Select options",
  
  "使用Mouse drag - 连接点, Click - 选择Options在这个2DEnvironment中Game": 
    "Use Mouse drag to connect dots, Click to select options in this 2D game environment",
  
  "粒子Click器": 
    "Particle Clicker",
  
  "由CERN制作的科学ClickGame, Simulation高能物理研究过程. Click积累数据, 雇佣研究人员, Upgrade设备, Discovery希格斯玻色子等基本粒子.": 
    "Scientific click game made by CERN, simulating high-energy physics research. Click to accumulate data, hire researchers, upgrade equipment, and discover fundamental particles like the Higgs boson.",
  
  "Hextris旋转": 
    "Hextris",
  
  "节奏大师": 
    "Rhythm Master",
  
  "，": ", ",
  "。": ". ",
  "、": ", ",
  "在这个3DEnvironment中Game": "in this 3D game environment",
  "在这个2DEnvironment中Game": "in this 2D game environment"
};

// 读取games-data.js
fs.readFile('./games-data.js', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // 应用替换
  let cleanedData = data;
  for (const [mixedText, englishText] of Object.entries(replacementDict)) {
    cleanedData = cleanedData.replace(new RegExp(mixedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), englishText);
  }

  // 检查是否还有中文字符
  const chinesePattern = /[\u4e00-\u9fa5]+/g;
  const remainingChinese = cleanedData.match(chinesePattern);
  
  if (remainingChinese) {
    console.log('Warning: Still found Chinese characters in the file:');
    const uniqueChinese = [...new Set(remainingChinese)];
    uniqueChinese.forEach(text => console.log(`- "${text}"`));
  }

  // 写入清理后的文件
  fs.writeFile('./games-data.js', cleanedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully cleaned mixed language in games-data.js');
  });
}); 