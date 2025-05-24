import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useBids } from '../contexts/BidContext';
import Swal from 'sweetalert2';

const TaskDetail = () => {
    const { taskId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { totalBidOpportunities, addBid, hasBid, loadingBids, refreshBids } = useBids();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loadingTask, setLoadingTask] = useState(true);
    const [error, setError] = useState(null);
    const [isPlacingBid, setIsPlacingBid] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user && !authLoading) {
            navigate('/login', { state: { from: { pathname: `/task/${taskId}` } } });
            return;
        }

        const fetchTask = async () => {
            setLoadingTask(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:5000/tasks/${taskId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTask(data);
            } catch (err) {
                console.error("Failed to fetch task details:", err);
                setError(err.message);
                Swal.fire({ icon: 'error', title: 'Failed to Load Task', text: err.message });
            } finally {
                setLoadingTask(false);
            }
        };

        if (user && taskId) {
            fetchTask();
        } else if (!taskId) {
            setError("Task ID is missing.");
            setLoadingTask(false);
        }
    }, [taskId, user, authLoading, navigate]);

    useEffect(() => {
        if (user && user.uid) {
            refreshBids();
        }
    }, [user, refreshBids]);

    const handlePlaceBid = async () => {
        if (!user) {
            Swal.fire('Login Required', 'You need to be logged in to place a bid.', 'warning');
            navigate('/login', { state: { from: { pathname: `/task/${taskId}` } } });
            return;
        }
        setIsPlacingBid(true);
        try {
            await addBid(taskId);
            Swal.fire({
                icon: 'success',
                title: 'Bid Placed!',
                text: 'Your bid has been recorded for this opportunity.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Bid Failed',
                text: error.message || 'Could not place your bid. You might have already bid on this task.',
            });
        } finally {
            setIsPlacingBid(false);
        }
    };

    if (loadingTask || authLoading || loadingBids) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex flex-col items-center justify-center bg-base-200 p-4">
                <h2 className="text-2xl font-semibold text-error mb-4">Error Loading Task</h2>
                <p className="text-base-content/70 mb-6 text-center">{error}</p>
                <Link to="/browse-tasks" className="btn btn-primary">Back to Browse Tasks</Link>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-base-200">
                <p className="text-xl text-base-content/70">Task details are not available.</p>
            </div>
        );
    }

    const userIsOwner = user && task.userId === user.uid;
    const alreadyBidOnThisTask = hasBid(taskId);

    return (
        <div className="min-h-[calc(100vh-136px)] bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-3xl">
                {user && (
                    <div className="mb-6 text-center p-3 bg-info text-info-content rounded-md shadow">
                        You have bid on <span className="font-bold text-lg">{totalBidOpportunities}</span> {totalBidOpportunities === 1 ? "opportunity" : "opportunities"} so far.
                    </div>
                )}

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-6 md:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                            <h1 className="card-title text-3xl md:text-4xl font-bold mb-2 sm:mb-0">{task.title}</h1>
                            <span className="badge badge-lg badge-primary badge-outline mt-1 sm:mt-0 whitespace-nowrap">{task.category}</span>
                        </div>

                        <div className="mb-6 prose max-w-none">
                            <h3 className="text-xl font-semibold mb-2 border-b pb-1">Task Description</h3>
                            <p className="text-base-content/90 whitespace-pre-wrap">{task.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
                            <div>
                                <strong className="block text-base-content/70">Budget:</strong>
                                <span className="text-lg font-semibold text-accent">${task.budget.toLocaleString()}</span>
                            </div>
                            <div>
                                <strong className="block text-base-content/70">Deadline:</strong>
                                <span className="text-lg font-semibold text-error">{new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div>
                                <strong className="block text-base-content/70">Status:</strong>
                                <span className={`text-lg font-semibold capitalize ${task.status === 'open' ? 'text-success' : 'text-warning'}`}>{task.status}</span>
                            </div>
                            <div>
                                <strong className="block text-base-content/70">Posted On:</strong>
                                <span className="text-base-content/80">{new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        
                        <div className="mb-6 p-4 bg-base-200/50 rounded-lg">
                             <h3 className="text-lg font-semibold mb-2 text-base-content/80">Posted By</h3>
                             <p><strong>Name:</strong> {task.userName || 'N/A'}</p>
                             <p><strong>Email:</strong> {task.userEmail || 'N/A'}</p>
                        </div>

                        <div className="card-actions justify-end mt-8">
                            <Link to="/browse-tasks" className="btn btn-outline">Back to Tasks</Link>
                            
                            {user && !userIsOwner && (
                                alreadyBidOnThisTask ? (
                                    <button className="btn btn-success btn-disabled" disabled>Bid Placed</button>
                                ) : (
                                    <button 
                                        className={`btn btn-primary ${isPlacingBid ? 'loading' : ''}`}
                                        onClick={handlePlaceBid}
                                        disabled={isPlacingBid}
                                    >
                                        {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;