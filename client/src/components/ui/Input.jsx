export function Input({ label, error, icon: Icon, className = "", type = "text", required = false, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative rounded-xl">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full bg-white border ${
                        error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-orange-600 focus:ring-orange-600"
                    } rounded-xl text-slate-900 placeholder-slate-400 text-sm ${
                        Icon ? "pl-10" : "pl-3.5"
                    } pr-3.5 py-2.5 transition duration-150 focus:outline-none focus:ring-1 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
