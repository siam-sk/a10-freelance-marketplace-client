import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup, signInWithGoogle, loading } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: "Password must be at least 6 characters long." });
            return;
        }
        if (!/[A-Z]/.test(password)) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: "Password must contain at least one uppercase letter." });
            return;
        }
        if (!/[a-z]/.test(password)) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: "Password must contain at least one lowercase letter." });
            return;
        }
 
        if (photoURL && !photoURL.startsWith('http')) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: "Please enter a valid URL for the photo." });
            return;
        }

        setIsSubmitting(true);
        try {
            await signup(email, password, displayName, photoURL); 
            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'Welcome to TalentSphere!',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/'); 
        } catch (err) {
            let errorMessage = 'Failed to create an account. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already in use.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: errorMessage,
            });
            console.error("Signup error:", err);
        }
        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            await signInWithGoogle();
            Swal.fire({
                icon: 'success',
                title: 'Account Created/Logged In!',
                text: 'Welcome!',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/'); 
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Google Sign-In Failed',
                text: err.message || 'An error occurred. Please try again.',
            });
            console.error("Google sign-in error:", err);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-base-100 shadow-xl rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="display-name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="display-name"
                                name="displayName"
                                type="text"
                                autoComplete="name"
                                required
                                className="input input-bordered w-full mb-3"
                                placeholder="Full Name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                disabled={isSubmitting || loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input input-bordered w-full mb-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting || loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="photo-url" className="sr-only">
                                Photo URL
                            </label>
                            <input
                                id="photo-url"
                                name="photoURL"
                                type="url"
                                autoComplete="photo"
                                className="input input-bordered w-full mb-3"
                                placeholder="Photo URL (optional)"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                disabled={isSubmitting || loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="input input-bordered w-full"
                                placeholder="Password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting || loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? <span className="loading loading-spinner"></span> : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="divider">OR</div>

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full flex items-center justify-center gap-2"
                        disabled={isSubmitting || loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l0.002-0.002l6.19,5.238C39.702,35.636,44,28.738,44,20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        Sign up with Google
                    </button>
                </div>

                <div className="text-sm text-center">
                    <p className="text-base-content">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-focus">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;