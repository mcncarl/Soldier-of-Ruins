const fs = require('fs');
const path = require('path');

// Load games data
const gamesDataPath = path.join(__dirname, 'games-data.js');
let gamesContent = fs.readFileSync(gamesDataPath, 'utf8');

// Extract the games array portion
const startMarker = 'const gamesData = [';
const endMarker = '];';

const startIndex = gamesContent.indexOf(startMarker) + startMarker.length;
const endIndex = gamesContent.lastIndexOf(endMarker, gamesContent.lastIndexOf('if (typeof module !=='));

let gamesArrayString = gamesContent.substring(startIndex, endIndex + 1);

// Process translations
// This is a simplified translation function
// In a real app, you'd use a proper translation API
function translateToEnglish(text) {
  // Map of common Chinese words/phrases to their English translations
  const translations = {
    // Game categories
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
    
    // Game descriptions
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
    '效果': 'Effect',
    '设置': 'Settings',
    '选项': 'Options',
    '难度': 'Difficulty',
    '简单': 'Easy',
    '中等': 'Medium',
    '困难': 'Hard',
    'Challenge': 'Challenge',
    '成就': 'Achievement',
    '排行榜': 'Leaderboard',
    '得分': 'Score',
    '时间': 'Time',
    '生命': 'Life',
    '能量': 'Energy',
    '金币': 'Coin',
    '宝石': 'Gem',
    '资源': 'Resource',
    '升级': 'Upgrade',
    '进度': 'Progress',
    '等级': 'Level',
    '模式': 'Mode',
    '单人': 'Single Player',
    '多人': 'Multiplayer',
    '合作': 'Cooperative',
    '对战': 'Versus',
    '竞技': 'Competitive',
    '休闲': 'Casual',
    '沉浸式': 'Immersive',
    '交互': 'Interactive',
    '反应': 'Reaction',
    'Strategy': 'Strategy',
    '思考': 'Thinking',
    '计划': 'Planning',
    '建设': 'Building',
    '创造': 'Creation',
    '毁灭': 'Destruction',
    '生存': 'Survival',
    'Adventure': 'Adventure',
    'Exploration': 'Exploration',
    '发现': 'Discovery',
    '神秘': 'Mystery',
    '幻想': 'Fantasy',
    '科幻': 'Sci-Fi',
    '未来': 'Future',
    '历史': 'History',
    '现代': 'Modern',
    '古代': 'Ancient',
    '中文': 'Chinese',
    '英文': 'English',
  };

  // Replace Chinese terms with English ones
  let translatedText = text;
  for (const [chinese, english] of Object.entries(translations)) {
    translatedText = translatedText.replace(new RegExp(chinese, 'g'), english);
  }

  return translatedText;
}

// Translate the games array string
let translatedGamesArray = translateToEnglish(gamesArrayString);

// Rebuild the file content
const newContent = gamesContent.substring(0, startIndex) + 
                  translatedGamesArray + 
                  gamesContent.substring(endIndex + 1);

// Write the translated content back to the file
fs.writeFileSync(gamesDataPath, newContent, 'utf8');

console.log('Translation completed!'); 