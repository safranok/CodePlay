import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Language } from '../types';

interface EditorWindowProps {
  language: Language;
  code: string;
  theme: 'dark' | 'light';
  errorLineNumber?: number;
  onChange: (value: string | undefined) => void;
}

const EditorWindow: React.FC<EditorWindowProps> = ({ language, code, theme, errorLineNumber, onChange }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure indentation/linting if needed
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    
    // Define a premium dark theme
    monaco.editor.defineTheme('premium-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', background: '1A1A1A' }
        ],
        colors: {
            'editor.background': '#1A1A1A',
            'editor.foreground': '#FFFFFF',
            'editor.lineHighlightBackground': '#2A2A2A',
            'editorCursor.foreground': '#FFFFFF',
            'editor.selectionBackground': '#333333',
        }
    });

    // Define a premium light theme
    monaco.editor.defineTheme('premium-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: '', background: 'F3F3F3' }
        ],
        colors: {
            'editor.background': '#F3F3F3',
            'editor.foreground': '#111111',
            'editor.lineHighlightBackground': '#E5E7EB',
            'editorCursor.foreground': '#000000',
            'editor.selectionBackground': '#D1D5DB',
        }
    });

    // Set Initial Theme
    monaco.editor.setTheme(theme === 'dark' ? 'premium-dark' : 'premium-light');

    // Override Ctrl+A / Cmd+A to strictly select editor content
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, () => {
        editor.trigger('keyboard', 'editor.action.selectAll', null);
    });
  };

  // Sync Theme Prop with Monaco
  useEffect(() => {
    if (monacoRef.current) {
        monacoRef.current.editor.setTheme(theme === 'dark' ? 'premium-dark' : 'premium-light');
    }
  }, [theme]);

  // Wrapper-level safeguard for Ctrl+A
  const handleWrapperKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();
      
      if (editorRef.current) {
        if (!editorRef.current.hasTextFocus()) {
          editorRef.current.focus();
        }
        editorRef.current.trigger('keyboard', 'editor.action.selectAll', null);
      }
    }
  };

  // Handle Error Line Highlighting
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (errorLineNumber && errorLineNumber > 0) {
      // Apply decoration
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new monacoRef.current.Range(errorLineNumber, 1, errorLineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'runtime-error-line',
            glyphMarginClassName: 'runtime-error-glyph',
            hoverMessage: { value: 'Runtime Error Occurred Here' }
          }
        }
      ]);
      // Scroll to line
      editorRef.current.revealLineInCenter(errorLineNumber);
    } else {
      // Clear decorations
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [errorLineNumber]);

  return (
    <div 
        className="h-full w-full overflow-hidden bg-[#F3F3F3] dark:bg-[#1A1A1A] relative transition-colors duration-300"
        onKeyDown={handleWrapperKeyDown}
        tabIndex={-1} 
        style={{ outline: 'none' }}
    >
      <style>{`
        .runtime-error-line {
          background-color: rgba(220, 38, 38, 0.2);
          border-left: 3px solid #dc2626;
        }
      `}</style>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        // Theme is controlled via handleEditorDidMount and useEffect
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 24, bottom: 24 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          lineNumbersMinChars: 3,
          renderLineHighlight: 'all', 
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          // Hard Line-Wrap System
          wordWrap: 'bounded',       // Wrap at min(viewport, wordWrapColumn)
          wordWrapColumn: 91,        // Strict 91 character limit
          wrappingStrategy: 'advanced', 
          scrollbar: {
            vertical: 'auto',
            horizontal: 'hidden',    // Disable horizontal scrolling
            handleMouseWheel: true,
          }
        }}
      />
    </div>
  );
};

export default EditorWindow;