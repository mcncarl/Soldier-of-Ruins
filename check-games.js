const fs = require('fs');
const path = require('path');

try {
  // Check File Size
  const statsObj = fs.statSync('./games-data.js');
  const fileSizeKB = (statsObj.size / 1024).toFixed(2);
  console.log('File Size:', fileSizeKB, 'KB');
  
  // Try to load Game data
  const gamesModule = require('./games-data.js');
  if (gamesModule.gamesData && Array.isArray(gamesModule.gamesData)) {
    console.log('Total Games:', gamesModule.gamesData.length);
    
    // Check game types (note: type field is lowercase "2d" and "3d")
    const gameTypes = {
      '2d': 0,
      '3d': 0,
      'other': 0
    };
    
    gamesModule.gamesData.forEach(game => {
      if (game.type === '2d') {
        gameTypes['2d']++;
      } else if (game.type === '3d') {
        gameTypes['3d']++;
      } else {
        gameTypes['other']++;
        console.log('Found games of other types:', game.id, game.type);
      }
    });
    
    console.log('\nGame Type Statistics:');
    console.log('- 2D Games Count:', gameTypes['2d']);
    console.log('- 3D Games Count:', gameTypes['3d']);
    if (gameTypes['other'] > 0) {
      console.log('- Other Game Types Count:', gameTypes['other']);
    }
    
    // Check if any deleted games still exist
    const deletedIds = [
      'cookie-clicker', 'classic-tetris', 'chess-game', 'kart-racing', 
      'tower-blocks', 'ski-game', 'space-invaders', '3d-racing-mini', 
      'retro-asteroids', 'zombie-shooter', 'block-puzzle', 
      'endless-runner', 'pixel-coloring', 'tower-builder'
    ];
    
    const remainingDeletedGames = gamesModule.gamesData.filter(game => 
      deletedIds.includes(game.id)
    );
    
    if (remainingDeletedGames.length > 0) {
      console.log('\nWarning: Games marked for deletion still exist in the data:', remainingDeletedGames.length);
      console.log('IDs of remaining deleted games:', remainingDeletedGames.map(g => g.id));
    } else {
      console.log('\nAll games marked for deletion have been removed from the data');
    }
  } else {
    console.log('Unable to get game data, please check the games-data.js file format');
  }
} catch (error) {
  console.error('Error checking game data:', error.message);
} 