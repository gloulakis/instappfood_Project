const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const files = ['App.js'];
function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
        const file = path.join(dir, name);
        if (fs.statSync(file).isDirectory()) walk(file);
        else if (file.endsWith('.js')) files.push(file);
    }
}
walk('components'); walk('redux');
let failures = 0;
const globals = new Set(['console', 'require', 'module', 'Promise', 'Set', 'Map', 'Math', 'Object', 'Array', 'String', 'Number', 'Boolean', 'undefined', 'fetch', 'alert', 'setTimeout', 'clearTimeout']);
for (const file of files) {
    const ast = babel.parseSync(fs.readFileSync(file, 'utf8'), { filename: file });
    babel.transformFileSync(file);
    function checkImport(source) {
        try { require.resolve(source.startsWith('.') ? path.resolve(path.dirname(file), source) : source); }
        catch (error) { console.error(`${file}: missing dependency or asset ${source}`); failures++; }
    }
    traverse(ast, {
        ImportDeclaration(p) { checkImport(p.node.source.value); },
        CallExpression(p) {
            if (p.node.callee.name === 'require' && p.node.arguments[0]?.type === 'StringLiteral') checkImport(p.node.arguments[0].value);
        },
        ReferencedIdentifier(p) {
            if (!p.scope.hasBinding(p.node.name) && !globals.has(p.node.name)) {
                console.error(`${file}:${p.node.loc.start.line}: undefined ${p.node.name}`); failures++;
            }
        }
    });
}
if (failures) process.exit(1);
console.log(`Validated compilation, identifiers, imports, and assets in ${files.length} source files.`);
