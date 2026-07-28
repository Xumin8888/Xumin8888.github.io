const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://xumin8888.github.io';
const destBase = path.join(__dirname, 'source');

function fetchUrl(url, retries = 10) {
    return new Promise((resolve, reject) => {
        const tryFetch = (attempt) => {
            https.get(url, { timeout: 15000 }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const u = new URL(res.headers.location, url).href;
                    tryFetch(attempt);
                    return;
                }
                if (res.statusCode !== 200) {
                    if (attempt < retries) { 
                        console.log('    重试 ' + attempt + '/' + retries + '...');
                        setTimeout(() => tryFetch(attempt + 1), 3000); 
                    }
                    else reject(new Error('HTTP ' + res.statusCode));
                    return;
                }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', (e) => {
                if (attempt < retries) { 
                    console.log('    重试 ' + attempt + '/' + retries + ' (' + e.message + ')...');
                    setTimeout(() => tryFetch(attempt + 1), 3000); 
                }
                else reject(e);
            });
        };
        tryFetch(1);
    });
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function extractAssets(html, basePath) {
    const assets = new Set();
    const patterns = [
        /<script[^>]+src=["']([^"']+)["']/gi,
        /<link[^>]+href=["']([^"']+)["']/gi,
        /<img[^>]+src=["']([^"']+)["']/gi,
    ];
    for (const p of patterns) {
        let m;
        while ((m = p.exec(html)) !== null) {
            let u = m[1];
            if (u.startsWith('data:') || u.startsWith('http')) continue;
            if (u.startsWith('/')) u = baseUrl + u;
            else u = baseUrl + basePath + '/' + u;
            assets.add(u.split('#')[0].split('?')[0]);
        }
    }
    return assets;
}

async function downloadFile(url, destPath) {
    const data = await fetchUrl(url);
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, data);
    return data;
}

async function downloadDemo(demoPath) {
    console.log('\n下载: ' + demoPath);
    const demoBase = '/' + demoPath + '/';
    const destDir = path.join(destBase, demoPath);
    ensureDir(destDir);
    
    const indexPath = path.join(destDir, 'index.html');
    let indexHtml;
    if (fs.existsSync(indexPath)) {
        indexHtml = fs.readFileSync(indexPath);
        console.log('  index.html 已存在');
    } else {
        indexHtml = await downloadFile(baseUrl + demoBase + 'index.html', indexPath);
        console.log('  index.html 下载完成');
    }
    
    const htmlStr = indexHtml.toString('utf8');
    const assets = extractAssets(htmlStr, demoBase);
    console.log('  发现 ' + assets.size + ' 个资源');
    
    for (const url of assets) {
        try {
            const u = new URL(url);
            let rp = u.pathname;
            if (rp.startsWith('/')) rp = rp.slice(1);
            const dp = path.join(destBase, rp);
            
            if (fs.existsSync(dp)) {
                console.log('  已存在: ' + path.basename(rp));
                continue;
            }
            
            console.log('  下载: ' + path.basename(rp));
            await downloadFile(url, dp);
            console.log('    ✅ 完成');
        } catch(e) {
            console.log('    ❌ 失败: ' + e.message);
        }
    }
    console.log('✅ ' + demoPath + ' 处理完成');
}

async function main() {
    const demos = ['demos/study-system', 'demos/sell-project'];
    for (const d of demos) {
        await downloadDemo(d);
    }
    console.log('\n🎉 全部完成!');
}

main().catch(console.error);
