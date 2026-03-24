'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { QUICK_LINKS } from '@/data/koshaData'
import { ArrowLeft, Plus, FileText, UploadCloud, Trash2, Edit2, Check, X, Layers, ExternalLink, Link2 } from 'lucide-react'

export default function AppendixPage() {
    const params = useParams()
    const router = useRouter()
    const docId = params?.id

    const [appendixData, setAppendixData] = useState(null)
    const [documents, setDocuments] = useState([])
    const [newItemTitle, setNewItemTitle] = useState('')
    const [editingDocId, setEditingDocId] = useState(null)
    const [editingTitle, setEditingTitle] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    // 기존 업로드 파일 선택 모달
    const [showFilePicker, setShowFilePicker] = useState(false)
    const [filePickerTargetId, setFilePickerTargetId] = useState(null)
    const [existingFiles, setExistingFiles] = useState([]) // { key, name, url }
    const [filePickerSearch, setFilePickerSearch] = useState('')

    useEffect(() => {
        setIsLoaded(false)
        
        let linkTitle = ""
        const savedLinks = localStorage.getItem('kosha_quick_links')
        if (savedLinks) {
            try {
                const links = JSON.parse(savedLinks)
                const link = links.find(l => l.docId === docId)
                if (link) {
                    setAppendixData(link)
                    linkTitle = link.title
                }
            } catch (e) {
                console.error("Failed to parse quick links")
            }
        }
        
        if (!linkTitle) {
            const staticLink = QUICK_LINKS.find(l => l.docId === docId)
            if (staticLink) {
                setAppendixData(staticLink)
                linkTitle = staticLink.title
            }
        }

        if (linkTitle) {
            const savedData = localStorage.getItem(`appendix_docs_${docId}`)
            if (savedData) {
                try {
                    setDocuments(JSON.parse(savedData))
                } catch (e) {
                    setDocuments([{ id: '1', title: `${linkTitle} 초기 안내서`, customCode: 'DOC-001', fileName: null }])
                }
            } else {
                setDocuments([
                    { id: '1', title: `${linkTitle} 초기 안내서`, customCode: 'DOC-001', fileName: null },
                ])
            }
            setIsLoaded(true)
        }
    }, [docId])

    useEffect(() => {
        if (isLoaded && docId) {
            localStorage.setItem(`appendix_docs_${docId}`, JSON.stringify(documents))
        }
    }, [documents, isLoaded, docId])

    if (!appendixData) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-pulse flex items-center gap-2 text-slate-500"><Layers className="animate-spin" /> 로딩 중...</div>
        </div>
    )

    const handleAddDocument = (e) => {
        e.preventDefault()
        const finalTitle = newItemTitle.trim() || '새 항목'
        const newDoc = {
            id: Date.now().toString(),
            title: finalTitle,
            customCode: `NEW-${Math.floor(1000 + Math.random() * 9000)}`,
            fileName: null
        }
        setDocuments(prev => [...prev, newDoc])
        setNewItemTitle('')
    }

    const handleDelete = (id) => {
        if(confirm('이 항목을 삭제하시겠습니까?')) {
            setDocuments(prev => prev.filter(d => d.id !== id))
        }
    }

    const handleFileUpload = async (e, id) => {
        const file = e.target.files[0]
        if (!file) return

        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.') || file.name

        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (res.ok) {
                const blob = await res.json()
                // 업로드된 파일을 kosha_uploaded_files에도 저장 (메인 대시보드와 공유)
                try {
                    const existingUploads = JSON.parse(localStorage.getItem('kosha_uploaded_files') || '{}')
                    existingUploads[`appendix-${id}-${Date.now()}`] = { name: file.name, url: blob.url }
                    localStorage.setItem('kosha_uploaded_files', JSON.stringify(existingUploads))
                } catch {}
                setDocuments(prev => prev.map(d =>
                    d.id === id
                        ? { ...d, fileName: file.name, fileUrl: blob.url, title: fileNameWithoutExt }
                        : d
                ))
                return
            }
        } catch (err) {
            console.warn('Blob upload failed, saving filename only:', err)
        }

        setDocuments(prev => prev.map(d =>
            d.id === id
                ? { ...d, fileName: file.name, fileUrl: null, title: fileNameWithoutExt }
                : d
        ))
    }

    // 기존 업로드 목록 불러오기 및 모달 열기
    const openFilePicker = (docId) => {
        const raw = localStorage.getItem('kosha_uploaded_files')
        if (!raw) { alert('아직 업로드된 파일이 없습니다.'); return }
        try {
            const uploads = JSON.parse(raw)
            const list = Object.entries(uploads)
                .filter(([, v]) => v && typeof v === 'object' && v.url)
                .map(([key, v]) => ({ key, name: v.name || key, url: v.url }))
            if (list.length === 0) { alert('Vercel에 업로드된 파일이 없습니다. 먼저 파일 업로드 후 이용해주세요.'); return }
            setExistingFiles(list)
            setFilePickerTargetId(docId)
            setFilePickerSearch('')
            setShowFilePicker(true)
        } catch {
            alert('파일 목록을 불러오는 데 실패했습니다.')
        }
    }

    // 기존 파일 선택 완료
    const handleSelectExistingFile = (fileItem) => {
        const fileNameWithoutExt = fileItem.name.split('.').slice(0, -1).join('.') || fileItem.name
        setDocuments(prev => prev.map(d =>
            d.id === filePickerTargetId
                ? { ...d, fileName: fileItem.name, fileUrl: fileItem.url, title: fileNameWithoutExt }
                : d
        ))
        setShowFilePicker(false)
        setFilePickerTargetId(null)
    }

    const handleOpenFile = (doc) => {
        if (doc.fileUrl) {
            window.open(doc.fileUrl, '_blank')
        } else if (doc.fileName) {
            const safePath = doc.fileName.replace(/\\/g, '/').split('/')
                .map(seg => encodeURIComponent(seg)).join('/')
            window.open(`/uploads/${safePath}`, '_blank')
        } else {
            alert('첨부된 파일이 없습니다. 먼저 파일을 업로드해주세요.')
        }
    }

    const handleStartEdit = (doc) => {
        setEditingDocId(doc.id)
        setEditingTitle(doc.title)
    }

    const handleSaveEdit = (id) => {
        if(!editingTitle.trim()) return
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, title: editingTitle.trim() } : d))
        setEditingDocId(null)
    }

    const filteredFiles = existingFiles.filter(f =>
        f.name.toLowerCase().includes(filePickerSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push('/?tab=appendix#appendix-section')}
                            className="bg-white p-2.5 shadow-sm border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Appendix</span>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{appendixData.title}</h1>
                            </div>
                            <p className="text-sm text-slate-500">항목을 추가하고 관련 파일을 업로드 및 관리할 수 있습니다.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 hidden md:flex">
                        <div className="flex items-center gap-1.5 select-none">
                            <svg width="28" height="28" viewBox="0 0 100 100" className="text-[#00509a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 6 C25.7 6 6 25.7 6 50 C6 74.3 25.7 94 50 94 C74.3 94 94 74.3 94 50 C94 25.7 74.3 6 50 6 Z M50 20 C66.568 20 80 33.431 80 50 C80 66.568 66.568 80 50 80 C33.431 80 20 66.568 20 50 C20 33.431 33.431 20 50 20 Z" />
                                <path d="M50 27 L74 54 L26 54 Z" />
                                <path d="M26 63 A 26 26 0 0 0 74 63 Z" />
                            </svg>
                            <span className="text-xl font-black text-[#5e5e5e] tracking-tight leading-none" style={{ fontFamily: 'Pretendard, "Malgun Gothic", sans-serif', letterSpacing: '-0.05em' }}>
                                우미
                            </span>
                        </div>
                        <span className="text-sm font-bold text-slate-600 border-l-2 border-slate-300 pl-3 leading-none flex items-center">
                            안전보건실
                        </span>
                    </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 w-full mb-8 rounded-full opacity-20"></div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-blue-500" />
                                새 항목 추가
                            </h2>
                            <form onSubmit={handleAddDocument} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">항목 명칭</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium text-slate-800 shadow-sm"
                                        placeholder="예: 공통 작업기준서"
                                        value={newItemTitle}
                                        onChange={(e) => setNewItemTitle(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Plus size={18} /> 항목 추가
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={20} className="text-slate-500"/>
                                    등록된 관리 목록
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                        총 {documents.length}개
                                    </span>
                                </h2>
                            </div>
                            
                            {documents.length === 0 ? (
                                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <FileText size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700">등록된 항목이 없습니다</h3>
                                    <p className="text-sm mt-2 text-slate-500 max-w-sm">
                                        좌측 폼을 이용해 '{appendixData.title}'에 속할 새로운 항목(기준서 등)을 추가해보세요.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {documents.map((doc, idx) => (
                                        <div key={doc.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                            
                                            <div className="flex-1 flex gap-4 items-start">
                                                <div className="bg-slate-100/80 border border-slate-200 text-slate-400 p-2.5 rounded-xl shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                                                    <span className="text-xs font-extrabold w-4 h-4 flex items-center justify-center">{idx + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    {editingDocId === doc.id ? (
                                                        <div className="flex gap-2 mb-2 w-full max-w-sm">
                                                            <input 
                                                                autoFocus
                                                                type="text" 
                                                                value={editingTitle} 
                                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                                className="border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full font-medium text-sm"
                                                            />
                                                            <button onClick={() => handleSaveEdit(doc.id)} className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-1.5 rounded-md hover:bg-emerald-100 shadow-sm"><Check size={16}/></button>
                                                            <button onClick={() => setEditingDocId(null)} className="bg-white border border-slate-300 text-slate-500 p-1.5 rounded-md hover:bg-slate-50 shadow-sm"><X size={16}/></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3
                                                                className={`text-[17px] font-bold transition-colors ${
                                                                    doc.fileName
                                                                        ? 'text-blue-700 hover:text-blue-900 hover:underline cursor-pointer'
                                                                        : 'text-slate-800'
                                                                }`}
                                                                onClick={() => doc.fileName && handleOpenFile(doc)}
                                                                title={doc.fileName ? '클릭하여 파일 열기' : ''}
                                                            >
                                                                {doc.title}
                                                                {doc.fileName && <ExternalLink size={14} className="inline ml-1 opacity-60" />}
                                                            </h3>
                                                            <button onClick={() => handleStartEdit(doc)} className="text-slate-300 hover:text-blue-500 transition-colors p-1" title="이름 수정"><Edit2 size={14}/></button>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                                                            ID: {doc.customCode}
                                                        </span>
                                                        {doc.fileName && (
                                                            <button
                                                                onClick={() => handleOpenFile(doc)}
                                                                className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 truncate max-w-[200px] md:max-w-xs hover:bg-emerald-100 transition-colors"
                                                            >
                                                                <Check size={12} strokeWidth={3} /> {doc.fileName}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-start md:justify-end shrink-0 pl-[46px] md:pl-0 gap-2">
                                                {/* 기존 업로드 파일 연결 버튼 */}
                                                <button
                                                    onClick={() => openFilePicker(doc.id)}
                                                    className="border px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300"
                                                    title="이미 업로드된 파일 연결"
                                                >
                                                    <Link2 size={15} />
                                                    기존 파일 연결
                                                </button>
                                                {/* 새 파일 업로드 버튼 */}
                                                <label className={`cursor-pointer border px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm
                                                    ${doc.fileName ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'}`}
                                                >
                                                    <UploadCloud size={16} />
                                                    {doc.fileName ? '파일 변경' : '새로 업로드'}
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                                </label>
                                                <button 
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    title="이 항목 삭제"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                </div>
            </div>

            {/* 기존 업로드 파일 선택 모달 */}
            {showFilePicker && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Link2 size={20} className="text-indigo-600" />
                                    기존 업로드 파일 연결
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">Vercel에 이미 업로드된 파일을 재사용합니다.</p>
                            </div>
                            <button onClick={() => setShowFilePicker(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 border-b border-slate-100">
                            <input
                                type="text"
                                placeholder="파일명 검색..."
                                value={filePickerSearch}
                                onChange={e => setFilePickerSearch(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                autoFocus
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                            {filteredFiles.length === 0 ? (
                                <div className="text-center text-slate-400 py-8 text-sm">검색 결과가 없습니다.</div>
                            ) : filteredFiles.map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => handleSelectExistingFile(f)}
                                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg shrink-0 group-hover:bg-indigo-200 transition-colors">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 truncate">{f.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate">{f.url}</div>
                                    </div>
                                    <div className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">선택</div>
                                </button>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center">
                            <p className="text-xs text-slate-400">총 {filteredFiles.length}개의 파일이 있습니다.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
