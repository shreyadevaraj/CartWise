import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, User, Mail, Lock, Sparkles, ShoppingBag } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await register(formData);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-100 via-peach-100 to-lavender-100 font-inter relative overflow-hidden">
            {/* Massive Colorful Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-mint-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[800px] h-[800px] bg-peach-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-[30%] left-[50%] w-[600px] h-[600px] bg-lavender-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

            <div className="max-w-md w-full mx-4 relative z-10 py-10">
                {/* Branding Above Card */}
                <div className="text-center mb-8 animate-float">
                    <div className="inline-flex items-center justify-center space-x-3 mb-2">
                        <div className="p-3 bg-gradient-to-tr from-mint-500 to-teal-500 rounded-2xl shadow-xl shadow-mint-500/30">
                            <ShoppingBag size={36} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-mint-600 via-peach-600 to-lavender-600">
                            CartWise
                        </h1>
                    </div>
                    <p className="text-gray-600 font-bold tracking-widest uppercase text-sm">Join the Smart Shopping Revolution</p>
                </div>

                <div className="bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] shadow-mint-500/10 overflow-hidden border-2 border-white/50 p-8 md:p-12 transform transition-all duration-500 hover:shadow-mint-500/20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-500 font-medium">Start saving money on every grocery trip!</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 ml-1 uppercase">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mint-500 group-focus-within:text-mint-700 transition-colors">
                                        <User size={22} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 border-2 border-mint-100 rounded-2xl bg-mint-50/30 focus:bg-white focus:border-mint-400 focus:ring-4 focus:ring-mint-500/10 outline-none transition-all duration-300 font-bold text-gray-800 placeholder-mint-300"
                                        placeholder="John Carter"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 ml-1 uppercase">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mint-500 group-focus-within:text-mint-700 transition-colors">
                                        <Mail size={22} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 border-2 border-mint-100 rounded-2xl bg-mint-50/30 focus:bg-white focus:border-mint-400 focus:ring-4 focus:ring-mint-500/10 outline-none transition-all duration-300 font-bold text-gray-800 placeholder-mint-300"
                                        placeholder="cart@smartwise.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 ml-1 uppercase">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mint-500 group-focus-within:text-mint-700 transition-colors">
                                        <Lock size={22} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 border-2 border-mint-100 rounded-2xl bg-mint-50/30 focus:bg-white focus:border-mint-400 focus:ring-4 focus:ring-mint-500/10 outline-none transition-all duration-300 font-bold text-gray-800 placeholder-mint-300"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 text-sm text-center font-black animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center py-5 px-6 border-none rounded-2xl text-lg font-black text-white bg-gradient-to-r from-mint-500 via-teal-500 to-mint-600 hover:shadow-2xl hover:shadow-mint-500/40 focus:outline-none focus:ring-4 focus:ring-mint-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-mint-500/30"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            {loading ? 'CREATING YOUR SPACE...' : 'START SAVING NOW'}
                            {!loading && <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform stroke-[3]" />}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-bold mb-3 uppercase text-xs">A member already?</p>
                        <Link to="/login" className="inline-block w-full py-4 border-2 border-peach-200 rounded-2xl text-peach-700 font-black hover:bg-peach-50 hover:border-peach-400 transition-all uppercase tracking-widest text-sm shadow-sm group">
                            Sign In To Your Account <span className="group-hover:pl-1 transition-all">➜</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
