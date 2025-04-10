'use client'

import React, { useState } from 'react';

const HtmlParser = () => {
    const [htmlString, setHtmlString] = useState('');
    const [parsedData, setParsedData] = useState({
        hanja: '',
        meaning: '',
        pinyin: '',
    });

    const parseHtml = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // 한자 추출
        const hanja = doc.querySelector('.origin .highlight')?.textContent.trim() || '';

        // 의미 추출
        const meaning = doc.querySelector('.mean_item .mean')?.childNodes[2]?.textContent.trim() || '';

        // 병음 추출
        const pinyin = doc.querySelector('.pronounce_item .pronounce')?.textContent.trim() || '';

        setParsedData({ hanja, meaning, pinyin });
    };

    return (
        <div className="p-4">
            <textarea
                onChange={(e) => setHtmlString(e.target.value)}
            />
            <button onClick={parseHtml} className="bg-blue-500 text-white px-4 py-2 rounded">
                Parse HTML
            </button>
            <div className="mt-4 space-y-2">
                <p><strong>📚 한자:</strong> {parsedData.hanja}</p>
                <p><strong>🗣️ 발음:</strong> {parsedData.pinyin}</p>
                <p><strong>💬 뜻:</strong> {parsedData.meaning}</p>
            </div>
        </div>
    );
};

export default HtmlParser;
