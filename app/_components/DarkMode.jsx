import React, { useEffect, useState } from 'react';

const DarkMode = () => {
    // Initialize with a safe default for SSR
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    // After mount, we can safely access localStorage
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const element = document.documentElement;
        if (theme === 'dark') {
            element.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            element.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme, mounted]);

    const changeTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    if (!mounted) {
        return <div className="size-12"></div>; // Avoid hydration mismatch
    }

    return (
        <div className='relative size-12 flex items-center justify-center'>
            {theme === 'dark' && (
                <img
                    src="/images/darkmode.png"
                    alt="Switch to Dark Mode"
                    onClick={changeTheme}
                    className="w-20 h-auto cursor-pointer drop-shadow-md transition-transform hover:scale-110 active:scale-95"
                />
            )}
            {theme === 'light' && (
                <img
                    src="/images/lightmode.png"
                    alt="Switch to Light Mode"
                    onClick={changeTheme}
                    className="w-20 h-auto cursor-pointer drop-shadow-md transition-transform hover:scale-110 active:scale-95"
                />
            )}
        </div>
    );
}

export default DarkMode;