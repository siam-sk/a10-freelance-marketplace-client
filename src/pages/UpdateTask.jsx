import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const UpdateTask = () => {
    const { taskId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [taskTitle, setTaskTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [budget, setBudget] = useState('');
    const [originalTaskData, setOriginalTaskData] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        "Web Development", "Design", "Writing", "Marketing", "Video Editing",
        "Admin Support", "Translation", "Data Science", "Mobile App Development",
        "Consulting", "Customer Service", "Other"
    ];

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login', { state: { from: { pathname: `/update-task/${taskId}` } } });
            return;
        }

        const fetchTaskData = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const response = await fetch(`http://a10-freelance-marketplace-server.vercel.app/tasks/${taskId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.userId !== user.uid) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'You can only update tasks that you have posted.',
                    });
                    navigate('/my-tasks');
                    return;
                }
                
                setOriginalTaskData(data);
                setTaskTitle(data.title);
                setCategory(data.category);
                setDescription(data.description);
                // Format date for input type="date"
                setDeadline(data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '');
                setBudget(data.budget.toString());

            } catch (err) {
                console.error("Failed to fetch task data for update:", err);
                setError(err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Task Data',
                    text: err.message,
                });
            } finally {
                setIsLoadingData(false);
            }
        };

        if (taskId) {
            fetchTaskData();
        } else {
            setError("Task ID is missing.");
            setIsLoadingData(false);
        }

    }, [taskId, user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!taskTitle || !category || !description || !deadline || !budget) {
            Swal.fire('Validation Error', 'Please fill in all required fields.', 'warning');
            setIsSubmitting(false);
            return;
        }
        const budgetValue = parseFloat(budget);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            Swal.fire('Validation Error', 'Please enter a valid positive number for the budget.', 'warning');
            setIsSubmitting(false);
            return;
        }
        const today = new Date().toISOString().split("T")[0];
        if (deadline < today) {
            Swal.fire('Validation Error', 'Deadline cannot be in the past.', 'warning');
            setIsSubmitting(false);
            return;
        }

        const updatedTaskData = {
            title: taskTitle,
            category,
            description,
            deadline,
            budget: budgetValue,
        };

        try {
            const response = await fetch(`http://a10-freelance-marketplace-server.vercel.app/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTaskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update task');
            }
            
            await response.json();

            Swal.fire({
                icon: 'success',
                title: 'Task Updated!',
                text: 'Your task has been successfully updated.',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/my-tasks'); 
        } catch (err) {
            Swal.fire('Update Failed', err.message || 'Could not update the task.', 'error');
            console.error("Error updating task:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData || authLoading) {
        return <div className="min-h-[calc(100vh-136px)] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (error) {
        return <div className="min-h-[calc(100vh-136px)] flex items-center justify-center text-error p-4">Error: {error}</div>;
    }
    
    if (!originalTaskData) {
         return <div className="min-h-[calc(100vh-136px)] flex items-center justify-center"><p>Task data not found.</p></div>;
    }


    return (
        <div className="min-h-[calc(100vh-136px)] bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 p-10 bg-base-100 shadow-xl rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                        Update Your Task
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-base-content mb-1">Task Title <span className="text-error">*</span></label>
                        <input id="taskTitle" type="text" required className="input input-bordered w-full" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-base-content mb-1">Category <span className="text-error">*</span></label>
                        <select id="category" required className="select select-bordered w-full" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isSubmitting}>
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-base-content mb-1">Description <span className="text-error">*</span></label>
                        <textarea id="description" rows="5" required className="textarea textarea-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-base-content mb-1">Deadline <span className="text-error">*</span></label>
                            <input id="deadline" type="date" required className="input input-bordered w-full" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().split("T")[0]} disabled={isSubmitting} />
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-base-content mb-1">Budget (USD) <span className="text-error">*</span></label>
                            <input id="budget" type="number" required className="input input-bordered w-full" value={budget} onChange={(e) => setBudget(e.target.value)} min="1" step="any" disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-base-content mb-1">Your Email (Poster)</label>
                            <input id="userEmail" type="email" readOnly className="input input-bordered w-full bg-base-200/70 cursor-not-allowed" value={originalTaskData?.userEmail || ''} />
                        </div>
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-base-content mb-1">Your Name (Poster)</label>
                            <input id="userName" type="text" readOnly className="input input-bordered w-full bg-base-200/70 cursor-not-allowed" value={originalTaskData?.userName || 'Not set'} />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isSubmitting || isLoadingData}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTask;