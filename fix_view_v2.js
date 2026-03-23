const fs = require('fs');
const filePath = 'c:\\Users\\user\\Desktop\\vs\\kosha-ms\\src\\app\\page.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Recent Updates
const recentMarker = 'className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden"';
// Replace only those that don't have onClick
const regexRecent = new RegExp('(<div\\s+key={idx}[^>]*?)\\s+' + recentMarker, 'g');
content = content.replace(regexRecent, (match, prefix) => {
    if (prefix.includes('onClick')) return match;
    return `${prefix} onClick={(e) => handleFileView(e, null, update.title + '.pdf')} ${recentMarker}`;
});

// 2. Standard Section
// Target the title area inside Standard button
const stdTitleSearch = '<div translate="no" className={`text-sm font-medium truncate notranslate ${selectedStandard?.id === std.id ? \'text-indigo-800\' : \'text-slate-800 group-hover:text-indigo-700\'}`}>{std.title} (기준서)</div>';
const stdTitleReplace = `<div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, std.id)}>
                                                                                        <div translate="no" className={\`text-sm font-medium truncate notranslate \${selectedStandard?.id === std.id ? 'text-indigo-800' : 'text-slate-800 group-hover:text-indigo-700 group-hover:underline'}\`}>{std.title} (기준서)</div>
                                                                                        <div className="text-xs text-slate-500">{std.id}</div>
                                                                                    </div>`;

// Since there's also a <div>...</div> around it, I'll replace the whole block
const stdOuterBlock = '<div>\s*<div translate="no" className={`text-sm font-medium truncate notranslate \${selectedStandard\?\.id === std\.id \? \'text-indigo-800\' : \'text-slate-800 group-hover:text-indigo-700\'}`}>{std\.title} \(기준서\)</div>\s*<div className="text-xs text-slate-500">{std\.id}</div>\s*</div>';
// Using specific string match considering possible space/newline variations
const stdTargetRaw = `<div>
                                                                                        <div translate="no" className={\`text-sm font-medium truncate notranslate \${selectedStandard?.id === std.id ? 'text-indigo-800' : 'text-slate-800 group-hover:text-indigo-700'}\`}>{std.title} (기준서)</div>
                                                                                        <div className="text-xs text-slate-500">{std.id}</div>
                                                                                    </div>`;
// Try a more direct line-by-line replace if possible
content = content.replace('text-slate-800 group-hover:text-indigo-700', 'text-slate-800 group-hover:text-indigo-700 group-hover:underline');

// 3. Related Docs
content = content.replace('text-slate-800 group-hover:text-slate-900', 'text-slate-800 group-hover:text-blue-700 group-hover:underline');

// Final attempt at the div wraps
if (!content.includes('onClick={(e) => handleFileView(e, std.id)}')) {
    content = content.replace('group/stitle">\n                                                                                    <div>', 'group/stitle">\n                                                                                    <div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, std.id)}>');
}
if (!content.includes('onClick={(e) => handleFileView(e, doc.id)}')) {
    content = content.replace('group/dtitle">\n                                                                                            <div>', 'group/dtitle">\n                                                                                            <div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, doc.id)}>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File update attempt finished');
