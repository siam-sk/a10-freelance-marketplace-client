import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        `flex items-center ${isActive ? "active text-primary font-semibold" : "font-medium"}`
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

    if (loading) {
        return <div className="navbar bg-base-100 text-base-content sticky top-0 z-[99] backdrop-blur-sm h-[68px] animate-pulse"></div>;
    }

    return (
        <div className="navbar bg-base-100 text-base-content sticky top-0 z-[99] backdrop-blur-sm shadow-md">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    {isMenuOpen && (
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 text-base-content rounded-box w-52">
                            {generatedMenuItems}
                        </ul>
                    )}
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl font-bold flex items-center gap-2 px-1 md:px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586" />
                    </svg>
                    <span className="hidden sm:inline">TalentSphere</span>
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-1">
                    {desktopMenuLinks}
                </ul>
            </div>
            
            <div className="navbar-end">
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