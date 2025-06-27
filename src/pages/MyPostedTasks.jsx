import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { CurrencyDollarIcon, CalendarDaysIcon, PencilIcon, TrashIcon, PlusIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import UpdateTaskModal from '../components/UpdateTaskModal';

const MyPostedTasks = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login', { state: { from: { pathname: '/dashboard/my-tasks' } } });
            return;
        }

        const fetchMyTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks?userId=${user.uid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch your tasks.');
                }
                const data = await response.json();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMyTasks(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching my tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTasks();
    }, [user, authLoading, navigate]);

    const handleOpenUpdateModal = (task) => {
        setSelectedTask(task);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskUpdated = (updatedTask) => {
        setMyTasks(prevTasks =>
            prevTasks.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
        handleCloseUpdateModal();
    };

    const handleDelete = (taskId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks/${taskId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete the task.');
                    }

                    setMyTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
                    Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
                } catch (err) {
                    Swal.fire('Error!', err.message, 'error');
                }
            }
        });
    };

    if (loading || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-3xl font-bold text-base-content mb-2">Loading Your Tasks...</h1>
                <p className="text-base-content/70 mb-6">Please wait while we fetch your data.</p>
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-base-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-error">Error Loading Your Tasks</h2>
                <p className="text-base-content/70 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-base-content">My Posted Tasks</h1>
                    <p className="text-base-content/70 mt-1">Manage the tasks you have created.</p>
                </div>
                <Link to="/dashboard/add-task" className="btn btn-primary">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Post a New Task
                </Link>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Task Title</th>
                                    <th>Budget</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTasks.map(task => (
                                    <tr key={task._id} className="hover">
                                        <td>
                                            <Link to={`/task/${task._id}`} className="font-bold hover:text-primary">{task.title}</Link>
                                            <div className="text-sm opacity-50">{task.category}</div>
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
                                        <td>
                                            <span className={`badge ${task.status === 'open' ? 'badge-success' : 'badge-ghost'} capitalize`}>{task.status}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleOpenUpdateModal(task)} className="btn btn-ghost btn-sm btn-square" aria-label="Update">
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(task._id)} className="btn btn-ghost btn-sm btn-square text-error" aria-label="Delete">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {myTasks.length === 0 && (
                        <div className="text-center py-16 px-4">
                            <BriefcaseIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                            <p className="text-xl font-semibold text-base-content/70">You haven't posted any tasks yet.</p>
                            <p className="text-base-content/50 mt-2">Ready to get started?</p>
                            <Link to="/dashboard/add-task" className="btn btn-primary mt-6">
                                Post Your First Task
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <UpdateTaskModal
                task={selectedTask}
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onTaskUpdated={handleTaskUpdated}
            />
        </div>
    );
};

export default MyPostedTasks;