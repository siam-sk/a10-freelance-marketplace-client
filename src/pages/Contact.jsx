import React from 'react';
import Swal from 'sweetalert2';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you for contacting us. We will get back to you shortly.',
            confirmButtonColor: '#764cad'
        });
        e.target.reset();
    };

    return (
        <div className="bg-base-200 min-h-[calc(100vh-136px)] py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-base-content">Get in Touch</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto text-base-content/70">
                        Have a question or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl mx-auto">
                    <div className="card-body lg:w-1/2 p-8">
                        <h2 className="card-title text-2xl mb-4">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name</span></label>
                                <input type="text" placeholder="John Doe" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email Address</span></label>
                                <input type="email" placeholder="john.doe@example.com" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Subject</span></label>
                                <input type="text" placeholder="Question about a task" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your Message</span></label>
                                <textarea className="textarea textarea-bordered h-32" placeholder="Write your message here..." required></textarea>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:w-1/2 bg-primary text-primary-content p-8 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none">
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPinIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Our Office</h3>
                                    <p className="opacity-80">123 Talent Ave, Workshire, WS 45678</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <EnvelopeIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <a href="mailto:support@talentsphere.com" className="opacity-80 hover:opacity-100 transition">support@talentsphere.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <PhoneIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <a href="tel:+1234567890" className="opacity-80 hover:opacity-100 transition">+1 (234) 567-890</a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="w-full h-48 bg-base-300/20 rounded-lg flex items-center justify-center">
                                <p className="text-sm opacity-70">[Map Placeholder]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;