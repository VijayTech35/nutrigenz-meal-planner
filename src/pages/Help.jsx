import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition, FadeIn } from '../components/Animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { HelpCircle, ChevronDown, Mail, MessageSquare, BookOpen, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const faqs = [
  { q: 'How do I generate a recipe?', a: 'Go to the Generate page, add your ingredients, select preferences, and click "Generate AI Recipe". The AI will create a unique recipe based on your inputs!' },
  { q: 'How does the pantry work?', a: 'Add ingredients to your pantry with quantities and expiry dates. The system will alert you when items are expiring and suggest recipes based on what you have.' },
  { q: 'Can I track my nutrition?', a: 'Yes! Use the Nutrition Tracker to log meals and track calories, protein, carbs, and fats. Set daily goals and monitor your weekly progress.' },
  { q: 'How do I plan meals for the week?', a: 'Visit the Meal Planner page, navigate to any week, and click on empty slots to add recipes. You can also generate a grocery list from your meal plan.' },
  { q: 'What is the AI Assistant?', a: 'The AI Assistant is your personal nutrition coach. Ask it questions about recipes, nutrition facts, meal planning, and get instant answers.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive instructions to reset your password.' },
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
              <p className="text-slate-500 dark:text-slate-400">Find answers and get support</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FadeIn delay={0}>
              <div className="p-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl text-white">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">Email Support</h3>
                <p className="text-white/80 text-sm">support@nutrigenz.ai</p>
                <p className="text-white/60 text-xs mt-1">24h response time</p>
              </div>
            </FadeIn>
            <FadeIn delay={50}>
              <div className="p-5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl text-white">
                <MessageSquare className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-white/80 text-sm">Chat with our team</p>
                <p className="text-white/60 text-xs mt-1">Available 9am-5pm</p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl text-white">
                <BookOpen className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">Documentation</h3>
                <p className="text-white/80 text-sm">Read our guides</p>
                <p className="text-white/60 text-xs mt-1">Comprehensive docs</p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-1">AI Help</h3>
                <p className="text-white/80 text-sm">Ask the AI assistant</p>
                <p className="text-white/60 text-xs mt-1">Instant answers</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search FAQs..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                      <span className="font-medium text-slate-900 dark:text-white pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="p-4 pt-0 text-slate-600 dark:text-slate-400 text-sm">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={300}>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Send Feedback</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Help us improve NutriGenZ! Share your thoughts or report an issue.</p>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
                placeholder="Your feedback..." />
              <Button variant="primary" onClick={() => { if (feedback.trim()) { toast.success('Thank you for your feedback!'); setFeedback(''); } }} disabled={!feedback.trim()}>
                <MessageSquare className="w-4 h-4" /> Send Feedback
              </Button>
            </Card>
          </FadeIn>
        </div>
        <MobileNav />
      </div>
    </PageTransition>
  );
};

export default Help;
