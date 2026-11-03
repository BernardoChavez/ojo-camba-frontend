import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/core/store/AppContext.tsx';
import { assistantService, AssistantChatResponse } from '../services/assistant.service.ts';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  safety_level?: 'SEGURO' | 'PRECAUCION' | 'PELIGRO_ALTO' | 'INFORMATIVO';
  source?: string;
}

const QUICK_PROMPTS = [
  '¿Es seguro transitar por El Mechero ahora?',
  '¿Cómo está la situación por La Ramada?',
  '¿Qué precauciones tomar en el Casco Viejo?',
  '¿Hay corredores seguros cerca de Equipetrol?',
];

export const ChatDrawer: React.FC = () => {
  const { chatDrawerOpen, setChatDrawerOpen, activeCoords } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: '¡Buenas, pariente! Soy **Centinela SCZ**, tu agente de prevención e inteligencia comunitaria de Ojo Camba. Pregúntame sobre cualquier anillo, barrio o zona de Santa Cruz y analizaré en tiempo real los incidentes cercanos a tus coordenadas.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      safety_level: 'INFORMATIVO',
      source: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatDrawerOpen) {
    return (
      <button
        type="button"
        onClick={() => setChatDrawerOpen(true)}
        title="Hablar con Centinela SCZ (IA)"
        className="fixed bottom-6 right-6 z-[990] w-14 h-14 bg-gradient-to-tr from-[#0d592c] to-[#1e8548] hover:scale-105 text-white rounded-full shadow-2xl shadow-emerald-900/30 flex items-center justify-center transition-all active:scale-95 border-2 border-white"
      >
        <span className="relative flex items-center justify-center">
          <MessageSquare className="w-6 h-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </span>
      </button>
    );
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response: AssistantChatResponse = await assistantService.sendMessage({
        message: text,
        latitude: activeCoords[0],
        longitude: activeCoords[1],
        neighborhood: 'Santa Cruz de la Sierra',
      });

      const assistantMsg: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        safety_level: response.safety_level,
        source: response.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error querying Centinela:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed bottom-6 right-6 w-96 h-[560px] bg-scz-card/95 backdrop-blur-xl border border-scz-border rounded-2xl shadow-2xl flex flex-col z-[1000] overflow-hidden animate-fadeIn">
      {/* Drawer Header */}
      <div className="p-3.5 border-b border-scz-border bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-100">Centinela SCZ</h3>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                Gemini 3.5 Flash
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>
                GPS: {activeCoords[0].toFixed(3)}, {activeCoords[1].toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setChatDrawerOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                {/* Safety Badge */}
                {m.safety_level && m.safety_level !== 'INFORMATIVO' && (
                  <div className="mb-1.5 flex items-center gap-1">
                    <span
                      className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${
                        m.safety_level === 'PELIGRO_ALTO'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : m.safety_level === 'PRECAUCION'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {m.safety_level === 'PELIGRO_ALTO'
                        ? 'Alerta Crítica'
                        : m.safety_level === 'PRECAUCION'
                        ? 'Zona de Precaución'
                        : 'Sector Seguro'}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line text-[11.5px]">{m.text}</div>
              </div>

              <span className="text-[9px] text-slate-500 px-1 font-mono">
                {m.timestamp} {m.source ? `• ${m.source}` : ''}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 w-fit text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Centinela está analizando el cuadrante...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-scz-border/60 bg-slate-900/50 flex gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading}
            onClick={() => handleSendMessage(q)}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10.5px] rounded-lg border border-slate-700/60 transition-all flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 border-t border-scz-border bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          disabled={loading}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Pregunta a Centinela sobre seguridad..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
