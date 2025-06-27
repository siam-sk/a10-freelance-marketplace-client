import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const UpdateTaskModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
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
        if (task) {
            setTaskTitle(task.title);
            setCategory(task.category);
            setDescription(task.description);
            setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
            setBudget(task.budget.toString());
        }
    }, [task]);

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
            const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTaskData),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            onTaskUpdated({ ...task, ...updatedTaskData });
            Swal.fire({ icon: 'success', title: 'Task Updated!', text: 'Your task has been successfully updated.', timer: 2000, showConfirmButton: false });
            onClose();
        } catch (err) {
            Swal.fire('Update Failed', err.message || 'Could not update the task.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-3xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-2xl mb-4">Update Task</h3>
                <p className="text-base-content/70 mb-6">Edit the details of your posted task.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Task Title</span></label>
                        <input type="text" placeholder="e.g., Build a responsive landing page" className="input input-bordered w-full" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Category</span></label>
                            <select className="select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Budget ($)</span></label>
                            <input type="number" placeholder="e.g., 500" className="input input-bordered" value={budget} onChange={(e) => setBudget(e.target.value)} required min="1" />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Description</span></label>
                        <textarea className="textarea textarea-bordered h-24" placeholder="Provide a detailed description of the task..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Deadline</span></label>
                        <input type="date" className="input input-bordered" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTaskModal;