import React, { useState, useRef } from 'react';
    import { Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Link, ImageIcon } from 'lucide-react';
    import JsonStorage from '../components/JsonStorage';
    
    export default function EditorPage() {
      const [text, setText] = useState('');
      const editorRef = useRef<HTMLDivElement>(null);
      const [json, setJson] = useState<any>(null);
    
      const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        setText(e.target.innerHTML);
      };
    
      const handleFormat = (format: string) => {
        if (!editorRef.current) return;
    
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
    
        const range = selection.getRangeAt(0);
        const selectedText = range.extractContents();
        let formattedText = '';
    
        switch (format) {
          case 'bold':
            formattedText = `<strong>${selectedText.textContent}</strong>`;
            break;
          case 'italic':
            formattedText = `<em>${selectedText.textContent}</em>`;
            break;
          case 'h1':
            formattedText = `<h1>${selectedText.textContent}</h1>`;
            break;
          case 'h2':
            formattedText = `<h2>${selectedText.textContent}</h2>`;
            break;
          case 'h3':
            formattedText = `<h3>${selectedText.textContent}</h3>`;
            break;
          case 'h4':
            formattedText = `<h4>${selectedText.textContent}</h4>`;
            break;
          case 'h5':
            formattedText = `<h5>${selectedText.textContent}</h5>`;
            break;
          case 'h6':
            formattedText = `<h6>${selectedText.textContent}</h6>`;
            break;
          case 'link':
            const url = prompt('Enter URL:');
            formattedText = `<a href="${url || ''}">${selectedText.textContent}</a>`;
            break;
          case 'image':
            const imageUrl = prompt('Enter Image URL:');
            formattedText = `<img src="${imageUrl || ''}" alt="${selectedText.textContent}" />`;
            break;
          default:
            formattedText = selectedText.textContent;
        }
    
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        range.insertNode(tempDiv);
        editorRef.current.focus();
      };
    
      const handleJsonStored = (json: any) => {
        setJson(json);
      };
    
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => handleFormat('bold')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Bold">
              <Bold size={18} />
            </button>
            <button onClick={() => handleFormat('italic')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Italic">
              <Italic size={18} />
            </button>
            <button onClick={() => handleFormat('h1')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 1">
              <Heading1 size={18} />
            </button>
            <button onClick={() => handleFormat('h2')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 2">
              <Heading2 size={18} />
            </button>
            <button onClick={() => handleFormat('h3')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 3">
              <Heading3 size={18} />
            </button>
            <button onClick={() => handleFormat('h4')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 4">
              <Heading4 size={18} />
            </button>
            <button onClick={() => handleFormat('h5')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 5">
              <Heading5 size={18} />
            </button>
            <button onClick={() => handleFormat('h6')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Heading 6">
              <Heading6 size={18} />
            </button>
            <button onClick={() => handleFormat('link')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Link">
              <Link size={18} />
            </button>
            <button onClick={() => handleFormat('image')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3C3C3C] transition-colors" title="Image">
              <ImageIcon size={18} />
            </button>
          </div>
          <JsonStorage onJsonStored={handleJsonStored} />
          <div className="mt-4">
            {json && (
              <pre className="text-sm text-gray-700 dark:text-gray-300">
                {JSON.stringify(json, null, 2)}
              </pre>
            )}
          </div>
        </div>
      );
    }
