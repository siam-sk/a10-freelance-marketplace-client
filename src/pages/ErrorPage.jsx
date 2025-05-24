import React from 'react';
import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    let errorMessage = "Sorry, an unexpected error has occurred.";
    let errorStatus = "Error";

    if (error) {
        if (error.status === 404) {
            errorMessage = "Oops! The page you're looking for doesn't exist.";
            errorStatus = "404 - Page Not Found";
        } else if (error.statusText || error.message) {
            errorMessage = error.statusText || error.message;
            errorStatus = error.status ? `${error.status} - Error` : "Error";
        }
    }


    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-md w-full">
                <div className="mb-8">
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 mx-auto text-primary opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                         <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> {/* Simple X mark */}
                    </svg>
                </div>
                <h1 className="text-5xl font-bold text-base-content mb-4">{errorStatus}</h1>
                <p className="text-xl text-base-content/80 mb-8">
                    {errorMessage}
                </p>
                <Link to="/" className="btn btn-primary btn-lg">
                    Go Back Home
                </Link>
                {error && (error.status !== 404) && (
                    <div className="mt-6 text-xs text-base-content/60">
                        <p>If the problem persists, please contact support.</p>
                        {error.data && <p>Details: {error.data}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;