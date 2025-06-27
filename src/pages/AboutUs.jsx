import React from 'react';
import { Link } from 'react-router';
import { BuildingOffice2Icon, RocketLaunchIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

const teamMembers = [
    { name: 'Jane Doe', role: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'John Smith', role: 'Lead Developer', imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { name: 'Emily White', role: 'Head of Marketing', imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

const AboutUs = () => {
    return (
        <div className="bg-base-100 text-base-content">
            {/* Hero Section */}
            <div className="bg-primary text-primary-content py-20 text-center">
                <div className="container mx-auto px-4">
                    <BuildingOffice2Icon className="h-16 w-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold">About TalentSphere</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">Connecting talent with opportunity, one project at a time.</p>
                </div>
            </div>

            {/* Our Mission Section */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <RocketLaunchIcon className="h-12 w-12 text-secondary mx-auto md:mx-0 mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-base-content/80 leading-relaxed">
                            Our mission is to create the most efficient and trusted digital marketplace where businesses can find, hire, and collaborate with the world's best freelance talent. We aim to empower individuals to live their dream work-life and provide businesses with the tools they need to succeed.
                        </p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1484&auto=format&fit=crop" alt="Team collaboration" className="rounded-lg shadow-lg" />
                    </div>
                </div>
            </section>

            <div className="divider container mx-auto"></div>

            {/* Meet the Team Section */}
            <section className="py-16 sm:py-20 bg-base-200">
                <div className="container mx-auto px-4 text-center">
                    <UserGroupIcon className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="card bg-base-100 shadow-md text-center">
                                <figure className="px-10 pt-10">
                                    <img src={member.imageUrl} alt={member.name} className="rounded-full w-32 h-32 object-cover ring ring-primary ring-offset-base-100 ring-offset-2" />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title">{member.name}</h3>
                                    <p className="text-secondary font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <SparklesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
                    <p className="text-base-content/80 max-w-xl mx-auto mb-8">
                        Whether you're looking to hire top talent or find your next freelance opportunity, TalentSphere is the place for you.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/browse-tasks" className="btn btn-primary btn-wide">Find Work</Link>
                        <Link to="/signup" className="btn btn-secondary btn-outline btn-wide">Hire Talent</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;