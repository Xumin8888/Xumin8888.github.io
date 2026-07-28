const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const baseUrl = 'https://xumin8888.github.io';
const demos = [
    'demos/study-system',
    'demos/study-system2',
    'demos/data-dashboard',
    'demos/sellH5-project',
    'demos/sell-project',
    'play'
];
const destBase = path.join(__dirname, 'source');

function fetchUrl(url, retries = 3) {
    return new Promise((resolve, reject) => {
        const tryFetch = (attempt) => {
            https.get(url, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307 || res.statusCode === 308) {
                    const redirectUrl = new URL(res.headers.location, url).href;
                    tryFetch(attempt);
                    return;
                }
                if (res.statusCode !== 200) {
                    if (attempt < retries) {
                        setTimeout(() => tryFetch(attempt + 1), 1000 * attempt);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
                    }
                    return;
                }
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', (err) => {
                if (attempt < retries) {
                    setTimeout(() => tryFetch(attempt + 1), 1000 * attempt);
                } else {
                    reject(err);
                }
            });
        };
        tryFetch(1);
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function downloadFile(url, destPath) {
    ensureDir(path.dirname(destPath));
    const data = await fetchUrl(url);
    fs.writeFileSync(destPath, data);
    console.log(`  下载完成: ${path.basename(destPath)} (${(data.length / 1024).toFixed(1)} KB)`);
    return data.toString('utf8', 0, Math.min(data.length, 500000));
}

function extractAssets(html, basePath) {
    const assets = new Set();
    const patterns = [
        /<script[^>]+src=["']([^"']+)["']/gi,
        /<link[^>]+href=["']([^"']+)["']/gi,
        /<img[^>]+src=["']([^"']+)["']/gi,
        /url\(["']?([^"')]+)["']?\)/gi,
        /import\s+[^'"]*from\s+['"]([^'"]+)['"]/g,
    ];
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            let assetUrl = match[1];
            if (assetUrl.startsWith('data:') || assetUrl.startsWith('http') || assetUrl.startsWith('//')) continue;
            if (assetUrl.startsWith('/')) {
                assetUrl = baseUrl + assetUrl;
            } else {
                assetUrl = baseUrl + basePath + '/' + assetUrl;
            }
            assets.add(assetUrl.split('#')[0].split('?')[0]);
        }
    }
    return assets;
}

async function downloadDemo(demoPath) {
    console.log(`\n正在下载: ${demoPath}`);
    const demoBase = '/' + demoPath + '/';
    const destDir = path.join(destBase, demoPath);
    ensureDir(destDir);

    try {
        const indexHtml = await downloadFile(baseUrl + demoBase + 'index.html', path.join(destDir, 'index.html'));
        const assets = extractAssets(indexHtml, demoBase);
        console.log(`  发现 ${assets.size} 个资源文件`);

        const downloaded = new Set();
        let round = 0;
        let newAssets = [...assets];

        while (newAssets.length > 0 && round < 5) {
            round++;
            const currentAssets = [...newAssets];
            newAssets = [];

            for (const assetUrl of currentAssets) {
                if (downloaded.has(assetUrl)) continue;
                downloaded.add(assetUrl);

                try {
                    const urlObj = new URL(assetUrl);
                    let relPath = urlObj.pathname;
                    if (relPath.startsWith('/')) relPath = relPath.slice(1);
                    const absDest = path.join(destBase, '..', 'temp_assets', relPath);
                    const content = await downloadFile(assetUrl, absDest);

                    if (assetUrl.endsWith('.js') || assetUrl.endsWith('.css')) {
                        const moreAssets = extractAssets(content, demoBase);
                        for (const a of moreAssets) {
                            if (!downloaded.has(a)) {
                                newAssets.push(a);
                            }
                        }
                    }
                } catch (e) {
                    console.log(`  跳过(失败): ${assetUrl.split('/').pop()}`);
                }
            }
        }

        const assetsDir = path.join(destBase, '..', 'temp_assets');
        if (fs.existsSync(assetsDir)) {
            const copyRecursive = (src, dest) => {
                ensureDir(path.dirname(dest));
                if (fs.statSync(src).isDirectory()) {
                    for (const item of fs.readdirSync(src)) {
                        copyRecursive(path.join(src, item), path.join(dest, item));
                    }
                } else {
                    fs.copyFileSync(src, dest);
                }
            };
            for (const item of fs.readdirSync(assetsDir)) {
                const srcPath = path.join(assetsDir, item);
                const destPath = path.join(destBase, item);
                if (item === 'demos' || item === 'play') {
                    copyRecursive(srcPath, destPath);
                }
            }
        }

        console.log(`✅ ${demoPath} 下载完成！`);
    } catch (e) {
        console.error(`❌ ${demoPath} 下载失败:`, e.message);
    }
}

async function main() {
    console.log('开始下载所有 demo 项目...');
    for (const demo of demos) {
        await downloadDemo(demo);
    }
    console.log('\n🎉 全部下载完成！');
}

main().catch(console.error);
