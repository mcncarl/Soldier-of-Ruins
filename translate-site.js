const fs = require('fs');
const path = require('path');

// 翻译映射，添加中文到英文的映射
const translations = {
  // 通用网站文本
  'Game Recommendation Zone': 'Game Recommendation Zone',
  'Game Not Found': 'Game Not Found',
  'The specified game ID': 'The specified game ID',
  'does not exist or has been removed. Returning to homepage.': 'does not exist or has been removed. Returning to homepage.',
  'OK': 'OK',
  '3D Premium Games': '3D Premium Games',
  
  // Game 1-10
  'Game 1': 'Game 1',
  'Game 2': 'Game 2',
  'Game 3': 'Game 3',
  'Game 4': 'Game 4',
  'Game 5': 'Game 5',
  'Game 6': 'Game 6',
  'Game 7': 'Game 7',
  'Game 8': 'Game 8',
  'Game 9': 'Game 9',
  'Game 10': 'Game 10',
  
  // Game类别和通用Game术语
  'Action': 'Action',
  'Adventure': 'Adventure',
  'Shooter': 'Shooter',
  'Racing': 'Racing',
  'Exploration': 'Exploration',
  'Sandbox': 'Sandbox',
  'Arcade': 'Arcade',
  'Puzzle': 'Puzzle',
  'Sports': 'Sports',
  'Idle': 'Idle',
  'Strategy': 'Strategy',
  'Simulation': 'Simulation',
  'Card': 'Card',
  'Board': 'Board',
  'Word': 'Word',
  
  // Game相关词汇
  'Game': 'Game',
  'Player': 'Player',
  'Character': 'Character',
  'Enemy': 'Enemy',
  'World': 'World',
  'Level': 'Level',
  'Skill': 'Skill',
  'Challenge': 'Challenge',
  'Item': 'Item',
  'Weapon': 'Weapon',
  'Magic': 'Magic',
  'Combat': 'Combat',
  'Adventure': 'Adventure',
  'Puzzle': 'Puzzle',
  'Collect': 'Collect',
  'Unlock': 'Unlock',
  'Experience': 'Experience',
  'Control': 'Control',
  'Move': 'Move',
  'Jump': 'Jump',
  'Attack': 'Attack',
  'Defend': 'Defend',
  'Rhythm Master': 'Rhythm Master',
  'Block': 'Block',
  'Build': 'Build',
  'Pixel': 'Pixel',
  'Virtual': 'Virtual',
  'Reality': 'Reality',
  'Story': 'Story',
  'Scene': 'Scene',
  'Environment': 'Environment',
  'Mission': 'Mission',
  'Goal': 'Goal',
  'Visual': 'Visual',
  'Sound Effect': 'Sound Effect',
  'Music': 'Music',
  'Graphics': 'Graphics',
  
  // Game描述中的混合中英文短语
  'The art of hexagonal puzzles': 'The art of hexagonal puzzles',
  'Left/Right Arrow keys': 'Left/Right Arrow keys',
  'Up/Down Arrow keys': 'Up/Down Arrow keys',
  'A fascinating puzzle game based on hexagons': 'A fascinating puzzle game based on hexagons',
  'inspired by Russian blocks': 'inspired by Russian blocks',
  'Rotate the hexagon': 'Rotate the hexagon',
  'match blocks of the same color': 'match blocks of the same color',
  'create combos': 'create combos',
  'Easy to pick up': 'Easy to pick up',
  'full of challenge': 'full of challenge',
  'This immersive 3D WebGL experience': 'This immersive 3D WebGL experience',
  'showcases the capabilities of modern browsers': 'showcases the capabilities of modern browsers',
  'playable directly in your browser without any plugins': 'playable directly in your browser without any plugins',
  
  // check-games.js中的内容
  'File Size': 'File Size',
  'Total Games': 'Total Games',
  'Found games of other types': 'Found games of other types',
  'Game Type Statistics': 'Game Type Statistics',
  '2D Games Count': '2D Games Count',
  '3D Games Count': '3D Games Count',
  'Other Game Types Count': 'Other Game Types Count',
  'Warning: Games marked for deletion still exist in the data': 'Warning: Games marked for deletion still exist in the data',
  'IDs of remaining deleted games': 'IDs of remaining deleted games',
  'All games marked for deletion have been removed from the data': 'All games marked for deletion have been removed from the data',
  'Unable to get game data, please check the games-data.js file format': 'Unable to get game data, please check the games-data.js file format',
  
  // 自动翻译脚本中的消息
  'Processing file:': 'Processing file:',
  'File translated:': 'File translated:',
  'File doesn't need translation:': 'File doesn\'t need translation:',
  'Starting to translate website content...': 'Starting to translate website content...',
  'Found': 'Found',
  'files to process': 'files to process',
  'Translation complete!': 'Translation complete!',
  'Files translated:': 'Files translated:',
  'Files not needing translation:': 'Files not needing translation:',
  'Error during translation:': 'Error during translation:',
  'Special processing': 'Special processing',
  'file processing completed': 'file processing completed',
  'Processing result:': 'Processing result:',
  'success': 'success',
  'failure': 'failure',
  'Processing': 'Processing',
  'directory files': 'directory files',
  'in the directory': 'in the directory',
  '个file processing completed': 'files processed',
  '跳过已Processing的文件:': 'Skipping already processed file:',
  
  // 翻译中文注释
  'Responsive iframe styles': 'Responsive iframe styles',
  'Slightly higher ratio on mobile devices': 'Slightly higher ratio on mobile devices',
  'First filter all 3D games, then sort by rating and take the top 6': 'First filter all 3D games, then sort by rating and take the top 6'
};

// 已翻译的混合文本映射，用于二次替换
const mixedTextMappings = {
  'Total Games': 'Total Games',
  'Found games of other types': 'Found games of other types',
  'Game Type Statistics': 'Game Type Statistics',
  '2D Games Count': '2D Games Count',
  '3D Games Count': '3D Games Count',
  'Other Game Types Count': 'Other Game Types Count',
  'Warning: Games marked for deletion still exist in the data': 'Warning: Games marked for deletion still exist in the data',
  'IDs of remaining deleted games': 'IDs of remaining deleted games',
  'All games marked for deletion have been removed from the data': 'All games marked for deletion have been removed from the data',
  'Unable to get game data, please check the games-data.js file format': 'Unable to get game data, please check the games-data.js file format',
  'Check File Size': 'Check File Size', 
  'Try to load Game data': 'Try to load Game data',
  'Slightly higher ratio on mobile devices': 'Slightly higher ratio on mobile devices',
  'First filter all 3D games, then sort by rating and take the top 6': 'First filter all 3D games, then sort by rating and take the top 6'
};

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory() && file !== 'node_modules' && file !== '.git') {
      fileList = getAllFiles(filePath, fileList);
    } else if (stats.isFile() && 
              (path.extname(file) === '.html' || 
               path.extname(file) === '.js' || 
               path.extname(file) === '.json')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Special processing games-data.js 文件
function processGamesDataFile() {
  const filePath = path.join('.', 'games-data.js');
  console.log(`Special processing games-data.js file...`);
  
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 使用翻译映射替换内容
    Object.keys(translations).forEach(key => {
      const value = translations[key];
      // 使用全局正则表达式进行替换
      const regex = new RegExp(key, 'g');
      content = content.replace(regex, value);
    });
    
    // 二次替换，Processing混合文本
    Object.keys(mixedTextMappings).forEach(key => {
      const value = mixedTextMappings[key];
      // 使用全局正则表达式进行替换
      const regex = new RegExp(key, 'g');
      content = content.replace(regex, value);
    });
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`games-data.js file processing completed`);
    
    return true;
  } catch (error) {
    console.error(`Error processing games-data.js file:`, error);
    return false;
  }
}

// Special processingGamein the directoryHTML文件
function processGamesDirectory() {
  const gamesDir = path.join('.', 'games');
  console.log(`Processing games directory files...`);
  
  try {
    const files = fs.readdirSync(gamesDir);
    let processedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(gamesDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && path.extname(file) === '.html') {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // 使用翻译映射替换内容
        Object.keys(translations).forEach(key => {
          const value = translations[key];
          // 使用全局正则表达式进行替换
          const regex = new RegExp(key, 'g');
          content = content.replace(regex, value);
        });
        
        // 二次替换，Processing混合文本
        Object.keys(mixedTextMappings).forEach(key => {
          const value = mixedTextMappings[key];
          // 使用全局正则表达式进行替换
          const regex = new RegExp(key, 'g');
          content = content.replace(regex, value);
        });
        
        // 如果内容有变化，写回文件
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          processedCount++;
        }
      }
    });
    
    console.log(`${processedCount} files processed in the games directory`);
    return true;
  } catch (error) {
    console.error(`Error processing games directory:`, error);
    return false;
  }
}

// 翻译文件内容
function translateFileContent(filePath) {
  console.log(`Processing file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 使用翻译映射替换内容
  Object.keys(translations).forEach(key => {
    const value = translations[key];
    // 使用全局正则表达式进行替换
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  });
  
  // 二次替换，Processing混合文本
  Object.keys(mixedTextMappings).forEach(key => {
    const value = mixedTextMappings[key];
    // 使用全局正则表达式进行替换
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  });
  
  // 如果内容有变化，写回文件
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File translated: ${filePath}`);
    return true;
  } else {
    console.log(`File doesn't need translation: ${filePath}`);
    return false;
  }
}

// 主函数
function translateAllFiles() {
  console.log('Starting to translate website content...');
  
  try {
    // Special processingGame数据文件
    const gamesDataResult = processGamesDataFile();
    console.log(`games-data.js Processing result: ${gamesDataResult ? 'success' : 'failure'}`);
    
    // Special processingGame目录
    const gamesDirectoryResult = processGamesDirectory();
    console.log(`games directory Processing result: ${gamesDirectoryResult ? 'success' : 'failure'}`);
    
    // 获取所有需要Processing的文件
    const allFiles = getAllFiles('.');
    console.log(`Found ${allFiles.length} files to process`);
    
    // 统计变量
    let translatedFiles = 0;
    let unchangedFiles = 0;
    
    // Processing每个文件
    allFiles.forEach(file => {
      // 跳过已经Processing过的文件
      if (file.includes('games-data.js') || file.includes('games/')) {
        console.log(`Skipping already processed file: ${file}`);
        return;
      }
      
      const result = translateFileContent(file);
      if (result) {
        translatedFiles++;
      } else {
        unchangedFiles++;
      }
    });
    
    console.log('\nTranslation complete!');
    console.log(`- Files translated: ${translatedFiles}`);
    console.log(`- Files not needing translation: ${unchangedFiles}`);
    
  } catch (error) {
    console.error('Error during translation:', error);
  }
}

// 执行翻译
translateAllFiles(); 