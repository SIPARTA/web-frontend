"use client";

import React, { useState, useRef, useEffect } from "react";

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

type Message = { id: string; text: string; sender: "user" | "ai" };

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    text: "Halo. Tulis bahan yang ingin dicek, misalnya pemutih dan cuka. Saya akan bantu jelaskan risikonya dengan bahasa singkat.",
    sender: "ai",
  },
];

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: inputValue.trim(), sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => m.id !== "msg-1")
        .map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUserMsg.text, history }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: `Gagal menghubungi layanan: ${data.message || "coba beberapa saat lagi."}`, sender: "ai" }]);
        return;
      }
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: data.reply, sender: "ai" }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: "Koneksi bermasalah. Coba kirim ulang pertanyaan.", sender: "ai" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="font-semibold" style={{ color: "var(--teal-600)" }}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden h-full min-h-[450px] max-h-[600px]">
      <div className="flex items-center justify-between gap-3 p-4 border-b" style={{ borderColor: "var(--border-soft)", background: "var(--surface-soft)" }}>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--section-title)" }}>Asisten bahan kimia</h3>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Jawaban ringkas untuk pengecekan awal</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "var(--hero-tag-bg)", color: "var(--hero-tag-text)" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--teal-400)" }} />
          Aktif
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[88%] rounded-md p-3.5 text-sm whitespace-pre-wrap leading-relaxed"
              style={
                msg.sender === "user"
                  ? { background: "var(--teal-600)", color: "#fff" }
                  : { background: "var(--surface-soft)", color: "var(--foreground)", border: "1px solid var(--border-soft)" }
              }
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-md p-3.5 flex gap-1.5 border" style={{ background: "var(--surface-soft)", borderColor: "var(--border-soft)" }}>
              {[0, 0.15, 0.3].map((delay) => (
                <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--muted)", animationDelay: `-${delay}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Contoh: pemutih dan amonia"
            className="form-input flex-1 py-2.5 text-sm"
          />
          <button type="submit" disabled={!inputValue.trim()} className="btn-primary p-2.5 min-h-0 disabled:opacity-50" aria-label="Kirim pesan">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
