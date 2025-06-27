import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const AddTask = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [taskTitle, setTaskTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [budget, setBudget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        "Web Development",
        "Design",
        "Writing",
        "Marketing",
        "Video Editing",
        "Admin Support",
        "Translation",
        "Data Science",
        "Mobile App Development",
        "Consulting",
        "Customer Service",
        "Other"
    ];

    useEffect(() => {
        if (authLoading) return; 

        if (!user) {
            navigate('/login', { state: { from: { pathname: '/dashboard/add-task' } } });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'You must be logged in to add a task.',
            });
            setIsSubmitting(false);
            navigate('/login');
            return;
        }

        if (!taskTitle || !category || !description || !deadline || !budget) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
            });
            setIsSubmitting(false);
            return;
        }
        
        const budgetValue = parseFloat(budget);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please enter a valid positive number for the budget.',
            });
            setIsSubmitting(false);
            return;
        }
        
        const today = new Date().toISOString().split("T")[0];
        if (deadline < today) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Deadline cannot be in the past.',
            });
            setIsSubmitting(false);
            return;
        }


        const taskData = {
            title: taskTitle,
            category,
            description,
            deadline,
            budget: budgetValue,
            userEmail: user.email,
            userName: user.displayName || "Anonymous User",
            userId: user.uid,
            status: 'open',
        };

        try {
            const response = await fetch('https://a10-freelance-marketplace-server.vercel.app/tasks', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(taskData),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to add task');
            }
            
            const result = await response.json();
            console.log('Task added to DB:', result);


            Swal.fire({
                icon: 'success',
                title: 'Task Added!',
                text: 'Your task has been successfully listed.',
                timer: 2000,
                showConfirmButton: false
            });
            
            navigate('/dashboard/my-tasks'); 

            setTaskTitle('');
            setCategory('');
            setDescription('');
            setDeadline('');
            setBudget('');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.message || 'Could not add the task. Please try again.',
            });
            console.error("Error adding task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }
    
    if (!user) {
        return <div className="min-h-screen flex items-center justify-center"><p>Redirecting to login...</p></div>;
    }


    return (
        <div className="min-h-[calc(100vh-136px)] bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 p-10 bg-base-100 shadow-xl rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                        Post a New Task
                    </h2>
                    <p className="mt-2 text-center text-sm text-base-content/70">
                        Fill in the details below to find the right talent for your project.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-base-content mb-1">
                            Task Title <span className="text-error">*</span>
                        </label>
                        <input
                            id="taskTitle"
                            name="taskTitle"
                            type="text"
                            required
                            className="input input-bordered w-full"
                            placeholder="e.g., Design a modern logo for tech startup"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-base-content mb-1">
                            Category <span className="text-error">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="select select-bordered w-full"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-base-content mb-1">
                            Description <span className="text-error">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            required
                            className="textarea textarea-bordered w-full"
                            placeholder="Provide a detailed description of what needs to be done, including deliverables, specific requirements, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-base-content mb-1">
                                Deadline <span className="text-error">*</span>
                            </label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                required
                                className="input input-bordered w-full"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-base-content mb-1">
                                Budget (USD) <span className="text-error">*</span>
                            </label>
                            <input
                                id="budget"
                                name="budget"
                                type="number"
                                required
                                className="input input-bordered w-full"
                                placeholder="e.g., 500"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                min="1"
                                step="any"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-base-content mb-1">
                                Your Email (Poster)
                            </label>
                            <input
                                id="userEmail"
                                name="userEmail"
                                type="email"
                                readOnly
                                className="input input-bordered w-full bg-base-200/70 cursor-not-allowed"
                                value={user?.email || ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-base-content mb-1">
                                Your Name (Poster)
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                readOnly
                                className="input input-bordered w-full bg-base-200/70 cursor-not-allowed"
                                value={user?.displayName || 'Not set'}
                            />
                        </div>
                    </div>


                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting ? <span className="loading loading-spinner"></span> : 'Add Task Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;