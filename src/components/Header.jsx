import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    const menuItemsList = [
        { path: "/", label: "Home", authRequired: false, icon: null },
        { path: "/browse-tasks", label: "Browse Tasks", authRequired: false, icon: null },
        { path: "/add-task", label: "Add Task", authRequired: true, icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        )},
        { path: "/my-tasks", label: "My Posted Tasks", authRequired: true, icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
        )},
    ];

    const generatedMenuItems = menuItemsList
        .filter(item => !item.authRequired || (item.authRequired && user))
        .map(item => (
            <li key={item.path}>
                <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                        `flex items-center py-2 ${isActive ? "active text-primary font-semibold" : "font-medium"}`
                    }
                    onClick={closeMenu}
                >
                    {item.icon}
                    {item.label}
                </NavLink>
            </li>
        ));
    
    const desktopMenuLinks = menuItemsList
        .filter(item => !item.authRequired || (item.authRequired && user))
        .map(item => (
            <li key={item.path}>
                <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                        `btn btn-ghost btn-sm normal-case flex items-center ${isActive ? "bg-primary/20 text-primary" : "text-base-content hover:bg-base-200"}`
                    }
                >
                    {item.icon}
                    {item.label}
                </NavLink>
            </li>
        ));

    if (loading && !user) { 
        return <div className="navbar bg-base-100 text-base-content sticky top-0 z-[99] backdrop-blur-sm h-[68px] animate-pulse px-4 md:px-8"></div>;
    }

    return (
        <div className="navbar bg-base-100 text-base-content sticky top-0 z-[99] backdrop-blur-sm shadow-md px-4 md:px-8">
            <div className="navbar-start">
                <div className={`dropdown ${isMenuOpen ? 'dropdown-open' : ''}`}>
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 text-base-content rounded-box w-52">
                        {generatedMenuItems}
                        <li className="mt-1 pt-1 border-t border-base-300">
                            <button 
                                onClick={() => { 
                                    handleThemeToggle(); 
                                    closeMenu();
                                }} 
                                className="btn btn-ghost btn-sm w-full justify-start py-2"
                            >
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21c3.73 0 7.01-2.067 8.687-5.123Z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                                )}
                                <span className="ml-1 capitalize">{theme === 'light' ? 'Dark' : 'Light'}</span>
                            </button>
                        </li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl font-bold flex items-center gap-2 px-1 md:px-2">
                    <img src={logo} alt="TalentSphere Logo" className="h-8 w-auto md:h-10" />
                    <span className="hidden sm:inline">TalentSphere</span>
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-1">
                    {desktopMenuLinks}
                </ul>
            </div>
            
            <div className="navbar-end">
                <button onClick={handleThemeToggle} className="btn btn-ghost btn-circle hidden sm:flex" aria-label="Toggle theme">
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21c3.73 0 7.01-2.067 8.687-5.123Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    )}
                </button>
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom tooltip-primary" data-tip={user.displayName || 'User Profile'}>
                            <div className="w-10 rounded-full ring ring-offset-base-100 ring-offset-2 group-hover:ring-primary">
                                <img 
                                    alt={user.displayName || 'User avatar'} 
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random&color=fff&font-size=0.5`} 
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 text-base-content rounded-box w-60 border border-base-300">
                            <li className="p-2 border-b border-base-300 mb-1">
                                <div className="font-bold truncate text-lg">{user.displayName || 'User'}</div>
                                {user.email && <div className="text-xs opacity-70 truncate">{user.email}</div>}
                            </li>
                            <li>
                                <NavLink to="/profile" className={({isActive}) => `py-2 ${isActive && 'active'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/my-tasks" className={({isActive}) => `py-2 ${isActive && 'active'}`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
                                    My Posted Tasks
                                </NavLink>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <button onClick={handleLogout} className="text-error hover:bg-error/10 w-full justify-start py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-sm btn-primary normal-case">Login</Link>
                        <Link to="/signup" className="btn btn-sm btn-outline btn-primary hover:text-primary-content normal-case">Signup</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;