import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await login(formData);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-peach-100 via-mint-100 to-lavender-100 font-inter relative overflow-hidden">
            {/* Massive Colorful Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-peach-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob"></div>
            <div className="absolute top-[10%] right-[-20%] w-[800px] h-[800px] bg-lavender-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-[800px] h-[800px] bg-mint-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

            <div className="max-w-md w-full mx-4 relative z-10">
                {/* Branding Above Card */}
                <div className="text-center mb-8 animate-float">
                    <div className="inline-flex items-center justify-center space-x-3 mb-2">
                        <div className="p-3 bg-gradient-to-tr from-peach-500 to-orange-500 rounded-2xl shadow-xl shadow-peach-500/30">
                            <ShoppingCart size={36} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-peach-600 via-lavender-600 to-mint-600">
                            CartWise
                        </h1>
                    </div>
                    <p className="text-gray-600 font-bold tracking-widest uppercase text-sm">Empowering Your Grocery Journey</p>
                </div>

                <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] shadow-peach-500/10 overflow-hidden border-2 border-white/50 p-8 md:p-12 transform transition-all duration-500 hover:shadow-peach-500/20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Welcome Back!</h2>
                        <p className="text-gray-500 font-medium">Ready for some smart savings?</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 ml-1">EMAIL ADDRESS</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-peach-500 group-focus-within:text-peach-700 transition-colors">
                                        <Mail size={22} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-12 pr-4 py-4.5 border-2 border-peach-100 rounded-2xl bg-peach-50/30 focus:bg-white focus:border-peach-400 focus:ring-4 focus:ring-peach-500/10 outline-none transition-all duration-300 font-bold text-gray-800 placeholder-peach-300"
                                        placeholder="you@cartwise.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 ml-1">PASSWORD</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-peach-500 group-focus-within:text-peach-700 transition-colors">
                                        <Lock size={22} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-4.5 border-2 border-peach-100 rounded-2xl bg-peach-50/30 focus:bg-white focus:border-peach-400 focus:ring-4 focus:ring-peach-500/10 outline-none transition-all duration-300 font-bold text-gray-800 placeholder-peach-300"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end pr-1">
                                    <a href="#" className="text-xs font-black text-peach-600 hover:text-orange-600 transition-colors uppercase tracking-wider underline">Forgot?</a>
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
                            className="group relative w-full flex justify-center items-center py-5 px-6 border-none rounded-2xl text-lg font-black text-white bg-gradient-to-r from-peach-500 via-orange-500 to-peach-600 hover:shadow-2xl hover:shadow-peach-500/40 focus:outline-none focus:ring-4 focus:ring-peach-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-peach-500/30"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            {loading ? 'OPENING YOUR CART...' : 'SIGN IN TO CARTWISE'}
                            {!loading && <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform stroke-[3]" />}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-bold mb-3">NEW TO CARTWISE?</p>
                        <Link to="/register" className="inline-block w-full py-4 border-2 border-mint-200 rounded-2xl text-mint-700 font-black hover:bg-mint-50 hover:border-mint-400 transition-all uppercase tracking-widest text-sm shadow-sm group">
                            Create A New Account <span className="group-hover:pl-1 transition-all">➜</span>
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">
                    &copy; 2026 CartWise Inc. All Rights Reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
