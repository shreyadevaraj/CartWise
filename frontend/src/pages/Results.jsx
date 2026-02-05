import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles, TrendingDown, ShoppingCart } from 'lucide-react';
import { comparePrices } from '../services/api';
import ResultCard from '../components/ResultCard';
import Navbar from '../components/Navbar';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, pincode } = location.state || { items: [], pincode: '' };

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!items.length || !pincode) {
            navigate('/dashboard');
            return;
        }
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const apiItems = items.map(item => ({
                itemName: `${item.itemName} ${item.quantity}`.trim(),
                quantity: item.count || '1'
            }));
            const { data } = await comparePrices(pincode, apiItems);
            setResults(data);
        } catch (err) {
            setError('The engine is currently facing heavy traffic. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!items.length) return null;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-all mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Builder
                        </button>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">
                            Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-500 to-teal-600 underline decoration-8 decoration-mint-100 underline-offset-[12px]">Intelligence</span>
                        </h1>
                        <p className="mt-4 text-gray-500 font-bold text-xl uppercase tracking-tighter">
                            Real-time analysis for {pincode}
                        </p>
                    </div>

                    {!loading && results && (
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex -space-x-4 mb-3">
                                {['B', 'Z', 'S', 'J', 'D', 'A'].map((l, i) => (
                                    <div key={i} className={`w-12 h-12 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-black text-white text-lg bg-gradient-to-br from-gray-300 to-gray-400`}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">6 Platforms Analyzed</p>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="min-h-[600px] flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-white p-12 text-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-20 opacity-5">
                            <TrendingDown className="w-64 h-64 text-mint-500" />
                        </div>

                        {/* Animated Icon */}
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-mint-100 rounded-full animate-ping opacity-20"></div>
                            <div className="w-32 h-32 bg-mint-50 rounded-full flex items-center justify-center relative z-10 animate-bounce-slow">
                                <Sparkles className="w-16 h-16 text-mint-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                "A penny saved is a <span className="text-mint-600">penny earned</span>."
                            </h2>
                            <div className="w-16 h-1 bg-gray-100 mx-auto rounded-full"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                                — Benjamin Franklin
                            </p>
                        </div>

                        {/* Status Pill */}
                        <div className="mt-16 inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full">
                            <Loader2 className="w-5 h-5 text-mint-500 animate-spin" />
                            <span className="text-gray-500 font-bold text-sm tracking-wide">Analysing 6 Platforms...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-white p-12 text-center shadow-xl">
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">{error}</h2>
                        <button
                            onClick={fetchResults}
                            className="mt-6 px-10 py-4 bg-gray-900 text-white font-black rounded-3xl hover:bg-gray-800 transition-all active:scale-95"
                        >
                            RETRY ENGINE
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex flex-col gap-8 pb-20">
                            {results.map((result, index) => (
                                <div key={index} className="transform transition-all duration-700 hover:-translate-x-3">
                                    <ResultCard
                                        result={result}
                                        isCheapest={index === 0 && result.available}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Results;
