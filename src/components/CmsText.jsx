import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';

export default function CmsText({ 
  slug, 
  fallback, 
  className = '', 
  as: Component = 'span', 
  replaceObj = null,
  ...props
}) {
  const { cmsContent, updateCmsText, isAdminEditing } = useContent();
  
  const getCmsText = () => {
    return cmsContent?.[slug] ?? fallback;
  };
  
  const rawText = getCmsText();
  
  // Apply placeholders (e.g., {name}) ONLY when NOT editing
  let displayText = rawText;
  if (replaceObj && !isAdminEditing) {
    Object.entries(replaceObj).forEach(([key, val]) => {
      displayText = displayText.replace(key, val);
    });
  }

  const elementRef = useRef(null);
  const [localText, setLocalText] = useState(rawText);

  // Sync state if CMS changes externally
  useEffect(() => {
    setLocalText(rawText);
  }, [rawText]);

  const handleBlur = () => {
    if (!isAdminEditing) return;
    const newText = elementRef.current?.innerText?.trim() || '';
    
    // Safety check to avoid blank strings
    if (newText === '') {
      if (elementRef.current) {
        elementRef.current.innerText = rawText;
      }
      return;
    }

    if (newText !== rawText) {
      updateCmsText(slug, newText);
    }
  };

  const handleKeyDown = (e) => {
    // Save on Enter (unless holding shift for multiline textareas/paragraphs)
    if (e.key === 'Enter' && Component !== 'p' && Component !== 'textarea') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  // Prevent rich text styling being pasted in contentEditable
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleClick = (e) => {
    if (isAdminEditing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!isAdminEditing) {
    return <Component className={className} {...props}>{displayText}</Component>;
  }

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck="false"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={handleClick}
      className={`${className} inline-block outline-none border border-dashed border-secondary/50 hover:border-secondary focus:border-secondary focus:bg-secondary/5 focus:ring-1 focus:ring-secondary rounded px-1.5 -mx-1.5 transition-all cursor-text relative group min-h-[1em]`}
      title={`Klikk for å redigere "${slug}" direkte på siden`}
      {...props}
    >
      {rawText}
    </Component>
  );
}
