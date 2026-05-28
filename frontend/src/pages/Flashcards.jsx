import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Layers, ChevronRight, RotateCcw, Loader2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Flashcards() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchDecks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('flashcard_decks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data && !error) {
          const mappedDecks = data.map(d => ({
            id: d.id,
            name: d.title,
            color: ['#a855f7', '#3b82f6', '#10b981', '#ec4899'][Math.floor(Math.random() * 4)],
            cards: typeof d.cards === 'string' ? JSON.parse(d.cards) : d.cards
          }));
          setDecks(mappedDecks);
        } else {
          setDecks(JSON.parse(localStorage.getItem('flashcardDecks') || '[]'));
        }
      }
    } catch (error) {
      toast.error('Failed to load flashcard decks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      // Mock generation delay
      await new Promise(res => setTimeout(res, 1500));

      const newCards = [
        { question: `What is the core concept of ${topic}?`, answer: `The core concept revolves around optimizing system architecture and resource allocation.` },
        { question: `Name a key benefit of using ${topic}.`, answer: `Improved scalability, maintainability, and better developer experience.` },
        { question: `When should you avoid using ${topic}?`, answer: `When the system overhead is larger than the benefits, or for very simple scripts.` },
        { question: `What is the most common anti-pattern in ${topic}?`, answer: `Tight coupling of components and lack of proper abstraction layers.` }
      ];

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('flashcard_decks').insert([{
          user_id: user.id,
          title: topic,
          cards: newCards
        }]);
      }

      await fetchDecks(); // Refresh decks
      setShowGenerateModal(false);
      setTopic('');
      toast.success('Deck generated successfully! +10 XP');
    } catch (error) {
      toast.error('Failed to generate deck.');
    } finally {
      setGenerating(false);
    }
  };

  const [swipeAnim, setSwipeAnim] = useState(null); // 'left' or 'right'

  const handleReview = async (rating) => {
    // rating: 'hard' -> swipe left, 'easy' -> swipe right
    setSwipeAnim(rating === 'hard' ? 'left' : 'right');
    
    // Wait for swipe animation
    setTimeout(() => {
      if (currentCardIndex < activeDeck.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setFlipped(false);
        setSwipeAnim(null);
      } else {
        toast.success('You have finished this deck! +50 XP 💎');
        setActiveDeck(null);
        setSwipeAnim(null);
      }
    }, 400);
  };

  const startDeck = (deck) => {
    if (!deck.cards || deck.cards.length === 0) {
      toast.error("This deck has no cards.");
      return;
    }
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setFlipped(false);
  };

  return (
    <div className="app-container animate-fade-in">
      <Navbar />
      <div style={{ padding: '2rem 0' }}>
        <style>{`
          @keyframes swipeLeft {
            0% { transform: translateX(0) rotate(0deg) rotateY(180deg); opacity: 1; }
            100% { transform: translateX(-200px) rotate(-15deg) rotateY(180deg); opacity: 0; }
          }
          @keyframes swipeRight {
            0% { transform: translateX(0) rotate(0deg) rotateY(180deg); opacity: 1; }
            100% { transform: translateX(200px) rotate(15deg) rotateY(180deg); opacity: 0; }
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Smart Flashcards</h1>
            <p style={{ color: 'var(--text-muted)' }}>Swipe Right if you know it, Swipe Left if you need practice.</p>
          </div>
          {!activeDeck && (
            <button className="btn-primary hover-glow" style={{ background: 'linear-gradient(135deg, #a855f7, #60a5fa)', padding: '12px 24px', borderRadius: '30px' }} onClick={() => setShowGenerateModal(true)}>
              <Plus size={18} style={{marginRight:'5px'}}/> Generate AI Deck
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          </div>
        ) : !activeDeck ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {decks.length === 0 ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No decks found. Generate one using AI to start learning!</p>
              </div>
            ) : (
              decks.map((deck, idx) => (
                <div key={idx} className="glass-panel premium-3d cascade-reveal" style={{ padding: '2.5rem', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(168, 85, 247, 0.2)', animationDelay: `${idx * 0.1}s` }} 
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(168, 85, 247, 0.2)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                     onClick={() => startDeck(deck)}>
                  <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), transparent)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(168,85,247,0.3)' }}>
                    <Layers color="#c084fc" size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#fff' }}>{deck.name}</h3>
                  <p style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>{deck.cards?.length || 0} cards deck</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: -1 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setActiveDeck(null)}>
                Back to Decks
              </button>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(168,85,247,0.3)', padding: '5px 15px', borderRadius: '20px', color: '#c084fc', fontWeight: 'bold' }}>
                Card {currentCardIndex + 1} of {activeDeck.cards.length}
              </div>
            </div>
            
            {/* The Stack Effect Behind the Card */}
            <div style={{ position: 'relative', height: '450px' }}>
              {currentCardIndex < activeDeck.cards.length - 1 && (
                <div className="glass-panel" style={{ position: 'absolute', top: '20px', left: '5%', width: '90%', height: '400px', zIndex: 0, opacity: 0.5, transform: 'scale(0.95)', border: '1px solid rgba(255,255,255,0.05)' }}></div>
              )}

              <div 
                className="glass-panel premium-3d" 
                style={{ 
                  height: '420px', 
                  width: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '3rem',
                  cursor: 'pointer',
                  perspective: '1000px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  transformStyle: 'preserve-3d',
                  transition: swipeAnim ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: swipeAnim ? 'none' : (flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'),
                  animation: swipeAnim === 'left' ? 'swipeLeft 0.4s forwards' : swipeAnim === 'right' ? 'swipeRight 0.4s forwards' : 'none',
                  border: flipped ? '2px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(168, 85, 247, 0.4)',
                  boxShadow: flipped ? '0 10px 40px rgba(16, 185, 129, 0.2)' : '0 20px 50px rgba(0,0,0,0.5)'
                }}
                onClick={() => setFlipped(!flipped)}
              >
                {!flipped ? (
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(168,85,247,0.1)', color: '#c084fc', padding: '8px 16px', borderRadius: '20px', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid rgba(168,85,247,0.3)' }}>Question</div>
                    <h2 style={{ fontSize: '2.2rem', lineHeight: '1.4', color: '#fff', fontWeight: '800' }}>{activeDeck.cards[currentCardIndex].question}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '3rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RotateCcw size={16} /> Click anywhere to flip
                    </p>
                  </div>
                ) : (
                  <div style={{ transform: 'rotateY(180deg)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
                    <div style={{ alignSelf: 'center', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '20px', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.3)' }}>Answer</div>
                    <h2 style={{ fontSize: '1.6rem', lineHeight: '1.6', color: '#10b981', textAlign: 'center', fontWeight: '600' }}>
                      {activeDeck.cards[currentCardIndex].answer}
                    </h2>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', opacity: flipped ? 1 : 0.2, pointerEvents: flipped ? 'all' : 'none', transition: 'all 0.3s' }}>
              {/* Swipe Left (Hard) */}
              <button 
                onClick={() => handleReview('hard')} 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', color: '#ef4444', 
                  width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)', transition: 'all 0.2s',
                  fontSize: '2rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              >
                ❌
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Swipe Decision
              </div>
              
              {/* Swipe Right (Easy) */}
              <button 
                onClick={() => handleReview('easy')} 
                style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', color: '#10b981', 
                  width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s',
                  fontSize: '2rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; }}
              >
                🔥
              </button>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
              <h2 style={{ marginBottom: '1rem' }}>Generate Flashcards</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Enter a topic and our AI will generate a deck of 10 study cards.</p>
              
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Java Streams, System Design..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                autoFocus
                disabled={generating}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ background: 'transparent', boxShadow: 'none' }} onClick={() => setShowGenerateModal(false)} disabled={generating}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleGenerate} disabled={generating || !topic.trim()}>
                  {generating ? <><Loader2 size={16} className="animate-spin" style={{marginRight:'8px'}}/> Generating...</> : 'Generate AI Deck'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
