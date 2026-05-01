'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Plus,
  Package,
  ShoppingBag,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Truck,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Box,
  Loader2,
  Tags,
  LogOut,
  X,
  Check,
  MessageSquare,
  Mail,
  Users,
  Activity,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [draggedOrderId, setDraggedOrderId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    category: []
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    image: ''
  });

  useEffect(() => {
    const savedLogin = localStorage.getItem('nafha_admin_session');
    if (savedLogin === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchOrders();
      fetchCategories();
      fetchContacts();
      fetchSubscribers();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('nafha_admin_session', 'active');
        toast.success('Access Granted');
      } else {
        toast.error('Access Denied');
      }
    } catch (error) {
      toast.error('Login Error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('nafha_admin_session');
    toast.success('Logged out');
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchContacts = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    setContacts(data);
  };

  const fetchSubscribers = async () => {
    const res = await fetch('/api/newsletter');
    const data = await res.json();
    setSubscribers(data);
  };

  // Analytics Calculations
  const getAnalytics = () => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'shipped');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalSalesCount = deliveredOrders.length;
    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const avgOrderValue = totalSalesCount > 0 ? (totalRevenue / totalSalesCount).toFixed(2) : 0;
    
    // Daily Sales Data (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dailySales = last7Days.map(date => {
      const dayOrders = deliveredOrders.filter(o => o.createdAt?.split('T')[0] === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length
      };
    });

    // Top Products
    const productStats = {};
    deliveredOrders.forEach(o => {
      o.items?.forEach(item => {
        if (!productStats[item.name]) productStats[item.name] = { name: item.name, sales: 0, revenue: 0 };
        productStats[item.name].sales += item.quantity;
        productStats[item.name].revenue += (item.price || 0) * item.quantity;
      });
    });
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return { totalRevenue, totalSalesCount, pendingOrdersCount, avgOrderValue, dailySales, topProducts };
  };

  const stats = getAnalytics();

  const [isDeleting, setIsDeleting] = useState(null); // { id, type, name }

  const handleConfirmDelete = async () => {
    if (!isDeleting) return;
    const { id, type } = isDeleting;

    try {
      let url = '';
      if (type === 'product') url = `/api/products/${id}`;
      else if (type === 'category') url = `/api/categories/${id}`;
      else if (type === 'contact') url = `/api/contact/${id}`;
      else if (type === 'order') url = `/api/orders/${id}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} Removed`);
        if (type === 'product') fetchProducts();
        else if (type === 'category') fetchCategories();
        else if (type === 'contact') fetchContacts();
        else if (type === 'order') fetchOrders();
      } else {
        toast.error('Deletion failed');
      }
    } catch (error) {
      toast.error('Network Error');
    } finally {
      setIsDeleting(null);
    }
  };

  const deleteContact = (id, name) => setIsDeleting({ id, type: 'contact', name });
  const deleteCategory = (id, name) => setIsDeleting({ id, type: 'category', name });
  const deleteProduct = (id, name) => setIsDeleting({ id, type: 'product', name });
  const deleteOrder = (id, name) => setIsDeleting({ id, type: 'order', name });

  const handleImageUpload = async (e, type = 'product') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });
      const data = await res.json();
      if (data.url) {
        if (type === 'product') {
          setFormData(prev => ({ ...prev, image: data.url }));
        } else {
          setCategoryFormData(prev => ({ ...prev, image: data.url }));
        }
        toast.success('Image uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload Error');
    } finally {
      setUploading(false);
    }
  };

  const toggleProductCategory = (catName) => {
    setFormData(prev => {
      const current = prev.category || [];
      if (current.includes(catName)) {
        return { ...prev, category: current.filter(c => c !== catName) };
      } else {
        return { ...prev, category: [...current, catName] };
      }
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (formData.category.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      // Clean up data
      const dataToSend = { ...formData };
      delete dataToSend._id;
      delete dataToSend.__v;
      delete dataToSend.createdAt;
      delete dataToSend.updatedAt;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product added');
        setIsAdding(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', image: '', stock: '', category: [] });
        fetchProducts();
      }
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData),
      });
      if (res.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category added');
        setIsAddingCategory(false);
        setEditingCategory(null);
        setCategoryFormData({ name: '', image: '' });
        fetchCategories();
      }
    } catch (error) {
      toast.error('Error saving category');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Order moved to ${status}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="game-card p-10 w-full max-w-md bg-surface text-center shadow-[12px_12px_0px_#000000]">
          <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-black">ADMIN ACCESS</h1>
          <p className="text-black/60 font-bold uppercase tracking-widest text-xs mb-8">Secure Terminal</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="PASSKEY"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-white border-2 border-black p-4 rounded-xl focus:border-primary outline-none text-center font-black tracking-widest text-black"
            />
            <button type="submit" className="game-button w-full py-4 cursor-pointer">
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar cartCount={0} onCartClick={() => { }} />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-black">Admin Dashboard</h1>
            <p className="text-black/60 font-bold uppercase tracking-widest text-sm flex items-center gap-4">
              Authorized Personnel Only
              <button onClick={handleLogout} className="text-red-500 flex items-center gap-1 hover:underline cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 p-1 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000]">
            <button onClick={() => setActiveTab('intelligence')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'intelligence' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <Activity className="w-5 h-5" /> <span className="hidden sm:inline">dashboard</span>
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'products' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <Package className="w-5 h-5" /> <span className="hidden sm:inline">Products</span>
            </button>
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'categories' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <Tags className="w-5 h-5" /> <span className="hidden sm:inline">Categories</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <ShoppingBag className="w-5 h-5" /> <span className="hidden sm:inline">Orders</span>
            </button>
            <button onClick={() => setActiveTab('contacts')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'contacts' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <MessageSquare className="w-5 h-5" /> <span className="hidden sm:inline">Contacts</span>
            </button>
            <button onClick={() => setActiveTab('subscribers')} className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'subscribers' ? 'bg-primary text-black' : 'hover:bg-black/5 text-black/40'}`}>
              <Users className="w-5 h-5" /> <span className="hidden sm:inline">Recruits</span>
            </button>
          </div>
        </div>

        {activeTab === 'intelligence' && (
          <div className="space-y-12">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `${stats.totalRevenue} DT`, icon: Wallet, color: 'text-primary' },
                { label: 'Successful Missions', value: stats.totalSalesCount, icon: Zap, color: 'text-blue-500' },
                { label: 'Pending Missions', value: stats.pendingOrdersCount, icon: Clock, color: 'text-orange-500' },
                { label: 'Avg Order Value', value: `${stats.avgOrderValue} DT`, icon: TrendingUp, color: 'text-purple-500' },
              ].map((s, i) => (
                <div key={i} className="game-card p-6 bg-white border-2 border-black shadow-[6px_6px_0px_#000000] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <s.icon className="w-16 h-16 text-black" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1 relative z-10">{s.label}</p>
                  <h3 className="text-3xl font-black italic text-black relative z-10">{s.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue Curve */}
              <div className="lg:col-span-2 game-card p-8 bg-white border-2 border-black shadow-[10px_10px_0px_#000000]">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-black">Revenue Stream</h3>
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">7-Day Deployment Intel</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-black/10 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-black uppercase text-black/40">Active</span>
                    </div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.dailySales}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2ef2c9" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2ef2c9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#00000008" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: '900', fill: '#00000030'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: '900', fill: '#00000030'}}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '20px', 
                          border: '2px solid black', 
                          fontWeight: '900', 
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          boxShadow: '8px 8px 0px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Best Sellers */}
              <div className="game-card p-8 bg-white border-2 border-black shadow-[10px_10px_0px_#000000]">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-black mb-10">Asset Leaderboard</h3>
                <div className="space-y-4">
                  {stats.topProducts.map((p, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border-2 border-black/5 hover:border-black transition-all hover:bg-white hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center font-black text-primary text-xs italic shadow-lg group-hover:rotate-6 transition-transform">{i+1}</div>
                        <div>
                          <p className="font-black uppercase italic text-sm text-black truncate max-w-[120px]">{p.name}</p>
                          <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">{p.sales} Units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-black leading-none">{p.revenue} DT</p>
                        <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Confirmed</p>
                      </div>
                    </div>
                  ))}
                  {stats.topProducts.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-black/20 font-black uppercase text-xs tracking-widest border-2 border-dashed border-black/5 rounded-[2.5rem] py-20">
                      Waiting for Intel
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Asset Inventory</h2>
              <button
                onClick={() => {
                  setIsAdding(!isAdding);
                  setEditingProduct(null);
                  setFormData({ name: '', description: '', price: '', image: '', stock: '', category: [] });
                }}
                className="game-button py-3 px-6 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                {isAdding ? 'Cancel' : 'Register New Asset'}
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleSaveProduct} className="game-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-2 border-black shadow-[12px_12px_0px_#000000]">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Name</label>
                  <input required className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Price (DT)</label>
                  <input required type="number" className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Stock</label>
                  <input required type="number" className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Target Categories (Select Multiple)</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map(cat => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => toggleProductCategory(cat.name)}
                        className={`p-3 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest flex items-center justify-between transition-all ${formData.category?.includes(cat.name) ? 'bg-black text-white border-black' : 'bg-zinc-50 text-black/40 border-black/10 hover:border-black/30'}`}
                      >
                        {cat.name}
                        {formData.category?.includes(cat.name) && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Product Image</label>
                  <label className={`w-full h-64 border-2 border-dashed border-black rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-all overflow-hidden bg-zinc-50 relative`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} disabled={uploading} />
                    {uploading ? (
                      <Loader2 className="w-12 h-12 animate-spin text-black" />
                    ) : formData.image ? (
                      <div className="relative w-full h-full p-4">
                        <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
                        <button type="button" onClick={(e) => { e.preventDefault(); setFormData({ ...formData, image: '' }); }} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full cursor-pointer"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Plus className="w-12 h-12 text-black/20" />
                        <span className="text-xs font-black uppercase text-black/40">Drop Tactical Asset Here</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Description</label>
                  <textarea required className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none h-32" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="game-button w-full py-4 cursor-pointer">{editingProduct ? 'Update Asset' : 'Register Asset'}</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4">
              {products.map((p) => (
                <div key={p._id} className="game-card p-6 flex flex-col md:flex-row items-center gap-6 bg-white border-2 border-black hover:shadow-[6px_6px_0px_#000000]">
                  <img src={p.image} className="w-24 h-24 object-contain rounded-xl border-2 border-black bg-zinc-50" alt={p.name} />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                      <h3 className="text-xl font-bold uppercase tracking-tighter text-black">{p.name}</h3>
                      {p.category.map(c => (
                        <span key={c} className="text-[9px] bg-black text-white px-2 py-0.5 rounded font-black uppercase">{c}</span>
                      ))}
                    </div>
                    <p className="text-black/60 text-sm line-clamp-1 italic">{p.description}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-1">
                    <span className="text-2xl font-black text-black">{p.price} DT</span>
                    <span className={`text-sm font-bold ${p.stock <= 0 ? 'text-red-500' : 'text-black/40'}`}>Stock: {p.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setFormData({
                          ...p,
                          category: Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)
                        });
                        setIsAdding(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 bg-black/5 hover:bg-primary rounded-xl transition-all border border-black/10 cursor-pointer"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteProduct(p._id, p.name)} className="p-3 bg-black/5 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-black/10 cursor-pointer"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Operations Segments</h2>
              <button onClick={() => { setIsAddingCategory(!isAddingCategory); setEditingCategory(null); setCategoryFormData({ name: '', image: '' }); }} className="game-button py-3 px-6 cursor-pointer"><Plus className="w-5 h-5" /> {isAddingCategory ? 'Cancel' : 'Deploy New Segment'}</button>
            </div>
            {isAddingCategory && (
              <form onSubmit={handleSaveCategory} className="game-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-2 border-black shadow-[12px_12px_0px_#000000]">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Segment Name</label>
                  <input required className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none" value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black">Segment Asset (Image)</label>
                  <label className={`w-full h-48 border-2 border-dashed border-black rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-all relative overflow-hidden bg-zinc-50`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'category')} disabled={uploading} />
                    {uploading ? (
                      <Loader2 className="w-10 h-10 animate-spin text-black" />
                    ) : categoryFormData.image ? (
                      <div className="relative w-full h-full p-4">
                        <img src={categoryFormData.image} className="w-full h-full object-contain" alt="Preview" />
                        <button type="button" onClick={(e) => { e.preventDefault(); setCategoryFormData({ ...categoryFormData, image: '' }); }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full cursor-pointer"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (<Plus className="w-10 h-10 text-black/20" />)}
                  </label>
                </div>
                <div className="md:col-span-2"><button type="submit" className="game-button w-full py-4 cursor-pointer">{editingCategory ? 'Update Segment' : 'Initialize Segment'}</button></div>
              </form>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {categories.map(cat => (
                <div key={cat._id} className="game-card p-6 bg-white text-center group border-2 border-black hover:shadow-[10px_10px_0px_#000000]">
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 border-2 border-black relative group bg-zinc-50">
                    <img src={cat.image} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform" alt={cat.name} />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button onClick={() => { setEditingCategory(cat); setCategoryFormData({ name: cat.name, image: cat.image }); setIsAddingCategory(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-white rounded-xl cursor-pointer hover:bg-primary"><Edit3 className="w-5 h-5" /></button>
                      <button onClick={() => deleteCategory(cat._id, cat.name)} className="p-3 bg-white rounded-xl cursor-pointer hover:bg-red-500 hover:text-white"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <h3 className="font-black uppercase italic tracking-tighter text-xl text-black">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <OrderColumn title="NEW MISSIONS" status="pending" orders={orders} products={products} updateOrderStatus={updateOrderStatus} draggedOrderId={draggedOrderId} setDraggedOrderId={setDraggedOrderId} getInitials={getInitials} color="black" deleteOrder={deleteOrder} />
              <OrderColumn title="IN TRANSIT" status="shipped" orders={orders} products={products} updateOrderStatus={updateOrderStatus} draggedOrderId={draggedOrderId} setDraggedOrderId={setDraggedOrderId} getInitials={getInitials} color="blue-500" deleteOrder={deleteOrder} />
              <OrderColumn title="COMPLETED" status="delivered" orders={orders} products={products} updateOrderStatus={updateOrderStatus} draggedOrderId={draggedOrderId} setDraggedOrderId={setDraggedOrderId} getInitials={getInitials} color="primary" deleteOrder={deleteOrder} />
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Customer Messages</h2>
            {contacts.length === 0 ? (
              <div className="border-2 border-dashed border-black/10 rounded-[2rem] py-20 text-center font-black text-black/10 text-xs tracking-widest uppercase">No Messages Yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map(msg => (
                  <div key={msg._id} className="bg-white border-2 border-black rounded-[2rem] p-6 hover:shadow-[6px_6px_0px_#000000] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-black text-black text-lg italic uppercase">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-[10px] font-black text-black/40 flex items-center gap-1 hover:text-black cursor-pointer">
                          <Mail className="w-3 h-3" /> {msg.email}
                        </a>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => deleteContact(msg._id, `Message from ${msg.name}`)}
                          className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border-2 border-red-100 hover:border-red-500 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-black/70 text-sm font-bold leading-relaxed bg-zinc-50 p-4 rounded-xl border border-black/10">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Newsletter Squad</h2>
            {subscribers.length === 0 ? (
              <div className="border-2 border-dashed border-black/10 rounded-[2rem] py-20 text-center font-black text-black/10 text-xs tracking-widest uppercase">No Recruits Yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscribers.map(sub => (
                  <div key={sub._id} className="bg-white border-2 border-black rounded-2xl p-6 hover:shadow-[6px_6px_0px_#000000] transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-black/40 uppercase tracking-widest leading-none mb-1">Squad Member</p>
                        <h3 className="font-black text-black text-sm truncate uppercase italic">{sub.email.split('@')[0]}</h3>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">{new Date(sub.createdAt).toLocaleDateString()}</span>
                      <a href={`mailto:${sub.email}`} className="p-2 bg-zinc-50 text-black hover:bg-black hover:text-white rounded-lg transition-all cursor-pointer">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border-4 border-black p-8 rounded-[2.5rem] w-full max-w-sm shadow-[20px_20px_0px_rgba(0,0,0,1)] text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-2">UNAUTHORIZED DELETION?</h3>
              <p className="text-black/60 font-bold text-xs uppercase tracking-widest mb-8 leading-relaxed">
                Confirm termination of <span className="text-black font-black italic underline decoration-red-500 decoration-2">{isDeleting.name}</span>? This action cannot be reversed.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-4 rounded-2xl border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white border-2 border-black font-black uppercase tracking-widest text-[10px] shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Terminate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function OrderColumn({ title, status, orders, products, updateOrderStatus, draggedOrderId, setDraggedOrderId, getInitials, color, deleteOrder }) {
  const filteredOrders = orders.filter(o => o.status === status);
  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={() => updateOrderStatus(draggedOrderId, status)} className="space-y-6 min-h-[600px]">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: color === 'primary' ? '#2ef2c9' : color }} />
        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-black/80">{title}</h2>
      </div>
      <div className="space-y-6">
        {filteredOrders.map(order => (
          <OrderCard key={order._id} order={order} products={products} getInitials={getInitials} onDragStart={() => setDraggedOrderId(order._id)} onUpdate={updateOrderStatus} onDelete={deleteOrder} />
        ))}
        {filteredOrders.length === 0 && <div className="border-2 border-dashed border-black/10 rounded-[2rem] py-20 text-center font-black text-black/10 text-xs tracking-widest uppercase">No Active Intel</div>}
      </div>
    </div>
  );
}

function OrderCard({ order, products, onUpdate, onDelete, getInitials, onDragStart }) {
  return (
    <div draggable onDragStart={onDragStart} className="game-card p-6 bg-white border-2 border-black hover:shadow-[6px_6px_0px_#000000] cursor-grab active:cursor-grabbing relative group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shadow-lg">{getInitials(order.customerName)}</div>
          <div><h3 className="font-black text-lg text-black italic">{order.customerName}</h3><p className="text-[10px] font-black text-black/40 uppercase tracking-widest">#{order._id.slice(-6)}</p></div>
        </div>
        <div className="text-right"><p className="text-xl font-black text-black leading-none">{order.total} DT</p><p className="text-[10px] text-black/40 font-black uppercase">{new Date(order.createdAt).toLocaleDateString()}</p></div>
      </div>
      <div className="bg-zinc-50 p-4 rounded-2xl border-2 border-black/5 mb-6">
        <p className="text-[10px] font-black text-black/40 uppercase mb-2">Target Data:</p>
        <p className="text-xs font-bold text-black">{order.city}, {order.address}</p>
        <p className="text-xs font-black text-primary mt-1">{order.phone}</p>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Loadout Inventory:</p>
        {order.items?.map((item, idx) => {
          const productAsset = products?.find(p => p._id === item.productId);
          const displayImage = item.image || productAsset?.image || 'https://placehold.co/200x200?text=📦';

          return (
            <div key={idx} className="flex items-center gap-3 p-2 bg-white border border-black/5 rounded-xl">
              <div className="w-12 h-12 rounded-xl border-2 border-black/10 overflow-hidden bg-zinc-200 flex-shrink-0 shadow-sm">
                <img
                  src={displayImage}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/200x200?text=📦';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase italic text-black truncate leading-none mb-1">{item.name}</p>
                <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">QTY: {item.quantity} × {item.price} DT</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {order.status !== 'delivered' && (
          <button onClick={() => onUpdate(order._id, order.status === 'pending' ? 'shipped' : 'delivered')} className="flex-1 game-button py-3 text-[10px] cursor-pointer">{order.status === 'pending' ? 'Authorize Shipment' : 'Mark as Secured'}</button>
        )}
        <button onClick={() => onDelete(order._id, `Order #${order._id.slice(-6)}`)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border-2 border-red-100 transition-all cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyColumn() {
  return (
    <div className="border-2 border-dashed border-black/10 rounded-2xl py-12 text-center text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">
      NO ORDERS IN QUEUE
    </div>
  );
}
