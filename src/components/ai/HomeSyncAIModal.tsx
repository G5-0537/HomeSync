import React, { useState, useRef, useEffect } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import { useAuth } from '../../context/AuthContext';
import { HomeSyncAIAgent } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { AIMessage } from '../../types';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Check, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  Receipt,
  ShoppingCart,
  CheckSquare,
  FileText
} from 'lucide-react';

export const HomeSyncAIModal: React.FC = () => {
  const { household, refreshData } = useHousehold();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: "Hey! I'm **HomeSync AI**. I'm your personal household assistant. I can help you manage expenses, divide bills, organize chores, track inventory, and understand your rental agreement.\n\nWhat can I help you with today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const agent = new HomeSyncAIAgent(
    household,
    user?.uid || 'user-aanya',
    user?.name || 'Aanya Sharma'
  );

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isProcessing) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    (async () => {
      try {
        const { reply, toolCall } = await agent.processMessageAsync(text);
        const botMsg: AIMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          toolCall
        };
        setMessages(prev => [...prev, botMsg]);
        refreshData();
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            sender: 'assistant',
            content: "I encountered an issue processing that instruction. Please check details or try again.",
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  const handleConfirmTool = (msgId: string, toolCall: NonNullable<AIMessage['toolCall']>) => {
    try {
      const executionResult = agent.executeTool(toolCall.name, toolCall.params);
      success('Action executed successfully!');
      refreshData();

      setMessages(prev =>
        prev.map(m => {
          if (m.id === msgId && m.toolCall) {
            return {
              ...m,
              toolCall: { ...m.toolCall, status: 'executed', result: executionResult },
              content: `${m.content}\n\n${executionResult}`
            };
          }
          return m;
        })
      );
    } catch (e) {
      error('Could not execute tool');
    }
  };

  const handleCancelTool = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId && m.toolCall) {
          return {
            ...m,
            toolCall: { ...m.toolCall, status: 'cancelled' },
            content: `${m.content}\n\n*(Action was cancelled by user)*`
          };
        }
        return m;
      })
    );
  };

  const suggestions = [
    { label: "Who owes me money?", icon: Receipt },
    { label: "Add ₹1200 for groceries and split equally", icon: Receipt },
    { label: "Create a shopping list", icon: ShoppingCart },
    { label: "Who has completed the most chores?", icon: CheckSquare },
    { label: "How much rent is pending?", icon: FileText },
    { label: "Explain my rental agreement", icon: FileText }
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-sage-600 hover:bg-sage-700 text-white px-4 py-3.5 rounded-full shadow-float hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open HomeSync AI"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-ivory-50 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lavender-400 rounded-full animate-ping" />
            </div>
            <span className="font-display font-semibold text-sm tracking-tight pr-1">
              Ask HomeSync AI
            </span>
          </button>
        )}
      </div>

      {/* Modern Conversational Modal Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-6 right-6 w-full max-w-md sm:max-w-lg h-[620px] max-h-[90vh]'
          }`}
        >
          <div className="w-full h-full bg-ivory-50 dark:bg-charcoal-900 rounded-2xl border border-charcoal-200 dark:border-charcoal-700 shadow-float flex flex-col overflow-hidden backdrop-blur-xl transition-colors">
            {/* Header */}
            <div className="px-5 py-4 bg-white/90 dark:bg-charcoal-800/90 border-b border-charcoal-200/70 dark:border-charcoal-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">HomeSync AI</h3>
                    <span className="text-[10px] font-semibold bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 px-2 py-0.5 rounded-full border border-sage-200 dark:border-sage-800">
                      Personal Consultant
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-400 dark:text-charcoal-400">Authenticated: {household?.propertyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 transition-colors"
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-subtle ${
                      m.sender === 'user'
                        ? 'bg-sage-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-charcoal-800 text-charcoal-800 dark:text-ivory-100 border border-charcoal-100 dark:border-charcoal-700 rounded-bl-xs'
                    }`}
                  >
                    {m.content}

                    {/* Tool Confirmation Action Box (e.g. for creating expenses) */}
                    {m.toolCall && m.toolCall.status === 'pending_confirmation' && (
                      <div className="mt-3.5 pt-3 border-t border-charcoal-100/80 dark:border-charcoal-700 bg-ivory-50 dark:bg-charcoal-900/80 -mx-2 -mb-2 p-3 rounded-xl border border-charcoal-200 dark:border-charcoal-700">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold text-xs mb-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Financial Authorization Required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmTool(m.id, m.toolCall!)}
                            className="flex-1 py-1.5 px-3 bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Confirm & Execute
                          </button>
                          <button
                            onClick={() => handleCancelTool(m.id)}
                            className="py-1.5 px-3 border border-charcoal-200 dark:border-charcoal-600 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-200 text-xs font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-charcoal-400 mt-1 px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-300 bg-white dark:bg-charcoal-800 p-3 rounded-2xl w-fit border border-charcoal-100 dark:border-charcoal-700 shadow-subtle">
                  <Bot className="w-4 h-4 text-sage-600 dark:text-sage-400 animate-spin" />
                  <span>HomeSync AI is inspecting household records...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-white/70 dark:bg-charcoal-800/80 border-t border-charcoal-100 dark:border-charcoal-700 overflow-x-auto flex items-center gap-2 no-scrollbar">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.label)}
                  className="shrink-0 text-[11px] font-medium bg-ivory-100 dark:bg-charcoal-700 hover:bg-sage-50 dark:hover:bg-charcoal-600 hover:text-sage-800 dark:hover:text-sage-300 text-charcoal-700 dark:text-charcoal-200 px-3 py-1.5 rounded-full border border-charcoal-200/60 dark:border-charcoal-600 transition-colors flex items-center gap-1.5"
                >
                  <s.icon className="w-3 h-3 text-sage-600 dark:text-sage-400" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 sm:p-4 bg-white dark:bg-charcoal-800 border-t border-charcoal-200/80 dark:border-charcoal-700">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask HomeSync AI (e.g. 'Add ₹500 for groceries and split')..."
                  className="flex-1 bg-ivory-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all placeholder:text-charcoal-400 dark:placeholder:text-charcoal-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="p-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-40 text-white shadow-subtle transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
