import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import Swal from 'sweetalert2';
import { CurrencyDollarIcon, CalendarDaysIcon, BriefcaseIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const BrowseTask = () => {
    const [searchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState('createdAt-desc');

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
                setTasks(data);
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

    const categories = useMemo(() => {
        const allCategories = tasks.map(task => task.category);
        return [...new Set(allCategories)];
    }, [tasks]);

    const filteredAndSortedTasks = useMemo(() => {
        return tasks
            .filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory ? task.category === selectedCategory : true;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'budget-asc':
                        return a.budget - b.budget;
                    case 'budget-desc':
                        return b.budget - a.budget;
                    case 'deadline-asc':
                        return new Date(a.deadline) - new Date(b.deadline);
                    case 'deadline-desc':
                        return new Date(b.deadline) - new Date(a.deadline);
                    case 'createdAt-asc':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'createdAt-desc':
                    default:
                        return new Date(b.createdAt) - new Date(a.createdAt);
                }
            });
    }, [tasks, searchTerm, selectedCategory, sortBy]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('createdAt-desc');
    };

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
        <div className="min-h-[calc(100vh-136px)] bg-base-200">
            <div className="bg-base-100 py-8 text-center border-b border-base-300">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-base-content">Find Your Next Opportunity</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-base text-base-content/70">
                        Explore a wide range of freelance tasks posted by clients from all over the world.
                    </p>
                </div>
            </div>

            <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow-lg mb-8 sticky top-20 z-30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="form-control w-full md:w-2/5 lg:w-1/3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by task title..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <MagnifyingGlassIcon className="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-base-content/40" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="form-control w-full sm:w-auto">
                                <select
                                    className="select select-bordered"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-control w-full sm:w-auto">
                                <select
                                    className="select select-bordered"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="createdAt-desc">Sort by: Newest</option>
                                    <option value="createdAt-asc">Sort by: Oldest</option>
                                    <option value="deadline-asc">Sort by: Deadline (Soonest)</option>
                                    <option value="deadline-desc">Sort by: Deadline (Furthest)</option>
                                    <option value="budget-desc">Sort by: Budget (High-Low)</option>
                                    <option value="budget-asc">Sort by: Budget (Low-High)</option>
                                </select>
                            </div>
                             <button onClick={handleResetFilters} className="btn btn-ghost">
                                <XMarkIcon className="h-5 w-5 mr-1"/>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {filteredAndSortedTasks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedTasks.map(task => (
                            <div key={task._id} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col border-t-4 border-primary/20 hover:border-primary rounded-lg overflow-hidden">
                                <div className="card-body p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="card-title text-lg font-bold group-hover:text-primary transition-colors leading-tight">{task.title}</h3>
                                        <span className="badge badge-ghost badge-sm whitespace-nowrap ml-2 mt-1">{task.category}</span>
                                    </div>
                                    <p className="text-sm text-base-content/75 mt-1 mb-4 flex-grow min-h-[60px] line-clamp-3">{task.description}</p>
                                    <div className="mt-auto space-y-2.5 border-t border-base-300/30 pt-4">
                                        <div className="flex items-center text-sm text-base-content/80">
                                            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-success flex-shrink-0" />
                                            <span className="font-semibold">${task.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-base-content/80">
                                            <CalendarDaysIcon className="h-5 w-5 mr-2 text-error flex-shrink-0" />
                                            <span className="font-medium">{new Date(task.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions p-4 bg-base-200/30">
                                    <Link to={`/task/${task._id}`} className="btn btn-primary btn-block shadow-md hover:shadow-lg">View Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4 bg-base-100 rounded-lg shadow-md">
                        <BriefcaseIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                        <p className="text-xl font-semibold text-base-content/70">
                            {tasks.length > 0 ? "No tasks match your criteria." : "No tasks available right now."}
                        </p>
                        <p className="text-base-content/50 mt-2">
                            {tasks.length > 0 ? "Try adjusting your search or filters." : "Check back soon or be the first to post a task!"}
                        </p>
                        {tasks.length === 0 && (
                            <Link to="/add-task" className="btn btn-primary mt-6">Post a New Task</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseTask;