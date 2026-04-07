import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(
    ({ className, variant = 'primary', size = 'md', isLoading, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-primary/20',
            secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-md hover:shadow-secondary/20',
            accent: 'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-accent/20',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
            ghost: 'text-primary hover:bg-slate-100',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg font-bold',
            xl: 'px-10 py-5 text-xl font-black uppercase tracking-widest',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-sans whitespace-nowrap',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {props.children}
            </button>
        );
    }
);
