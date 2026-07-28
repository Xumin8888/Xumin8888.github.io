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
const downloaded = new Set();

function fetchUrl(url, retries = 5) {
    return new Promise((resolve, reject) => {
        const tryFetch = (attempt) => {
            if (downloaded.has(url)) {
                resolve(null);
                return;
            }
            https.get(url, { timeout: 15000 }, (res) => {
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
                res.on('end', () => {
                    downloaded.add(url);
                    resolve(Buffer.concat(chunks));
                });
            }).on('error', (e) => {
                if (attempt < retries) { setTimeout(() => tryFetch(attempt + 1), 2000); }
                else reject(e);
            });
        };
        tryFetch(1);
    });
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function extractFromText(text, demoPath) {
    const assets = new Set();
    const patterns = [
        /["']([^"']+\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|eot|mp3|mp4|webm))["']/gi,
        /url\(["']?([^"')]+\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|eot|mp3|mp4|webm))["']?\)/gi,
        /src\s*:\s*["']([^"']+\.(?:png|jpg|jpeg|gif|webp|svg|ico))["']/gi,
        /background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi,
    ];
    for (const p of patterns) {
        let m;
        while ((m = p.exec(text)) !== null) {
            let u = m[1];
            if (u.startsWith('data:') || u.startsWith('http') || u.startsWith('//')) continue;
            if (u.startsWith('/')) {
                u = baseUrl + u;
            } else {
                u = baseUrl + '/' + demoPath + '/' + u;
            }
            u = u.split('#')[0].split('?')[0];
            if (/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|eot|mp3|mp4|webm)$/i.test(u)) {
                assets.add(u);
            }
        }
    }
    return assets;
}

async function downloadAsset(url, demoPath) {
    if (downloaded.has(url)) return 'exists';
    try {
        const u = new URL(url);
        let rp = u.pathname;
        if (rp.startsWith('/')) rp = rp.slice(1);
        const dp = path.join(baseDir, rp);
        if (fs.existsSync(dp)) {
            downloaded.add(url);
            return 'exists';
        }
        const data = await fetchUrl(url);
        if (!data) return 'exists';
        ensureDir(path.dirname(dp));
        fs.writeFileSync(dp, data);
        return 'downloaded';
    } catch(e) {
        return 'failed: ' + e.message;
    }
}

async function deepScanDemo(demoPath) {
    console.log('\n=== 深度扫描: ' + demoPath + ' ===');
    
    const demoDir = path.join(baseDir, demoPath);
    const allAssets = new Set();
    
    function scanDir(dir) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scanDir(fullPath);
            } else if (/\.(js|css|html?)$/i.test(item)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const assets = extractFromText(content, demoPath);
                    assets.forEach(a => allAssets.add(a));
                } catch(e) {}
            }
        }
    }
    
    scanDir(demoDir);
    console.log('  发现 ' + allAssets.size + ' 个静态资源');
    
    let success = 0, failed = 0, exists = 0;
    let i = 0;
    for (const url of allAssets) {
        i++;
        const result = await downloadAsset(url, demoPath);
        if (result === 'downloaded') {
            success++;
            console.log('    [' + i + '/' + allAssets.size + '] ✅ ' + path.basename(url));
        } else if (result === 'exists') {
            exists++;
        } else {
            failed++;
            console.log('    [' + i + '/' + allAssets.size + '] ❌ ' + path.basename(url));
        }
    }
    
    console.log('  完成: 新下载 ' + success + ', 已存在 ' + exists + ', 失败 ' + failed);
    
    if (success > 0) {
        console.log('  再次扫描新下载的文件...');
        await deepScanDemo(demoPath);
    }
}

async function main() {
    for (const demo of demos) {
        await deepScanDemo(demo);
    }
    console.log('\n🎉 全部深度扫描完成!');
}

main().catch(console.error);
