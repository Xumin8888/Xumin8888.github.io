const fs = require('fs');
const path = require('path');
const https = require('https');

const demos = [
    'demos/study-system',
    'demos/study-system2',
    'demos/data-dashboard',
    'demos/sellH5-project',
    'demos/sell-project',
    'play'
];

const baseUrl = 'https://xumin8888.github.io';
const baseDir = path.join(__dirname, 'source');

function fetchUrl(url, retries = 5) {
    return new Promise((resolve, reject) => {
        const tryFetch = (attempt) => {
            https.get(url, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const u = new URL(res.headers.location, url).href;
                    tryFetch(attempt);
                    return;
                }
                if (res.statusCode !== 200) {
                    if (attempt < retries) { setTimeout(() => tryFetch(attempt + 1), 2000); }
                    else reject(new Error('HTTP ' + res.statusCode));
                    return;
                }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', (e) => {
                if (attempt < retries) { setTimeout(() => tryFetch(attempt + 1), 2000); }
                else reject(e);
            });
        };
        tryFetch(1);
    });
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function extractAssets(html, demoPath) {
    const assets = new Set();
    const patterns = [
        /<img[^>]+src=["']([^"']+)["']/gi,
        /<img[^>]+srcset=["']([^"']+)["']/gi,
        /url\(["']?([^"')]+)["']?\)/gi,
        /<script[^>]+src=["']([^"']+)["']/gi,
        /<link[^>]+href=["']([^"']+)["']/gi,
    ];
    for (const p of patterns) {
        let m;
        while ((m = p.exec(html)) !== null) {
            let u = m[1];
            if (u.startsWith('data:') || u.startsWith('http') || u.startsWith('//')) continue;
            if (u.startsWith('/')) {
                u = baseUrl + u;
            } else {
                u = baseUrl + '/' + demoPath + '/' + u;
            }
            assets.add(u.split('#')[0].split('?')[0]);
        }
    }
    return assets;
}

async function checkAndFixDemo(demoPath) {
    console.log('\n=== 检查: ' + demoPath + ' ===');
    const indexPath = path.join(baseDir, demoPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log('  ❌ index.html 不存在');
        return;
    }
    const html = fs.readFileSync(indexPath, 'utf8');
    const assets = extractAssets(html, demoPath);
    console.log('  发现 ' + assets.size + ' 个资源引用');
    
    let missing = [];
    for (const url of assets) {
        const u = new URL(url);
        let rp = u.pathname;
        if (rp.startsWith('/')) rp = rp.slice(1);
        const dp = path.join(baseDir, rp);
        if (!fs.existsSync(dp)) {
            missing.push({ url, dest: dp, rel: rp });
        }
    }
    
    console.log('  缺失 ' + missing.length + ' 个文件');
    
    if (missing.length > 0) {
        console.log('  开始下载缺失文件...');
        let success = 0;
        for (const item of missing) {
            try {
                console.log('    下载: ' + path.basename(item.rel));
                const data = await fetchUrl(item.url);
                ensureDir(path.dirname(item.dest));
                fs.writeFileSync(item.dest, data);
                success++;
                console.log('      ✅ 成功 (' + (data.length/1024).toFixed(1) + ' KB)');
            } catch(e) {
                console.log('      ❌ 失败: ' + e.message);
            }
        }
        console.log('  下载完成: ' + success + '/' + missing.length);
    }
    
    // 检查是否有登录相关内容
    const hasLogin = /登录|login|注册|register|账号|密码/i.test(html);
    console.log('  包含登录相关: ' + (hasLogin ? '是' : '否'));
}

async function main() {
    for (const demo of demos) {
        await checkAndFixDemo(demo);
    }
    console.log('\n🎉 全部检查完成!');
}

main().catch(console.error);
