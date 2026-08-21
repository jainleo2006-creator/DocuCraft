import React, { useState, useEffect } from 'react';
import { Keyboard, X, Command, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface KeyboardShortcutManagerProps {
  onNavigate: (path: string) => void;
  onClearFiles?: () => void;
  hasFilesUploaded?: boolean;
}

export interface ShortcutItem {
  key: string;
  label: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Tools';
}

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { key: 'H', label: 'H', description: 'Navigate to Home page', category: 'Navigation' },
  { key: 'T', label: 'T', description: 'Open All Tools directory', category: 'Navigation' },
  { key: 'A', label: 'A', description: 'About & Security Information', category: 'Navigation' },
  { key: 'Esc', label: 'Esc', description: 'Clear uploaded files / Dismiss overlays', category: 'Actions' },
  { key: '/', label: '/', description: 'Focus search bar', category: 'Actions' },
  { key: '?', label: '?', description: 'Toggle keyboard shortcuts helper modal', category: 'Actions' },
];

export const KeyboardShortcutManager: React.FC<KeyboardShortcutManagerProps> = ({
  onNavigate,
  onClearFiles,
  hasFilesUploaded,
}) => {
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setActiveNotification(message);
    const timer = setTimeout(() => {
      setActiveNotification(null);
    }, 1800);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      const isInputActive =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Escape key handler: clear files or close dialogs even if active in some contexts
      if (e.key === 'Escape') {
        if (showHelperModal) {
          e.preventDefault();
          setShowHelperModal(false);
          return;
        }

        // Trigger file clear or global cancel
        window.dispatchEvent(new CustomEvent('docucraft:clear-files'));
        if (onClearFiles) {
          onClearFiles();
        }
        showToast('Cleared current upload / reset tool');
        return;
      }

      // If user is typing in a form field, don't hijack alphabet keys
      if (isInputActive) {
        return;
      }

      // Ignore if modifier keys like Ctrl, Cmd, Alt are held (except Shift for '?')
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const keyLower = e.key.toLowerCase();

      if (keyLower === 'h') {
        e.preventDefault();
        onNavigate('/');
        showToast('Navigated to Home (H)');
      } else if (keyLower === 't') {
        e.preventDefault();
        onNavigate('/tools');
        showToast('Navigated to All Tools (T)');
      } else if (keyLower === 'a') {
        e.preventDefault();
        onNavigate('/about');
        showToast('Navigated to About (A)');
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowHelperModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onClearFiles, showHelperModal]);

  return (
    <>
      {/* Action Notification Toast */}
      {activeNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl shadow-lg border border-slate-700/60 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Floating Keyboard Shortcut Trigger Pill in Corner */}
      <div className="fixed bottom-5 left-5 z-40 hidden md:block">
        <button
          type="button"
          id="keyboard-shortcuts-pill-btn"
          onClick={() => setShowHelperModal(true)}
          aria-label="View keyboard shortcuts"
          className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-full shadow-2xs text-[11px] font-medium backdrop-blur-xs transition-all cursor-pointer"
        >
          <Keyboard className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Shortcuts</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#F1F5F9] text-[#475569] rounded-md border border-[#E2E8F0]">
            ?
          </kbd>
        </button>
      </div>

      {/* Keyboard Shortcuts Dialog Modal */}
      {showHelperModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowHelperModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="shortcuts-modal-title" className="text-sm font-bold text-[#0F172A]">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-[11px] text-[#64748B]">Navigate DocuCraft with rapid keystrokes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                aria-label="Close shortcuts dialog"
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Navigation & Tools
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">Navigate to Home page</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      H
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">Open All Tools directory</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      T
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">About & Architecture info</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      A
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Actions & Controls
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">Clear current files / Reset tool</span>
                    <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      Esc
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">Focus search bar (in directory)</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      /
                    </kbd>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                    <span className="text-xs text-[#334155] font-medium">Toggle this shortcuts cheat sheet</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#0F172A] rounded-lg border border-[#CBD5E1] shadow-2xs">
                      ?
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Note */}
            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Shortcuts are inactive while typing inside form inputs.</span>
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                className="font-bold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
