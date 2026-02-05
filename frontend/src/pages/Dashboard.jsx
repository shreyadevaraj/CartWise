import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, ShoppingBag, MapPin, ShoppingCart, Info, Sparkles, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [pincode, setPincode] = useState('');
    const [items, setItems] = useState([{ itemName: '', quantity: '', count: '1' }]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddItem = () => {
        setItems([...items, { itemName: '', quantity: '', count: '1' }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length === 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleCompare = () => {
        if (!pincode) {
            setError('Please set your location pincode first');
            return;
        }
        if (items.some(item => !item.itemName.trim())) {
            setError('Please fill in all item names');
            return;
        }
        setError('');
        navigate('/results', { state: { items, pincode } });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-inter text-gray-800 pb-20 relative overflow-hidden">
            <Navbar />

            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-peach-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-mint-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-7xl font-black text-gray-900 tracking-tighter">
                        Smart <span className="text-mint-600">Cart</span> Builder
                    </h1>
                    <p className="text-gray-500 font-bold text-xl uppercase tracking-tighter">
                        Build your list. We'll handle the price hunting.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Configuration */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-4 border-white p-10 relative group">
                            <h2 className="text-2xl font-black text-gray-800 mb-2 flex items-center gap-3">
                                <MapPin className="w-7 h-7 text-peach-500" /> Location
                            </h2>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">Where are we shipping?</p>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="block w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-black text-xl placeholder-gray-300 focus:border-peach-400 focus:bg-white transition-all transform focus:scale-[1.02]"
                                    placeholder="Enter Pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-peach-500 bg-peach-50 px-3 py-1 rounded-lg">
                                    REQUIRED
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-500 text-xs font-black flex items-center gap-2 border border-red-100">
                                    <Info className="w-4 h-4" /> {error}
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-mint-500 to-teal-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-mint-500/40 hidden lg:block">
                            <Sparkles className="w-12 h-12 mb-6" />
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Pro Tip</h3>
                            <p className="font-bold text-mint-50 text-base leading-relaxed opacity-90">
                                Add exact quantities (like '500g' or '1L') for more accurate matching Across Blinkit, Zepto, and others.
                            </p>
                        </div>
                    </div>

                    {/* Right: Item List */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/50 border-4 border-white overflow-hidden flex flex-col">
                            <div className="p-10 border-b-2 border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-mint-500 flex items-center justify-center text-white">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Your Needs</h3>
                                        <p className="text-[10px] font-black text-mint-600 tracking-widest uppercase">{items.length} Items Listed</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddItem}
                                    className="group h-14 w-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-mint-500 hover:rotate-90 transition-all duration-500 shadow-xl"
                                >
                                    <Plus className="w-8 h-8" strokeWidth={3} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-start animate-in fade-in slide-in-from-right-5 mb-4">
                                        <div className="flex-grow p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                                            {/* Numbering */}
                                            <div className="md:col-span-1 flex justify-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* Item Name */}
                                            <div className="md:col-span-6">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                                    placeholder="e.g. Milk, Bread, Eggs"
                                                    value={item.itemName}
                                                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                                    placeholder="e.g. 1L, 500g"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                />
                                            </div>

                                            {/* Count */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Units</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-all font-medium text-gray-900 text-center"
                                                    value={item.count}
                                                    onChange={(e) => handleItemChange(index, 'count', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {items.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="mt-8 h-10 w-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-10 bg-gray-50/50 border-t-2 border-gray-100 text-right">
                                <button
                                    onClick={handleCompare}
                                    className="inline-flex items-center gap-4 bg-gray-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-mint-600 hover:shadow-2xl hover:shadow-mint-500/40 transition-all transform hover:-translate-y-1 active:scale-95 group"
                                >
                                    FIND BEST PRICES
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
