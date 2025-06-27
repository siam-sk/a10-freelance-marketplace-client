import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { CurrencyDollarIcon, CalendarDaysIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const MyBids = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login', { state: { from: { pathname: '/dashboard/my-bids' } } });
            return;
        }

        const fetchMyBids = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/bids?bidderId=${user.uid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch your bids.');
                }
                const data = await response.json();
                data.sort((a, b) => new Date(b.bidDate) - new Date(a.bidDate));
                setBids(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching my bids:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBids();
    }, [user, authLoading, navigate]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return <div className="badge badge-success gap-2"><CheckCircleIcon className="w-4 h-4"/>Accepted</div>;
            case 'rejected':
                return <div className="badge badge-error gap-2"><XCircleIcon className="w-4 h-4"/>Rejected</div>;
            case 'pending':
            default:
                return <div className="badge badge-warning gap-2"><ClockIcon className="w-4 h-4"/>Pending</div>;
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-3xl font-bold text-base-content mb-2">Loading Your Bids...</h1>
                <p className="text-base-content/70 mb-6">Please wait while we fetch your bidding history.</p>
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-base-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-error">Error Loading Bids</h2>
                <p className="text-base-content/70 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">My Bids</h1>
                <p className="text-base-content/70 mt-1">Track the status of all your bids on tasks.</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Task Budget</th>
                                    <th>Task Deadline</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.map(bid => (
                                    <tr key={bid._id} className="hover">
                                        <td>
                                            <div className="font-bold">{bid.task.title}</div>
                                            <div className="text-sm opacity-50">{bid.task.category}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <CurrencyDollarIcon className="w-4 h-4 mr-1 text-info" />
                                                <span className="font-semibold">${bid.task.budget.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <CalendarDaysIcon className="w-4 h-4 mr-1 text-error" />
                                                {new Date(bid.task.deadline).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(bid.status)}</td>
                                        <td>
                                            <Link to={`/task/${bid.task._id}`} className="btn btn-ghost btn-sm">View Task</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {bids.length === 0 && (
                        <div className="text-center py-16 px-4">
                            <BriefcaseIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                            <p className="text-xl font-semibold text-base-content/70">You haven't placed any bids yet.</p>
                            <p className="text-base-content/50 mt-2">Find a task that interests you and place your first bid!</p>
                            <Link to="/browse-tasks" className="btn btn-primary mt-6">
                                Browse Available Tasks
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBids;