'use client'

import React, {useImperativeHandle, forwardRef, useState, useEffect} from 'react';

// eslint-disable-next-line react/display-name
const InputPinyin = forwardRef((props, ref) => {
    const [rawInput, setRawInput] = useState('');
    const [converted, setConverted] = useState('');

    useImperativeHandle(ref, () => ({
        resetInput: () => {
            setRawInput('-')
            setConverted('')
        }, // 외부에서 호출 가능
    }));

    useEffect(() => {
        if(props.pinyin){
            setConverted(props.pinyin)
        }
    }, [props.pinyin])
    const toneMap = {
        a: ["ā", "á", "ǎ", "à"],
        e: ["ē", "é", "ě", "è"],
        i: ["ī", "í", "ǐ", "ì"],
        o: ["ō", "ó", "ǒ", "ò"],
        u: ["ū", "ú", "ǔ", "ù"],
        // ü: ["ǖ", "ǘ", "ǚ", "ǜ"],
    };

    const convertPinyin = (input) => {
        return input.replace(/([aeiouü]+)([1-4])/g, (match, vowels, tone) => {
            const vowelList = vowels.split("");
            const mainVowel = findMainVowel(vowelList);
            if (!mainVowel) return match;

            const tonedVowel = toneMap[mainVowel][parseInt(tone) - 1];
            return vowels.replace(mainVowel, tonedVowel);
        });
    }

    const findMainVowel = (vowels) => {
        if (vowels.includes("a")) return "a";
        if (vowels.includes("e")) return "e";
        if (vowels.includes("o")) return "o";
        if (vowels.includes("i")) return "i";
        if (vowels.includes("u")) return "u";
        if (vowels.includes("ü")) return "ü";
        return null;
    }

    const handleChange = (e) => {
        const input = e.target.value;
        setRawInput(input)
        const result = convertPinyin(input)
        setConverted(result)
        props.onKeyDown(result)
    };

    return (
        <div>
            <label>병음</label>
            <input
                type="text"
                value={rawInput}
                onChange={handleChange}
                placeholder="예) ni3 hao3"
            />
            { props.type !== 'M' &&
                <div>
                    변환된 병음: {converted}
                </div>
            }

        </div>
    );
});

export default InputPinyin;