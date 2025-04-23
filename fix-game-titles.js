const fs = require('fs');

// 读取title-map.json获取标题映射
fs.readFile('./title-map.json', 'utf8', (err, titleMapData) => {
  if (err) {
    console.error('Error reading title-map.json:', err);
    return;
  }

  // 解析标题映射
  let titleMap;
  try {
    titleMap = JSON.parse(titleMapData);
  } catch (e) {
    console.error('Error parsing title-map.json:', e);
    return;
  }

  // 读取games-data-english.js文件
  fs.readFile('./games-data-english.js', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading games-data-english.js:', err);
      return;
    }

    // 额外的标题映射
    const additionalTitleMap = {
      "扫雷": "Minesweeper",
      "HTML5平台Jump": "HTML5 Platform Jumper",
      "3D卡丁竞速": "3D Kart Racing",
      "极速Racing3D": "Speed Racing 3D",
      "赛博跑者": "Cyber Runner",
      "黑暗降临": "Darkness Falls"
    };

    // 合并标题映射
    const combinedTitleMap = {...titleMap, ...additionalTitleMap};

    // 替换所有中文标题
    let updatedData = data;
    for (const [chineseTitle, englishTitle] of Object.entries(combinedTitleMap)) {
      // 在title属性中替换
      updatedData = updatedData.replace(new RegExp(`"title": "${chineseTitle}"`, 'g'), `"title": "${englishTitle}"`);
      
      // 在thumbnail中替换
      updatedData = updatedData.replace(new RegExp(`text=${encodeURIComponent(chineseTitle)}`, 'g'), `text=${encodeURIComponent(englishTitle)}`);
      updatedData = updatedData.replace(new RegExp(`text=${chineseTitle}`, 'g'), `text=${englishTitle}`);
    }

    // 写入更新后的文件
    fs.writeFile('./games-data-english.js', updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing updated games-data-english.js:', err);
        return;
      }
      console.log('Successfully fixed Chinese game titles in games-data-english.js');
      
      // 检查是否仍然有中文字符
      const chinesePattern = /[\u4e00-\u9fa5]+/g;
      const remainingChinese = updatedData.match(chinesePattern);
      
      if (remainingChinese) {
        console.log('Warning: Still found Chinese characters in the file:');
        const uniqueChinese = [...new Set(remainingChinese)];
        uniqueChinese.forEach(text => console.log(`- "${text}"`));
      } else {
        console.log('All Chinese characters have been replaced successfully!');
      }
    });
  });
}); 