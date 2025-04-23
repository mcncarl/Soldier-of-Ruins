const fs = require('fs');

// 基本短语翻译字典
const translationDict = {
  // 通用游戏术语
  "游戏": "game",
  "关卡": "level",
  "得分": "score",
  "高分": "high score",
  "设置": "settings",
  "开始": "start",
  "暂停": "pause",
  "继续": "continue",
  "重置": "reset",
  "结束": "end",
  "菜单": "menu",
  "选项": "options",
  "难度": "difficulty",
  "简单": "easy",
  "中等": "medium",
  "困难": "hard",
  "专家": "expert",
  "挑战": "challenge",
  "成就": "achievement",
  "排行榜": "leaderboard",
  "时间": "time",
  "生命": "life",
  "能量": "energy",
  "金币": "coin",
  "宝石": "gem",
  "资源": "resource",
  "升级": "upgrade",
  "进度": "progress",
  "等级": "level",
  "模式": "mode",
  
  // 游戏类型
  "益智": "puzzle",
  "动作": "action",
  "冒险": "adventure",
  "策略": "strategy",
  "角色扮演": "RPG",
  "射击": "shooter",
  "平台": "platform",
  "竞速": "racing",
  "体育": "sports",
  "模拟": "simulation",
  
  // 控制
  "键盘": "keyboard",
  "鼠标": "mouse",
  "触摸": "touch",
  "方向键": "arrow keys",
  "空格键": "space bar",
  "点击": "click",
  "双击": "double-click",
  "拖动": "drag",
  "滑动": "swipe",
  "按住": "hold",
  "释放": "release",
  
  // 方向
  "上": "up",
  "下": "down",
  "左": "left",
  "右": "right",
  "前": "forward",
  "后": "backward",
  
  // 游戏元素
  "角色": "character",
  "敌人": "enemy",
  "障碍": "obstacle",
  "道具": "item",
  "武器": "weapon",
  "技能": "skill",
  "能力": "ability",
  "特效": "effect",
  "奖励": "reward",
  "惩罚": "penalty",
  "场景": "scene",
  "背景": "background",
  "音乐": "music",
  "音效": "sound effect",
  "图形": "graphics",
  "界面": "interface",
  
  // 游戏机制
  "收集": "collect",
  "躲避": "avoid",
  "跳跃": "jump",
  "射击": "shoot",
  "匹配": "match",
  "消除": "eliminate",
  "解锁": "unlock",
  "建造": "build",
  "探索": "explore",
  "战斗": "combat",
  "赢得": "win",
  "失败": "lose",
  "完成": "complete",
  
  // 特定游戏类型
  "纸牌": "card",
  "棋牌": "board game",
  "泡泡": "bubble",
  "方块": "block",
  "拼图": "puzzle",
  "迷宫": "maze",
  "平台跳跃": "platform jumping",
  "无尽跑酷": "endless runner",
  "塔防": "tower defense",
  "赛车": "racing",
  "体育": "sports",
  
  // 描述性词语
  "精美": "beautiful",
  "华丽": "gorgeous",
  "经典": "classic",
  "现代": "modern",
  "复古": "retro",
  "流畅": "smooth",
  "快速": "fast",
  "刺激": "exciting",
  "有趣": "fun",
  "休闲": "casual",
  "挑战性": "challenging",
  "策略性": "strategic",
  "创新": "innovative",
  "独特": "unique",
  "逼真": "realistic",
  "沉浸式": "immersive",
  "互动": "interactive",
  "多样化": "diverse",
  "丰富": "rich",
  "直观": "intuitive",
  "易学": "easy to learn",
  "难精通": "difficult to master",
  "上瘾": "addictive",
  
  // 特定词组
  "轻松上手": "easy to pick up",
  "但充满挑战": "but full of challenge",
  "随时随地": "anytime, anywhere",
  "限定时间": "limited time",
  "各种挑战": "various challenges",
  "精心设计": "carefully designed",
  "充分展示": "fully showcases",
  "沉浸在游戏中": "immerse in the game",
  "提升技能": "improve skills",
  "测试反应": "test reflexes",
  "锻炼大脑": "train your brain",
  "解开谜题": "solve puzzles",
  "战胜对手": "defeat opponents",
  
  // 特定中国游戏名称
  "节奏大师": "Rhythm Master",
  "贪吃蛇大作战": "Snake Battle",
  "粒子点击器": "Particle Clicker",
  "饼干点击器": "Cookie Clicker",
  "Hextris旋转": "Hextris",
  
  // 通用游戏类型
  "塔防游戏": "tower defense game",
  "益智游戏": "puzzle game",
  "动作游戏": "action game",
  "冒险游戏": "adventure game",
  "策略游戏": "strategy game",
  "赛车游戏": "racing game",
  "射击游戏": "shooting game",
  "平台游戏": "platform game",
  "角色扮演游戏": "RPG game",
  "模拟游戏": "simulation game",
  "卡牌游戏": "card game",
  "棋盘游戏": "board game",
  "文字游戏": "word game",
  "记忆游戏": "memory game",
  "音乐游戏": "music game",
  "运动游戏": "sports game",
  "休闲游戏": "casual game",
  
  // 混合词汇
  "滚轮": "mouse wheel",
  "缩放视图": "zoom view",
  "切换菜单": "toggle menu",
  "建筑": "building",
  "技巧": "skills",
  "系统": "system",
  "方向": "direction",
  "交换相邻的糖果以形成三个或更多相同颜色的连线": "swap adjacent candies to form lines of three or more of the same color",
  "特殊": "special",
  "完成各种": "complete various",
  "获取高分": "get high scores",
  "三消配对": "match-3",
  "轻松": "easy",
  "交换糖果": "swap candies",
  "弹球": "pinball",
  "的数字重现": "digital recreation",
  "用弹簧发射球": "launch the ball with springs",
  "操作挡板保持球在": "operate paddles to keep the ball in",
  "击中各种": "hit various",
  "物理": "physics",
  "真实": "real",
  "玩法": "gameplay",
  "但令人上瘾": "but addictive",
  "指尖弹球": "fingertip pinball",
  "挡板": "paddle",
  "下": "down",
  "操作弹簧": "operate springs",
  "发射球": "launch ball",
  "这款经典泡泡": "this classic bubble",
  "让您瞄准并发射彩色泡泡": "let you aim and shoot colorful bubbles",
  "是匹配三个或更多相同颜色的泡泡使它们消失": "match three or more bubbles of the same color to make them disappear",
  "清除所有泡泡以通关": "clear all bubbles to pass the level",
  "注意不要让泡泡堆到底线": "be careful not to let bubbles stack to the bottom line",
  "泡泡": "bubble",
  "色彩消除": "color elimination",
  "瞄准": "aim",
  "发射泡泡": "shoot bubbles",
  "交换下一个泡泡": "swap next bubble"
};

// 完整段落或特定上下文的翻译
const contextualTranslations = {
  "经典的纸牌接龙现在可以在浏览器中玩将所有牌按照花色从到排列到四个基础堆支持多种规则变体和主题": 
    "Classic solitaire now playable in your browser. Arrange all cards by suit from ace to king in four foundation piles. Supports multiple rule variants and themes.",
  
  "经典纸牌随时随地": 
    "Classic card game, anytime, anywhere",
  
  "纸牌双击自动到正确位置": 
    "Cards, double-click to automatically move to the correct position",
  
  "在这款精美的充满宝藏新能力战胜各种揭开古老文明的秘密": 
    "In this beautiful game, collect treasures, gain new abilities, defeat various enemies, and uncover the secrets of ancient civilizations.",
  
  "解开互动使用物品": 
    "Solve interactive puzzles using items",
  
  "在这款第一人称你需要在限定内每次迷宫都会随机生成提供无尽的以延长或获得线索冲刺": 
    "In this first-person game, you need to escape within a limited time. Each time the maze is randomly generated, providing endless gameplay. Collect items to extend time or get clues. Use sprint to move faster.",
  
  "在这款经典赌场纸牌与庄家对抗尝试获得接近点但不超过的牌面点数真实的赌场氛围测试您的和运气": 
    "In this classic casino card game, compete against the dealer and try to get a card total close to 21 points without exceeding it. Experience a real casino atmosphere that tests your strategy and luck.",
  
  "赌场经典为王要牌停牌双倍下注": 
    "Casino classic, be the king. Hit, stand, or double down.",
  
  "卡丁竞速选择您的在各种充满的赛道上与对手竞速新的速度与激情极速卡丁狂飙漂移": 
    "Kart racing: Choose your vehicle and race against opponents on various tracks full of challenges. Experience new speed and excitement with extreme kart racing and drifting.",
  
  "这款经典的数字在的网格中填入数字使每行每列和每个方格内的数字不重复提供多种级别从到专家": 
    "This classic number puzzle requires you to fill numbers in a grid so that each row, column, and square box contains no repeating digits. Offers multiple difficulty levels from beginner to expert.",
  
  "数字逻辑头脑锻炼选择格子输入数字笔记功能记录可能性": 
    "Number logic and brain training. Select cells, input numbers, and use the notes feature to record possibilities.",
  
  "在这款节奏跟随屏幕指示滑动或按住音符与节拍同步提供多种流行歌曲和不同测试您的节奏感": 
    "In this rhythm game, follow on-screen instructions to slide or hold notes in sync with the beat. Features various popular songs and different difficulty levels to test your sense of rhythm.",
  
  "节拍指尖律动键位长按保持音符滑动连接音符": 
    "Beat, fingertip rhythm. Use keys, long press to hold notes, slide to connect notes.",
  
  "这款经典的您的短期记忆力翻开卡片并记住它们的位置尝试匹配所有对子以最少的尝试次数获胜": 
    "This classic game tests your short-term memory. Flip cards and remember their positions. Try to match all pairs with the fewest attempts to win.",
  
  "记忆配对乐趣翻开卡片": 
    "Memory matching fun. Flip cards to find pairs.",
  
  "这个集合提供了上千个精心挑选的战术从入门到大师级别分析局面找出最佳着法提高您的战术思维和计算能力": 
    "This collection offers thousands of carefully selected tactics from beginner to master level. Analyze positions, find the best moves, and improve your tactical thinking and calculation abilities.",
  
  "战术思维提升棋艺选择和": 
    "Tactical thinking, improve chess skills. Select and make moves.",
  
  "您需要通过其他车辆来帮助红色汽车驶出拥挤的停车场看似随着的推进会变得越来越复杂和具有": 
    "You need to move other vehicles to help the red car exit the crowded parking lot. What seems simple becomes increasingly complex and challenging as you progress through the levels.",
  
  "停车解谜智慧突围车辆": 
    "Parking puzzle, smart breakthrough. Move vehicles to clear the way.",
  
  "在这款文字搜索在字母网格中寻找隐藏的可以水平垂直或对角线排列向前或向后提供多种主题和": 
    "In this word search game, find hidden words in the letter grid. Words can be arranged horizontally, vertically, or diagonally, forward or backward. Offers various themes and difficulty levels.",
  
  "字词搜索训练观察选择": 
    "Word search, train observation. Select words in the grid.",
  
  "刺激的各种高性能跑车在精心设计的赛道上比赛感受速度与激情自己的技巧紧张刺激的": 
    "Experience the thrill of various high-performance cars racing on carefully designed tracks. Feel the speed and excitement as you test your own driving skills in this intense and exciting game.",
  
  "这款充分展示了技术的强大功能提供流畅的和物理提供多种视角选择让您沉浸在刺激的或键重置位置界面直观易用适合各级进行您将更多赛道和车辆不断提升": 
    "This game fully showcases the powerful features of the technology, providing smooth graphics and realistic physics. It offers multiple camera angles to immerse you in the exciting gameplay. Use the R key to reset position. The interface is intuitive and suitable for players of all levels. As you progress, you'll unlock more tracks and vehicles, constantly improving your skills.",
  
  "精美的和逼真的物理多种和赛道选择响应灵敏的系统逼真的声果熟悉方式后再高赛道利用漂移技巧过弯可以提高速度注意赛道上的尝试不同车型最适合你的一款如果遇到性能问题可以调整画质": 
    "Beautiful graphics and realistic physics, multiple vehicle and track options, responsive control system, realistic sound effects. After becoming familiar with the controls, try again for higher scores. Use drift techniques around corners to increase speed. Pay attention to obstacles on the track. Try different vehicle models to find one that suits you best. If you encounter performance issues, you can adjust the graphics quality."
};

// 赛博朋克相关翻译
const cyberTranslations = {
  "赛博跑者风格的跑酷将带您穿越充满霓虹灯光的赛博朋克城市躲避障碍使用各种特殊能力尽可能跑得更远": 
    "Cyber Runner style parkour will take you through a cyberpunk city filled with neon lights. Dodge obstacles, use various special abilities, and run as far as possible.",
  
  "在赛博城市中奔跑左右或上或下滑行特殊能力": 
    "Run in the cyber city. Move left/right or up/down, slide, and use special abilities.",
  
  "通过呈现出一个充满活力的赛博朋克将在不断变化的中奔跑面对各种障碍和采用程序生成的确保每次都是独特的中的可以和能力滑行躲避障碍激活特殊能力": 
    "Through a vibrant cyberpunk environment, you'll run through ever-changing landscapes, facing various obstacles and challenges. Using procedurally generated content ensures each run is unique. You can use slide to avoid obstacles and activate special abilities in the game.",
  
  "节奏快速要求高但直观适合各类快速上手流畅的富有感的赛博朋克": 
    "Fast-paced and demanding, but intuitive and suitable for all kinds of players to quickly get started. Enjoy smooth and dynamic cyberpunk visuals."
};

// 读取games-data.js
fs.readFile('./games-data.js', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  let cleanedData = data;
  
  // 首先，应用上下文翻译（较长段落）
  for (const [chineseText, englishText] of Object.entries(contextualTranslations)) {
    cleanedData = cleanedData.replace(new RegExp(chineseText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), englishText);
  }
  
  // 应用赛博朋克相关翻译
  for (const [chineseText, englishText] of Object.entries(cyberTranslations)) {
    cleanedData = cleanedData.replace(new RegExp(chineseText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), englishText);
  }

  // 应用基本短语翻译（从最长短语开始，避免部分匹配问题）
  const sortedTranslations = Object.entries(translationDict).sort((a, b) => b[0].length - a[0].length);
  for (const [chineseText, englishText] of sortedTranslations) {
    cleanedData = cleanedData.replace(new RegExp(chineseText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), englishText);
  }

  // 修复常见标点符号
  cleanedData = cleanedData
    .replace(/，/g, ", ")
    .replace(/。/g, ". ")
    .replace(/、/g, ", ")
    .replace(/：/g, ": ")
    .replace(/；/g, "; ")
    .replace(/！/g, "! ")
    .replace(/？/g, "? ");

  // 检查是否还有中文字符
  const chinesePattern = /[\u4e00-\u9fa5]+/g;
  const remainingChinese = cleanedData.match(chinesePattern);
  
  if (remainingChinese) {
    console.log('Warning: Still found Chinese characters in the file:');
    const uniqueChinese = [...new Set(remainingChinese)];
    uniqueChinese.forEach(text => console.log(`- "${text}"`));
  } else {
    console.log('All Chinese characters have been replaced successfully!');
  }

  // 写入清理后的文件
  fs.writeFile('./games-data-fixed.js', cleanedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully cleaned mixed language. Result written to games-data-fixed.js');
  });
}); 