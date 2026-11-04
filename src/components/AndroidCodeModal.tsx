import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, X, Layers, Terminal } from 'lucide-react';
import { ANDROID_KOTLIN_FILES, KotlinFile } from '../data/androidKotlinCode';
import { useBloom } from '../context/BloomContext';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(ANDROID_KOTLIN_FILES[0]);
  const [copied, setCopied] = useState(false);
  const { playSound } = useBloom();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    playSound('tap');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    playSound('bloom');
    // Create text file bundle
    const bundleContent = ANDROID_KOTLIN_FILES.map(
      (f) => `// =====================================\n// FILE: ${f.path}\n// ${f.description}\n// =====================================\n\n${f.content}\n\n`
    ).join('\n');

    const blob = new Blob([bundleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BloomEra_Android_Jetpack_Compose_Source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                BloomEra Android Kotlin & Jetpack Compose Architecture
              </h2>
              <p className="text-xs text-neutral-400">
                Production-grade native Android code matching this design system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download All Code
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: Sidebar + Code Editor */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 border-r border-neutral-800 bg-neutral-950/40 p-3 flex flex-col gap-1 overflow-y-auto shrink-0">
            <span className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
              Compose Source Tree
            </span>
            {ANDROID_KOTLIN_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => {
                    setSelectedFile(file);
                    playSound('tap');
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                      : 'hover:bg-neutral-800/60 text-neutral-300'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-neutral-500'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{file.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Code View */}
          <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/40 text-xs">
              <span className="font-mono text-neutral-400 text-[11px] truncate">{selectedFile.path}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-300 leading-relaxed select-text">
              <pre className="whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
