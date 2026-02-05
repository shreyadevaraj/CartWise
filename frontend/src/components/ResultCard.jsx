import { TrendingDown, XCircle, CheckCircle, Package, Truck, Info, ExternalLink, Star, ShoppingCart } from 'lucide-react';

const ResultCard = ({ result, isCheapest }) => {
    // Highly vivid platform colors
    const getPlatformTheme = (name) => {
        if (name === 'Blinkit') return {
            bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
            border: 'border-yellow-200',
            text: 'text-yellow-700',
            iconBg: 'bg-yellow-400',
            button: 'bg-yellow-500'
        };
        if (name === 'Zepto') return {
            bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            iconBg: 'bg-purple-600',
            button: 'bg-purple-700'
        };
        if (name === 'Swiggy Instamart') return {
            bg: 'bg-gradient-to-br from-orange-50 to-red-50',
            border: 'border-orange-200',
            text: 'text-orange-700',
            iconBg: 'bg-orange-600',
            button: 'bg-orange-700'
        };
        if (name === 'JioMart') return {
            bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            iconBg: 'bg-blue-600',
            button: 'bg-blue-700'
        };
        if (name === 'DMart Ready') return {
            bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            iconBg: 'bg-emerald-600',
            button: 'bg-emerald-700'
        };
        if (name === 'Amazon Fresh') return {
            bg: 'bg-gradient-to-br from-green-50 to-yellow-50',
            border: 'border-green-200',
            text: 'text-green-700',
            iconBg: 'bg-green-600',
            button: 'bg-green-700'
        };
        return {
            bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
            border: 'border-gray-200',
            text: 'text-gray-700',
            iconBg: 'bg-gray-600',
            button: 'bg-gray-700'
        };
    };

    const theme = getPlatformTheme(result.platformName);

    // Extreme winner styling
    const winnerStyle = isCheapest
        ? 'ring-[8px] ring-mint-500/20 border-4 border-mint-500 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] shadow-mint-500/40 from-mint-50/50 to-white'
        : `border-2 border-gray-100 hover:border-peach-300 shadow-xl shadow-gray-200/50 bg-white`;

    return (
        <div className={`relative rounded-3xl transition-all duration-500 overflow-hidden group flex flex-col md:flex-row bg-white ${winnerStyle} mb-6`}>
            {isCheapest && (
                <div className="absolute top-0 left-0 bg-mint-500 text-white text-xs font-bold px-4 py-1.5 rounded-br-2xl z-20 shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" /> BEST PRICE
                </div>
            )}

            {/* Section 1: Platform Identity */}
            <div className={`p-6 md:w-[260px] flex flex-col justify-center items-center md:items-start md:border-r border-gray-100 relative bg-gray-50/50`}>
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg ${theme.iconBg}`}>
                        {result.platformName[0]}
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                            {result.platformName}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${result.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.available ? (
                                <><CheckCircle className="w-3.5 h-3.5" /> Available</>
                            ) : (
                                <><XCircle className="w-3.5 h-3.5" /> Out of Stock</>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Item Breakdown */}
            <div className="flex-grow p-6">
                {!result.available ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 py-4">
                        <Info className="w-10 h-10 opacity-20" />
                        <p className="font-medium text-sm">Store unavailable in this area</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {result.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.inStock ? 'bg-mint-500' : 'bg-red-400'}`}></div>
                                    <p className={`font-medium text-sm truncate ${item.inStock ? 'text-gray-900' : 'text-gray-400 decoration-line-through'}`} title={item.matchedName || item.originalName}>
                                        {item.matchedName || item.originalName}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-4 text-right">
                                    {item.inStock ? (
                                        <p className="font-bold text-gray-900">₹{item.price}</p>
                                    ) : (
                                        <span className="text-red-500 text-xs font-medium">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Section 3: Pricing & Action */}
            <div className={`p-6 md:w-[240px] flex flex-col justify-center items-center md:items-end md:border-l border-gray-100 ${isCheapest ? 'bg-mint-50/30' : 'bg-white'}`}>
                <div className="flex flex-col items-center md:items-end gap-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total</p>
                    <p className={`text-4xl font-bold tracking-tight ${isCheapest ? 'text-mint-600' : 'text-gray-900'}`}>
                        ₹{result.totalAmount}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Delivery: ₹{result.deliveryFee}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
