import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Brain, Send, Sparkles, ChefHat, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I\'m your AI nutrition assistant. Ask me anything about recipes, nutrition, or meal planning! 🥗', id: 0 }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const quickPrompts = [
    'What can I cook with chicken and rice?',
    'Suggest a healthy breakfast',
    'How many calories should I eat?',
    'What are good protein sources?',
    'Suggest a meal plan for today',
    'What can I substitute for eggs?',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim(), id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', { message: input.trim(), history });
      const reply = res.data.data.reply;
      setMessages(prev => [...prev, { role: 'ai', content: reply, id: Date.now() + 1 }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again! 🤖', id: Date.now() + 1 }]);
    }
    setLoading(false);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
              <p className="text-slate-500 dark:text-slate-400">Ask me anything about nutrition & cooking</p>
            </div>
          </div>

          <Card className="h-[600px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <Avatar name="You" size="sm" />
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4">
                    <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-6 pb-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Quick questions</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button key={idx} onClick={() => handleQuickPrompt(prompt)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium transition-all">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about recipes, nutrition, meal planning..."
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                <Button variant="primary" onClick={handleSend} disabled={!input.trim() || loading}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default AIAssistant;
