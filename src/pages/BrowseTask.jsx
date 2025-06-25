import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import Swal from 'sweetalert2';

const BrowseTask = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://a10-freelance-marketplace-server.vercel.app/tasks');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                const sortedTasks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTasks(sortedTasks);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Tasks',
                    text: err.message || 'Could not retrieve tasks from the server. Please try again later.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex flex-col items-center justify-center bg-base-200 p-4">
                <h2 className="text-2xl font-semibold text-error mb-4">Error Loading Tasks</h2>
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
                <h1 className="text-4xl font-bold text-center mb-10 text-base-content">Browse All Available Tasks</h1>
                {tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tasks.map(task => (
                            <div key={task._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                                <div className="card-body flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="card-title text-xl font-semibold">{task.title}</h2>
                                        <span className="badge badge-primary badge-outline whitespace-nowrap">{task.category}</span>
                                    </div>
                                    <p className="text-sm text-base-content/80 mt-1 mb-3 flex-grow">
                                        {task.description.length > 120 ? `${task.description.substring(0, 120)}...` : task.description}
                                    </p>
                                    <div className="text-sm mb-1">
                                        <strong>Budget:</strong> <span className="font-medium text-accent">${task.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm mb-1">
                                        <strong>Deadline:</strong> <span className="font-medium text-error">{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs text-base-content/60 mb-3">
                                        Posted by: {task.userName || 'Anonymous'} on {new Date(task.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="card-actions justify-end mt-auto">
 
                                        <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm">
                                            See Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto text-base-content/30 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5L21 21M12 6v6m0 0v6m0-6h6m-6 0H6" transform="rotate(45 12 12) scale(0.6)" />
                        </svg>
                        <p className="text-xl font-semibold text-base-content/70">No tasks available at the moment.</p>
                        <p className="text-base-content/50 mt-2">Check back later or be the first to post one!</p>
                        <Link to="/add-task" className="btn btn-primary mt-6">Post a New Task</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseTask;