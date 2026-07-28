const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://xumin8888.github.io';
const demos = ['demos/study-system', 'demos/sell-project', 'play'];
const destBase = path.join(__dirname, 'source');

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

function extractAssets(html, basePath) {
    const assets = new Set();
    const patterns = [
        /<script[^>]+src=["']([^"']+)["']/gi,
        /<link[^>]+href=["']([^"']+)["']/gi,
        /<img[^>]+src=["']([^"']+)["']/gi,
        /url\(["']?([^"')]+)["']?\)/gi,
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

async function downloadDemo(demoPath) {
    console.log('下载: ' + demoPath);
    const demoBase = '/' + demoPath + '/';
    const destDir = path.join(destBase, demoPath);
    ensureDir(destDir);
    try {
        const indexHtml = await fetchUrl(baseUrl + demoBase + 'index.html');
        fs.writeFileSync(path.join(destDir, 'index.html'), indexHtml);
        console.log('  index.html 完成');
        const htmlStr = indexHtml.toString('utf8');
        const assets = extractAssets(htmlStr, demoBase);
        console.log('  发现 ' + assets.size + ' 个资源');
        for (const url of assets) {
            try {
                const u = new URL(url);
                let rp = u.pathname;
                if (rp.startsWith('/')) rp = rp.slice(1);
                const dp = path.join(destBase, rp);
                ensureDir(path.dirname(dp));
                const data = await fetchUrl(url);
                fs.writeFileSync(dp, data);
                console.log('  完成: ' + path.basename(rp));
            } catch(e) {
                console.log('  跳过: ' + url.split('/').pop() + ' - ' + e.message);
            }
        }
        console.log('✅ ' + demoPath + ' 完成');
    } catch(e) {
        console.log('❌ ' + demoPath + ' 失败: ' + e.message);
    }
}

async function main() {
    for (const d of demos) await downloadDemo(d);
    console.log('全部完成!');
}
main();
