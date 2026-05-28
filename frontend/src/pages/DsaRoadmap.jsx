import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Map, Trophy, Database, GitMerge, GalleryHorizontalEnd, Layers, Search, Link as LinkIcon, Network, Flame } from 'lucide-react';

const ROADMAP_DATA = [
  {
    id: 'arrays',
    title: 'Arrays & Hashing',
    icon: <Database size={20} />,
    questions: [
      { id: 'q1', title: 'Contains Duplicate', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'q2', title: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'q3', title: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 'q4', title: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'q5', title: 'Top K Frequent Elements', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'q6', title: 'Product of Array Except Self', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'q7', title: 'Valid Sudoku', difficulty: 'Medium', link: 'https://leetcode.com/problems/valid-sudoku/' },
      { id: 'q8', title: 'Longest Consecutive Sequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' }
    ]
  },
  {
    id: 'twopointers',
    title: 'Two Pointers',
    icon: <GitMerge size={20} />,
    questions: [
      { id: 'q9', title: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'q10', title: 'Two Sum II', difficulty: 'Medium', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'q11', title: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'q12', title: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' }
    ]
  },
  {
    id: 'slidingwindow',
    title: 'Sliding Window',
    icon: <GalleryHorizontalEnd size={20} />,
    questions: [
      { id: 'q13', title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'q14', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'q15', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'q16', title: 'Minimum Window Substring', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' }
    ]
  },
  {
    id: 'stack',
    title: 'Stack',
    icon: <Layers size={20} />,
    questions: [
      { id: 'q17', title: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'q18', title: 'Min Stack', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack/' },
      { id: 'q19', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'q20', title: 'Generate Parentheses', difficulty: 'Medium', link: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'q21', title: 'Daily Temperatures', difficulty: 'Medium', link: 'https://leetcode.com/problems/daily-temperatures/' }
    ]
  },
  {
    id: 'binarysearch',
    title: 'Binary Search',
    icon: <Search size={20} />,
    questions: [
      { id: 'q22', title: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/' },
      { id: 'q23', title: 'Search a 2D Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'q24', title: 'Koko Eating Bananas', difficulty: 'Medium', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'q25', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'q26', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' }
    ]
  },
  {
    id: 'linkedlist',
    title: 'Linked List',
    icon: <LinkIcon size={20} />,
    questions: [
      { id: 'q27', title: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'q28', title: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'q29', title: 'Reorder List', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'q30', title: 'Remove Nth Node From End of List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'q31', title: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'q32', title: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'q33', title: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'q34', title: 'Merge k Sorted Lists', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' }
    ]
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: <Network size={20} />,
    questions: [
      { id: 'q35', title: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'q36', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'q37', title: 'Diameter of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'q38', title: 'Balanced Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 'q39', title: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
      { id: 'q40', title: 'Subtree of Another Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'q41', title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'q42', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' }
    ]
  }
];

export default function DsaRoadmap() {
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState({ 'arrays': true });
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Count total questions
    let total = 0;
    ROADMAP_DATA.forEach(topic => {
      total += topic.questions.length;
    });
    setTotalQuestions(total);

    // Load progress from Supabase
    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('dsa_progress').select('topic_id, completed').eq('user_id', user.id);
        if (data && !error) {
          const loadedProgress = {};
          data.forEach(item => {
            loadedProgress[item.topic_id] = item.completed;
          });
          setCompletedQuestions(loadedProgress);
          localStorage.setItem('dsaProgress', JSON.stringify(loadedProgress));
        }
      }
    });
  }, []);

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleQuestion = (e, qId) => {
    e.stopPropagation();
    const isNowCompleted = !completedQuestions[qId];
    const newCompleted = {
      ...completedQuestions,
      [qId]: isNowCompleted
    };
    setCompletedQuestions(newCompleted);
    localStorage.setItem('dsaProgress', JSON.stringify(newCompleted));

    import('../lib/supabase').then(async ({ supabase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (isNowCompleted) {
          await supabase.from('dsa_progress').upsert({ user_id: user.id, topic_id: qId, completed: true });
        } else {
          await supabase.from('dsa_progress').delete().eq('user_id', user.id).eq('topic_id', qId);
        }
      }
    });

    // Update exact score
    const currentScore = parseInt(localStorage.getItem('prepGenie_score') || '0', 10);
    const scoreDiff = isNowCompleted ? 10 : -10;
    const newScore = Math.max(0, currentScore + scoreDiff);
    localStorage.setItem('prepGenie_score', newScore);
    window.dispatchEvent(new Event('statsUpdated'));
  };

  const getTopicProgress = (topic) => {
    const completed = topic.questions.filter(q => completedQuestions[q.id]).length;
    const total = topic.questions.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  const overallPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return '#10b981';
    if (difficulty === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="main-content" style={{ padding: '2rem', marginLeft: '80px', marginTop: '20px' }}>
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Map size={36} color="var(--primary)" /> DSA Roadmap
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Master Data Structures and Algorithms with this curated list of essential problems.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.05))', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.3)', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)' }} className="premium-3d">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px', justifyContent: 'flex-end' }}>
            <Trophy size={20} /> Overall Progress
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'baseline', gap: '5px', justifyContent: 'flex-end' }}>
            {completedCount} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ {totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="glass-panel premium-3d" style={{ padding: '2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(168,85,247,0.3)', background: 'linear-gradient(135deg, rgba(20,20,30,0.8), rgba(10,10,15,0.9))' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)', width: '250px', height: '250px', borderRadius: '50%', filter: 'blur(30px)' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontWeight: '800', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Flame color="#f59e0b" size={28} /> Skill Tree Mastery
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '2rem', textShadow: '0 0 20px rgba(168,85,247,0.8)' }}>{overallPercentage}%</span>
        </div>
        <div style={{ width: '100%', height: '20px', background: 'rgba(0,0,0,0.6)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)', 
            width: `${overallPercentage}%`,
            transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            borderRadius: '10px',
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.4), 0 0 20px rgba(168,85,247,0.8)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', animation: 'shimmerXP 2s infinite' }}></div>
          </div>
        </div>
      </div>

      {/* RPG Timeline Skill Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', paddingLeft: '30px' }}>
        {/* The Glowing Vertical Path */}
        <div style={{ position: 'absolute', left: '49px', top: '20px', bottom: '20px', width: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${overallPercentage}%`, background: 'linear-gradient(180deg, #38bdf8, #a855f7)', boxShadow: '0 0 15px #a855f7', transition: 'height 1s ease', borderRadius: '2px' }}></div>
        </div>
        {ROADMAP_DATA.map((topic, index) => {
          const progress = getTopicProgress(topic);
          const isUnlocked = index === 0 || getTopicProgress(ROADMAP_DATA[index - 1]).percentage > 0;
          const isFullyCompleted = progress.percentage === 100;
          const isExpanded = expandedTopics[topic.id];

          return (
            <div key={topic.id} style={{ position: 'relative', zIndex: 1, paddingLeft: '4rem', opacity: isUnlocked ? 1 : 0.5, filter: isUnlocked ? 'none' : 'grayscale(100%)', transition: 'all 0.4s' }}>
              
              {/* Skill Node Circle */}
              <div style={{ 
                position: 'absolute', left: '0', top: '25px', width: '42px', height: '42px', 
                borderRadius: '50%', 
                background: isFullyCompleted ? '#10b981' : isUnlocked ? '#a855f7' : '#1f2937',
                border: `3px solid ${isFullyCompleted ? '#059669' : isUnlocked ? '#d8b4fe' : '#4b5563'}`,
                boxShadow: isUnlocked ? `0 0 20px ${isFullyCompleted ? '#10b981' : '#a855f7'}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
                transition: 'all 0.3s'
              }}>
                {isFullyCompleted ? <CheckCircle2 size={24} color="#fff" /> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff' }}></div>}
              </div>

              <div className="glass-panel premium-3d cascade-reveal" style={{ 
                overflow: 'hidden', 
                animationDelay: `${index * 0.08}s`, 
                transition: 'all 0.4s ease', 
                background: isExpanded ? 'linear-gradient(135deg, rgba(20,20,30,0.9), rgba(10,10,15,0.95))' : 'rgba(15,20,30,0.7)',
                border: isExpanded ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)', 
                boxShadow: isExpanded ? '0 15px 40px rgba(168,85,247,0.2)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                borderRadius: '20px'
              }}>
                {/* Topic Header */}
                <div 
                  style={{ 
                    padding: '1.8rem 2rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}
                  onClick={() => isUnlocked && toggleTopic(topic.id)}
                  onMouseOver={(e) => { if (!isExpanded && isUnlocked) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseOut={(e) => { if (!isExpanded && isUnlocked) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                      width: '48px', height: '48px', 
                      borderRadius: '12px', 
                      background: isFullyCompleted ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1))', 
                      color: isFullyCompleted ? '#10b981' : 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: isFullyCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(168,85,247,0.3)',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)'
                    }}>
                      {topic.icon || <Map size={24} />}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', margin: '0 0 5px 0', fontWeight: '800', letterSpacing: '0.5px', color: '#fff' }}>{topic.title}</h2>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{topic.questions.length} Quest{topic.questions.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {/* Topic Mini Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '100px', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ width: `${progress.percentage}%`, height: '100%', background: isFullyCompleted ? '#10b981' : 'linear-gradient(90deg, #38bdf8, #a855f7)', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isFullyCompleted ? '#10b981' : '#fff', minWidth: '50px' }}>{progress.percentage}%</span>
                    </div>
                    
                    <div style={{ color: 'var(--text-muted)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown size={28} />
                    </div>
                  </div>
                </div>

              {/* Questions List */}
              {isExpanded && (
                <div style={{ padding: '0.5rem 0' }}>
                  {topic.questions.map((q, qIndex) => {
                    const isCompleted = completedQuestions[q.id];
                    return (
                      <div 
                        key={q.id} 
                        style={{ 
                          padding: '1rem 1.5rem', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'background 0.2s',
                          borderBottom: qIndex !== topic.questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button 
                            onClick={(e) => toggleQuestion(e, q.id)}
                            style={{ 
                              background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', 
                              border: isCompleted ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.1)', 
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: isCompleted ? '#10b981' : 'var(--text-muted)',
                              width: '36px', height: '36px', borderRadius: '50%',
                              transition: 'all 0.2s',
                              boxShadow: isCompleted ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                            }}
                            onMouseOver={(e) => { if (!isCompleted) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseOut={(e) => { if (!isCompleted) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                          >
                            {isCompleted ? <CheckCircle2 size={20} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>}
                          </button>
                          
                          <span 
                            onClick={() => navigate('/coding-playground', { state: { question: q } })}
                            style={{ 
                              color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', 
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              fontSize: '1.1rem',
                              transition: 'color 0.2s',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => { if (!isCompleted) e.currentTarget.style.color = 'var(--primary)' }}
                            onMouseOut={(e) => { if (!isCompleted) e.currentTarget.style.color = 'var(--text-main)' }}
                          >
                            {q.title}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: '600', 
                            color: getDifficultyColor(q.difficulty),
                            background: `${getDifficultyColor(q.difficulty)}15`,
                            padding: '4px 10px',
                            borderRadius: '12px'
                          }}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
