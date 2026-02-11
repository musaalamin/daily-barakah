'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Send, User, Clock, Users } from 'lucide-react';

const NAMES = ["Ahmed", "Fatima", "Yusuf", "Aisha", "Ibrahim", "Zainab", "Omar", "Hana"];
const DUAS = [
    "May Allah grant us all Jannah.",
    "Please pray for my exams tomorrow.",
    "Ya Allah, heal everyone who is sick.",
    "O Allah, increase us in knowledge.",
    "May Allah forgive our parents."
];

const generateRandomLikes = () => Math.floor(Math.random() * 500) + 50;

const INITIAL_POSTS = [
  { id: 1, user: "Sister Amina", text: "Please pray for my mother's health. She is undergoing surgery tomorrow.", ameens: 842, time: "2h ago", isUser: false },
  { id: 2, user: "Ahmed K.", text: "I have a difficult exam coming up. Ya Allah make it easy for me.", ameens: 389, time: "4h ago", isUser: false },
  { id: 3, user: "Anonymous", text: "Ya Allah, bless everyone reading this with Jannah and remove their worries.", ameens: 1256, time: "5h ago", isUser: false }
];

export default function DuaFeed({ onClose }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newDua, setNewDua] = useState("");
  const [onlineCount, setOnlineCount] = useState(1240);
  const feedRef = useRef(null);

  // SIMULATE LIVE ACTIVITY
  useEffect(() => {
    // 1. Add Fake Likes randomly
    const likeInterval = setInterval(() => {
        setPosts(currentPosts => 
            currentPosts.map(p => 
                Math.random() > 0.7 ? { ...p, ameens: p.ameens + Math.floor(Math.random() * 5) } : p
            )
        );
    }, 2000);

    // 2. Add Fake Post every 10 seconds
    const postInterval = setInterval(() => {
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        const randomDua = DUAS[Math.floor(Math.random() * DUAS.length)];
        
        const fakePost = {
            id: Date.now() + Math.random(),
            user: randomName,
            text: randomDua,
            ameens: 1,
            time: "Just now",
            isUser: false
        };
        setPosts(prev => [fakePost, ...prev]);
        setOnlineCount(c => c + Math.floor(Math.random() * 5)); // Increase online count
    }, 10000);

    return () => { clearInterval(likeInterval); clearInterval(postInterval); };
  }, []);

  const handlePost = () => {
    if (!newDua.trim()) return;
    
    const post = {
      id: Date.now(),
      user: "You",
      text: newDua,
      ameens: 0,
      time: "Just now",
      isUser: true
    };
    
    setPosts([post, ...posts]);
    setNewDua("");
    
    if(feedRef.current) feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAmeen = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, ameens: p.ameens + 1, liked: true } : p));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col animate-in slide-in-from-right">
      <div className="p-4 flex items-center justify-between bg-[#1B4332] text-white shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <button onClick={onClose}><ArrowLeft /></button>
            <div>
                <h2 className="font-bold text-lg">Community Dua</h2>
                <div className="flex items-center gap-1 text-[10px] text-green-200">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {onlineCount.toLocaleString()} Muslims Online
                </div>
            </div>
        </div>
        <Users size={20} className="opacity-50"/>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24" ref={feedRef}>
          {/* Input Area */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 mb-6">
              <textarea 
                value={newDua}
                onChange={(e) => setNewDua(e.target.value)}
                placeholder="Ask the Ummah for Dua..." 
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-green-500 focus:bg-white transition-all resize-none h-24"
              />
              <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400">Be sincere & kind.</span>
                  <button 
                    onClick={handlePost}
                    className="bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-800 disabled:opacity-50 flex items-center gap-2"
                    disabled={!newDua.trim()}
                  >
                      Post Dua <Send size={14} />
                  </button>
              </div>
          </div>

          {/* Feed */}
          {posts.map(post => (
              <div key={post.id} className={`p-5 rounded-2xl shadow-sm border animate-in slide-in-from-bottom-2 ${post.isUser ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${post.isUser ? 'bg-[#1B4332]' : 'bg-gray-300'}`}>
                              {post.user.charAt(0)}
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-800">{post.user}</p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10}/> {post.time}</p>
                          </div>
                      </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 font-medium">"{post.text}"</p>
                  <button 
                    onClick={() => handleAmeen(post.id)}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-colors w-full justify-center ${post.liked ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}
                  >
                      <Heart size={14} className={post.liked || post.ameens > 0 ? "fill-current" : ""} /> 
                      {post.ameens === 0 ? "Be the first to say Ameen" : `${post.ameens.toLocaleString()} Said Ameen`}
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
}