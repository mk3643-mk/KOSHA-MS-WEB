const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\user\\Desktop\\vs\\kosha-ms\\src\\app\\page.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add handleFileView
const stateMarker = 'const [newRevision, setNewRevision] = useState({ version: \'\', date: new Date().toISOString().split(\'T\')[0], description: \'\', author: \'\', fileName: \'\' })';
const handleFileViewCode = `\n
    const handleFileView = (e, fileId, fileNameOverride = null) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const fileName = fileNameOverride || uploadedFiles[fileId];
        
        if (!fileName) {
            alert('첨부된 파일이 없습니다. 먼저 파일을 업로드해주세요.');
            return;
        }

        const isPdf = fileName.toLowerCase().endsWith('.pdf');
        const actionText = isPdf ? '열람(및 인쇄/다운로드)' : '다운로드';
        
        if (confirm(\`'\${fileName}' 파일을 \${actionText} 하시겠습니까?\`)) {
            const blob = new Blob(["이것은 시뮬레이션된 파일 내용입니다."], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };`;

if (content.includes(stateMarker) && !content.includes('const handleFileView =')) {
    content = content.replace(stateMarker, stateMarker + handleFileViewCode);
}

// 2. Recent Updates
const recentMarker1 = 'RECENT_UPDATES.slice(0, 2).map((update, idx) => (';
const recentReplace1 = 'RECENT_UPDATES.slice(0, 2).map((update, idx) => (\n                                    <div key={idx} onClick={(e) => handleFileView(e, null, update.title + \'.pdf\')} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">';
content = content.replace(recentMarker1 + '\n                                    <div key={idx} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">', recentReplace1);

const recentMarker2 = 'RECENT_UPDATES.slice(2, 4).map((update, idx) => (';
const recentReplace2 = 'RECENT_UPDATES.slice(2, 4).map((update, idx) => (\n                                    <div key={idx} onClick={(e) => handleFileView(e, null, update.title + \'.pdf\')} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">';
content = content.replace(recentMarker2 + '\n                                    <div key={idx} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">', recentReplace2);

// Add underline to recent update titles
const titleMarker = 'h3 className="text-[14px] font-bold text-slate-700 group-hover:text-blue-700 transition-colors line-clamp-1"';
content = content.replace(titleMarker, 'h3 className="text-[14px] font-bold text-slate-700 group-hover:text-blue-700 group-hover:underline transition-all line-clamp-1"', true);
content = content.replace(titleMarker, 'h3 className="text-[14px] font-bold text-slate-700 group-hover:text-blue-700 group-hover:underline transition-all line-clamp-1"', true);

// 3. Manual Section
const manualAnchorStart = '<a href="#" className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group">';
const manualDivStart = '<div onClick={(e) => handleFileView(e, `manual-${chapter.chapter}`)} className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group cursor-pointer">';
content = content.replace(manualAnchorStart, manualDivStart);
content = content.replace('</a>\n                                                    </div>', '</div>\n                                                    </div>');
// Add underline to manual title
content = content.replace('className="text-sm font-medium text-slate-800 group-hover:text-blue-700 truncate notranslate"', 'className="text-sm font-medium text-slate-800 group-hover:text-blue-700 group-hover:underline truncate notranslate"');

// 4. Standard Section
const standardTitleMarker = '<div translate="no" className={`text-sm font-medium truncate notranslate ${selectedStandard?.id === std.id ? \'text-indigo-800\' : \'text-slate-800 group-hover:text-indigo-700\'}`}>{std.title} (기준서)</div>';
const standardTitleReplace = `<div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, std.id)}>
                                                                                        <div translate="no" className={\`text-sm font-medium truncate notranslate \${selectedStandard?.id === std.id ? 'text-indigo-800' : 'text-slate-800 group-hover:text-indigo-700 group-hover:underline'}\`}>{std.title} (기준서)</div>
                                                                                        <div className="text-xs text-slate-500">{std.id}</div>
                                                                                    </div>`;
const standardOuterMarker = '<div>\n                                                                                        <div translate="no" className={`text-sm font-medium truncate notranslate ${selectedStandard?.id === std.id ? \'text-indigo-800\' : \'text-slate-800 group-hover:text-indigo-700\'}`}>{std.title} (기준서)</div>\n                                                                                        <div className="text-xs text-slate-500">{std.id}</div>\n                                                                                    </div>';
content = content.replace(standardOuterMarker, standardTitleReplace);

// 5. Related Docs (Document Form)
const docTitleMarker = '<div translate="no" className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate notranslate">{doc.name}</div>';
const docOuterMarker = '<div>\n                                                                                                <div translate="no" className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate notranslate">{doc.name}</div>\n                                                                                                <div className="text-xs text-slate-500">{doc.id}</div>\n                                                                                            </div>';
const docTitleReplace = `<div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, doc.id)}>
                                                                                                <div translate="no" className="text-sm font-medium text-slate-800 group-hover:text-blue-700 group-hover:underline truncate notranslate">{doc.name}</div>
                                                                                                <div className="text-xs text-slate-500">{doc.id}</div>
                                                                                            </div>`;
content = content.replace(docOuterMarker, docTitleReplace);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully');
