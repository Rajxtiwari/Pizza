import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Moon, 
  Sun, 
  MessageSquare, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Star, 
  Clock, 
  MapPin, 
  CreditCard,
  ChefHat,
  Info,
  Mic,
  Send
} from 'lucide-react';
import { PIZZAS, Pizza, CartItem, Order, User } from './types';
import { getChatResponse } from './services/geminiService';

export default function App() {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Zypto Brain. Ready for some delicious pizza? I can recommend toppings, check your points, or track your order!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aKeyPressCount, setAKeyPressCount] = useState(0);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load state
  useEffect(() => {
    const savedCart = localStorage.getItem('zypto_cart');
    const savedUser = localStorage.getItem('zypto_user');
    const savedTheme = localStorage.getItem('zypto_theme');
    const savedOrders = localStorage.getItem('zypto_all_orders');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    if (savedOrders) setAllOrders(JSON.parse(savedOrders));
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('zypto_cart', JSON.stringify(cart));
    localStorage.setItem('zypto_user', JSON.stringify(user));
    localStorage.setItem('zypto_theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('zypto_all_orders', JSON.stringify(allOrders));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [cart, user, isDarkMode, allOrders]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Admin easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a') {
        setAKeyPressCount(prev => {
          if (prev + 1 >= 5) {
            setIsAdminOpen(true);
            return 0;
          }
          return prev + 1;
        });
      } else {
        setAKeyPressCount(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Recommendations Logic
  const recommendations = useMemo(() => {
    const cartTags = cart.flatMap(item => {
      const pizza = PIZZAS.find(p => p.id === item.pizzaId);
      return pizza ? pizza.tags : [];
    });

    const userHistoryTags = user?.orderHistory.flatMap(order => 
      order.items.flatMap(item => {
        const pizza = PIZZAS.find(p => p.name === item.name);
        return pizza ? pizza.tags : [];
      })
    ) || [];

    const allRelevantTags = [...cartTags, ...userHistoryTags];
    const tagCounts: Record<string, number> = {};
    allRelevantTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const scoredPizzas = PIZZAS.filter(p => !cart.some(c => c.pizzaId === p.id))
      .map(p => {
        let score = 0;
        p.tags.forEach(tag => {
          score += tagCounts[tag] || 0;
        });
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score);

    return scoredPizzas.slice(0, 3);
  }, [cart, user]);

  const recommendationReason = useMemo(() => {
    if (cart.length === 0 && (!user || user.orderHistory.length === 0)) {
      return "AI Insight: New here? These are our most popular picks to get you started!";
    }
    
    const cartTags = cart.flatMap(item => {
      const pizza = PIZZAS.find(p => p.id === item.pizzaId);
      return pizza ? pizza.tags : [];
    });
    
    if (cartTags.includes('spicy')) return "AI Insight: You seem to love 'spicy' flavors. Check these out!";
    if (cartTags.includes('vegetarian')) return "AI Insight: We've found some great vegetarian options for you!";
    if (cartTags.includes('meat')) return "AI Insight: Based on your love for meat, we recommend these!";
    
    return "AI Insight: Based on your current selection and history, we think you'll love these.";
  }, [cart, user]);

  // Actions
  const addToCart = (pizzaId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.pizzaId === pizzaId);
      if (existing) {
        return prev.map(item => item.pizzaId === pizzaId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { pizzaId, quantity: 1 }];
    });
  };

  const updateQuantity = (pizzaId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.pizzaId === pizzaId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (pizzaId: number) => {
    setCart(prev => prev.filter(item => item.pizzaId !== pizzaId));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const pizza = PIZZAS.find(p => p.id === item.pizzaId);
    return sum + (pizza?.price || 0) * item.quantity;
  }, 0);

  const loyaltyDiscount = (user?.points || 0) >= 500 ? 5 : 0;
  const finalTotal = Math.max(0, cartTotal - loyaltyDiscount);

  const handleLogin = (username: string) => {
    const newUser: User = {
      username,
      points: 0,
      orderHistory: []
    };
    setUser(newUser);
    setIsProfileOpen(false);
  };

  const handlePlaceOrder = (address: string, city: string) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleString(),
      items: cart.map(item => {
        const pizza = PIZZAS.find(p => p.id === item.pizzaId)!;
        return { name: pizza.name, quantity: item.quantity, price: pizza.price };
      }),
      total: finalTotal,
      address,
      city,
      status: 'preparing'
    };

    const earnedPoints = Math.floor(cartTotal * 10);
    const updatedUser = user ? {
      ...user,
      points: user.points - (loyaltyDiscount > 0 ? 500 : 0) + earnedPoints,
      orderHistory: [newOrder, ...user.orderHistory]
    } : {
      username: 'Guest',
      points: earnedPoints,
      orderHistory: [newOrder]
    };

    setUser(updatedUser);
    setAllOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);

    // Simulate delivery progress
    setTimeout(() => {
      setAllOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'on-the-way' } : o));
      setActiveOrder(prev => prev?.id === newOrder.id ? { ...prev, status: 'on-the-way' } : prev);
    }, 10000);

    setTimeout(() => {
      setAllOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, status: 'delivered' } : o));
      setActiveOrder(prev => prev?.id === newOrder.id ? { ...prev, status: 'delivered' } : prev);
    }, 20000);
  };

  const handleChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    const context = `
      User: ${user?.username || 'Guest'}
      Points: ${user?.points || 0}
      Cart: ${cart.map(i => PIZZAS.find(p => p.id === i.pizzaId)?.name).join(', ')}
      Active Order Status: ${activeOrder?.status || 'None'}
    `;

    const botResponse = await getChatResponse(userMsg, context);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <ChefHat size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter italic">ZYPTO<span className="text-orange-500">PIZZA</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            <UserIcon size={18} />
            <span className="text-sm font-medium hidden sm:inline">
              {user ? user.username : 'Login'}
            </span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-orange-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-orange-500">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Best Pizza in the Metaverse
            </span>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[0.9]">
              CRAVING <br /> <span className="text-orange-500">PERFECTION?</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
              Experience the future of pizza delivery with AI-powered recommendations and lightning-fast service.
            </p>
          </motion.div>
        </section>

        {/* AI Recommendations Banner */}
        <section className="mb-16">
          <div className="p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Star size={16} fill="white" />
                </div>
                <h3 className="font-bold text-xl tracking-tight italic">AI CHEF'S CHOICE</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8 flex items-start gap-3">
                <Info size={18} className="text-orange-400 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-300 italic">{recommendationReason}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recommendations.map(pizza => (
                  <motion.div 
                    key={pizza.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                    onClick={() => addToCart(pizza.id)}
                  >
                    <div className="text-4xl mb-3">{pizza.emoji}</div>
                    <h4 className="font-bold mb-1">{pizza.name}</h4>
                    <p className="text-xs text-zinc-400 mb-3 line-clamp-1">{pizza.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400">${pizza.price}</span>
                      <button className="p-2 rounded-lg bg-white/10 group-hover:bg-orange-500 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Menu Grid */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold tracking-tight">Signature Menu</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PIZZAS.map(pizza => (
              <motion.div 
                key={pizza.id}
                layoutId={`pizza-${pizza.id}`}
                className="group p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-orange-500/10 transition-all"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">{pizza.emoji}</div>
                <div className="flex gap-1 mb-3">
                  {pizza.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-xl font-bold mb-2">{pizza.name}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 h-10 line-clamp-2">
                  {pizza.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">${pizza.price}</span>
                  <button 
                    onClick={() => addToCart(pizza.id)}
                    className="px-6 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-bold">Your Basket</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={32} className="text-zinc-400" />
                    </div>
                    <p className="text-zinc-500">Your basket is empty.</p>
                  </div>
                ) : (
                  cart.map(item => {
                    const pizza = PIZZAS.find(p => p.id === item.pizzaId)!;
                    return (
                      <div key={item.pizzaId} className="flex gap-4">
                        <div className="text-4xl w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                          {pizza.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{pizza.name}</h4>
                          <p className="text-sm text-zinc-500 mb-2">${pizza.price} each</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.pizzaId, -1)} className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.pizzaId, 1)} className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold mb-2">${pizza.price * item.quantity}</p>
                          <button onClick={() => removeFromCart(item.pizzaId)} className="text-zinc-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${cartTotal}</span>
                  </div>
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Loyalty Discount</span>
                      <span>-${loyaltyDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span>Total</span>
                    <span>${finalTotal}</span>
                  </div>
                </div>

                <button 
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[500px]"
            >
              <div className="p-4 bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <ChefHat size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Zypto Brain</h4>
                    <span className="text-[10px] text-zinc-400">Online & Hungry</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-none' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <button type="button" onClick={startVoiceInput} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-orange-500 transition-colors">
                  <Mic size={20} />
                </button>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  <Send size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Modals (Profile, Checkout, Tracking, Admin) */}
      <AnimatePresence>
        {isProfileOpen && (
          <Modal title="Your Profile" onClose={() => setIsProfileOpen(false)}>
            {!user ? (
              <div className="p-6">
                <p className="text-zinc-500 mb-6">Login to save orders and earn points!</p>
                <input 
                  type="text" 
                  placeholder="Enter your username"
                  className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin((e.target as HTMLInputElement).value);
                  }}
                />
                <button 
                  onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    handleLogin(input.value);
                  }}
                  className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold"
                >
                  Join the Pizza Party
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                    <UserIcon size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{user.username}</h4>
                    <p className="text-orange-500 font-bold">{user.points} Zypto Points</p>
                  </div>
                </div>

                <h5 className="font-bold mb-4 flex items-center gap-2">
                  <Clock size={18} /> Order History
                </h5>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {user.orderHistory.length === 0 ? (
                    <p className="text-zinc-500 text-sm italic">No orders yet. Time to fix that!</p>
                  ) : (
                    user.orderHistory.map(order => (
                      <div key={order.id} className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-zinc-500">#{order.id}</span>
                          <span className="text-xs text-zinc-400">{order.date}</span>
                        </div>
                        <p className="text-sm font-medium mb-1">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">${order.total}</span>
                          <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button 
                  onClick={() => setUser(null)}
                  className="w-full mt-8 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </Modal>
        )}

        {isCheckoutOpen && (
          <Modal title="Checkout" onClose={() => setIsCheckoutOpen(false)}>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-zinc-500 mb-2 block">Delivery Address</span>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-zinc-400" size={20} />
                    <input 
                      type="text" 
                      id="checkout-address"
                      placeholder="123 Pizza Lane"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-zinc-500 mb-2 block">City</span>
                  <input 
                    type="text" 
                    id="checkout-city"
                    placeholder="Flavor Town"
                    className="w-full px-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-orange-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Payment Method</p>
                    <p className="text-sm font-bold">Demo Card **** 4242</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-600" />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-2xl font-black mb-6">
                  <span>Total</span>
                  <span>${finalTotal}</span>
                </div>
                <button 
                  onClick={() => {
                    const addr = (document.getElementById('checkout-address') as HTMLInputElement).value;
                    const city = (document.getElementById('checkout-city') as HTMLInputElement).value;
                    if (!addr || !city) return alert("Please fill in your details!");
                    handlePlaceOrder(addr, city);
                  }}
                  className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-xl shadow-orange-500/20"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </Modal>
        )}

        {isTrackingOpen && activeOrder && (
          <Modal title="Track Your Order" onClose={() => setIsTrackingOpen(false)}>
            <div className="p-8 text-center">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-zinc-100 dark:border-zinc-800 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {activeOrder.status === 'preparing' ? '👨‍🍳' : activeOrder.status === 'on-the-way' ? '🛵' : '✅'}
                </div>
              </div>

              <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">
                {activeOrder.status === 'preparing' ? 'Preparing Your Feast' : activeOrder.status === 'on-the-way' ? 'On The Way!' : 'Delivered!'}
              </h4>
              <p className="text-zinc-500 mb-8">
                {activeOrder.status === 'preparing' ? 'Our chefs are working their magic.' : activeOrder.status === 'on-the-way' ? 'Your pizza is cruising to your door.' : 'Enjoy your meal!'}
              </p>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-orange-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Estimated Time</p>
                    <p className="font-bold">15 - 25 Mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-orange-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Delivery To</p>
                    <p className="font-bold truncate max-w-[200px]">{activeOrder.address}, {activeOrder.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {isAdminOpen && (
          <Modal title="Admin Dashboard" onClose={() => setIsAdminOpen(false)}>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Total Orders</p>
                  <p className="text-2xl font-black">{allOrders.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Revenue</p>
                  <p className="text-2xl font-black text-green-500">${allOrders.reduce((a, b) => a + b.total, 0)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Active</p>
                  <p className="text-2xl font-black text-orange-500">{allOrders.filter(o => o.status !== 'delivered').length}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">#{order.id} - {order.items.length} items</p>
                      <p className="text-xs text-zinc-500">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${order.total}</p>
                      <span className="text-[10px] font-black uppercase text-orange-500">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <ChefHat size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tighter italic">ZYPTO<span className="text-orange-500">PIZZA</span></h1>
        </div>
        <p className="text-zinc-500 text-sm mb-8">Crafted with ❤️ and AI for the ultimate pizza experience.</p>
        <div className="flex justify-center gap-6 text-zinc-400">
          <a href="#" className="hover:text-orange-500 transition-colors">Instagram</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Twitter</a>
          <a href="#" className="hover:text-orange-500 transition-colors">TikTok</a>
        </div>
      </footer>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] z-[70] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
}
