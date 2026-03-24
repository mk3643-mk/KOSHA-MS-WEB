'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { KOSHA_DATA, QUICK_LINKS } from '@/data/koshaData'
import { Search, ChevronDown, ChevronUp, ChevronRight, FileText, ClipboardList, Hand, AlertTriangle, FileCheck, Layers, ArrowLeft, Book, BookOpen, UploadCloud, X, Home, Clock, ExternalLink, Edit2, Check, Plus, Trash2, History, Star, Paperclip, RotateCcw } from 'lucide-react'

// Map icon string to component
const iconMap = {
    'clipboard-list': ClipboardList,
    'hand': Hand,
    'alert-triangle': AlertTriangle,
    'file-check': FileCheck,
}

const DEFAULT_RECENT_UPDATES = [
    { type: '매뉴얼', title: '08. 안전보건관리 활동 (매뉴얼)', date: '2024-03-19', status: 'new', category: 'manual' },
    { type: '기준서', title: 'SHMS-404 위험성평가 운영기준', date: '2024-03-18', status: 'updated', category: 'standard' },
    { type: '양식', title: 'M02-08-11 작업허가서 (Form)', date: '2024-03-17', status: 'updated', category: 'form' },
    { type: '문서목록', title: '현장 문서체계표 및 준공이관 목록', date: '2024-03-15', status: 'new', category: 'other' },
];

function DashboardContent() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openChapter, setOpenChapter] = useState(null)
    const [selectedStandard, setSelectedStandard] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({}) 
    const [koshaData, setKoshaData] = useState(KOSHA_DATA)
    const [editingItem, setEditingItem] = useState(null) 
    const [editValue, setEditValue] = useState('')
    const [quickLinks, setQuickLinks] = useState(QUICK_LINKS)
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [isAddingRevision, setIsAddingRevision] = useState(false)
    const [newRevision, setNewRevision] = useState({ version: '', date: new Date().toISOString().split('T')[0], description: '', author: '', fileName: '' })
    const [favorites, setFavorites] = useState([])
    const [recentUpdates, setRecentUpdates] = useState(DEFAULT_RECENT_UPDATES)
    const [isAllUpdatesModalOpen, setIsAllUpdatesModalOpen] = useState(false)
    const [editingFileId, setEditingFileId] = useState(null)
    const [tempFilePath, setTempFilePath] = useState('')
    const [history, setHistory] = useState([])
    const [showUndoToast, setShowUndoToast] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Helper added to fix React object render crash
    const getFileName = (fileData) => {
        if (!fileData) return '';
        if (typeof fileData === 'object' && fileData !== null) return fileData.name || '';
        return String(fileData);
    };

    const uploadToBlob = async (file) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            return await res.json();
        } catch (error) {
            console.error('Upload Error:', error);
            alert('파일 업로드에 실패했습니다. (Vercel 환경 변수가 올바른지 확인해주세요)');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const pushToHistory = () => {
        const state = {
            koshaData: JSON.parse(JSON.stringify(koshaData)),
            uploadedFiles: { ...uploadedFiles },
            quickLinks: JSON.parse(JSON.stringify(quickLinks)),
            recentUpdates: [...recentUpdates]
        };
        setHistory(prev => [state, ...prev].slice(0, 10)); // Keep last 10 steps
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const [prev, ...rest] = history;
        setKoshaData(prev.koshaData);
        setUploadedFiles(prev.uploadedFiles);
        setQuickLinks(prev.quickLinks);
        setRecentUpdates(prev.recentUpdates);
        setHistory(rest);
        setShowUndoToast(false);
    };

    const handleFileView = (e, fileId, fileNameOverride = null) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const fileData = (fileId && typeof uploadedFiles[fileId] === 'object') ? uploadedFiles[fileId] : null;
        if (fileData && fileData.url) {
            window.open(fileData.url, '_blank');
            return;
        }

        let fileName = fileNameOverride || (fileId ? uploadedFiles[fileId] : null);
        if (typeof fileName === 'object') fileName = fileName.name;

        if (!fileName) {
            alert('첨부된 파일이 없습니다. 먼저 파일을 업로드해주세요.');
            return;
        }
        
        // Normalize slashes and encode segments to preserve path structure
        const safePath = fileName.replace(/\\/g, '/').split('/')
            .map(segment => encodeURIComponent(segment))
            .join('/');
            
        const fileUrl = `/uploads/${safePath}`;
        window.open(fileUrl, '_blank');
    };

    const searchParams = useSearchParams();
    useEffect(() => {
        const savedLinks = localStorage.getItem('kosha_quick_links')
        if (savedLinks) { try { setQuickLinks(JSON.parse(savedLinks)) } catch (e) {} }
        const savedFavorites = localStorage.getItem('kosha_favorites')
        if (savedFavorites) { try { setFavorites(JSON.parse(savedFavorites)) } catch (e) {} }
        const savedUploadedFiles = localStorage.getItem('kosha_uploaded_files')
        if (savedUploadedFiles) { try { setUploadedFiles(JSON.parse(savedUploadedFiles)) } catch (e) {} }
        const savedMainData = localStorage.getItem('kosha_main_data')
        if (savedMainData) { try { setKoshaData(JSON.parse(savedMainData)) } catch (e) {} }
        const savedUpdates = localStorage.getItem('kosha_recent_updates')
        if (savedUpdates) { try { setRecentUpdates(JSON.parse(savedUpdates)) } catch (e) {} }
        
        // Check for specific tab parameter to auto-open sections (like Appendix)
        const tab = searchParams.get('tab');
        if (tab === 'appendix') {
            setOpenChapter('부록');
        }
        
        setIsDataLoaded(true)
    }, [searchParams])

    useEffect(() => {
        if (isDataLoaded) {
            localStorage.setItem('kosha_quick_links', JSON.stringify(quickLinks))
            localStorage.setItem('kosha_favorites', JSON.stringify(favorites))
            localStorage.setItem('kosha_uploaded_files', JSON.stringify(uploadedFiles))
            localStorage.setItem('kosha_main_data', JSON.stringify(koshaData))
            localStorage.setItem('kosha_recent_updates', JSON.stringify(recentUpdates))
        }
    }, [quickLinks, favorites, uploadedFiles, koshaData, recentUpdates, isDataLoaded])

    const toggleFavorite = (e, docId) => {
        e.preventDefault(); e.stopPropagation();
        setFavorites(prev => prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]);
    };

    const handleStartEdit = (e, type, id, currentValue, parentId = null) => {
        e.preventDefault(); e.stopPropagation();
        setEditingItem({ type, id, parentId }); setEditValue(currentValue);
    }

    const handleSaveEdit = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!editingItem) return;
        const { type, id: oldId, parentId } = editingItem;
        const trimmedValue = editValue.trim();

        if (type === 'quicklink') {
            setQuickLinks(prev => prev.map(link => link.docId === oldId ? { ...link, title: trimmedValue } : link));
            setEditingItem(null); return;
        }

        let actualNewId = oldId;
        let actualNewTitle = trimmedValue;

        if (type === 'standard' || type === 'doc') {
            const match = trimmedValue.match(/^(SHMS-[A-Z0-9가-힣-]+)(?:\s+(.*))?$/i);
            if (match) {
                actualNewId = match[1];
                actualNewTitle = (match[2] && match[2].trim()) || actualNewId;
            }
        }

        if (oldId !== actualNewId) {
            setUploadedFiles(prev => {
                if (!prev[oldId]) return prev;
                const next = { ...prev, [actualNewId]: prev[oldId] };
                delete next[oldId]; return next;
            });
            setFavorites(prev => prev.map(f => f === oldId ? actualNewId : f));
            setRecentUpdates(prev => prev.map(u => u.id === oldId ? { ...u, id: actualNewId } : u));
        }

        const now = new Date().toLocaleDateString('ko-KR');
        pushToHistory();
        const newData = koshaData.map(chapter => {
            if (type === 'standard') {
                if (chapter.chapter !== parentId) return chapter;
                const newStandards = chapter.standards.map(std => std.id === oldId ? { ...std, id: actualNewId, title: actualNewTitle, lastModified: now } : std);
                return { ...chapter, standards: newStandards };
            }
            if (type === 'doc') {
                const newStandards = chapter.standards.map(std => {
                    if (std.id !== parentId) return std;
                    const newRelatedDocs = std.related_docs.map(doc => doc.id === oldId ? { ...doc, id: actualNewId, name: actualNewTitle, lastModified: now } : doc);
                    return { ...std, related_docs: newRelatedDocs };
                });
                return { ...chapter, standards: newStandards };
            }
            if (type === 'manual' && chapter.chapter === oldId) return { ...chapter, chapter: actualNewTitle, lastModified: now };
            return chapter;
        });

        setKoshaData(newData);
        if (type === 'manual' && openChapter === oldId) setOpenChapter(actualNewTitle);
        setEditingItem(null);
    }

    const handleCancelEdit = (e) => { e.preventDefault(); e.stopPropagation(); setEditingItem(null); }

    const handleFileUpload = async (e, fileId) => {
        const file = e.target.files[0];
        if (file) {
            alert("업로드 중입니다... 잠시만 기다려주세요.");
            const uploadedBlob = await uploadToBlob(file);
            const fileData = uploadedBlob ? { name: file.name, url: uploadedBlob.url } : file.name;
            const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.') || file.name;
            pushToHistory();
            setUploadedFiles(prev => ({ ...prev, [fileId]: fileData }));
            setKoshaData(prevData => prevData.map(chapter => {
                const now = new Date().toLocaleDateString('ko-KR');
                let newChapterName = chapter.chapter;
                let chapterLastMod = chapter.lastModified;
                if (chapter.chapter === fileId || `manual-${chapter.chapter}` === fileId) {
                    chapterLastMod = now;
                }
                const newStandards = chapter.standards.map(std => {
                    let newTitle = std.title;
                    let stdLastMod = std.lastModified;
                    if (std.id === fileId) {
                        const escapedId = std.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        newTitle = fileNameWithoutExt.replace(new RegExp(`^${escapedId}\\s*`, 'i'), '').trim() || fileNameWithoutExt;
                        stdLastMod = now;
                    }
                    const newRelatedDocs = std.related_docs.map(doc => {
                        if (doc.id === fileId) return { ...doc, name: fileNameWithoutExt.replace(new RegExp(`^${doc.id}\\s*`, 'i'), '').trim() || fileNameWithoutExt, lastModified: now };
                        return doc;
                    });
                    const newAttachments = (std.attachments || []).map(att => {
                        if (att.id === fileId) return { ...att, lastModified: now };
                        return att;
                    });
                    return { ...std, title: newTitle, related_docs: newRelatedDocs, attachments: newAttachments, lastModified: stdLastMod };
                });
                return { ...chapter, chapter: newChapterName, standards: newStandards, lastModified: chapterLastMod };
            }));
            if (openChapter === fileId) setOpenChapter(fileNameWithoutExt);

            // Update recent updates
            const type = fileId.includes('manual') ? '매뉴얼' : (fileId.includes('EXT') || fileId.includes('FORM') ? '양식' : '기준서');
            const category = fileId.includes('manual') ? 'manual' : (fileId.includes('EXT') || fileId.includes('FORM') ? 'form' : 'standard');
            const newUpdate = {
                id: fileId,
                type,
                title: fileNameWithoutExt,
                date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
                status: 'updated',
                category
            };
            setRecentUpdates(prev => [newUpdate, ...prev]);
        }
    }

    const handleRemoveFile = (e, fileId) => {
        e.preventDefault();
        pushToHistory();
        setUploadedFiles(prev => { const newFiles = { ...prev }; delete newFiles[fileId]; return newFiles; });
        setShowUndoToast(true); setTimeout(() => setShowUndoToast(false), 5000);
    }

    const activeChapter = useMemo(() => {
        if (selectedStandard) return koshaData.find(c => c.standards.some(s => s.id === selectedStandard.id));
        if (openChapter && !searchQuery.trim()) return koshaData.find(c => c.chapter === openChapter);
        return null;
    }, [selectedStandard, openChapter, searchQuery, koshaData]);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return koshaData;
        const query = searchQuery.toLowerCase();
        return koshaData.map(chapter => {
            const filteredStandards = chapter.standards.filter(std =>
                std.id.toLowerCase().includes(query) || std.title.toLowerCase().includes(query) ||
                std.related_docs.some(doc => doc.name.toLowerCase().includes(query) || doc.id.toLowerCase().includes(query))
            )
            return { ...chapter, standards: filteredStandards };
        }).filter(chapter => chapter.standards.length > 0 || chapter.chapter.toLowerCase().includes(query));
    }, [searchQuery, koshaData]);

    const router = useRouter();
    const handleQuickLink = (docId) => router.push(`/appendix/${docId}`);

    const fileInputRef = React.useRef(null);
    const standardInputRef = React.useRef(null);
    const masterListInputRef = React.useRef(null);
    const [currentChapterRef, setCurrentChapterRef] = useState(null);

    const triggerManualUpload = (e, chapterTitle) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentChapterRef(chapterTitle);
        setTimeout(() => fileInputRef.current?.click(), 0);
    }

    const triggerStandardAdd = (e, chapterTitle) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentChapterRef(chapterTitle);
        setTimeout(() => standardInputRef.current?.click(), 0);
    }

    const triggerMasterListUpload = (e) => {
        e.preventDefault(); e.stopPropagation();
        masterListInputRef.current?.click();
    }

    const toggleChapter = (chapterTitle) => {
        if (openChapter === chapterTitle) { setOpenChapter(null); setSelectedStandard(null); }
        else { selectChapter(chapterTitle); }
    }

    const selectChapter = (chapterTitle) => {
        setOpenChapter(chapterTitle); setSelectedStandard(null); setSearchQuery('');
        setTimeout(() => {
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    }

    const handleGoBack = () => { setSearchQuery(''); setSelectedStandard(null); }

    const handleAddAttachment = async (e, stdId) => {
        const file = e.target.files[0];
        if (!file) return;

        alert("업로드 중입니다... 잠시만 기다려주세요.");
        const uploadedBlob = await uploadToBlob(file);
        const fileData = uploadedBlob ? { name: file.name, url: uploadedBlob.url } : file.name;

        const now = new Date().toLocaleDateString('ko-KR');
        pushToHistory();
        const newAttachment = { id: `ATT-${stdId}-${Math.floor(Math.random() * 9000 + 1000)}`, name: file.name, lastModified: now };
        setKoshaData(prev => prev.map(chapter => ({
            ...chapter,
            standards: chapter.standards.map(std => {
                if (std.id === stdId) return { ...std, attachments: [...(std.attachments || []), newAttachment], lastModified: now };
                return std;
            })
        })));
        setUploadedFiles(prev => ({ ...prev, [newAttachment.id]: fileData }));
        
        if (selectedStandard?.id === stdId) {
            setSelectedStandard(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), newAttachment],
                lastModified: now
            }));
        }
    };

    const handleDeleteAttachment = (stdId, attId) => {
        if (!confirm('이 첨부 문서를 삭제하시겠습니까?')) return;
        pushToHistory();
        setKoshaData(prev => prev.map(chapter => ({
            ...chapter,
            standards: chapter.standards.map(std => {
                if (std.id === stdId) return { ...std, attachments: (std.attachments || []).filter(a => a.id !== attId) };
                return std;
            })
        })));
        
        if (selectedStandard?.id === stdId) {
            setSelectedStandard(prev => ({ ...prev, attachments: (prev.attachments || []).filter(a => a.id !== attId) }));
        }
        
        setUploadedFiles(prev => { const next = { ...prev }; delete next[attId]; return next; });
        setShowUndoToast(true); setTimeout(() => setShowUndoToast(false), 5000);
    };

    const handleAddRelatedDoc = async (e, standardId) => {
        const file = e.target.files[0];
        if (!file || !standardId) return;

        alert("업로드 중입니다... 잠시만 기다려주세요.");
        const uploadedBlob = await uploadToBlob(file);
        const fileData = uploadedBlob ? { name: file.name, url: uploadedBlob.url } : file.name;

        const now = new Date().toLocaleDateString('ko-KR');
        pushToHistory();
        const newDoc = { id: `${standardId}-EXT-${Date.now().toString().slice(-4)}`, name: file.name.split('.')[0] || "새 문서양식", lastModified: now };
        setKoshaData(prev => prev.map(chapter => {
            const updatedStandards = chapter.standards.map(std => {
                if (std.id === standardId) return { ...std, related_docs: [...std.related_docs, newDoc], lastModified: now };
                return std;
            });
            return { ...chapter, standards: updatedStandards };
        }));
        setUploadedFiles(prev => ({ ...prev, [newDoc.id]: fileData }));
        if (selectedStandard?.id === standardId) {
            setSelectedStandard(prev => ({ ...prev, related_docs: [...prev.related_docs, newDoc], lastModified: now }));
        }

        // Update recent updates
        const newUpdate = {
            id: newDoc.id,
            type: '양식',
            title: newDoc.name,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
            status: 'new',
            category: 'form'
        };
        setRecentUpdates(prev => [newUpdate, ...prev]);
    }

    const handleDeleteRelatedDoc = (docId) => {
        if (!confirm('해당 양식을 삭제하시겠습니까?')) return;
        pushToHistory();
        setKoshaData(prev => prev.map(chapter => {
            const updatedStandards = chapter.standards.map(std => ({ ...std, related_docs: std.related_docs.filter(doc => doc.id !== docId) }));
            return { ...chapter, standards: updatedStandards };
        }));
        if (selectedStandard) {
             setSelectedStandard(prev => ({ ...prev, related_docs: prev.related_docs.filter(doc => doc.id !== docId) }));
        }
        setShowUndoToast(true); setTimeout(() => setShowUndoToast(false), 5000);
    }

    const handleAddStandard = async (e, chapterId) => {
        const file = e.target.files[0];
        if (!file || !chapterId) return;

        alert("업로드 중입니다... 잠시만 기다려주세요.");
        const uploadedBlob = await uploadToBlob(file);
        const fileData = uploadedBlob ? { name: file.name, url: uploadedBlob.url } : file.name;

        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.') || file.name;
        
        let id = '';
        let title = fileNameWithoutExt;
        
        // Try to parse ID from filename (e.g., SHMS-101 Title)
        const idMatch = fileNameWithoutExt.match(/^(SHMS-[A-Z0-9가-힣-]+)\s+(.*)$/i);
        if (idMatch) {
            id = idMatch[1];
            title = idMatch[2].trim();
        } else {
            id = `SHMS-${Math.floor(Math.random() * 800) + 200}`;
            title = fileNameWithoutExt;
        }

        pushToHistory();
        const newStandard = { id, title: title || fileNameWithoutExt, revisions: [], related_docs: [] };
        setKoshaData(prev => prev.map(chap => {
            if (chap.chapter === chapterId) return { ...chap, standards: [...chap.standards, newStandard] };
            return chap;
        }));
        setSelectedStandard(newStandard); setUploadedFiles(prev => ({ ...prev, [id]: fileData }));

        // Update recent updates
        const newUpdate = {
            id: id,
            type: '기준서',
            title: fileNameWithoutExt,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
            status: 'new',
            category: 'standard'
        };
        setRecentUpdates(prev => [newUpdate, ...prev]);
    }

    const handleDeleteStandard = (stdId) => {
        if (!confirm('이 기준서를 삭제하시겠습니까?')) return;
        pushToHistory();
        setKoshaData(prev => prev.map(chapter => ({
            ...chapter,
            standards: chapter.standards.filter(s => s.id !== stdId)
        })));
        if (selectedStandard?.id === stdId) setSelectedStandard(null);
        setShowUndoToast(true); setTimeout(() => setShowUndoToast(false), 5000);
    }

    const handleAddRevision = (stdId) => {
        if (!newRevision.version || !newRevision.description) { alert('버전과 개정내용을 입력해주세요.'); return; }
        pushToHistory();
        const revisionToAdd = { ...newRevision };
        setKoshaData(prev => prev.map(chapter => {
            const updatedStandards = chapter.standards.map(std => {
                if (std.id === stdId) return { ...std, revisions: [...(std.revisions || []), revisionToAdd] };
                return std;
            });
            return { ...chapter, standards: updatedStandards };
        }));
        if (selectedStandard?.id === stdId) {
            setSelectedStandard(prev => ({ ...prev, revisions: [...(prev.revisions || []), revisionToAdd] }));
        }

        // Update recent updates
        const stdTitle = koshaData.flatMap(c => c.standards).find(s => s.id === stdId)?.title || "기준서";
        const newUpdate = {
            id: stdId,
            type: '기준서',
            title: `${stdTitle} (v${revisionToAdd.version} 개정)`,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
            status: 'updated',
            category: 'standard'
        };
        setRecentUpdates(prev => [newUpdate, ...prev]);

        setIsAddingRevision(false);
        setNewRevision({ version: '', date: new Date().toISOString().split('T')[0], description: '', author: '', fileName: '' });
    }

    const handleDeleteRevision = (stdId, version) => {
        if (!confirm('해당 개정 이력을 삭제하시겠습니까?')) return;
        pushToHistory();
        setKoshaData(prev => prev.map(chapter => {
            const updatedStandards = chapter.standards.map(std => {
                if (std.id === stdId) return { ...std, revisions: (std.revisions || []).filter(rev => rev.version !== version) };
                return std;
            });
            return { ...chapter, standards: updatedStandards };
        }));
        if (selectedStandard?.id === stdId) {
            setSelectedStandard(prev => ({ ...prev, revisions: (prev.revisions || []).filter(rev => rev.version !== version) }));
        }
        setShowUndoToast(true); setTimeout(() => setShowUndoToast(false), 5000);
    }

    const handleGoHome = () => { setSearchQuery(''); setSelectedStandard(null); setOpenChapter(null); }

    const handleStartEditFilePath = (e, fileId, currentPath) => {
        e.preventDefault(); e.stopPropagation();
        setEditingFileId(fileId); setTempFilePath(currentPath);
    }

    const handleSaveFilePath = (e) => {
        e.preventDefault(); e.stopPropagation();
        pushToHistory();
        setUploadedFiles(prev => ({ ...prev, [editingFileId]: tempFilePath }));
        setEditingFileId(null);
    }

    const moveStandard = (chapterTitle, stdId, direction) => {
        pushToHistory();
        setKoshaData(prev => prev.map(chapter => {
            if (chapter.chapter !== chapterTitle) return chapter;
            const index = chapter.standards.findIndex(s => s.id === stdId);
            if (index === -1) return chapter;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= chapter.standards.length) return chapter;
            const newStandards = [...chapter.standards];
            [newStandards[index], newStandards[newIndex]] = [newStandards[newIndex], newStandards[index]];
            return { ...chapter, standards: newStandards };
        }));
    };

    // Keyboard Navigation Logic
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (editingItem || editingFileId) return;

            // Get all visible items in the sidebar
            const visibleItems = [];
            filteredData.forEach(chapter => {
                visibleItems.push({ type: 'chapter', id: chapter.chapter, data: chapter });
                if (openChapter === chapter.chapter) {
                    chapter.standards.forEach(std => {
                        visibleItems.push({ type: 'standard', id: std.id, data: std, parentChapter: chapter.chapter });
                    });
                }
            });

            if (visibleItems.length === 0) return;

            // Find current index
            let currentIndex = -1;
            if (selectedStandard) {
                currentIndex = visibleItems.findIndex(item => item.type === 'standard' && item.id === selectedStandard.id);
            } else if (activeChapter) {
                currentIndex = visibleItems.findIndex(item => item.type === 'chapter' && item.id === activeChapter.chapter);
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = Math.min(currentIndex + 1, visibleItems.length - 1);
                if (nextIndex !== currentIndex) {
                    const nextItem = visibleItems[nextIndex];
                    if (nextItem.type === 'chapter') {
                        setActiveChapter(nextItem.data);
                        setOpenChapter(nextItem.id);
                        setSelectedStandard(null);
                    } else {
                        setSelectedStandard(nextItem.data);
                        setOpenChapter(nextItem.parentChapter);
                    }
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = Math.max(currentIndex - 1, 0);
                if (prevIndex !== currentIndex) {
                    const prevItem = visibleItems[prevIndex];
                    if (prevItem.type === 'chapter') {
                        setActiveChapter(prevItem.data);
                        setOpenChapter(prevItem.id);
                        setSelectedStandard(null);
                    } else {
                        setSelectedStandard(prevItem.data);
                        setOpenChapter(prevItem.parentChapter);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredData, openChapter, selectedStandard, activeChapter, editingItem, editingFileId]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
            <aside className="w-full md:w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col flex-shrink-0 h-auto md:h-screen md:sticky md:top-0">
                <div className="p-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-100"><Layers size={20} /></div>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">KOSHA-MS</h1>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={handleGoHome} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="처음으로 돌아가기">
                                <Home size={18} />
                            </button>
                            <button onClick={handleUndo} disabled={history.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${history.length > 0 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'text-slate-300 pointer-events-none'}`} title="직전 작업 되돌리기">
                                <RotateCcw size={14} className={history.length > 0 ? 'animate-in fade-in transition-transform group-hover:rotate-[-45deg]' : ''} />
                                <span>되돌리기</span>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="문서번호 또는 키워드 검색" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all bg-slate-50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="mt-4">
                        <div className={`p-3 rounded-xl border border-blue-100 transition-all flex items-center justify-between group ${uploadedFiles['master-list'] ? 'bg-blue-50 hover:bg-blue-100 shadow-sm' : 'bg-slate-50 border-dashed hover:border-blue-300'}`}>
                            <div className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1" onClick={(e) => uploadedFiles['master-list'] && handleFileView(e, 'master-list')}>
                                <div className={`p-2 rounded-lg ${uploadedFiles['master-list'] ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}><Layers size={18} /></div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold text-slate-700 truncate">전체 문서목록표</h4>
                                    <p className="text-[10px] text-slate-500 truncate">{uploadedFiles['master-list'] ? (typeof uploadedFiles['master-list'] === 'object' ? uploadedFiles['master-list'].name : uploadedFiles['master-list']) : 'PDF 파일을 업로드하세요'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                                <button onClick={triggerMasterListUpload} className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors" title="목록표 업로드"><UploadCloud size={14} /></button>
                                {uploadedFiles['master-list'] && (
                                    <button onClick={(e) => handleRemoveFile(e, 'master-list')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors" title="삭제"><X size={14} /></button>
                                )}
                            </div>
                        </div>
                        <input type="file" ref={masterListInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'master-list')} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 hidden md:block">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">매뉴얼 목차</h2>
                    <nav className="space-y-1">
                        {filteredData.map((data, idx) => (
                            <div key={idx} className="mb-2">
                                <div className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center group/chapter ${openChapter === data.chapter ? 'bg-slate-50' : 'hover:bg-slate-100'}`}>
                                    <div className="flex-1 truncate mr-2" onClick={() => selectChapter(data.chapter)}>
                                        {editingItem?.type === 'manual' && editingItem?.id === data.chapter ? (
                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit(e)} className="w-full text-xs font-semibold text-slate-700 border-b border-blue-500 focus:outline-none bg-white px-1" autoFocus />
                                                <button onClick={handleSaveEdit} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check size={12} /></button>
                                                <button onClick={handleCancelEdit} className="p-0.5 text-red-600 hover:bg-red-50 rounded"><X size={12} /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <span title={data.chapter} className="text-sm font-medium text-slate-700 truncate">{data.chapter}</span>
                                                <div className="flex items-center gap-0.5">
                                                    <button onClick={e => toggleFavorite(e, `manual-${data.chapter}`)} className={`p-1 transition-all ${favorites.includes(`manual-${data.chapter}`) ? 'text-yellow-500 opacity-100' : 'opacity-0 group-hover/chapter:opacity-100 text-slate-400 hover:text-yellow-500'}`} title="즐겨찾기">
                                                        <Star size={12} fill={favorites.includes(`manual-${data.chapter}`) ? "currentColor" : "none"} />
                                                    </button>
                                                    <button className="opacity-0 group-hover/chapter:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all" title="매뉴얼 업로드" onClick={e => triggerManualUpload(e, data.chapter)}>
                                                        <UploadCloud size={12} />
                                                    </button>
                                                    <button className="opacity-0 group-hover/chapter:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all" title="기준서 추가" onClick={e => triggerStandardAdd(e, data.chapter)}>
                                                        <Plus size={12} />
                                                    </button>
                                                    <button onClick={e => handleStartEdit(e, 'manual', data.chapter, data.chapter)} className="opacity-0 group-hover/chapter:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={10} /></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, `manual-${currentChapterRef}`)} />
                                    <input type="file" ref={standardInputRef} className="hidden" onChange={(e) => handleAddStandard(e, currentChapterRef)} />
                                    <button onClick={() => toggleChapter(data.chapter)}>{openChapter === data.chapter ? <ChevronDown size={16} className="text-slate-500 shrink-0" /> : <ChevronRight size={16} className="text-slate-500 shrink-0" />}</button>
                                </div>
                                {openChapter === data.chapter && (
                                    <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                                        {data.standards.map((std) => (
                                            <div key={std.id} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors group/standard ${selectedStandard?.id === std.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                                <div className="flex-1 truncate mr-2 text-sm cursor-pointer" onClick={() => setSelectedStandard(std)}>
                                                    {editingItem?.type === 'standard' && editingItem?.id === std.id && editingItem?.parentId === data.chapter ? (
                                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                            <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit(e)} className="w-full text-xs text-blue-700 border-b border-blue-500 focus:outline-none bg-white px-1" autoFocus />
                                                            <button onClick={handleSaveEdit} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check size={12} /></button>
                                                            <button onClick={handleCancelEdit} className="p-0.5 text-red-600 hover:bg-red-50 rounded"><X size={12} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <span title={`${std.id} ${std.title}`} className={`${selectedStandard?.id === std.id ? 'text-blue-700 font-medium' : 'text-slate-600'} truncate`}>
                                                                {std.title.toLowerCase().startsWith(std.id.toLowerCase()) ? std.title : `${std.id} ${std.title}`}
                                                            </span>
                                                            <div className="flex items-center gap-0.5">
                                                                <button onClick={e => toggleFavorite(e, std.id)} className={`p-0.5 transition-all ${favorites.includes(std.id) ? 'text-yellow-500 opacity-100' : 'opacity-0 group-hover/standard:opacity-100 text-slate-400 hover:text-yellow-500'}`} title="즐겨찾기">
                                                                    <Star size={10} fill={favorites.includes(std.id) ? "currentColor" : "none"} />
                                                                </button>
                                                                <div className="flex flex-col opacity-0 group-hover/standard:opacity-100">
                                                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); moveStandard(data.chapter, std.id, 'up'); }} className="p-0.5 text-slate-400 hover:text-blue-500" title="위로 이동"><ChevronUp size={10} /></button>
                                                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); moveStandard(data.chapter, std.id, 'down'); }} className="p-0.5 text-slate-400 hover:text-blue-500" title="아래로 이동"><ChevronDown size={10} /></button>
                                                                </div>
                                                                <button onClick={e => handleStartEdit(e, 'standard', std.id, std.title, data.chapter)} className="opacity-0 group-hover/standard:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={10} /></button>
                                                                <button onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteStandard(std.id); }} className="opacity-0 group-hover/standard:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-all" title="기준서 삭제"><Trash2 size={10} /></button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <button onClick={() => selectChapter('부록')} className={`w-full text-left px-3 py-2.5 rounded-md transition-all flex items-center gap-3 group ${openChapter === '부록' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                                <div className={`${openChapter === '부록' ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}><ClipboardList size={20} /></div>
                                <span className={`text-sm font-bold ${openChapter === '부록' ? 'text-white' : ''}`}>부록 (Appendix)</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1 w-full order-2 md:order-1">
                            {favorites.length > 0 ? (
                                <section className="animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <div className="bg-yellow-500 p-1.5 rounded-lg text-white"><Star size={18} fill="currentColor" /></div>
                                            자주 찾는 문서<span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-1">FAVORITES</span>
                                        </h2>
                                        <span className="text-xs text-slate-400 font-medium">{favorites.length}개의 즐겨찾기</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                        {favorites.map(favId => {
                                            let docInfo = null;
                                            koshaData.forEach(chapter => {
                                                if (`manual-${chapter.chapter}` === favId) docInfo = { title: chapter.chapter, subtitle: '매뉴얼', type: 'manual', id: favId };
                                                chapter.standards.forEach(std => { if (std.id === favId) docInfo = { title: std.title, subtitle: std.id, type: 'standard', id: favId }; });
                                            });
                                            if (!docInfo) return null;
                                            return (
                                                <div key={favId} onClick={() => {
                                                    if (docInfo.type === 'manual') { setOpenChapter(docInfo.title); setSelectedStandard(null); }
                                                    else { const chapter = koshaData.find(c => c.standards.find(s => s.id === favId)); if (chapter) { setOpenChapter(chapter.chapter); setSelectedStandard(chapter.standards.find(s => s.id === favId)); } }
                                                }} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer group shadow-sm">
                                                    <div title={docInfo.subtitle} className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 group-hover:bg-yellow-100 transition-colors"><FileText size={20} /></div>
                                                    <div className="overflow-hidden flex-1">
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-1">{docInfo.subtitle}</div>
                                                        <h3 className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors" title={docInfo.title}>{docInfo.title}</h3>
                                                    </div>
                                                    <button onClick={(e) => toggleFavorite(e, favId)} className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="즐겨찾기 해제"><Star size={14} fill="currentColor" /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ) : (
                                <div className="h-0 md:h-8"></div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2 md:pt-0 shrink-0 self-start order-1 md:order-2">
                            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleGoHome}>
                                <svg width="34" height="34" viewBox="0 0 100 100" className="text-[#00509a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 6 C25.7 6 6 25.7 6 50 C6 74.3 25.7 94 50 94 C74.3 94 94 74.3 94 50 C94 25.7 74.3 6 50 6 Z M50 20 C66.568 20 80 33.431 80 50 C80 66.568 66.568 80 50 80 C33.431 80 20 66.568 20 50 C20 33.431 33.431 20 50 20 Z" />
                                    <path d="M50 27 L74 54 L26 54 Z" /><path d="M26 63 A 26 26 0 0 0 74 63 Z" />
                                </svg>
                                <span className="text-[26px] font-black text-[#5e5e5e] tracking-tight leading-none" style={{ fontFamily: 'Pretendard, "Malgun Gothic", sans-serif', letterSpacing: '-0.05em' }}>우미</span>
                            </div>
                            <span className="text-[17px] font-bold text-slate-600 border-l-2 border-slate-300 pl-3 leading-none h-[22px] flex items-center">안전보건실</span>
                        </div>
                    </div>

                    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <div className="p-5 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="bg-blue-600 p-1.5 rounded-lg text-white"><Clock size={18} /></div>최근 업데이트 문서</h2>
                                <p className="text-sm text-slate-500 mt-1">현장 안전보건 경영시스템(KOSHA-MS)의 최신 변경 사항입니다.</p>
                            </div>
                            <button onClick={() => setIsAllUpdatesModalOpen(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors px-3 py-1.5 bg-blue-50 rounded-lg w-fit shadow-sm hover:shadow transition-all">전체 이력보기 <ChevronRight size={16} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            {recentUpdates.slice(0, 4).map((update, idx) => (
                                <div key={idx} onClick={(e) => handleFileView(e, update.id, update.title + '.pdf')} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div title={update.type} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                            update.type === '매뉴얼' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            update.type === '기준서' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                            update.type === '양식' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                                        }`}><FileText size={22} className="group-hover:scale-110 transition-transform" /></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider ${update.status === 'new' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{update.status === 'new' ? 'NEW' : 'UPDATED'}</span>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{update.type}</span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-slate-700 group-hover:text-blue-700 group-hover:underline transition-all line-clamp-1" title={update.title}>{update.title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 relative z-10">
                                        <span className="text-[11px] font-medium text-slate-400">{update.date}</span>
                                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {openChapter === '부록' ? (
                        <section id="appendix-section" className="animate-in fade-in zoom-in-95 duration-500">
                             <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200"><ClipboardList size={24} /></div>부록<span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black tracking-widest uppercase">Appendix</span></h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {quickLinks.map((link, idx) => {
                                    const Icon = iconMap[link.icon] || FileText;
                                    return (
                                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-5 group text-center relative overflow-hidden h-[240px]">
                                            <div className="bg-slate-50 p-5 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 cursor-pointer" onClick={() => handleQuickLink(link.docId)}>
                                                <Icon size={40} className="text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="w-full flex items-center justify-center gap-2">
                                                {editingItem?.type === 'quicklink' && editingItem?.id === link.docId ? (
                                                    <div className="flex items-center gap-1 w-full max-w-[200px]" onClick={e => e.stopPropagation()}>
                                                        <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit(e)} className="w-full text-lg font-bold text-slate-700 border-b-2 border-blue-500 focus:outline-none bg-blue-50/30 px-1 text-center" autoFocus />
                                                        <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={16} /></button>
                                                        <button onClick={handleCancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 group/title">
                                                        <span title={link.title} onClick={() => handleQuickLink(link.docId)} className="text-lg font-bold text-slate-700 group-hover:text-blue-700 transition-colors cursor-pointer">{link.title}</span>
                                                        <button onClick={e => handleStartEdit(e, 'quicklink', link.docId, link.title)} className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    ) : (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">문서 열람{searchQuery && <span className="text-xs font-normal text-slate-500 ml-2 border-l border-slate-300 pl-2">"{searchQuery}" 검색 결과</span>}</h2>
                            </div>
                            {!selectedStandard && !searchQuery && !activeChapter ? (
                                <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center text-slate-500 shadow-sm">
                                    <FileText size={48} className="text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-800 mb-1">문서를 선택해주세요</h3>
                                    <p className="text-sm">좌측 메뉴나 상단 빠른 검색을 통해 원하는 기준서를 선택하세요.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(activeChapter ? [activeChapter] : filteredData).map((chapter) => (
                                        <div key={chapter.chapter} className="space-y-4 mb-8">
                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <div className="border-b border-slate-100 p-5 bg-gradient-to-r from-blue-50/50 to-transparent"><h3 className="text-xl font-bold text-slate-800">{chapter.chapter}</h3></div>
                                                <div className="p-5 border-b border-slate-100 bg-white">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Book size={16} className="text-blue-500" />매뉴얼</h4>
                                                        <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                                            <UploadCloud size={14} />{uploadedFiles[`manual-${chapter.chapter}`] ? '변경' : '업로드'}<input type="file" className="hidden" onChange={(e) => handleFileUpload(e, `manual-${chapter.chapter}`)} />
                                                        </label>
                                                    </div>
                                                    <div onClick={(e) => handleFileView(e, `manual-${chapter.chapter}`)} className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group cursor-pointer">
                                                    <div title="매뉴얼(Manual)" className="bg-blue-100 p-2 rounded mr-3 group-hover:bg-blue-200 transition-colors"><Book size={16} className="text-blue-600" /></div>
                                                        <div className="overflow-hidden flex-1 mr-2">
                                                            {editingItem?.type === 'manual' && editingItem?.id === chapter.chapter ? (
                                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                                    <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full text-sm font-medium text-slate-800 border-b-2 border-blue-500 focus:outline-none bg-blue-50/30 px-1" autoFocus />
                                                                    <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                                                                    <button onClick={handleCancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={14} /></button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between group/title">
                                                                    <div>
                                                                        <div title={chapter.chapter} className="text-sm font-medium text-slate-800 group-hover:text-blue-700 group-hover:underline truncate">{chapter.chapter} (매뉴얼)</div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-slate-500">KOSHA-MS Manual</span>
                                                                            {chapter.lastModified && (<span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">최종 수정: {chapter.lastModified}</span>)}
                                                                        </div>
                                                                    </div>
                                                                    <button onClick={e => handleStartEdit(e, 'manual', chapter.chapter, chapter.chapter)} className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={12} /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {uploadedFiles[`manual-${chapter.chapter}`] && (
                                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                                {editingFileId === `manual-${chapter.chapter}` ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <input type="text" value={tempFilePath} onChange={e => setTempFilePath(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveFilePath(e)} className="text-xs border border-blue-400 rounded px-1 w-32 focus:outline-none" autoFocus />
                                                                        <button onClick={handleSaveFilePath} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check size={12} /></button>
                                                                        <button onClick={() => setEditingFileId(null)} className="p-0.5 text-red-600 hover:bg-red-50 rounded"><X size={12} /></button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <span title={getFileName(uploadedFiles[`manual-${chapter.chapter}`])} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">{getFileName(uploadedFiles[`manual-${chapter.chapter}`])}</span>
                                                                        <button onClick={e => handleStartEditFilePath(e, `manual-${chapter.chapter}`, getFileName(uploadedFiles[`manual-${chapter.chapter}`]))} className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors" title="파일 경로 수정"><Edit2 size={12} /></button>
                                                                        <button onClick={(e) => handleRemoveFile(e, `manual-${chapter.chapter}`)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"><X size={14} /></button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>


                                                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" />기준서</h4>
                                                        {selectedStandard && (<label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"><UploadCloud size={14} />{uploadedFiles[selectedStandard.id] ? "변경" : "업로드"}<input type="file" className="hidden" onChange={(e) => handleFileUpload(e, selectedStandard.id)} /></label>)}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {chapter.standards.filter(std => !selectedStandard || selectedStandard.id === std.id).map((std) => (
                                                            <div key={std.id} className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div onClick={() => setSelectedStandard(std)} className={`flex items-center p-3 rounded-lg border w-full text-left transition-colors group bg-white cursor-pointer ${selectedStandard?.id === std.id ? 'border-indigo-400 ring-1 ring-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                                                                    <div title="기준서(Standard)" className={`p-2 rounded mr-3 transition-colors ${selectedStandard?.id === std.id ? 'bg-indigo-200 text-indigo-700' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'}`}><BookOpen size={16} /></div>
                                                                        <div className="overflow-hidden flex-1 mr-2">
                                                                            {editingItem?.type === 'standard' && editingItem?.id === std.id ? (
                                                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                                                    <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit(e)} className="w-full text-sm font-medium text-slate-800 border-b-2 border-indigo-500 focus:outline-none bg-indigo-50/30 px-1" autoFocus />
                                                                                    <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                                                                                    <button onClick={handleCancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={14} /></button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center justify-between group/stitle">
                                                                                    <div className="cursor-pointer flex-1 overflow-hidden" onClick={(e) => handleFileView(e, std.id)}>
                                                                                        <div title={std.title} className={`text-sm font-medium truncate ${selectedStandard?.id === std.id ? 'text-indigo-800' : 'text-slate-800 group-hover:text-indigo-700 group-hover:underline'}`}>{std.title} (기준서)</div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-xs text-slate-500">{std.id}</span>
                                                                                            {std.lastModified && (<span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">최종 수정: {std.lastModified}</span>)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <div className="flex flex-col opacity-0 group-hover/stitle:opacity-100">
                                                                                            <button onClick={e => { e.preventDefault(); e.stopPropagation(); moveStandard(chapter.chapter, std.id, 'up'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="위로 이동"><ChevronUp size={10} /></button>
                                                                                            <button onClick={e => { e.preventDefault(); e.stopPropagation(); moveStandard(chapter.chapter, std.id, 'down'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="아래로 이동"><ChevronDown size={10} /></button>
                                                                                        </div>
                                                                                        <button onClick={e => handleStartEdit(e, 'standard', std.id, std.title, chapter.chapter)} className="opacity-0 group-hover/stitle:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={12} /></button>
                                                                                        <button onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteStandard(std.id); }} className="opacity-0 group-hover/stitle:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all" title="기준서 삭제"><Trash2 size={12} /></button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {uploadedFiles[std.id] && (
                                                                            <div className="flex items-center gap-1 mr-4" onClick={e => e.stopPropagation()}>
                                                                                {editingFileId === std.id ? (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <input type="text" value={tempFilePath} onChange={e => setTempFilePath(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveFilePath(e)} className="text-xs border border-blue-400 rounded px-1 w-32 focus:outline-none" autoFocus />
                                                                                        <button onClick={handleSaveFilePath} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check size={12} /></button>
                                                                                        <button onClick={() => setEditingFileId(null)} className="p-0.5 text-red-600 hover:bg-red-50 rounded"><X size={12} /></button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        <span title={getFileName(uploadedFiles[std.id])} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded truncate max-w-[120px]">{getFileName(uploadedFiles[std.id])}</span>
                                                                                        <button onClick={e => handleStartEditFilePath(e, std.id, getFileName(uploadedFiles[std.id]))} className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors" title="파일 경로 수정"><Edit2 size={12} /></button>
                                                                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(e, std.id); }} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"><X size={14} /></button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {!selectedStandard && (<label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors ml-2 whitespace-nowrap"><UploadCloud size={14} />{uploadedFiles[std.id] ? "변경" : "업로드"}<input type="file" className="hidden" onChange={(e) => handleFileUpload(e, std.id)} /></label>)}
                                                                </div>
                                                                
                                                                {/* Standard Attachments Sub-section */}
                                                                {std.attachments?.length > 0 && (
                                                                    <div className="ml-12 mt-2 space-y-2 mb-4">
                                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1 mb-1">
                                                                            <Paperclip size={10} />기준서 첨부 문서
                                                                        </div>
                                                                        <div className="grid grid-cols-1 gap-2">
                                                                            {std.attachments.map(att => (
                                                                                <div key={att.id} className="flex items-center justify-between bg-slate-50/50 border border-slate-200 rounded-lg p-2 group/att hover:bg-white hover:border-indigo-200 transition-all">
                                                                                    <div className="flex items-center gap-2 flex-1 cursor-pointer overflow-hidden" onClick={(e) => handleFileView(e, att.id)}>
                                                                                        <div className="bg-white p-1 rounded border border-slate-200 text-slate-400 group-hover/att:text-indigo-500 group-hover/att:border-indigo-200 transition-colors">
                                                                                            <FileText size={14} />
                                                                                        </div>
                                                                                        <div className="overflow-hidden">
                                                                                            <span className="text-xs font-bold text-slate-700 truncate block group-hover/att:text-indigo-700">{att.name}</span>
                                                                                            {att.lastModified && (<span className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5"><Clock size={9} /> {att.lastModified}</span>)}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    {uploadedFiles[att.id] && (
                                                                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                                                            {editingFileId === att.id ? (
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <input type="text" value={tempFilePath} onChange={e => setTempFilePath(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveFilePath(e)} className="text-[10px] border border-blue-400 rounded px-1 w-24 focus:outline-none" autoFocus />
                                                                                                    <button onClick={handleSaveFilePath} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check size={10} /></button>
                                                                                                    <button onClick={() => setEditingFileId(null)} className="p-0.5 text-red-600 hover:bg-red-50 rounded"><X size={10} /></button>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <span title={getFileName(uploadedFiles[att.id])} className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded truncate max-w-[100px] font-medium">{getFileName(uploadedFiles[att.id])}</span>
                                                                                                    <div className="opacity-0 group-hover/att:opacity-100 flex items-center gap-0.5 transition-opacity">
                                                                                                        <button onClick={e => handleStartEditFilePath(e, att.id, getFileName(uploadedFiles[att.id]))} className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors" title="파일 경로 수정"><Edit2 size={10} /></button>
                                                                                                        <button onClick={() => handleDeleteAttachment(std.id, att.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors" title="첨부 삭제"><X size={12} /></button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                {selectedStandard?.id === std.id && (
                                                                    <div className="ml-12 mt-2 px-2">
                                                                        <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors">
                                                                            <Plus size={14} />별도 첨부 문서 추가
                                                                            <input type="file" className="hidden" onChange={(e) => handleAddAttachment(e, std.id)} />
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {selectedStandard && (
                                                    <div className="p-5 border-b border-slate-100 bg-white">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2" translate="no">
                                                                <History size={16} className="text-amber-500" />
                                                                제개정 이력관리 (버전 관리)
                                                            </h4>
                                                            <button onClick={() => setIsAddingRevision(!isAddingRevision)} className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors">{isAddingRevision ? <X size={14} /> : <Plus size={14} />}{isAddingRevision ? '취소' : '이력 추가'}</button>
                                                        </div>
                                                        {isAddingRevision && (
                                                            <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                                    <div><label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">버전</label><input type="text" placeholder="1.1" className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2" value={newRevision.version} onChange={e => setNewRevision({...newRevision, version: e.target.value})} /></div>
                                                                    <div><label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">개정일자</label><input type="date" className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2" value={newRevision.date} onChange={e => setNewRevision({...newRevision, date: e.target.value})} /></div>
                                                                    <div className="col-span-2"><label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">개정내용</label><input type="text" placeholder="주요 변경 사항 입력" className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2" value={newRevision.description} onChange={e => setNewRevision({...newRevision, description: e.target.value})} /></div>
                                                                    <div><label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">작성자</label><input type="text" placeholder="이름" className="w-full px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2" value={newRevision.author} onChange={e => setNewRevision({...newRevision, author: e.target.value})} /></div>
                                                                    <div className="col-span-3"><label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">문서 첨부 (구버전 보관용)</label><div className="flex items-center gap-2"><label className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100/30 transition-colors"><UploadCloud size={14} className="text-amber-600" /><span className={newRevision.fileName ? "text-amber-900 font-medium" : "text-slate-400"}>{newRevision.fileName || "이전 버전 문서를 선택하세요..."}</span><input type="file" className="hidden" onChange={e => { const file = e.target.files[0]; if (file) setNewRevision({...newRevision, fileName: file.name}); }} /></label>{newRevision.fileName && (<button onClick={() => setNewRevision({...newRevision, fileName: ''})} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>)}</div></div>
                                                                </div>
                                                                <div className="flex justify-end mt-2"><button onClick={() => handleAddRevision(selectedStandard.id)} className="px-4 py-1.5 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 shadow-sm">저장하기</button></div>
                                                            </div>
                                                        )}
                                                        <div className="overflow-hidden border border-slate-200 rounded-xl"><table className="w-full text-left text-xs border-collapse" translate="no"><thead><tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider"><th className="px-4 py-2 w-16">버전</th><th className="px-4 py-2 w-28">제개정일자</th><th className="px-4 py-2">제개정내용</th><th className="px-4 py-2 w-32">첨부문서</th><th className="px-4 py-2 w-20">작성자</th><th className="px-4 py-2 w-10"></th></tr></thead><tbody className="divide-y divide-slate-100">{selectedStandard.revisions?.length > 0 ? selectedStandard.revisions.map((rev, rIdx) => (<tr key={rIdx} className="hover:bg-slate-50 group"><td className="px-4 py-2.5 font-bold text-blue-600">v{rev.version}</td><td className="px-4 py-2.5 text-slate-500">{rev.date}</td><td className="px-4 py-2.5 text-slate-700 font-medium">{rev.description}</td><td className="px-4 py-2.5">{rev.fileName ? (<div onClick={(e) => handleFileView(e, null, rev.fileName)} className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 w-fit max-w-[120px] cursor-pointer hover:bg-blue-100 hover:underline"><FileText size={12} className="shrink-0" /><span title={rev.fileName} className="truncate text-[11px]">{rev.fileName}</span></div>) : (<span className="text-slate-300">-</span>)}</td><td className="px-4 py-2.5 text-slate-500">{rev.author}</td><td className="px-4 py-2.5"><button onClick={() => handleDeleteRevision(selectedStandard.id, rev.version)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500"><Trash2 size={12} /></button></td></tr>)) : (<tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400 italic bg-white">개정 이력이 없습니다.</td></tr>)}</tbody></table></div>
                                                    </div>
                                                )}

                                                <div className="p-5 bg-blue-50/30 border-b border-slate-100">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Layers size={16} className="text-blue-500" />관련 문서양식 (Form)</h4>
                                                        <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                                            <UploadCloud size={14} />양식 추가
                                                            <input type="file" className="hidden" onChange={(e) => {
                                                                const targetStdId = selectedStandard?.id || (chapter.standards[0]?.id);
                                                                if (targetStdId) handleAddRelatedDoc(e, targetStdId);
                                                                else alert('양식을 추가할 수 있는 기준서가 현 챕터에 없습니다. 먼저 기준서를 추가하세요.');
                                                            }} />
                                                        </label>
                                                    </div>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {chapter.standards.flatMap(std => std.related_docs.map(doc => ({ ...doc, parentStdId: std.id }))).length > 0 ? 
                                                            chapter.standards.flatMap(std => std.related_docs.map(doc => ({ ...doc, parentStdId: std.id }))).map((doc) => (
                                                                <li key={doc.id} className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all group/ditem">
                                                                    <div className="flex items-center justify-between gap-2 text-xs">
                                                                        <div className="flex items-center gap-2 flex-1 overflow-hidden cursor-pointer" onClick={(e) => handleFileView(e, doc.id)}>
                                                                            <div title="문서양식(Form)" className="bg-slate-50 p-1.5 rounded text-slate-500 group-hover/ditem:bg-blue-50 group-hover/ditem:text-blue-600 transition-colors"><FileText size={14} /></div>
                                                                            <div className="overflow-hidden flex-1">
                                                                                <div className="font-bold text-slate-700 truncate group-hover/ditem:text-blue-700">{doc.name}</div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] text-slate-400">{doc.id}</span>
                                                                                    {doc.lastModified && (<span className="text-[10px] text-blue-400/80 font-medium">최종 수정: {doc.lastModified}</span>)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 opacity-0 group-hover/ditem:opacity-100 transition-opacity">
                                                                            <label className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer" title="파일 업로드/변경">
                                                                                <UploadCloud size={14} />
                                                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                                                            </label>
                                                                            <button onClick={e => handleStartEdit(e, 'doc', doc.id, doc.name, doc.parentStdId)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={12} /></button>
                                                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteRelatedDoc(doc.id); }} className="p-1 text-slate-400 hover:text-red-500"><X size={12} /></button>
                                                                        </div>
                                                                    </div>
                                                                    {uploadedFiles[doc.id] && (
                                                                        <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-2 px-1">
                                                                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded truncate max-w-[100px]">{getFileName(uploadedFiles[doc.id])}</span>
                                                                            <div className="flex items-center gap-0.5">
                                                                                <button onClick={e => handleStartEditFilePath(e, doc.id, getFileName(uploadedFiles[doc.id]))} className="p-0.5 text-slate-400 hover:text-blue-600"><Edit2 size={10} /></button>
                                                                                <button onClick={e => handleRemoveFile(e, doc.id)} className="p-0.5 text-slate-400 hover:text-red-500"><X size={10} /></button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            ))
                                                            : <li className="col-span-full py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">등록된 문서양식이 없습니다.</li>
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            {/* View All Updates Modal */}
            {isAllUpdatesModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <div className="bg-blue-600 p-1.5 rounded-lg text-white"><History size={18} /></div>
                                    전체 업데이트 이력
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">KOSHA-MS 경영시스템의 모든 변경 내역을 확인하세요.</p>
                            </div>
                            <button onClick={() => setIsAllUpdatesModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                            {recentUpdates.map((update, idx) => (
                                <div key={idx} onClick={(e) => { handleFileView(e, update.id, update.title + '.pdf'); setIsAllUpdatesModalOpen(false); }} className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div title={update.type} className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                                            update.type === '매뉴얼' ? 'bg-blue-100 text-blue-600' :
                                            update.type === '기준서' ? 'bg-indigo-100 text-indigo-600' :
                                            update.type === '양식' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                        }`}><FileText size={20} /></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${update.status === 'new' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{update.status === 'new' ? 'NEW' : 'UPDATED'}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{update.type}</span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-slate-700 group-hover:text-blue-700 underline-offset-2 transition-all">{update.title}</h3>
                                        </div>
                                    </div>
                                    <div className="text-[12px] font-medium text-slate-400">{update.date}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center">
                            <p className="text-xs text-slate-400">데이터는 브라우저 로컬 저장소(localStorage)에 보관됩니다.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Undo Toast Notification */}
            {showUndoToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
                        <span className="text-sm font-medium">항목을 삭제했습니다.</span>
                        <button onClick={handleUndo} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1 rounded-lg text-xs font-black transition-colors flex items-center gap-1">
                            <RotateCcw size={12} /> 실행 취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Dashboard() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </React.Suspense>
    )
}
