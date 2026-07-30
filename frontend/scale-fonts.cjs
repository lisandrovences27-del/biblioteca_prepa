const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Regex to find font-size: <number>px;
            // Also handles font: 18px/...
            const replaced = content.replace(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi, 'font-size: calc($1px * var(--a11y-zoom, 1))');
            
            // For the shorthand font: 18px/145%...
            const replacedShorthand = replaced.replace(/font\s*:\s*(\d+(?:\.\d+)?)px/gi, 'font: calc($1px * var(--a11y-zoom, 1))');

            if (content !== replacedShorthand) {
                fs.writeFileSync(fullPath, replacedShorthand);
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Done');
