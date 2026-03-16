'use client'

import React, { useState, useMemo } from 'react'
import { KOSHA_DATA, QUICK_LINKS } from '@/data/koshaData'
import { Search, ChevronDown, ChevronRight, FileText, ClipboardList, Hand, AlertTriangle, FileCheck, Layers, ArrowLeft, Book, BookOpen, UploadCloud, X } from 'lucide-react'

// Map icon string to component
const iconMap = {
    'clipboard-list': ClipboardList,
    'hand': Hand,
    'alert-triangle': AlertTriangle,
    'file-check': FileCheck,
}

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openChapter, setOpenChapter] = useState(null)
    const [selectedStandard, setSelectedStandard] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({}) // Store uploaded file info

    const handleFileUpload = (e, fileId) => {
        const file = e.target.files[0]
        if (file) {
            setUploadedFiles(prev => ({
                ...prev,
                [fileId]: file.name
            }))
        }
    }

    const handleRemoveFile = (e, fileId) => {
        e.preventDefault()
        setUploadedFiles(prev => {
            const newFiles = { ...prev }
            delete newFiles[fileId]
            return newFiles
        })
    }

    // Filter standards by search query
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return KOSHA_DATA

        const query = searchQuery.toLowerCase()

        return KOSHA_DATA.map(chapter => {
            const filteredStandards = chapter.standards.filter(std =>
                std.id.toLowerCase().includes(query) ||
                std.title.toLowerCase().includes(query) ||
                std.related_docs.some(doc => doc.name.toLowerCase().includes(query) || doc.id.toLowerCase().includes(query))
            )

            return {
                ...chapter,
                standards: filteredStandards
            }
        }).filter(chapter => chapter.standards.length > 0 || chapter.chapter.toLowerCase().includes(query))
    }, [searchQuery])

    const handleQuickLink = (docId) => {
        setSearchQuery(docId)
    }

    const toggleChapter = (chapterTitle) => {
        setOpenChapter(openChapter === chapterTitle ? null : chapterTitle)
    }

    const handleGoBack = () => {
        setSearchQuery('')
        setSelectedStandard(null)
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
            {/* Sidebar for Desktop, Top header for Mobile */}
            <aside className="w-full md:w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col flex-shrink-0 h-auto md:h-screen md:sticky md:top-0">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Layers size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">KOSHA-MS</h1>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="문서번호 또는 키워드 검색"
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 hidden md:block">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">매뉴얼 목차</h2>
                    <nav className="space-y-1">
                        {filteredData.map((data, idx) => (
                            <div key={idx} className="mb-2">
                                <button
                                    onClick={() => toggleChapter(data.chapter)}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 flex justify-between items-center transition-colors"
                                >
                                    <span className="text-sm font-medium text-slate-700 truncate pr-2">{data.chapter}</span>
                                    {openChapter === data.chapter ? <ChevronDown size={16} className="text-slate-500 shrink-0" /> : <ChevronRight size={16} className="text-slate-500 shrink-0" />}
                                </button>

                                {openChapter === data.chapter && (
                                    <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                                        {data.standards.map((std) => (
                                            <button
                                                key={std.id}
                                                onClick={() => setSelectedStandard(std)}
                                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${selectedStandard?.id === std.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {std.id} {std.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredData.length === 0 && (
                            <p className="text-sm text-slate-500 px-2 mt-4 text-center">검색 결과가 없습니다.</p>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Quick Links */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            자주 찾는 문서
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-normal">Quick Menu</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {QUICK_LINKS.map((link, idx) => {
                                const Icon = iconMap[link.icon] || FileText;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickLink(link.docId)}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-3 group text-center"
                                    >
                                        <div className="bg-slate-100 p-3 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <Icon size={24} className="text-slate-600 group-hover:text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{link.title}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </section>

                    {/* Mobile Categories (Visible only on mobile) */}
                    <section className="md:hidden">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">매뉴얼 목록</h2>
                        <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            {filteredData.map((data, idx) => (
                                <div key={idx} className="border-b border-slate-100 last:border-0">
                                    <button
                                        onClick={() => toggleChapter(data.chapter)}
                                        className="w-full text-left px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="font-semibold text-slate-800">{data.chapter}</span>
                                        {openChapter === data.chapter ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
                                    </button>
                                    {openChapter === data.chapter && (
                                        <div className="p-2 space-y-1 bg-white">
                                            {data.standards.map((std) => (
                                                <button
                                                    key={std.id}
                                                    onClick={() => {
                                                        setSelectedStandard(std);
                                                        window.scrollBy({ top: 300, behavior: 'smooth' });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${selectedStandard?.id === std.id ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="font-medium">{std.title}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{std.id}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Standards & Related Docs Details */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                문서 열람
                                {searchQuery && <span className="text-xs font-normal text-slate-500 ml-2 border-l border-slate-300 pl-2">"{searchQuery}" 검색 결과</span>}
                            </h2>
                            {(selectedStandard || searchQuery) && (
                                <button
                                    onClick={handleGoBack}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                                >
                                    <ArrowLeft size={16} />
                                    <span>되돌리기</span>
                                </button>
                            )}
                        </div>

                        {!selectedStandard && !searchQuery ? (
                            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center text-slate-500 shadow-sm">
                                <FileText size={48} className="text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-800 mb-1">문서를 선택해주세요</h3>
                                <p className="text-sm">좌측 메뉴나 상단 빠른 검색을 통해 원하는 기준서를 선택하세요.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(selectedStandard ? [{ chapter: "선택된 기준서", standards: [selectedStandard] }] : filteredData).map((chapter, cIdx) => (
                                    <div key={cIdx} className="space-y-4">
                                        {chapter.standards.map((std, sIdx) => (
                                            <div key={`${cIdx}-${sIdx}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                {/* Standard Header */}
                                                <div className="border-b border-slate-100 p-5 bg-gradient-to-r from-blue-50/50 to-transparent">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md mb-2">
                                                                {std.id}
                                                            </span>
                                                            <h3 className="text-xl font-bold text-slate-800">{std.title}</h3>
                                                            {(!selectedStandard) && <p className="text-xs text-slate-500 mt-2">{chapter.chapter}</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 1. Manual Section (상단) */}
                                                <div className="p-5 border-b border-slate-100 bg-white">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                            <Book size={16} className="text-blue-500" />
                                                            매뉴얼 문서
                                                        </h4>
                                                        <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                                            <UploadCloud size={14} />
                                                            {uploadedFiles[`manual-${cIdx}`] ? '변경' : '업로드'}
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, `manual-${cIdx}`)} />
                                                        </label>
                                                    </div>
                                                    <a href="#" className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                                                        <div className="bg-blue-100 p-2 rounded mr-3 group-hover:bg-blue-200 transition-colors">
                                                            <Book size={16} className="text-blue-600" />
                                                        </div>
                                                        <div className="overflow-hidden flex-1">
                                                            <div className="text-sm font-medium text-slate-800 group-hover:text-blue-700 truncate">{chapter.chapter} (매뉴얼)</div>
                                                            <div className="text-xs text-slate-500">KOSHA-MS Manual</div>
                                                        </div>
                                                        {uploadedFiles[`manual-${cIdx}`] && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">
                                                                    {uploadedFiles[`manual-${cIdx}`]}
                                                                </span>
                                                                <button onClick={(e) => handleRemoveFile(e, `manual-${cIdx}`)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </a>
                                                </div>

                                                {/* 2. Standard Section (중단) */}
                                                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                            <BookOpen size={16} className="text-indigo-500" />
                                                            기준서 문서
                                                        </h4>
                                                        <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors">
                                                            <UploadCloud size={14} />
                                                            {uploadedFiles[std.id] ? '변경' : '업로드'}
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, std.id)} />
                                                        </label>
                                                    </div>
                                                    <a href="#" className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors group bg-white">
                                                        <div className="bg-indigo-100 p-2 rounded mr-3 group-hover:bg-indigo-200 transition-colors">
                                                            <BookOpen size={16} className="text-indigo-600" />
                                                        </div>
                                                        <div className="overflow-hidden flex-1">
                                                            <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 truncate">{std.title} (기준서)</div>
                                                            <div className="text-xs text-slate-500">{std.id}</div>
                                                        </div>
                                                        {uploadedFiles[std.id] && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">
                                                                    {uploadedFiles[std.id]}
                                                                </span>
                                                                <button onClick={(e) => handleRemoveFile(e, std.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </a>
                                                </div>

                                                {/* 3. Related Documents List (하단) */}
                                                <div className="p-5 bg-white">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                            <FileText size={16} className="text-slate-400" />
                                                            관련 문서 및 양식
                                                        </h4>
                                                    </div>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {std.related_docs.map((doc, dIdx) => (
                                                            <li key={dIdx}>
                                                                <div className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors group relative">
                                                                    <div className="bg-slate-100 p-2 rounded mr-3 group-hover:bg-slate-200 transition-colors">
                                                                        <FileText size={16} className="text-slate-500 group-hover:text-slate-700" />
                                                                    </div>
                                                                    <div className="overflow-hidden flex-1">
                                                                        <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900 truncate">{doc.name}</div>
                                                                        <div className="text-xs text-slate-500">{doc.id}</div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {uploadedFiles[doc.id] && (
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[80px]">
                                                                                    {uploadedFiles[doc.id]}
                                                                                </span>
                                                                                <button onClick={(e) => handleRemoveFile(e, doc.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                                                                                    <X size={14} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        <label className="cursor-pointer p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title={uploadedFiles[doc.id] ? "파일 변경" : "파일 업로드"}>
                                                                            <UploadCloud size={16} />
                                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {std.related_docs.length === 0 && (
                                                        <p className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-100">관련 문서가 없습니다.</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </main>
        </div>
    )
}
