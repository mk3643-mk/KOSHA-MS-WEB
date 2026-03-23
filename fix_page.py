import sys

path = r'c:\Users\user\Desktop\vs\kosha-ms\src\app\page.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '{/* 2.5 Revision History Section (Versioning) */}' in line:
        new_lines.append(line)
        # Skip until the next section
        skip = True
        continue
    if skip:
        if '{/* 3. Related Documents List (하단) */}' in line:
            # Insert the correct component here
            component = """                                                    {selectedStandard && (
                                                        <div className="p-5 border-b border-slate-100 bg-white">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                                    <History size={16} className="text-amber-500" />
                                                                    개정 이력 관리
                                                                    <span className="text-xs font-normal text-slate-500 bg-amber-50 text-amber-700 px-2 py-0.5 rounded ml-2">
                                                                        Versioning
                                                                    </span>
                                                                </h4>
                                                                <button 
                                                                   onClick={() => setIsAddingRevision(!isAddingRevision)}
                                                                   className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors"
                                                                >
                                                                    {isAddingRevision ? <X size={14} /> : <Plus size={14} />}
                                                                    {isAddingRevision ? '취소' : '이력 추가'}
                                                                </button>
                                                            </div>

                                                            {isAddingRevision && (
                                                                <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                                        <div>
                                                                            <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">버전</label>
                                                                            <input 
                                                                               type="text" 
                                                                               placeholder="1.1" 
                                                                               className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                               value={newRevision.version}
                                                                               onChange={e => setNewRevision({...newRevision, version: e.target.value})}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">개정일자</label>
                                                                            <input 
                                                                               type="date" 
                                                                               className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                               value={newRevision.date}
                                                                               onChange={e => setNewRevision({...newRevision, date: e.target.value})}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">개정내용</label>
                                                                            <input 
                                                                               type="text" 
                                                                               placeholder="주요 변경 사항 입력" 
                                                                               className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                               value={newRevision.description}
                                                                               onChange={e => setNewRevision({...newRevision, description: e.target.value})}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">작성자</label>
                                                                            <input 
                                                                               type="text" 
                                                                               placeholder="이름" 
                                                                               className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                               value={newRevision.author}
                                                                               onChange={e => setNewRevision({...newRevision, author: e.target.value})}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-3">
                                                                            <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">문서 첨부 (구버전 보관용)</label>
                                                                            <div className="flex items-center gap-2">
                                                                                <label className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100/30 transition-colors">
                                                                                    <UploadCloud size={14} className="text-amber-600" />
                                                                                    <span className={newRevision.fileName ? "text-amber-900 font-medium" : "text-slate-400"}>
                                                                                        {newRevision.fileName || "이전 버전 문서를 선택하세요..."}
                                                                                    </span>
                                                                                    <input 
                                                                                       type="file" 
                                                                                       className="hidden" 
                                                                                       onChange={e => {
                                                                                           const file = e.target.files[0];
                                                                                           if (file) setNewRevision({...newRevision, fileName: file.name});
                                                                                       }}
                                                                                    />
                                                                                </label>
                                                                                {newRevision.fileName && (
                                                                                    <button 
                                                                                       onClick={() => setNewRevision({...newRevision, fileName: ''})}
                                                                                       className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                                                    >
                                                                                        <X size={16} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-end gap-2 mt-2">
                                                                        <button 
                                                                           onClick={() => handleAddRevision(selectedStandard.id)}
                                                                           className="px-4 py-1.5 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                                                                        >
                                                                            저장하기
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="overflow-hidden border border-slate-200 rounded-xl">
                                                                <table className="w-full text-left text-xs border-collapse">
                                                                    <thead>
                                                                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                                                                            <th className="px-4 py-2 w-16">버전</th>
                                                                            <th className="px-4 py-2 w-28">개정일자</th>
                                                                            <th className="px-4 py-2">개정내용</th>
                                                                            <th className="px-4 py-2 w-32">첨부문서</th>
                                                                            <th className="px-4 py-2 w-20">작성자</th>
                                                                            <th className="px-4 py-2 w-10"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {selectedStandard.revisions && selectedStandard.revisions.length > 0 ? (
                                                                            selectedStandard.revisions.map((rev, rIdx) => (
                                                                                <tr key={rIdx} className="hover:bg-slate-50 group">
                                                                                    <td className="px-4 py-2.5 font-bold text-blue-600">v{rev.version}</td>
                                                                                    <td className="px-4 py-2.5 text-slate-500">{rev.date}</td>
                                                                                    <td className="px-4 py-2.5 text-slate-700 font-medium">{rev.description}</td>
                                                                                    <td className="px-4 py-2.5">
                                                                                        {rev.fileName ? (
                                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 w-fit max-w-[120px] cursor-pointer hover:bg-blue-100 transition-colors">
                                                                                                <FileText size={12} className="shrink-0" />
                                                                                                <span className="truncate text-[11px]">{rev.fileName}</span>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-slate-300">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-2.5 text-slate-500">{rev.author}</td>
                                                                                    <td className="px-4 py-2.5">
                                                                                        <button 
                                                                                           onClick={() => handleDeleteRevision(selectedStandard.id, rev.version)}
                                                                                           className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                                                                                        >
                                                                                            <Trash2 size={12} />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 italic bg-white">개정 이력이 없습니다.</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
\n"""
            new_lines.append(component)
            new_lines.append(line)
            skip = False
        continue
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
