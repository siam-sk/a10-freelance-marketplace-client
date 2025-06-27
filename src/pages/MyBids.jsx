import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { CurrencyDollarIcon, CalendarDaysIcon, TagIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const MyBids = () => {
    const { user, loading: authLoading } = useAuth();
    const [bidsWithTasks, setBidsWithTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading || !user) {
            return;
        }

        const fetchMyBids = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch all bids by the user
                const bidsResponse = await fetch(`https://a10-freelance-marketplace-server.vercel.app/bids?userId=${user.uid}`);
                if (!bidsResponse.ok) {
                    throw new Error('Failed to fetch your bids.');
                }
                const bids = await bidsResponse.json();

                if (bids.length === 0) {
                    setBidsWithTasks([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch details for each task associated with the bids
                const taskPromises = bids.map(bid => 
                    fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks/${bid.taskId}`).then(res => {
                        if (!res.ok) {
                            console.error(`Failed to fetch task ${bid.taskId}`);
                            return null; 
                        }
                        return res.json();
                    })
                );

                const tasks = await Promise.all(taskPromises);

                // 3. Combine bid data with task data
                const combinedData = bids.map((bid, index) => ({
                    ...bid,
                    task: tasks[index]
                })).filter(item => item.task !== null);

                setBidsWithTasks(combinedData);

            } catch (err) {
                console.error("Error fetching my bids:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Bids',
                    text: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMyBids();
    }, [user, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold text-error">Error</h2>
                <p className="text-base-content/70">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-base-content mb-6">My Bids</h1>
            {bidsWithTasks.length === 0 ? (
                <div className="text-center py-10 px-4 bg-base-100 rounded-lg shadow-md">
                    <BriefcaseIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-xl font-semibold text-base-content/70">You haven't placed any bids yet.</p>
                    <p className="text-base-content/50 mt-2">Explore available tasks and start bidding!</p>
                    <Link to="/dashboard/all-tasks" className="btn btn-primary mt-6">Browse Tasks</Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Task Title</th>
                                <th>Category</th>
                                <th>Budget</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidsWithTasks.map((bid) => (
                                <tr key={bid._id} className="hover">
                                    <td>
                                        <div className="font-bold">{bid.task.title}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm flex items-center gap-1">
                                            <TagIcon className="w-3 h-3" /> {bid.task.category}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4 text-success" /> ${bid.task.budget.toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <CalendarDaysIcon className="w-4 h-4 text-error" /> {new Date(bid.task.deadline).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/task/${bid.task._id}`} className="btn btn-primary btn-sm">
                                            View Task
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBids;