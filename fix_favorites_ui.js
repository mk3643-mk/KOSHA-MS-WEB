const fs = require('fs');
const filePath = 'c:\\Users\\user\\Desktop\\vs\\kosha-ms\\src\\app\\page.js';
let content = fs.readFileSync(filePath, 'utf8');

const favSection = `
                    {/* Favorites Section */}
                    {favorites.length > 0 && (
                        <section className="animate-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <div className="bg-yellow-500 p-1.5 rounded-lg text-white">
                                        <Star size={18} fill="currentColor" />
                                    </div>
                                    자주 찾는 문서
                                    <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-1">FAVORITES</span>
                                </h2>
                                <span className="text-xs text-slate-400 font-medium">{favorites.length}개의 즐겨찾기</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {favorites.map(favId => {
                                    let docInfo = null;
                                    koshaData.forEach(chapter => {
                                        if (\`manual-\${chapter.chapter}\` === favId) {
                                            docInfo = { title: chapter.chapter, subtitle: '매뉴얼', type: 'manual', id: favId };
                                        }
                                        chapter.standards.forEach(std => {
                                            if (std.id === favId) {
                                                docInfo = { title: std.title, subtitle: std.id, type: 'standard', id: favId };
                                            }
                                        });
                                    });
                                    
                                    if (!docInfo) return null;

                                    return (
                                        <div 
                                            key={favId}
                                            onClick={() => {
                                                if (docInfo.type === 'manual') {
                                                    setOpenChapter(docInfo.title);
                                                    setSelectedStandard(null);
                                                } else {
                                                    const chapter = koshaData.find(c => c.standards.find(s => s.id === favId));
                                                    if (chapter) {
                                                        setOpenChapter(chapter.chapter);
                                                        setSelectedStandard(chapter.standards.find(s => s.id === favId));
                                                    }
                                                }
                                            }}
                                            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer group shadow-sm"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 group-hover:bg-yellow-100 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="overflow-hidden flex-1">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-1">{docInfo.subtitle}</div>
                                                <h3 className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors" title={docInfo.title}>{docInfo.title}</h3>
                                            </div>
                                            <button 
                                                onClick={(e) => toggleFavorite(e, favId)}
                                                className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                                title="즐겨찾기 해제"
                                            >
                                                <Star size={14} fill="currentColor" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}`;

const targetStr = '{/* Recently Updated Documents Section */}';
const insertionPoint = content.indexOf(targetStr);
if (insertionPoint !== -1) {
    const finalContent = content.substring(0, insertionPoint) + favSection + '\n\n                    ' + content.substring(insertionPoint);
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log('Inserted favorites section successfully');
} else {
    console.error('Failed to find insertion point');
}
