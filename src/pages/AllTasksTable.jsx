import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { CurrencyDollarIcon, CalendarDaysIcon, TagIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

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
            } finally {
                setLoading(false);
            }
        };

        fetchAllTasks();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-3xl font-bold text-base-content mb-2">Loading All Tasks...</h1>
                <p className="text-base-content/70 mb-6">Please wait while we fetch the data.</p>
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-base-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-error">Error Loading Tasks</h2>
                <p className="text-base-content/70 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">All Available Tasks</h1>
                <p className="text-base-content/70 mt-1">Browse all tasks posted on the platform.</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title & Category</th>
                                    <th>Posted By</th>
                                    <th>Budget</th>
                                    <th>Deadline</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task._id} className="hover">
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="font-bold">{task.title}</div>
                                                    <div className="text-sm opacity-50 flex items-center">
                                                        <TagIcon className="w-3 h-3 mr-1" /> {task.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={task.employerPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.employerName || 'U')}&background=random`} alt="Employer Avatar" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{task.employerName}</div>
                                                    <div className="text-sm opacity-50">{task.employerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <CurrencyDollarIcon className="w-4 h-4 mr-1 text-success" />
                                                <span className="font-semibold">${task.budget.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <CalendarDaysIcon className="w-4 h-4 mr-1 text-error" />
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <th>
                                            <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">View Details</Link>
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {tasks.length === 0 && (
                        <div className="text-center py-10 px-4">
                            <BriefcaseIcon className="h-12 w-12 mx-auto text-base-content/30 mb-4" />
                            <p className="text-lg font-semibold text-base-content/70">No tasks found.</p>
                            <p className="text-base-content/50 mt-1">There are currently no tasks available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllTasksTable;