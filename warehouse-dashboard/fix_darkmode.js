const fs = require('fs');
const path = require('path');

const viewsDir = './src/views';
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.vue'));

const replacements = [
  { regex: /text-\[#1e293b\]/g, replacement: 'text-[#1e293b] dark:text-slate-100' },
  { regex: /text-slate-700(?! dark:)/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { regex: /text-slate-600(?! dark:)/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-500(?! dark:)/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /text-slate-800(?! dark:)/g, replacement: 'text-slate-800 dark:text-slate-100' },
  { regex: /text-gray-500(?! dark:)/g, replacement: 'text-gray-500 dark:text-slate-400' },
  { regex: /text-gray-700(?! dark:)/g, replacement: 'text-gray-700 dark:text-slate-300' },
  { regex: /bg-white(?! dark:)/g, replacement: 'bg-white dark:bg-slate-800' },
  { regex: /bg-\[#eff6ff\]/g, replacement: 'bg-[#eff6ff] dark:bg-slate-700' },
  { regex: /bg-slate-50(?! dark:)/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /bg-gray-50(?! dark:)/g, replacement: 'bg-gray-50 dark:bg-slate-900' },
  { regex: /border-slate-200(?! dark:)/g, replacement: 'border-slate-200 dark:border-slate-600' },
  { regex: /border-slate-300(?! dark:)/g, replacement: 'border-slate-300 dark:border-slate-600' },
  { regex: /border-gray-200(?! dark:)/g, replacement: 'border-gray-200 dark:border-slate-600' },
  { regex: /border-gray-300(?! dark:)/g, replacement: 'border-gray-300 dark:border-slate-600' },
  { regex: /hover:bg-slate-50(?! dark:)/g, replacement: 'hover:bg-slate-50 dark:hover:bg-slate-700' },
  { regex: /hover:bg-slate-100(?! dark:)/g, replacement: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  { regex: /hover:bg-gray-50(?! dark:)/g, replacement: 'hover:bg-gray-50 dark:hover:bg-slate-700' },
  {
    regex: /<Card class=\"([^\"]+)\"/g, replacement: (match, p1) => {
      if (!p1.includes('dark:bg-slate-800')) {
        return `<Card class="${p1} dark:bg-slate-800"`;
      }
      return match;
    }
  }
];

for (const file of files) {
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { regex, replacement } of replacements) {
    if (typeof replacement === 'function') {
      content = content.replace(regex, replacement);
    } else {
      content = content.replace(regex, replacement);
    }
  }

  // Quick deduplication in case of multiple runs
  content = content.replace(/dark:text-slate-100 dark:text-slate-100/g, 'dark:text-slate-100');
  content = content.replace(/dark:text-slate-200 dark:text-slate-200/g, 'dark:text-slate-200');
  content = content.replace(/dark:text-slate-300 dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-400 dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
}
console.log('Done');
