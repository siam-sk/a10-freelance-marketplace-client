import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { CurrencyDollarIcon, CalendarDaysIcon, TagIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const AllTasksTable = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://a10-freelance-marketplace-server.vercel.app/tasks');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch tasks.');
                }
                const data = await response.json();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTasks(data);
            } catch (err) {
                console.error("Failed to fetch all tasks:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Tasks',
                    text: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllTasks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold text-error">Error Loading Tasks</h2>
                <p className="text-base-content/70">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-0">
            <h1 className="text-2xl font-bold text-base-content mb-6">All Site Tasks</h1>
            {tasks.length === 0 ? (
                <div className="text-center py-10 px-4 bg-base-100 rounded-lg shadow-md">
                    <p className="text-xl font-semibold text-base-content/70">No tasks have been posted on the site yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Task Title</th>
                                <th>Posted By</th>
                                <th>Category</th>
                                <th>Budget</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id} className="hover">
                                    <td>
                                        <div className="font-bold">{task.title}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <UserCircleIcon className="w-6 h-6 text-base-content/50" />
                                            <div>
                                                <div className="font-medium">{task.userName || 'N/A'}</div>
                                                <div className="text-sm opacity-60">{task.userEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm flex items-center gap-1">
                                            <TagIcon className="w-3 h-3" /> {task.category}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4 text-success" /> ${task.budget.toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <CalendarDaysIcon className="w-4 h-4 text-error" /> {new Date(task.deadline).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm capitalize ${
                                            task.status === 'open' ? 'badge-success' : 
                                            task.status === 'in progress' ? 'badge-warning' : 
                                            task.status === 'completed' ? 'badge-info' : 'badge-ghost'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/task/${task._id}`} className="btn btn-primary btn-xs">
                                            View Details
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

export default AllTasksTable;