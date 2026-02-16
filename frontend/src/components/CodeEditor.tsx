import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    readOnly?: boolean;
    height?: string;
}

// Map our language names to Monaco language IDs
const languageMap: Record<string, string> = {
    'C': 'c',
    'C++': 'cpp',
    'Java': 'java',
    'Python': 'python'
};

const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    language,
    readOnly = false,
    height = '400px'
}) => {
    const monacoLanguage = languageMap[language] || 'plaintext';

    return (
        <div className="rounded-lg overflow-hidden border border-white/10">
            <Editor
                height={height}
                language={monacoLanguage}
                value={value}
                onChange={(val) => onChange(val || '')}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: 'on',
                    padding: { top: 10, bottom: 10 },
                    fontFamily: "'Fira Code', 'Consolas', monospace",
<<<<<<< HEAD
                    fontLigatures: true,
                    letterSpacing: 0,
=======
>>>>>>> 2ad77c6470fc98a9002d3cc2e22bc860cab2a578
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true
                }}
            />
        </div>
    );
};

export default CodeEditor;
