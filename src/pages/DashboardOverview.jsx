import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useBids } from '../contexts/BidContext';
import { 
    BriefcaseIcon, 
    DocumentDuplicateIcon, 
    CurrencyDollarIcon 
} from '@heroicons/react/24/solid';

const DashboardOverview = () => {
    const { user } = useAuth();
    const { totalBidOpportunities, loadingBids } = useBids();
    const [stats, setStats] = useState({ totalTasks: 0, myTasks: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoadingStats(true);
            setError(null);
            try {
                const [tasksRes, myTasksRes] = await Promise.all([
                    fetch('https://a10-freelance-marketplace-server.vercel.app/tasks'),
                    fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks?userId=${user.uid}`)
                ]);

                if (!tasksRes.ok || !myTasksRes.ok) {
                    throw new Error('Failed to fetch task statistics.');
                }

                const tasksData = await tasksRes.json();
                const myTasksData = await myTasksRes.json();

                setStats({
                    totalTasks: tasksData.length,
                    myTasks: myTasksData.length,
                });
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError(err.message);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [user]);

    const isLoading = loadingStats || loadingBids;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">Welcome, {user?.displayName || 'User'}!</h1>
                <p className="text-base-content/70 mt-1">Here's a quick overview of your activity.</p>
            </div>

            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-28 bg-base-100 rounded-lg shadow-lg animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Error! {error}</span>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className={`card bg-base-100 shadow-lg border-l-4 border-primary`}>
                        <div className="card-body flex-row items-center justify-between p-5">
                            <div>
                                <div className="text-sm font-medium text-base-content/70 uppercase">Total Available Tasks</div>
                                <div className="text-3xl font-bold">{stats.totalTasks}</div>
                                <Link to="/dashboard/all-tasks" className="text-sm text-primary hover:underline mt-1">Browse all tasks</Link>
                            </div>
                            <div className="flex-shrink-0">
                                <BriefcaseIcon className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                    </div>
                    <div className={`card bg-base-100 shadow-lg border-l-4 border-secondary`}>
                        <div className="card-body flex-row items-center justify-between p-5">
                            <div>
                                <div className="text-sm font-medium text-base-content/70 uppercase">My Posted Tasks</div>
                                <div className="text-3xl font-bold">{stats.myTasks}</div>
                                <Link to="/dashboard/my-tasks" className="text-sm text-primary hover:underline mt-1">View my tasks</Link>
                            </div>
                            <div className="flex-shrink-0">
                                <DocumentDuplicateIcon className="h-10 w-10 text-secondary" />
                            </div>
                        </div>
                    </div>
                    <div className={`card bg-base-100 shadow-lg border-l-4 border-accent`}>
                        <div className="card-body flex-row items-center justify-between p-5">
                            <div>
                                <div className="text-sm font-medium text-base-content/70 uppercase">My Bids</div>
                                <div className="text-3xl font-bold">{totalBidOpportunities}</div>
                                <Link to="/dashboard/my-bids" className="text-sm text-primary hover:underline mt-1">View my bids</Link>
                            </div>
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-10 w-10 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-10 card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-xl border-b pb-3 mb-4">My Profile Information</h2>
                    <div className="flex items-center space-x-4">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=random`} alt="User Avatar" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{user?.displayName || 'Anonymous User'}</p>
                            <p className="text-base-content/70">{user?.email}</p>
                            <p className="text-xs text-base-content/50 mt-1">User ID: {user?.uid}</p>
                        </div>
                    </div>
                    <div className="card-actions justify-end mt-4">
                        <Link to="/profile" className="btn btn-sm btn-outline btn-primary">Edit Profile</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;