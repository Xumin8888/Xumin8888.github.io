const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'source', '_posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

for (const file of files) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const parts = content.split('---');
    if (parts.length < 3) continue;
    
    let frontMatter = parts[1];
    
    frontMatter = frontMatter.replace(/cover:\s*[^\n]*\n(?:\s+-\s+[^\n]*\n)*/g, '');
    frontMatter = frontMatter.replace(/top_img:\s*[^\n]*\n/g, '');
    
    if (!frontMatter.includes('top_img:')) {
        frontMatter = frontMatter.trim() + '\ntop_img: /img/bj.jpg\n';
    }
    
    parts[1] = '\n' + frontMatter + '\n';
    content = parts.join('---');
    
    fs.writeFileSync(filePath, content);
    console.log('✅ ' + file);
}

console.log('\n🎉 全部完成!');
