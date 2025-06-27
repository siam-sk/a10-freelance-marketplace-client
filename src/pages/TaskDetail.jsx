import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useBids } from '../contexts/BidContext';
import Swal from 'sweetalert2';
import {
    CurrencyDollarIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    UserCircleIcon,
    ArrowLeftIcon,
    InformationCircleIcon,
    TagIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

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
                const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks/${taskId}`);
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
        <div className="min-h-[calc(100vh-136px)] bg-purple-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">

                {user && (
                    <div className="mb-8 p-4 bg-primary/10 border border-primary/20 text-primary-content rounded-lg flex items-center gap-4 shadow-sm">
                        <InformationCircleIcon className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-base-content">Your Biddings</p>
                            <p className="text-sm text-base-content/80">
                                You have placed bids on <span className="font-bold text-accent">{totalBidOpportunities}</span> {totalBidOpportunities === 1 ? "opportunity" : "opportunities"} so far.
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-base-100 shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8 bg-purple-100/30 border-b border-purple-200/50">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <TagIcon className="h-6 w-6 text-primary" />
                                    <span className="badge badge-lg badge-primary badge-outline">{task.category}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-base-content">{task.title}</h1>
                            </div>
                            <div className="flex-shrink-0 pt-2">
                                <Link to="/browse-tasks" className="btn btn-sm btn-ghost">
                                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Tasks
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        <div className="lg:col-span-2 p-6 md:p-8 border-r-0 lg:border-r border-purple-200/50">
                            <div className="prose max-w-none prose-h3:mb-3 prose-h3:border-b prose-h3:pb-2 prose-p:text-base-content/90 prose-p:leading-relaxed">
                                <h3>Task Description</h3>
                                <p className="whitespace-pre-wrap">{task.description}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-1 p-6 md:p-8 bg-purple-100/20">
                            <div className="space-y-6">
                                <div>
                                    {user && !userIsOwner && (
                                        alreadyBidOnThisTask ? (
                                            <button className="btn btn-success btn-block btn-lg gap-2" disabled>
                                                <CheckCircleIcon className="h-6 w-6" />
                                                Bid Already Placed
                                            </button>
                                        ) : (
                                            <button
                                                className={`btn btn-primary btn-block btn-lg gap-2 ${isPlacingBid ? 'loading' : ''}`}
                                                onClick={handlePlaceBid}
                                                disabled={isPlacingBid || task.status !== 'open'}
                                            >
                                                <SparklesIcon className="h-6 w-6" />
                                                {isPlacingBid ? 'Placing Bid...' : 'Place Your Bid'}
                                            </button>
                                        )
                                    )}
                                    {user && userIsOwner && (
                                         <div className="text-center p-3 bg-info/20 text-info-content rounded-md">
                                            <p className="font-semibold">This is your task.</p>
                                            <p className="text-xs">You can manage it from 'My Posted Tasks'.</p>
                                         </div>
                                    )}
                                    {task.status !== 'open' && !userIsOwner && (
                                        <div className="text-center p-3 bg-warning/20 text-warning-content rounded-md">
                                            <p className="font-semibold">Bidding Closed</p>
                                            <p className="text-xs">This task is no longer accepting new bids.</p>
                                         </div>
                                    )}
                                </div>

                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body p-5">
                                        <h3 className="card-title text-lg">Task Snapshot</h3>
                                        <ul className="space-y-3 mt-2 text-sm">
                                            <li className="flex items-center gap-3">
                                                <CurrencyDollarIcon className="h-5 w-5 text-accent flex-shrink-0" />
                                                <div>
                                                    <span className="text-base-content/70">Budget</span>
                                                    <p className="font-semibold text-base-content">${task.budget.toLocaleString()}</p>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <CalendarDaysIcon className="h-5 w-5 text-error flex-shrink-0" />
                                                <div>
                                                    <span className="text-base-content/70">Deadline</span>
                                                    <p className="font-semibold text-base-content">{new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <CheckCircleIcon className="h-5 w-5 text-info flex-shrink-0" />
                                                <div>
                                                    <span className="text-base-content/70">Status</span>
                                                    <p>
                                                        <span className={`badge badge-sm capitalize ${task.status === 'open' ? 'badge-success' : 'badge-warning'}`}>{task.status}</span>
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <ClockIcon className="h-5 w-5 text-secondary flex-shrink-0" />
                                                <div>
                                                    <span className="text-base-content/70">Posted On</span>
                                                    <p className="font-semibold text-base-content">{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body p-5">
                                        <h3 className="card-title text-lg">Posted By</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                    <UserCircleIcon className="text-primary/50" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-base-content">{task.userName || 'Anonymous User'}</p>
                                                <p className="text-xs text-base-content/70">{task.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;