const fs = require('fs');
const filePath = 'c:\\Users\\user\\Desktop\\vs\\kosha-ms\\src\\app\\page.js';
let content = fs.readFileSync(filePath, 'utf8');

const prefix = `'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { KOSHA_DATA, QUICK_LINKS } from '@/data/koshaData'
import { Search, ChevronDown, ChevronRight, FileText, ClipboardList, Hand, AlertTriangle, FileCheck, Layers, ArrowLeft, Book, BookOpen, UploadCloud, X, Home, Clock, ExternalLink, Edit2, Check, Plus, Trash2, History, Star } from 'lucide-react'

// Map icon string to component
const iconMap = {
    'clipboard-list': ClipboardList,
    'hand': Hand,
    'alert-triangle': AlertTriangle,
    'file-check': FileCheck,
}

const RECENT_UPDATES = [
    { type: '매뉴얼', title: '08. 안전보건관리 활동 (매뉴얼)', date: '2024-03-19', status: 'new', category: 'manual' },
    { type: '기준서', title: 'SHMS-404 위험성평가 운영기준', date: '2024-03-18', status: 'updated', category: 'standard' },
    { type: '양식', title: 'M02-08-11 작업허가서 (Form)', date: '2024-03-17', status: 'updated', category: 'form' },
    { type: '문서목록', title: '현장 문서체계표 및 준공이관 목록', date: '2024-03-15', status: 'new', category: 'other' },
];

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openChapter, setOpenChapter] = useState(null)
    const [selectedStandard, setSelectedStandard] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({}) // Store uploaded file info
    const [koshaData, setKoshaData] = useState(KOSHA_DATA)
    const [editingItem, setEditingItem] = useState(null) // { type: 'manual'|'standard'|'doc'|'quicklink', id: '...' }
    const [editValue, setEditValue] = useState('')
    const [quickLinks, setQuickLinks] = useState(QUICK_LINKS)
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [isAddingRevision, setIsAddingRevision] = useState(false)
    const [newRevision, setNewRevision] = useState({ version: '', date: new Date().toISOString().split('T')[0], description: '', author: '', fileName: '' })
    const [favorites, setFavorites] = useState([])

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

        if (confirm(\`'\${fileName}' 문서를 열람하시겠습니까?\`)) {
            const ext = fileName.toLowerCase().split('.').pop();
            const mimeTypes = {
                'pdf': 'application/pdf',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'xls': 'application/vnd.ms-excel',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc': 'application/msword',
                'hwp': 'application/x-hwp',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg'
            };
            const mimeType = mimeTypes[ext] || 'application/octet-stream';
            const blob = new Blob(["이것은 시뮬레이션된 문서 내용입니다. 실제 파일 서버 연동 시 해당 문서의 전체 내용이 브라우저에서 열리게 됩니다."], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    };

    // Load states from localStorage on mount
    useEffect(() => {
        const savedLinks = localStorage.getItem('kosha_quick_links')
        if (savedLinks) {
            try { setQuickLinks(JSON.parse(savedLinks)) } catch (e) {}
        }
        const savedFavorites = localStorage.getItem('kosha_favorites')
        if (savedFavorites) {
            try { setFavorites(JSON.parse(savedFavorites)) } catch (e) {}
        }
        setIsDataLoaded(true)
    }, [])

    // Save states to localStorage
    useEffect(() => {
        if (isDataLoaded) {
            localStorage.setItem('kosha_quick_links', JSON.stringify(quickLinks))
            localStorage.setItem('kosha_favorites', JSON.stringify(favorites))
        }
    }, [quickLinks, favorites, isDataLoaded])

    const toggleFavorite = (e, docId) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => 
            prev.includes(docId) 
                ? prev.filter(id => id !== docId) 
                : [...prev, docId]
        );
    };

    const handleStartEdit = (e, type, id, currentValue) => {
        e.preventDefault()
        e.stopPropagation()
        setEditingItem({ type, id })
        setEditValue(currentValue)
    }

    const handleSaveEdit = (e) => {`;

// Find where the old handleSaveEdit started
const searchStr = 'const handleSaveEdit = (e) => {';
const splitIdx = content.indexOf(searchStr);

if (splitIdx !== -1) {
    const finalContent = prefix + content.substring(splitIdx + searchStr.length);
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log('Successfully restored and updated prefix of page.js');
} else {
    console.error('Failed to find split point');
}
