const fs = require('fs');

// 读取games-data.js获取原始数据结构
fs.readFile('./games-data.js', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // 从文件内容中提取gamesData数组
    const match = data.match(/const\s+gamesData\s*=\s*(\[[\s\S]*?\]);/);
    if (!match || !match[1]) {
      throw new Error('Could not find gamesData array in the file');
    }
    
    // 解析gamesData数组
    let gamesData;
    try {
      // 尝试直接解析JSON
      gamesData = JSON.parse(match[1]);
    } catch (parseError) {
      console.error('Could not parse gamesData as JSON, trying alternative method');
      
      // 替代方法：创建一个临时文件并执行它
      const tempFile = './temp-games-data.js';
      fs.writeFileSync(tempFile, `
        const gamesData = ${match[1]};
        console.log(JSON.stringify(gamesData));
      `, 'utf8');
      
      // 执行临时文件并获取输出
      const { execSync } = require('child_process');
      const output = execSync(`node ${tempFile}`).toString();
      
      // 解析输出
      gamesData = JSON.parse(output);
      
      // 删除临时文件
      fs.unlinkSync(tempFile);
    }
    
    console.log(`Loaded ${gamesData.length} games from the data file`);
    
    // 修复每个游戏的描述和控制说明
    gamesData.forEach(game => {
      // 修复游戏控件说明，确保全部是英文
      if (game.controls) {
        game.controls = game.controls.map(control => {
          // 替换中文控制说明为英文
          return fixControlText(control);
        });
      }
      
      // 修复游戏描述
      if (game.description) {
        game.description = fixChineseText(game.description);
      }
      
      // 修复tagline
      if (game.tagline) {
        game.tagline = fixChineseText(game.tagline);
      }
      
      // 修复长描述
      if (game.longDescription) {
        game.longDescription = fixChineseText(game.longDescription);
      }
      
      // 修复游戏玩法描述
      if (game.gameplayDescription) {
        game.gameplayDescription = fixChineseText(game.gameplayDescription);
      }
      
      // 修复features数组
      if (game.features) {
        game.features = game.features.map(feature => fixChineseText(feature));
      }
      
      // 修复tips数组
      if (game.tips) {
        game.tips = game.tips.map(tip => fixChineseText(tip));
      }
      
      // 确保languages包含English
      if (game.languages) {
        if (!game.languages.includes('English')) {
          game.languages = 'English, ' + game.languages;
        }
      } else {
        game.languages = 'English';
      }
    });
    
    // 提取helper函数
    const helperFunctionMatch = data.match(/function\s+getCategoryColor[\s\S]*?function\s+getGamesByType[\s\S]*?\}/);
    let helperFunctions = '';
    
    if (helperFunctionMatch) {
      helperFunctions = helperFunctionMatch[0];
    } else {
      // 使用默认helper函数
      helperFunctions = `
// Helper functions
function getCategoryColor(category) {
  const colorMap = {
    'arcade': 'red',
    'puzzle': 'yellow',
    'strategy': 'green',
    'action': 'blue',
    'racing': 'purple',
    'adventure': 'indigo',
    'simulation': 'pink',
    'educational': 'cyan'
  };
  return colorMap[category] || 'gray';
}

function getGameById(gameId) {
  return gamesData.find(game => game.id === gameId);
}

function getGamesByType(type) {
  return gamesData.filter(game => game.type === type);
}`;
    }
    
    // 创建新的JavaScript文件内容
    const newFileContent = `// Game Database - Centralized data storage for all games
// English version generated on ${new Date().toISOString().split('T')[0]}

const gamesData = ${JSON.stringify(gamesData, null, 2)};

${helperFunctions}
`;
    
    // 写入新文件
    fs.writeFile('./games-data-english.js', newFileContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Successfully created English version of games data at games-data-english.js');
    });
    
  } catch (e) {
    console.error('Error processing the data:', e);
  }
});

// 修复中英文混合的控制说明
function fixControlText(control) {
  if (!control) return '';
  
  // 各种控制说明的修复映射
  const controlFixes = {
    // 鼠标相关
    "Mouse drag - 连接点": "Mouse drag - Connect dots",
    "Click - 选择Options": "Click - Select options",
    "Mouse click - Collect数据": "Mouse click - Collect data",
    "interface按钮 - Upgrade研究": "Interface buttons - Upgrade research",
    "滚轮 - 缩放视图": "Mouse wheel - Zoom view",
    
    // 键盘相关
    "R键 - 重新start": "R key - Restart",
    "H键 - Toggle help": "H key - Toggle help",
    "使用Arrow keys/WASD - Drive, Space - Accelerate": "Arrow keys/WASD - Drive, Space - Accelerate",
    "方向键 - Move": "Arrow keys - Move",
    "空格键 - Jump": "Space - Jump",
    "键重置位置": "Key to reset position",
    
    // 混合控制
    "使用Left/Right Arrow keys to rotate the hexagon, Up/Down Arrow keys to speed up falling, P to pause the game": "Left/Right Arrow keys - Rotate hexagon, Up/Down Arrow keys - Speed up falling, P - Pause game"
  };
  
  // 检查是否有精确匹配
  if (controlFixes[control]) {
    return controlFixes[control];
  }
  
  // 没有精确匹配，尝试部分替换
  let result = control;
  for (const [chinese, english] of Object.entries(controlFixes)) {
    result = result.replace(chinese, english);
  }
  
  // 替换中英文混合的通用模式
  result = result.replace(/使用(.*?)in this (2|3)D game environment/, "$1");
  result = result.replace(/键/g, " key");
  
  // 检查是否包含中文字符，如果包含，尝试更通用的处理
  if (/[\u4e00-\u9fa5]/.test(result)) {
    // 提取英文部分
    const englishParts = result.match(/[a-zA-Z0-9\/\-\s]+/g) || [];
    if (englishParts.length > 0) {
      // 如果有提取到英文部分，使用它们
      return englishParts.join(' ').trim();
    } else {
      // 如果没有英文部分，返回通用控制说明
      return "Controls - Use keyboard or mouse";
    }
  }
  
  return result;
}

// 修复中文或中英文混合的文本
function fixChineseText(text) {
  if (!text) return '';
  
  // 如果文本包含大量中文，替换为通用英文描述
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const totalLength = text.length;
  const chineseRatio = chineseCharCount / totalLength;
  
  // 如果中文比例超过20%，用通用描述替换
  if (chineseRatio > 0.2) {
    if (text.includes("puzzle") || text.includes("益智")) {
      return "A challenging puzzle game that tests your logic and problem-solving skills. Match patterns, solve puzzles, and progress through increasingly difficult levels.";
    } else if (text.includes("racing") || text.includes("赛车") || text.includes("竞速")) {
      return "An exciting racing game with realistic physics and controls. Choose from various vehicles and tracks to test your driving skills against opponents or the clock.";
    } else if (text.includes("rhythm") || text.includes("节奏")) {
      return "A dynamic rhythm game where you follow on-screen prompts to tap, hold, or slide in sync with the music. Features multiple songs and difficulty levels to test your sense of rhythm.";
    } else if (text.includes("memory") || text.includes("记忆")) {
      return "A classic memory matching game that tests your recall ability. Flip cards to find matching pairs while trying to complete the game in as few moves as possible.";
    } else if (text.includes("strategy") || text.includes("策略")) {
      return "A strategic game that challenges your planning and decision-making skills. Develop tactics, manage resources, and outthink your opponents to achieve victory.";
    } else if (text.includes("arcade") || text.includes("街机")) {
      return "A fun arcade-style game with simple controls but addictive gameplay. Earn high scores, unlock achievements, and challenge yourself to beat your personal best.";
    } else if (text.includes("simulation") || text.includes("模拟")) {
      return "A realistic simulation game that recreates real-world activities or systems. Experience different scenarios and learn how various factors interact in a controlled environment.";
    } else if (text.includes("action") || text.includes("动作")) {
      return "An action-packed game requiring quick reflexes and coordination. Defeat enemies, overcome obstacles, and complete missions in this fast-paced adventure.";
    } else if (text.includes("adventure") || text.includes("冒险")) {
      return "An immersive adventure game where you explore diverse environments, solve puzzles, and discover a rich storyline. Uncover secrets and treasures as you progress through the game.";
    } else if (text.includes("educational") || text.includes("教育")) {
      return "An educational game that makes learning fun and interactive. Develop new skills and knowledge through engaging gameplay and challenges.";
    } else {
      return "An engaging HTML5 game with intuitive controls and challenging gameplay. Test your skills, earn achievements, and enjoy hours of entertainment directly in your browser.";
    }
  }
  
  // 替换常见混合文本模式
  let result = text;
  
  // 替换中英文标点符号
  result = result
    .replace(/，/g, ", ")
    .replace(/。/g, ". ")
    .replace(/、/g, ", ")
    .replace(/：/g, ": ")
    .replace(/；/g, "; ")
    .replace(/！/g, "! ")
    .replace(/？/g, "? ");
  
  // 替换混合词汇
  result = result
    .replace(/数字合并/g, "number merging")
    .replace(/头脑风暴/g, "brainstorming")
    .replace(/physics学习/g, "physics learning")
    .replace(/寓教于乐/g, "educational and entertaining")
    .replace(/以match/g, "to match")
    .replace(/并获得高分/g, "and get high scores")
    .replace(/通过合并相同的数字/g, "by merging the same numbers")
    .replace(/Creation更大的数值/g, "to create larger values")
    .replace(/Goal是达到2048/g, "The goal is to reach 2048")
    .replace(/但你能Challenge更高的数字吗/g, "but can you challenge for higher numbers")
    .replace(/Strategy和forward瞻性思维是制胜关键/g, "Strategy and forward thinking are key to success")
    .replace(/Collect数据/g, "Collect data")
    .replace(/Upgrade研究/g, "Upgrade research");
  
  // 如果文本中仍然包含中文字符，尝试提取英文部分
  if (/[\u4e00-\u9fa5]/.test(result)) {
    // 提取英文部分
    const englishParts = result.match(/[a-zA-Z0-9\/\-\s.,;:'"!?()]+/g) || [];
    if (englishParts.length > 0 && englishParts.join('').length > result.length * 0.5) {
      // 如果有提取到足够的英文部分，使用它们
      return englishParts.join(' ').replace(/\s+/g, ' ').trim();
    } else {
      // 否则返回一个通用描述
      return "An engaging HTML5 game with intuitive controls. Experience fun gameplay directly in your browser without any plugins.";
    }
  }
  
  // 清理文本
  result = result
    .replace(/\s+/g, " ")
    .trim();
  
  return result;
} 