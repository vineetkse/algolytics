"use client";

import { useMemo, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  language?: "javascript" | "python";
}

const JS_KEYWORDS =
  /\b(function|const|let|var|return|if|else|for|while|do|class|new|this|true|false|null|undefined|break|continue|switch|case|default|try|catch|finally|throw|typeof|instanceof|async|await|import|export|from|of|in)\b/g;
const PY_KEYWORDS =
  /\b(def|return|if|elif|else|for|while|class|True|False|None|import|from|as|pass|break|continue|and|or|not|in|is|lambda|with|try|except|finally|raise|yield|global|nonlocal)\b/g;
const STRINGS = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
const COMMENTS = /(\/\/.*$|#.*$)/gm;
const NUMBERS = /\b\d+\.?\d*\b/g;

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightLine(line: string, language: "javascript" | "python") {
  const keywords = language === "python" ? PY_KEYWORDS : JS_KEYWORDS;
  const tokens: { start: number; end: number; cls: string }[] = [];

  for (const re of [COMMENTS, STRINGS, keywords, NUMBERS]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const cls = re === COMMENTS
        ? "text-muted/60"
        : re === STRINGS
          ? "text-emerald-400/90"
          : re === keywords
            ? "text-sky-400"
            : "text-amber-300/90";
      tokens.push({ start: m.index, end: m.index + m[0].length, cls });
    }
  }

  tokens.sort((a, b) => a.start - b.start);
  let html = "";
  let pos = 0;
  for (const t of tokens) {
    if (t.start < pos) continue;
    html += escapeHtml(line.slice(pos, t.start));
    html += `<span class="${t.cls}">${escapeHtml(line.slice(t.start, t.end))}</span>`;
    pos = t.end;
  }
  html += escapeHtml(line.slice(pos));
  return html || "&nbsp;";
}

export function CodeEditor({
  value,
  onChange,
  className = "",
  placeholder,
  language = "javascript",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const highlighted = useMemo(() => {
    const lines = value.split("\n");
    return lines.map((line) => highlightLine(line, language)).join("<br/>");
  }, [value, language]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;

    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const indent = "  ";

    if (e.shiftKey && start === end) {
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const linePrefix = value.slice(lineStart, start);
      if (linePrefix.startsWith(indent)) {
        const next = value.slice(0, lineStart) + value.slice(lineStart + indent.length);
        onChange(next);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start - indent.length;
        });
      }
      return;
    }

    const next = value.slice(0, start) + indent + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + indent.length;
    });
  }

  return (
    <div className={`relative overflow-auto ${className}`}>
      <pre
        aria-hidden
        className="pointer-events-none absolute inset-0 m-0 whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed text-transparent"
        dangerouslySetInnerHTML={{
          __html: highlighted + (value.endsWith("\n") ? "<br/>" : ""),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 m-0 whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: highlighted + (value.endsWith("\n") ? "<br/>" : ""),
        }}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={(e) => {
          const parent = e.currentTarget.parentElement;
          if (!parent) return;
          const pre = parent.querySelector("pre");
          const overlay = parent.querySelectorAll("div")[0];
          if (pre) pre.scrollTop = e.currentTarget.scrollTop;
          if (overlay) overlay.scrollTop = e.currentTarget.scrollTop;
        }}
        spellCheck={false}
        placeholder={placeholder}
        className="relative z-10 m-0 h-full min-h-[inherit] w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-transparent caret-foreground outline-none selection:bg-accent/30"
      />
    </div>
  );
}
