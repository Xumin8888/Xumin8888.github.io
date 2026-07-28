const fs = require('fs');
const path = require('path');

const demos = [
    'demos/study-system',
    'demos/study-system2',
    'demos/data-dashboard',
    'demos/sellH5-project',
    'demos/sell-project',
    'play'
];

const baseDir = path.join(__dirname, 'source');

const injectCode = `
<script>
(function() {
    function handleError(img) {
        if (img.dataset.placeholder) return;
        img.dataset.placeholder = 'true';
        var w = img.naturalWidth || img.width || 400;
        var h = img.naturalHeight || img.height || 300;
        var seed = Math.floor(Math.random() * 1000);
        img.src = 'https://picsum.photos/seed/' + seed + '/' + w + '/' + h;
        img.style.objectFit = 'cover';
    }
    
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            handleError(e.target);
        }
    }, true);
    
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IMG') {
                    node.addEventListener('error', function() { handleError(node); });
                    if (node.complete && !node.naturalWidth) {
                        handleError(node);
                    }
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(function(img) {
                        img.addEventListener('error', function() { handleError(img); });
                        if (img.complete && !img.naturalWidth) {
                            handleError(img);
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() { handleError(img); });
        if (img.complete && !img.naturalWidth) {
            handleError(img);
        }
    });
    
    var style = document.createElement('style');
    style.textContent = 'img[src*="picsum.photos"] { background: #f0f0f0; }';
    document.head.appendChild(style);
})();
</script>
`;

function injectToDemo(demoPath) {
    const indexPath = path.join(baseDir, demoPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log('  ❌ 跳过: ' + demoPath + ' (index.html 不存在)');
        return;
    }
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    if (html.includes('picsum.photos')) {
        console.log('  ⏭️  跳过: ' + demoPath + ' (已注入)');
        return;
    }
    
    if (html.includes('</body>')) {
        html = html.replace('</body>', injectCode + '</body>');
    } else if (html.includes('</html>')) {
        html = html.replace('</html>', injectCode + '</html>');
    } else {
        html += injectCode;
    }
    
    fs.writeFileSync(indexPath, html);
    console.log('  ✅ 已注入: ' + demoPath);
}

console.log('开始注入图片错误处理代码...\n');
for (const demo of demos) {
    injectToDemo(demo);
}
console.log('\n🎉 全部完成!');
