import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

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
        "Web Development", "Design", "Writing", "Marketing", "Video Editing",
        "Admin Support", "Translation", "Data Science", "Mobile App Development",
        "Consulting", "Customer Service", "Other"
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
            Swal.fire({ icon: 'error', title: 'Authentication Error', text: 'You must be logged in to add a task.' });
            setIsSubmitting(false);
            navigate('/login');
            return;
        }

        if (!taskTitle || !category || !description || !deadline || !budget) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please fill in all required fields.' });
            setIsSubmitting(false);
            return;
        }
        
        const budgetValue = parseFloat(budget);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter a valid positive number for the budget.' });
            setIsSubmitting(false);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(deadline) < today) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Deadline cannot be in the past.' });
            setIsSubmitting(false);
            return;
        }

        const newTask = {
            title: taskTitle,
            category,
            description,
            deadline,
            budget: budgetValue,
            userId: user.uid,
            employerEmail: user.email,
            employerName: user.displayName,
            employerPhotoURL: user.photoURL,
            status: 'open',
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://a10-freelance-marketplace-server.vercel.app/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add task');
            }
            
            await response.json();

            Swal.fire({
                icon: 'success',
                title: 'Task Posted!',
                text: 'Your new task is now live.',
                timer: 2000,
                showConfirmButton: false
            });
            
            navigate('/dashboard/my-tasks'); 
        } catch (err) {
            Swal.fire('Submission Failed', err.message || 'Could not post the task.', 'error');
            console.error("Error adding task:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">Post a New Task</h1>
                <p className="text-base-content/70 mt-1">Fill out the details below to find the perfect freelancer.</p>
            </div>

            <div className="card bg-base-100 shadow-xl w-full">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Task Title</span>
                            </label>
                            <input type="text" placeholder="e.g., Build a responsive landing page" className="input input-bordered w-full" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select className="select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="" disabled>Select a category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Budget ($)</span>
                                </label>
                                <input type="number" placeholder="e.g., 500" className="input input-bordered" value={budget} onChange={(e) => setBudget(e.target.value)} required min="1" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea className="textarea textarea-bordered h-32" placeholder="Provide a detailed description of the task..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Deadline</span>
                            </label>
                            <input type="date" className="input input-bordered" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                        </div>

                        <div className="card-actions justify-end mt-4">
                            <button type="submit" className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Post Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTask;