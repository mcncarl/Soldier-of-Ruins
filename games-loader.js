/**
 * 3DGame批量加载器
 * 此脚本用于批量加载和展示3DGame
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有Game数据
    if (typeof gamesData !== 'undefined') {
        // 检查当前页面是首页还是Game详情页
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
            initHomepage();
        } else if (window.location.pathname.endsWith('game.html')) {
            loadGameDetails();
        }
    } else {
        console.error('Game数据未加载，请确保games-data.js文件已正确引入');
    }
});

// 初始化首页
function initHomepage() {
    createGamesList();
    setupEventListeners();
}

/**
 * 创建并显示Game列表
 */
function createGamesList(filterCategory = 'all', searchTerm = '') {
    const gamesContainer = document.getElementById('games-container');
    const noResults = document.getElementById('no-results');
    
    // 清空现有内容
    gamesContainer.innerHTML = '';
    
    // 筛选Game
    let filteredGames = gamesData;
    
    // 应用分类筛选
    if (filterCategory !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === filterCategory);
    }
    
    // 应用搜索筛选
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(searchLower) || 
            game.description.toLowerCase().includes(searchLower)
        );
    }
    
    // 检查是否有筛选结果
    if (filteredGames.length === 0) {
        gamesContainer.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    } else {
        gamesContainer.classList.remove('hidden');
        noResults.classList.add('hidden');
    }
    
    // 添加Game卡片
    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });
}

/**
 * 创建单个Game卡片
 * @param {Object} game - Game数据对象
 * @returns {HTMLElement} - Game卡片元素
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card bg-white rounded-xl shadow-md overflow-hidden';
    
    // 截断描述为短摘要
    const shortDescription = game.description.length > 100 
        ? game.description.substring(0, 100) + '...' 
        : game.description;
    
    card.innerHTML = `
        <div class="relative">
            <img class="h-48 w-full object-cover" src="${game.thumbnail}" alt="${game.title}">
            <span class="category-badge">${game.category}</span>
            <div class="game-rating">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>${game.rating}</span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-xl mb-2">${game.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${shortDescription}</p>
            <a href="game.html?id=${game.id}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Play Now</a>
        </div>
    `;
    
    return card;
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('game-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const activeCategory = document.querySelector('.category-button.active').dataset.category;
            createGamesList(activeCategory, this.value);
        }, 300));
    }
    
    // 分类过滤
    const categoryButtons = document.querySelectorAll('.category-button');
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 移除其他按钮的active类
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的active类
                this.classList.add('active');
                
                const searchTerm = searchInput ? searchInput.value : '';
                createGamesList(this.dataset.category, searchTerm);
            });
        });
    }
    
    // 分类菜单中的链接
    const categoryLinks = document.querySelectorAll('a[data-category]');
    if (categoryLinks) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                // 更新分类按钮状态
                categoryButtons.forEach(btn => {
                    if (btn.dataset.category === category) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                const searchTerm = searchInput ? searchInput.value : '';
                createGamesList(category, searchTerm);
                
                // 滚动到Game列表
                document.querySelector('#games-container').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

/**
 * 加载Game详情页
 * 此函数用于在Game详情页面加载时执行
 */
function loadGameDetails() {
    // 从URL获取GameID
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        console.error('没有指定GameID');
        document.body.innerHTML = '<div class="p-8 text-center"><h1 class="text-3xl font-bold text-red-600">错误</h1><p class="mt-4">未FoundGameID，请返回首页重试。</p><a href="index.html" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">返回首页</a></div>';
        return;
    }
    
    // 查找Game数据
    const game = gamesData.find(g => g.id === gameId);
    
    if (!game) {
        console.error(`未FoundID为${gameId}的Game`);
        document.body.innerHTML = '<div class="p-8 text-center"><h1 class="text-3xl font-bold text-red-600">Game Not Found</h1><p class="mt-4">您请求的Game不存在或已被移除。</p><a href="index.html" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">返回首页</a></div>';
        return;
    }
    
    // 更新页面标题
    document.title = `${game.title} - 3D Games Portal`;
    
    // 更新Game信息
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-category').textContent = game.category;
    document.getElementById('game-description').textContent = game.description;
    document.getElementById('game-full-description').textContent = game.description;
    document.getElementById('game-rating').textContent = game.rating;
    document.getElementById('game-rating-count').textContent = `(${game.ratingCount} ratings)`;
    
    // 更新Game图片
    if (game.thumbnail) {
        document.getElementById('game-image').src = game.thumbnail;
        document.getElementById('game-image').alt = game.title;
    }
    
    // 更新iframe
    const gameIframe = document.getElementById('game-iframe');
    if (gameIframe && game.iframeUrl) {
        gameIframe.src = game.iframeUrl;
    }
    
    // 更新面包屑
    document.getElementById('game-category-breadcrumb').textContent = game.category;
    document.getElementById('game-category-breadcrumb').href = `index.html?category=${encodeURIComponent(game.category)}`;
    document.getElementById('game-title-breadcrumb').textContent = game.title;
    
    // 加载相似Game
    loadSimilarGames(game.category, game.id);
}

/**
 * 加载相似Game
 * @param {string} category - Game分类
 * @param {string} currentGameId - 当前GameID
 */
function loadSimilarGames(category, currentGameId) {
    const similarGamesContainer = document.getElementById('similar-games');
    
    if (!similarGamesContainer) return;
    
    // 清空容器
    similarGamesContainer.innerHTML = '';
    
    // 查找相同分类的其他Game
    const similarGames = gamesData
        .filter(game => game.category === category && game.id !== currentGameId)
        .slice(0, 3); // 最多显示3个
    
    if (similarGames.length === 0) {
        similarGamesContainer.innerHTML = '<p class="text-gray-500">没有Found相似Game</p>';
        return;
    }
    
    // 添加相似Game
    similarGames.forEach(game => {
        const gameElement = document.createElement('a');
        gameElement.href = `game.html?id=${game.id}`;
        gameElement.className = 'flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors';
        
        gameElement.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="h-16 w-16 object-cover rounded">
            <div class="ml-4">
                <h4 class="font-medium text-gray-900">${game.title}</h4>
                <span class="text-xs font-medium text-blue-600">${game.category}</span>
            </div>
        `;
        
        similarGamesContainer.appendChild(gameElement);
    });
}

// 辅助函数：防抖
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 