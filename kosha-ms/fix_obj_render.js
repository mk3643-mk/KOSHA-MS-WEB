const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src', 'app', 'page.js');
let content = fs.readFileSync(pagePath, 'utf-8');

// Insert helper function after function DashboardContent() {
const insertHelper = `    const [isUploading, setIsUploading] = useState(false)

    // Helper added to fix React object render crash
    const getFileName = (fileData) => {
        if (!fileData) return '';
        if (typeof fileData === 'object' && fileData !== null) return fileData.name || '';
        return String(fileData);
    };`;

if (!content.includes('const getFileName = (fileData) =>')) {
    content = content.replace('    const [isUploading, setIsUploading] = useState(false)', insertHelper);
}

// Helper arrays for exact replacements
const replacements = [
    {
        from: /<span title=\{uploadedFiles\[`manual-\$\{chapter\.chapter\}`\]\} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-\[120px\]">\{uploadedFiles\[`manual-\$\{chapter\.chapter\}`\]\}<\/span>/g,
        to: '<span title={getFileName(uploadedFiles[`manual-${chapter.chapter}`])} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">{getFileName(uploadedFiles[`manual-${chapter.chapter}`])}</span>'
    },
    {
        from: /handleStartEditFilePath\(e, `manual-\$\{chapter\.chapter\}`, uploadedFiles\[`manual-\$\{chapter\.chapter\}`\]\)/g,
        to: 'handleStartEditFilePath(e, `manual-${chapter.chapter}`, getFileName(uploadedFiles[`manual-${chapter.chapter}`]))'
    },
    {
        from: /<span title=\{uploadedFiles\[std\.id\]\} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-\[120px\]">\{uploadedFiles\[std\.id\]\}<\/span>/g,
        to: '<span title={getFileName(uploadedFiles[std.id])} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">{getFileName(uploadedFiles[std.id])}</span>'
    },
    {
        from: /handleStartEditFilePath\(e, std\.id, uploadedFiles\[std\.id\]\)/g,
        to: 'handleStartEditFilePath(e, std.id, getFileName(uploadedFiles[std.id]))'
    },
    {
        from: /<span title=\{uploadedFiles\[att\.id\]\} className="text-\[10px\] bg-green-100 text-green-700 px-1\.5 py-0\.5 rounded truncate max-w-\[100px\] font-medium">\{uploadedFiles\[att\.id\]\}<\/span>/g,
        to: '<span title={getFileName(uploadedFiles[att.id])} className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded truncate max-w-[100px] font-medium">{getFileName(uploadedFiles[att.id])}</span>'
    },
    {
        from: /handleStartEditFilePath\(e, att\.id, uploadedFiles\[att\.id\]\)/g,
        to: 'handleStartEditFilePath(e, att.id, getFileName(uploadedFiles[att.id]))'
    },
    {
        from: /<span className="text-\[10px\] bg-green-50 text-green-700 px-1\.5 py-0\.5 rounded truncate max-w-\[100px\]">\{uploadedFiles\[doc\.id\]\}<\/span>/g,
        to: '<span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded truncate max-w-[100px]">{getFileName(uploadedFiles[doc.id])}</span>'
    },
    {
        from: /handleStartEditFilePath\(e, doc\.id, uploadedFiles\[doc\.id\]\)/g,
        to: 'handleStartEditFilePath(e, doc.id, getFileName(uploadedFiles[doc.id]))'
    }
];

let modified = false;
for (const r of replacements) {
    if (content.match(r.from)) {
        content = content.replace(r.from, r.to);
        modified = true;
    }
}

if (modified || content.includes('getFileName')) {
    fs.writeFileSync(pagePath, content, 'utf-8');
    console.log("Successfully patched page.js");
} else {
    console.log("Could not find matching strings to replace in page.js");
}
