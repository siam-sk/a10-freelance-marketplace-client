import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const MyPostedTasks = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return; 

        if (!user) {
            navigate('/login', { state: { from: { pathname: '/my-tasks' } } });
            return;
        }

        const fetchMyTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                
                const response = await fetch(`http://localhost:5000/tasks?userId=${user.uid}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMyTasks(data);
            } catch (err) {
                console.error("Failed to fetch my tasks:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Your Tasks',
                    text: err.message || 'Could not retrieve your tasks. Please try again.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMyTasks();
    }, [user, authLoading, navigate]);

    const handleDeleteTask = async (taskId) => {
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
                
                Swal.fire('Not Implemented!', 'Delete functionality is not yet implemented.', 'info');
            }
        });
        console.log("Delete task:", taskId);
    };

    const handleUpdateTask = (taskId) => {
        navigate(`/update-task/${taskId}`); 
    };

    const handleViewBids = (taskId) => {
        
        Swal.fire('Not Implemented!', 'View Bids functionality is not yet implemented.', 'info');
        console.log("View bids for task:", taskId);
    };


    if (loading || authLoading) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex flex-col items-center justify-center bg-base-200 p-4">
                <h2 className="text-2xl font-semibold text-error mb-4">Error Loading Your Tasks</h2>
                <p className="text-base-content/70 mb-6 text-center">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-136px)] bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 text-base-content">My Posted Tasks</h1>
                {myTasks.length > 0 ? (
                    <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Budget</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTasks.map(task => (
                                    <tr key={task._id} className="hover">
                                        <td>
                                            <Link to={`/task/${task._id}`} className="font-medium hover:text-primary transition-colors">
                                                {task.title}
                                            </Link>
                                        </td>
                                        <td>{task.category}</td>
                                        <td>${task.budget.toLocaleString()}</td>
                                        <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${
                                                task.status === 'open' ? 'badge-success' : 
                                                task.status === 'in progress' ? 'badge-warning' : 
                                                task.status === 'completed' ? 'badge-info' : 'badge-ghost'
                                            } badge-sm`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="text-center space-x-1">
                                            <button 
                                                onClick={() => handleUpdateTask(task._id)} 
                                                className="btn btn-xs btn-outline btn-info"
                                                title="Update Task"
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTask(task._id)} 
                                                className="btn btn-xs btn-outline btn-error"
                                                title="Delete Task"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => handleViewBids(task._id)} 
                                                className="btn btn-xs btn-outline btn-primary"
                                                title="View Bids"
                                            >
                                                Bids
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-base-100 shadow-xl rounded-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto text-base-content/30 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 3.75h7.5M3 3h18M3 21h18" />
                        </svg>
                        <p className="text-xl font-semibold text-base-content/70">You haven't posted any tasks yet.</p>
                        <Link to="/add-task" className="btn btn-primary mt-6">Post Your First Task</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPostedTasks;