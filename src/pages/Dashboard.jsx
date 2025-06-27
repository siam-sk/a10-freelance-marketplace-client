import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { 
    BriefcaseIcon, 
    CurrencyDollarIcon,
    ArrowLeftOnRectangleIcon,
    HomeIcon,
    Squares2X2Icon,
    DocumentPlusIcon,
    DocumentDuplicateIcon
} from '@heroicons/react/24/solid';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const navLinks = [
        { to: '/dashboard', text: 'Overview', icon: <Squares2X2Icon className="w-5 h-5" /> },
        { to: 'all-tasks', text: 'All Tasks', icon: <BriefcaseIcon className="w-5 h-5" /> },
        { to: 'my-tasks', text: 'My Posted Tasks', icon: <DocumentDuplicateIcon className="w-5 h-5" /> },
        { to: 'add-task', text: 'Add New Task', icon: <DocumentPlusIcon className="w-5 h-5" /> },
        { to: 'my-bids', text: 'My Bids', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="drawer lg:drawer-open min-h-[calc(100vh-136px)] bg-base-200">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-4 sm:p-6 lg:p-8">
                {/* Mobile Header with Hamburger Menu */}
                <div className="flex justify-between items-center mb-4 lg:hidden">
                    <label htmlFor="dashboard-drawer" className="btn btn-primary drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                    <div className="text-lg font-bold">Dashboard</div>
                </div>
                
                {/* This Outlet is crucial. It renders the child routes. */}
                <Outlet />
            </div>
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content border-r border-base-300">
                    <div className="mb-4 p-2 flex items-center space-x-3">
                         <div className="avatar">
                            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}`} alt="user avatar" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold">{user?.displayName || 'User'}</div>
                        </div>
                    </div>

                    <li className="menu-title"><span>Dashboard Menu</span></li>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === '/dashboard'}
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                {link.icon}
                                {link.text}
                            </NavLink>
                        </li>
                    ))}
                    <div className="divider"></div>
                    <li>
                        <NavLink to="/">
                            <HomeIcon className="w-5 h-5" />
                            Back to Home
                        </NavLink>
                    </li>
                     <li>
                        <button onClick={handleLogout} className="flex items-center space-x-2 w-full text-left p-2 rounded-lg hover:bg-error/10 text-error">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;