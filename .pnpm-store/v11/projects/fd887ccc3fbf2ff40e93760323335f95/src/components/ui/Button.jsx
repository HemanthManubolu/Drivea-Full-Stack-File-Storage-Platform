import { Spinner } from "./Spinner";

export function Button({
    children,
    variant = "primary", // primary | secondary | ghost | danger
    size = "md", // sm | md
    isLoading = false,
    disabled = false,
    className = "",
    type = "button",
    onClick,
    icon: Icon,
    ...props
}) {
    const baseStyle =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
        primary: "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    const sizes = {
        sm: "px-2.5 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2 text-sm gap-2",
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {isLoading ? <Spinner size="sm" className="text-current" /> : Icon ? <Icon className="size-4 shrink-0" /> : null}
            {children}
        </button>
    );
}
