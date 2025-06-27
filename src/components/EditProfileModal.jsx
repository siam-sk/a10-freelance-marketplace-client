import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const EditProfileModal = ({ isOpen, onClose, onProfileUpdate }) => {
    const { user, updateUserProfileData } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!displayName.trim()) {
            Swal.fire('Validation Error', 'Display Name cannot be empty.', 'warning');
            setIsSubmitting(false);
            return;
        }

        try {
            const profileData = { displayName, photoURL };
            await updateUserProfileData(profileData);
            
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile has been successfully updated.',
                timer: 2000,
                showConfirmButton: false
            });

            if (onProfileUpdate) {
                onProfileUpdate();
            }
            onClose();
        } catch (error) {
            Swal.fire('Update Failed', error.message || 'Could not update your profile.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-lg">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-2xl mb-4">Edit Profile</h3>
                <p className="text-base-content/70 mb-6">Update your display name and photo URL.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Display Name</span></label>
                        <input 
                            type="text" 
                            placeholder="Your full name" 
                            className="input input-bordered w-full" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL</span></label>
                        <input 
                            type="url" 
                            placeholder="https://example.com/your-photo.jpg" 
                            className="input input-bordered w-full" 
                            value={photoURL} 
                            onChange={(e) => setPhotoURL(e.target.value)} 
                        />
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

export default EditProfileModal;