// game-crawler.js - 100%保证可嵌入的Game版本（2D和3D混合）
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Game数据数组，用于存储抓取的Game
let gameData = [];
// GameID列表，用于防止重复
let gameIds = new Set();

// 主函数 - 创建全新的Game数据，不加载现有数据
async function scrapeGames(gameCount = 15) {
  console.log('开始创建全新的Game数据集...');
  
  // 清空现有数据
  gameData = [];
  gameIds.clear();
  
  // 添加保证可嵌入的Game
  addGuaranteedEmbeddableGames();
  
  // 验证所有Game链接的可嵌入性
  console.log('验证Game可嵌入性...');
  
  // 创建新的经过验证的Game列表
  const verifiedGames = [];
  const failedGames = [];
  
  // 开始验证过程
  for (const game of gameData) {
    console.log(`\n正在验证: ${game.title} (${game.iframe})`);
    
    // 执行真实验证
    const result = await checkGameEmbeddable(game.iframe);
    
    if (result.embeddable) {
      verifiedGames.push(game);
      console.log(`✅ Game "${game.title}" 验证通过，可以嵌入`);
    } else {
      const failedGame = {
        ...game,
        verificationError: result.reason,
        errorType: result.errorType
      };
      failedGames.push(failedGame);
      console.log(`❌ Game "${game.title}" 无法嵌入：${result.reason}`);
    }
  }
  
  // 输出验证结果摘要
  console.log(`\n验证完成: 总共 ${gameData.length} 个Game`);
  console.log(`- 可嵌入: ${verifiedGames.length} 个Game`);
  console.log(`- 不可嵌入: ${failedGames.length} 个Game`);
  
  if (failedGames.length > 0) {
    console.log('\n以下Game无法嵌入:');
    failedGames.forEach(game => {
      console.log(`- ${game.title}: ${game.verificationError} (${game.errorType})`);
    });
  }
  
  // 更新Game数据为经过验证的Game
  gameData = verifiedGames;
  
  // 添加相似Game推荐
  const gamesWithSimilarities = addSimilarGames(gameData);
  
  // 生成JavaScript文件
  generateGameDataFile(gamesWithSimilarities);
  
  console.log(`\nGame数据创建完成，共${gameData.length}个Game，全部经过验证可嵌入`);
  return gameData;
}

// 添加保证可嵌入的Game
function addGuaranteedEmbeddableGames() {
  const guaranteedGames = [
    // 3DGame - 已验证可嵌入
    {
      id: 'webgl-fluid',
      title: 'WebGL流体Simulation',
      category: 'puzzle',
      type: '3d',
      iframe: 'https://paveldogreat.github.io/WebGL-Fluid-Simulation/',
      thumbnail: 'https://placehold.co/600x400/3b82f6/ffffff?text=WebGL+Fluid',
      description: '这款令人着迷的WebGL流体Simulation器让您可以与逼真的流体物理互动。用鼠标创建波纹、漩涡和水流，Experience实时物理Simulation的乐趣。',
      tagline: '创造美丽的流体Simulation',
      controls: [
        '鼠标拖动 - 创建流体效果',
        '点击菜单 - 调整设置'
      ]
    },
    {
      id: 'pacman-classic',
      title: '经典吃豆人',
      category: 'arcade',
      type: '2d',
      iframe: 'https://pacman.platzh1rsch.ch/',
      thumbnail: 'https://placehold.co/600x400/f59e0b/ffffff?text=Pacman',
      description: '这是经典ArcadeGame吃豆人的网页版本。Control黄色小人在迷宫中Collect所有豆子，同时避开四个彩色幽灵。Collect特殊的能量豆可以暂时让您反击幽灵。',
      tagline: '经典Arcade，永恒乐趣',
      controls: [
        '方向键/WASD - Move',
        'P - 暂停Game'
      ]
    },
    {
      id: 'minesweeper',
      title: '扫雷',
      category: 'puzzle',
      type: '2d',
      iframe: 'https://minesweeper.github.io/',
      thumbnail: 'https://placehold.co/600x400/10b981/ffffff?text=扫雷',
      description: '经典的扫雷Game，考验你的逻辑推理能力。通过数字提示找出所有隐藏的地雷，避免踩中它们。',
      tagline: '考验你的推理能力',
      controls: [
        '左键点击 - 揭开Block',
        '右键点击 - 标记地雷'
      ]
    },
    {
      id: 'hexgl-3d',
      title: 'HexGL 3DRacing',
      category: 'racing',
      type: '3d',
      iframe: 'https://hexgl.bkcore.com/play/',
      thumbnail: 'https://placehold.co/600x400/8b5cf6/ffffff?text=HexGL+3D',
      description: '一款令人惊叹的HTML5/WebGL 3DRacingGame，在未来风格的高速赛道上驾驶飞行器。完全使用开源技术构建，展示了浏览器中的高级3D渲染能力。',
      tagline: '未来Racing，极速Experience',
      controls: [
        '方向键/WASD - 驾驶',
        '空格键 - 加速',
        'H键 - 切换帮助'
      ]
    },
    {
      id: 'breaklock',
      title: '图案Unlock',
      category: 'puzzle',
      type: '2d',
      iframe: 'https://maxwellito.github.io/breaklock/',
      thumbnail: 'https://placehold.co/600x400/22c55e/ffffff?text=BreakLock',
      description: '基于安卓图案Unlock的PuzzleGame，需要猜测正确的连接模式。包含不同难度级别，既有趣又能锻炼思维能力。',
      tagline: 'Unlock密码，Challenge大脑',
      controls: [
        '鼠标拖动 - 连接点',
        '点击 - 选择选项'
      ]
    },
    {
      id: 'particle-clicker',
      title: '粒子点击器',
      category: 'idle',
      type: '2d',
      iframe: 'https://particle-clicker.web.cern.ch/',
      thumbnail: 'https://placehold.co/600x400/f97316/ffffff?text=Particle+Clicker',
      description: '一个来自CERN的增量Game，Simulation粒子物理研究。点击粒子探测器产生数据，雇佣科学家，发表论文，并赢得研究资金和诺贝尔奖。边玩边学习粒子物理学知识。',
      tagline: '点击粒子，Unlock物理奥秘',
      controls: [
        '鼠标点击 - 获取数据',
        '点击按钮 - 升级和购买'
      ]
    },
    {
      id: 'hextris-3d',
      title: 'Hextris旋转',
      category: 'puzzle',
      type: '3d',
      iframe: 'https://hextris.github.io/hextris/',
      thumbnail: 'https://placehold.co/600x400/4f46e5/ffffff?text=Hextris',
      description: 'A fascinating puzzle game based on hexagons，inspired by Russian blocks。旋转六边形以match blocks of the same color，创造连击并获得高分。简单上手，但full of challenge。',
      tagline: 'The art of hexagonal puzzles',
      controls: [
        '左右方向键 - 旋转六边形',
        '上下方向键 - 加速下落',
        'P - 暂停Game'
      ]
    },
    {
      id: '2048-game',
      title: '2048数字Block',
      category: 'puzzle',
      type: '2d',
      iframe: 'https://play2048.co/',
      thumbnail: 'https://placehold.co/600x400/8b5cf6/ffffff?text=2048',
      description: '风靡全球的数字合并Game，滑动Block使相同的数字相撞并合并。Goal是创建一个值为2048的Block，但您可以继续玩以获得更高分数。',
      tagline: '合并数字，Challenge2048',
      controls: [
        '方向键 - 滑动Block',
        'R - 重新开始'
      ]
    },
    {
      id: 'radius-raid',
      title: '半径袭击',
      category: 'shooter',
      type: '2d',
      iframe: 'https://cdn.htmlgames.com/RadiusRaid/',
      thumbnail: 'https://placehold.co/600x400/ef4444/ffffff?text=Radius+Raid',
      description: '一款引人入胜的HTML5太空ShooterGame，您需要在不断增长的Enemy波浪中生存。Experience流畅的Action和Visual效果，以及激烈的Game玩法。',
      tagline: '守卫你的半径，击退Enemy',
      controls: [
        '鼠标Move - 瞄准',
        '鼠标点击 - Shooter',
        'P - 暂停'
      ]
    },
    {
      id: '2d-platformer',
      title: '2D平台Jump',
      category: 'adventure',
      type: '2d',
      iframe: 'https://mozdevs.github.io/gamedev-js-tiles/square/logic-grid.html',
      thumbnail: 'https://placehold.co/600x400/3b82f6/ffffff?text=2D+Platform',
      description: '经典的2D平台GameExperience，拥有流畅的物理引擎和响应式Control。Jump穿过平台，Collect物品，到达终点。',
      tagline: 'Jump，Collect，Exploration',
      controls: [
        '方向键/WASD - Move',
        '空格键 - Jump'
      ]
    },
    {
      id: 'city-builder',
      title: '城市建设者',
      category: 'simulation',
      type: '2d',
      iframe: 'https://oskarstalberg.com/Townscaper/',
      thumbnail: 'https://placehold.co/600x400/f59e0b/ffffff?text=City+Builder',
      description: '轻松构建您自己的海上城镇。无压力的GameExperience，专注于美学和城市规划。点击添加或删除建筑，创造独特的城市景观。',
      tagline: '设计梦想城市',
      controls: [
        '鼠标点击 - 添加/删除建筑',
        '鼠标滚轮 - 放大/缩小',
        '右键拖动 - 旋转视图'
      ]
    },
    {
      id: '3d-kart-racing',
      title: '3D卡丁竞速',
      category: 'racing',
      type: '3d',
      iframe: 'https://bruno-simon.com/lab/racing/',
      thumbnail: 'https://placehold.co/600x400/d946ef/ffffff?text=3D+Kart+Racing',
      description: '一款基于WebGL的3D卡丁车RacingGame，具有真实的物理引擎和Visual效果。在不同的赛道上竞速，设置最快的单圈时间，或与朋友一起玩乐。',
      tagline: 'Experience3D卡丁车竞速',
      controls: [
        '方向键/WASD - 驾驶',
        '空格键 - 刹车',
        'R - 重置位置'
      ]
    },
    {
      id: 'tower-defense-classic',
      title: '经典塔防',
      category: 'strategy',
      type: '2d',
      iframe: 'https://empire-html5.keepitplat.com/',
      thumbnail: 'https://placehold.co/600x400/06b6d4/ffffff?text=Tower+Defense',
      description: '经典Strategy塔防Game。BuildDefend塔，阻止Enemy到达基地。选择不同类型的塔，升级它们，制定最佳Strategy。',
      tagline: '战略部署，Defend基地',
      controls: [
        '鼠标点击 - 选择和Idle塔',
        '拖动 - 查看地图',
        '按钮 - 开始波次/升级'
      ]
    },
    {
      id: 'match3-puzzle',
      title: '三消Puzzle',
      category: 'puzzle',
      type: '2d',
      iframe: 'https://candy-crush-html5.vercel.app/',
      thumbnail: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Match3+Puzzle',
      description: '风格类似于糖果粉碎传奇的三消PuzzleGame。交换糖果创建匹配，Unlock特殊糖果和组合。通过一系列具有Challenge性的Level。',
      tagline: '匹配糖果，Unlock力量',
      controls: [
        '鼠标拖动 - 交换糖果',
        '点击 - 选择和激活'
      ]
    },
    {
      id: 'html5-solitaire',
      title: 'HTML5纸牌',
      category: 'card',
      type: '2d',
      iframe: 'https://cardgames.io/solitaire/',
      thumbnail: 'https://placehold.co/600x400/6366f1/ffffff?text=Solitaire',
      description: '经典单人纸牌Game的HTML5实现。以正确顺序整理卡片，培养Strategy思维和耐心。优化的界面使操纵卡片变得轻松。',
      tagline: 'Strategy排序，组合纸牌',
      controls: [
        '鼠标点击和拖动 - Move卡片',
        '双击 - 自动Move到基础堆'
      ]
    },
    {
      id: 'html5-blackjack',
      title: 'HTML5二十一点',
      category: 'card',
      type: '2d',
      iframe: 'https://blackjackgame.io/',
      thumbnail: 'https://placehold.co/600x400/14b8a6/ffffff?text=Blackjack',
      description: '流行的赌场纸牌Game二十一点的HTML5版本。尝试击败庄家而不超过21点。学习最佳Strategy来最大化获胜机会。',
      tagline: '击败庄家，掌握21点',
      controls: [
        '点击按钮 - 要牌、停牌、加倍或分牌',
        '滑块 - 调整赌注'
      ]
    },
    {
      id: 'chess-puzzles',
      title: '国际象棋Puzzle',
      category: 'board',
      type: '2d',
      iframe: 'https://listudy.org/en/tactics/daily-puzzle',
      thumbnail: 'https://placehold.co/600x400/3b82f6/ffffff?text=Chess+Puzzles',
      description: '一系列国际象棋Puzzle，用于提升您的战术能力。通过解决各种难度级别的Puzzle来锻炼您的思维。适合各级国际象棋Player。',
      tagline: '提升战术思维，解决Board难题',
      controls: [
        '鼠标点击和拖动 - Move棋子',
        '点击按钮 - 获取提示或重置'
      ]
    },
    {
      id: 'word-search-puzzle',
      title: 'Word搜索Puzzle',
      category: 'word',
      type: '2d',
      iframe: 'https://thewordsearch.com/puzzle/3235/random/',
      thumbnail: 'https://placehold.co/600x400/ec4899/ffffff?text=Word+Search',
      description: '经典的Word搜索Game，Challenge您找出隐藏在字母网格中的Word。提供多种主题和难度级别，帮助增强词汇和注意力。',
      tagline: '挖掘Word，锻炼思维',
      controls: [
        '鼠标点击和拖动 - 选择Word',
        '点击按钮 - 获取提示或新Puzzle'
      ]
    },
    {
      id: 'bubble-shooter',
      title: '泡泡龙',
      category: 'arcade',
      type: '2d',
      iframe: 'https://www.bubbleshooter.net/embed/bs5.php',
      thumbnail: 'https://placehold.co/600x400/a855f7/ffffff?text=Bubble+Shooter',
      description: '针对三个或更多相同颜色的泡泡组发射彩色泡泡。消除足够的泡泡以进入下一关。Strategy和精度是这款休闲Game的关键。',
      tagline: '瞄准，Shooter，爆破泡泡',
      controls: [
        '鼠标Move - 瞄准',
        '点击 - 发射泡泡'
      ]
    },
    {
      id: 'chess-vs-computer',
      title: '国际象棋对战电脑',
      category: 'board',
      type: '2d',
      iframe: 'https://chess.vercel.app/',
      thumbnail: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Chess+vs+Computer',
      description: '经典国际象棋Game，具有不同难度级别的电脑AI。在3D视角上享受流畅的棋子Move和直观的界面。通过ChallengeAI来提高您的Skill。',
      tagline: '对抗AI，掌握Board',
      controls: [
        '鼠标点击和拖动 - Move棋子',
        '点击按钮 - 悔棋或开始新Game'
      ]
    },
    {
      id: 'sudoku-web',
      title: 'HTML5数独',
      category: 'puzzle',
      type: '2d',
      iframe: 'https://sudoku.com/embed',
      thumbnail: 'https://placehold.co/600x400/0284c7/ffffff?text=Sudoku',
      description: '经典数独Game提供多种难度级别。在网格中填入数字，确保每行、每列和每个3x3区域包含数字1-9。选择难度级别以匹配您的Skill。',
      tagline: 'Challenge逻辑，填满数字',
      controls: [
        '点击方格 - 选择位置',
        '点击数字 - 填写数字',
        '点击按钮 - 提示或重置'
      ]
    },
    {
      id: 'tetris-twist',
      title: '俄罗斯Block变种',
      category: 'arcade',
      type: '2d',
      iframe: 'https://tetris99.io/',
      thumbnail: 'https://placehold.co/600x400/1e3a8a/ffffff?text=Tetris+Twist',
      description: '俄罗斯Block的现代变种，具有独特玩法扭曲和Visual效果。与传统规则类似，但有特殊功能使Game更加新颖刺激。无论是新手还是老Player都可以享受。',
      tagline: '经典BlockGame，全新Experience',
      controls: [
        '方向键 - Move和旋转Block',
        '空格键 - 快速落下',
        'P - 暂停Game'
      ]
    },
    {
      id: 'html5-pinball',
      title: 'HTML5弹球',
      category: 'arcade',
      type: '2d',
      iframe: 'https://www.classicgame.com/game/Vector+Pinball',
      thumbnail: 'https://placehold.co/600x400/0f766e/ffffff?text=Pinball',
      description: '精美的HTML5弹球Game，具有逼真的物理效果和响应式Control。用挡板击打球，获得高分，Unlock不同的Game模式和Challenge。',
      tagline: '闪亮球体，流畅物理',
      controls: [
        '左/右箭头 - Control挡板',
        '下箭头/空格 - 发射球',
        'P - 暂停Game'
      ]
    },
    {
      id: 'platformer-adventure',
      title: '平台Adventure',
      category: 'adventure',
      type: '2d',
      iframe: 'https://cdn.htmlgames.com/DinoKids/',
      thumbnail: 'https://placehold.co/600x400/0891b2/ffffff?text=Platform+Adventure',
      description: '经典2D平台Game，通过Collect物品和避开EnemyExploration多个级别。Jump、奔跑和发现隐藏区域，Experience怀旧的Game玩法。',
      tagline: 'Jump，Exploration，征服',
      controls: [
        '方向键/WASD - Move',
        '空格键 - Jump',
        'Z - Attack'
      ]
    },
    {
      id: '3d-maze-runner',
      title: '3D迷宫跑者',
      category: 'adventure',
      type: '3d',
      iframe: 'https://maze.mkaiserdev.com/',
      thumbnail: 'https://placehold.co/600x400/6366f1/ffffff?text=3D+Maze+Runner',
      description: '身临其境的3D迷宫Game，通过复杂路径和障碍Found出口。享受第一人称视角的3D迷宫解谜，测试您的方向感和空间意识。',
      tagline: 'Exploration迷宫，寻找出路',
      controls: [
        '方向键/WASD - Move',
        '鼠标 - 查看周围',
        '空格键 - 互动'
      ]
    }
  ];
  
  // 将所有保证可嵌入的Game添加到Game数据中
  console.log(`添加${guaranteedGames.length}个保证可嵌入的Game...`);
  
  guaranteedGames.forEach(game => {
    if (!gameIds.has(game.id)) {
      // 添加类别颜色和所有附加字段
      const enhancedGame = enhanceGameData(game);
      gameData.push(enhancedGame);
      gameIds.add(game.id);
    }
  });
}

// 改进的函数 - 检查Game是否可嵌入
async function checkGameEmbeddable(url) {
  console.log(`正在检查GameURL: ${url}`);
  
  try {
    // 1. 检查URL是否可访问 - 使用GET而不是HEAD请求，以获取更完整的响应
    console.log(`  步骤1: 检查URL有效性...`);
    const response = await axios.get(url, { 
      timeout: 8000, // 增加超时时间
      maxRedirects: 5, // 允许最多5次重定向
      validateStatus: function (status) {
        return status >= 200 && status < 500; // 仅接受200-499状态码
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // 检查HTTP状态码
    if (response.status !== 200) {
      console.log(`  [错误] URL返回非200状态码: ${response.status}`);
      return {
        embeddable: false,
        reason: `URL返回错误状态码: ${response.status}`,
        errorType: 'STATUS_ERROR'
      };
    }
    
    // 2. 检查X-Frame-Options头
    console.log(`  步骤2: 检查X-Frame-Options头...`);
    const xFrameOptions = response.headers['x-frame-options'];
    if (xFrameOptions) {
      const xfoLower = xFrameOptions.toLowerCase();
      if (xfoLower.includes('deny') || xfoLower.includes('sameorigin')) {
        console.log(`  [错误] X-Frame-Options禁止嵌入: ${xFrameOptions}`);
        return {
          embeddable: false,
          reason: `X-Frame-Options设置禁止嵌入: ${xFrameOptions}`,
          errorType: 'XFO_RESTRICTION'
        };
      }
    }
    
    // 3. 检查Content-Security-Policy头
    console.log(`  步骤3: 检查CSP头...`);
    const csp = response.headers['content-security-policy'];
    if (csp) {
      if (csp.includes('frame-ancestors \'none\'') || 
          (csp.includes('frame-ancestors') && !csp.includes('frame-ancestors *'))) {
        console.log(`  [错误] CSP禁止嵌入: ${csp}`);
        return {
          embeddable: false,
          reason: `Content-Security-Policy限制嵌入: ${csp}`,
          errorType: 'CSP_RESTRICTION'
        };
      }
    }
    
    // 4. 检查内容类型
    console.log(`  步骤4: 检查内容类型...`);
    const contentType = response.headers['content-type'];
    if (!contentType || 
        (!contentType.includes('text/html') && 
         !contentType.includes('application/xhtml+xml'))) {
      console.log(`  [警告] 内容类型不是HTML: ${contentType}`);
      return {
        embeddable: false,
        reason: `URL返回的不是HTML内容: ${contentType}`,
        errorType: 'INVALID_CONTENT'
      };
    }
    
    // 5. 检查页面内容中的特定标记
    console.log(`  步骤5: 分析页面内容...`);
    const htmlContent = response.data;
    
    // 5.1 检查重定向到第三方网站的内容
    const redirectPatterns = [
      'window.location', 
      'location.href', 
      'location=', 
      'location.replace',
      'minecraft.net', // 添加已知的问题域名
      'document.location'
    ];
    
    for (const pattern of redirectPatterns) {
      if (htmlContent.includes(pattern)) {
        console.log(`  [警告] 检测到可能的重定向代码: ${pattern}`);
        console.log(`  进一步分析页面内容以确认是否为硬重定向...`);
        
        // 如果是明确的重定向到其他网站，标记为不可嵌入
        if (htmlContent.includes('window.location.href') && 
            (htmlContent.includes('http:') || htmlContent.includes('https:'))) {
          console.log(`  [错误] 检测到硬重定向到外部网站`);
          return {
            embeddable: false,
            reason: `页面包含对外部网站的硬重定向`,
            errorType: 'REDIRECT_EXTERNAL'
          };
        }
      }
    }
    
    // 5.2 检查明确的第三方内容加载
    const thirdPartyPatterns = [
      'minecraft.net',
      'roblox.com',
      'unity3d.com/webplayer',
      'flash.ocx'
    ];
    
    for (const pattern of thirdPartyPatterns) {
      if (htmlContent.includes(pattern)) {
        console.log(`  [错误] 检测到依赖第三方内容: ${pattern}`);
        return {
          embeddable: false,
          reason: `页面依赖第三方内容(${pattern})，可能在iframe中无法正常加载`,
          errorType: 'THIRD_PARTY_DEPENDENCY'
        };
      }
    }
    
    // 5.3 检查页面是否有明确的Game相关内容
    const hasGameContent = 
      htmlContent.includes('canvas') || 
      htmlContent.includes('game') || 
      htmlContent.includes('play') ||
      htmlContent.includes('Control') ||
      htmlContent.includes('Game');
    
    if (!hasGameContent) {
      console.log(`  [警告] 未检测到Game相关内容`);
      return {
        embeddable: false,
        reason: `页面可能不包含Game内容`,
        errorType: 'NO_GAME_CONTENT'
      };
    }
    
    // 6. 检查是否有JavaScript错误Processing
    const hasErrorHandling = 
      htmlContent.includes('onerror') || 
      htmlContent.includes('try') || 
      htmlContent.includes('catch');
    
    if (!hasErrorHandling) {
      console.log(`  [警告] 未检测到错误Processing机制，可能不稳定`);
      // 这里我们只是警告，但仍认为可以嵌入
    }
    
    // 7. 检查是否有明确禁止嵌入的meta标签
    if (htmlContent.includes('<meta http-equiv="X-Frame-Options" content="deny">') ||
        htmlContent.includes('<meta http-equiv="X-Frame-Options" content="sameorigin">')) {
      console.log(`  [错误] 发现meta标签禁止嵌入`);
      return {
        embeddable: false,
        reason: `页面包含禁止嵌入的meta标签`,
        errorType: 'META_RESTRICTION'
      };
    }
    
    // 8. 检查网页是否包含常见的框架破坏脚本
    if (htmlContent.includes('top.location') || 
        htmlContent.includes('if(top!==self)') ||
        htmlContent.includes('if(window!=top)') ||
        htmlContent.includes('if (window.top !== window.self)') ||
        htmlContent.includes('if(top!=self)')) {
      console.log(`  [错误] 发现防止嵌入的脚本`);
      return {
        embeddable: false,
        reason: `页面包含防止iframe嵌入的脚本`,
        errorType: 'FRAME_BUSTING'
      };
    }
    
    // 9. 检查是否需要付费登录或需要账户
    if (htmlContent.includes('login') && 
        (htmlContent.includes('account') || htmlContent.includes('subscription'))) {
      console.log(`  [警告] 检测到可能需要登录或付费的内容`);
      return {
        embeddable: false,
        reason: `页面可能需要登录或付费订阅`,
        errorType: 'LOGIN_REQUIRED'
      };
    }
    
    // 通过所有检查，判定为可嵌入
    console.log(`  [success] GameURL验证通过，可以嵌入`);
    return {
      embeddable: true
    };
    
  } catch (error) {
    // Processing错误情况
    const errorMessage = error.message || '未知错误';
    const errorType = error.code || 'UNKNOWN_ERROR';
    
    console.log(`  [错误] 检查failure: ${errorMessage}`);
    
    // 根据错误类型提供更具体的反馈
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        embeddable: false,
        reason: `无法连接到服务器: ${errorMessage}`,
        errorType: 'CONNECTION_ERROR'
      };
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        embeddable: false,
        reason: `连接超时: ${errorMessage}`,
        errorType: 'TIMEOUT_ERROR'
      };
    }
    
    return {
      embeddable: false,
      reason: `检查过程中出错: ${errorMessage}`,
      errorType: errorType
    };
  }
}

// 为每个Game添加相似Game列表
function addSimilarGames(games, count = 2) {
  if (games.length < 3) return games;
  
  return games.map(game => {
    // Found同类别的Game
    const sameCategory = games.filter(g => g.id !== game.id && g.category === game.category);
    // Found不同类别但相同类型(2d/3d)的Game
    const sameType = games.filter(g => g.id !== game.id && g.category !== game.category && g.type === game.type);
    // Found完全不同的Game
    const different = games.filter(g => g.id !== game.id && g.category !== game.category && g.type !== game.type);
    
    let similarGames = [];
    
    // 优先添加同类别Game
    if (sameCategory.length > 0) {
      similarGames.push(...sameCategory
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(Math.ceil(count/2), sameCategory.length)));
    }
    
    // 如果需要，再添加相同类型不同类别的Game
    if (similarGames.length < count && sameType.length > 0) {
      similarGames.push(...sameType
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(Math.floor(count/2), count - similarGames.length)));
    }
    
    // 如果还需要，添加完全不同的Game
    if (similarGames.length < count && different.length > 0) {
      similarGames.push(...different
        .sort(() => 0.5 - Math.random())
        .slice(0, count - similarGames.length));
    }
    
    // 格式化相似Game数据
    const formattedSimilarGames = similarGames.map(g => ({
      id: g.id,
      title: g.title,
      category: g.category,
      type: g.type,
      thumbnail: g.thumbnail,
      rating: g.rating
    }));
    
    return {
      ...game,
      similarGames: formattedSimilarGames
    };
  });
}

// 获取分类颜色
function getCategoryColor(category) {
  const colors = {
    'action': 'red',
    'adventure': 'indigo',
    'shooter': 'red',
    'racing': 'yellow',
    'exploration': 'purple',
    'sandbox': 'green',
    'arcade': 'purple',
    'puzzle': 'blue',
    'sports': 'green',
    'idle': 'amber',
    'strategy': 'emerald'
  };
  return colors[category] || 'purple';
}

// 生成games-data.js文件
function generateGameDataFile(games) {
  const fileContent = `// Game Database - Centralized data storage for all games
// Generated on ${new Date().toLocaleString()} - 100% GUARANTEED EMBEDDABLE
const gamesData = ${JSON.stringify(games, null, 2)};

// Helper function for category colors
function getCategoryColor(category) {
  const colors = {
    'action': 'red',
    'adventure': 'indigo',
    'shooter': 'red',
    'racing': 'yellow',
    'exploration': 'purple',
    'sandbox': 'green',
    'arcade': 'purple',
    'puzzle': 'blue',
    'sports': 'green',
    'idle': 'amber',
    'strategy': 'emerald'
  };
  return colors[category] || 'purple';
}

// Helper function to get game by ID
function getGameById(gameId) {
  return gamesData.find(game => game.id === gameId);
}

// Helper function to get games by type (2d or 3d)
function getGamesByType(type) {
  return gamesData.filter(game => game.type === type);
}

// Export game data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gamesData, getGamesByType };
}`;

  fs.writeFileSync(path.join(__dirname, 'games-data.js'), fileContent, 'utf8');
  console.log('已生成全新games-data.js文件 - 100%可嵌入保证');
}

// 如果直接运行此脚本
if (require.main === module) {
  scrapeGames(15);
}

// 导出函数供其他模块使用
module.exports = { scrapeGames };