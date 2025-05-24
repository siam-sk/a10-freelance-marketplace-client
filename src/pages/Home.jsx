import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const slidesData = [
    {
        id: 1,
        title: "Unlock Your Freelance Potential",
        description: "Join TalentSphere to find exciting projects that match your skills and passion. Start building your dream career today!",
        ctaText: "Explore Opportunities",
        ctaLink: "/browse-tasks",
        bgClass: "bg-gradient-to-r from-primary to-secondary",
    },
    {
        id: 2,
        title: "Hire Top Talent, Effortlessly",
        description: "Post your project and connect with skilled freelancers ready to bring your ideas to life. Quality work, delivered on time.",
        ctaText: "Post a Task",
        ctaLink: "/add-task",
        bgClass: "bg-gradient-to-r from-accent to-neutral",
    },
    {
        id: 3,
        title: "Flexible Work, Meaningful Impact",
        description: "Discover a world of freelance jobs that offer flexibility and the chance to work on impactful projects from anywhere.",
        ctaText: "Sign Up Now",
        ctaLink: "/signup",
        bgClass: "bg-gradient-to-r from-info to-success",
    }
];


const allTasksData = [
    { id: 1, title: "Urgent: Need a Logo Designer", description: "Looking for a creative logo for a new tech startup.", budget: "$200", deadline: "2025-05-28T23:59:59Z", category: "Design" },
    { id: 2, title: "Content Writer for Blog Posts", description: "Seeking a skilled writer for ongoing blog content.", budget: "$0.05/word", deadline: "2025-06-05T23:59:59Z", category: "Writing" },
    { id: 3, title: "Develop a Small E-commerce Site", description: "Need a developer to build a Shopify store.", budget: "$1500", deadline: "2025-06-15T23:59:59Z", category: "Development" },
    { id: 4, title: "Social Media Marketing Campaign", description: "Plan and execute a 1-month SMM campaign.", budget: "$500", deadline: "2025-05-30T23:59:59Z", category: "Marketing" },
    { id: 5, title: "Video Editor for YouTube Channel", description: "Edit weekly vlogs, 10-15 mins each.", budget: "$100/video", deadline: "2025-06-02T23:59:59Z", category: "Video Editing" },
    { id: 6, title: "Data Entry and Virtual Assistant", description: "Ongoing VA tasks, approx 10 hrs/week.", budget: "$15/hr", deadline: "2025-06-10T23:59:59Z", category: "Admin Support" },
    { id: 7, title: "Translate Document from English to Spanish", description: "10-page technical document.", budget: "$150", deadline: "2025-05-29T23:59:59Z", category: "Translation" },
    { id: 8, title: "Mobile App UI/UX Design", description: "Design mockups for a new fitness app.", budget: "$800", deadline: "2025-06-20T23:59:59Z", category: "Design" },
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredTasks, setFeaturedTasks] = useState([]);

    useEffect(() => {
        
        const sortedTasks = [...allTasksData]
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)) 
            .slice(0, 6); 
        setFeaturedTasks(sortedTasks);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
    };

    
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000); 
        return () => clearInterval(slideInterval); 
    }, []);

    return (
        <div className="space-y-16 mb-16"> 
            {/* Banner/Slider Section */}
            <section className="banner relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                {slidesData.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.bgClass} text-primary-content flex items-center justify-center text-center p-4 md:p-8 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="container mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-down">{slide.title}</h1>
                            <p className="text-lg md:text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-300">{slide.description}</p>
                            <Link to={slide.ctaLink} className="btn btn-accent btn-lg animate-fade-in-up animation-delay-600">
                                {slide.ctaText}
                            </Link>
                        </div>
                    </div>
                ))}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 btn btn-circle btn-ghost text-primary-content hover:bg-white/20"
                    aria-label="Previous Slide"
                >
                    ❮
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 btn btn-circle btn-ghost text-primary-content hover:bg-white/20"
                    aria-label="Next Slide"
                >
                    ❯
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {slidesData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Tasks Section */}
            <section className="featured-tasks container mx-auto px-4 md:px-8 py-12">
                <h2 className="text-3xl font-bold text-center mb-10">Featured Tasks (Deadline Soon!)</h2>
                {featuredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredTasks.map(task => (
                            <div key={task.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h3 className="card-title text-lg font-semibold">{task.title}</h3>
                                        <span className="badge badge-primary badge-outline">{task.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 mb-2">{task.description.substring(0,100)}{task.description.length > 100 ? '...' : ''}</p>
                                    <div className="text-sm mb-1">
                                        <strong>Budget:</strong> {task.budget}
                                    </div>
                                    <div className="text-sm mb-3">
                                        <strong>Deadline:</strong> <span className="font-medium text-error">{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="card-actions justify-end">
                                        <Link to={`/task/${task.id}`} className="btn btn-primary btn-sm">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No featured tasks available at the moment.</p>
                )}
                <div className="text-center mt-12">
                    <Link to="/browse-tasks" className="btn btn-outline btn-primary">Browse All Tasks</Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works bg-base-200 py-16 px-4 md:px-8">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-10">How TalentSphere Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V7.875c0-.621.504-1.125 1.125-1.125H6.75" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Post a Task</h3>
                            <p className="text-gray-600">Clients describe their needs, set a budget, and post their project for freelancers to see.</p>
                        </div>
                        <div className="p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-primary">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Find Talent</h3>
                            <p className="text-gray-600">Freelancers browse available tasks, find projects matching their skills, and submit proposals.</p>
                        </div>
                        <div className="p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-primary">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Get Work Done</h3>
                            <p className="text-gray-600">Collaborate with your chosen freelancer, track progress, and get high-quality work delivered securely.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials container mx-auto px-4 md:px-8 py-12">
                <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder for Testimonial 1 */}
                    <div className="card bg-base-100 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="card-body">
                            <div className="avatar mb-4 flex justify-center">
                                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Jane Doe" />
                                </div>
                            </div>
                            <p className="italic text-gray-600">"TalentSphere helped me find the perfect designer for my project quickly and easily. Highly recommended!"</p>
                            <div className="mt-4 text-center">
                                <p className="font-semibold">- Jane Doe, Startup Founder</p>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for Testimonial 2 */}
                    <div className="card bg-base-100 shadow-xl transform hover:scale-105 transition-transform duration-300">
                         <div className="card-body">
                            <div className="avatar mb-4 flex justify-center">
                                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="https://img.daisyui.com/images/stock/photo-1510227272981-87123e259b17.jpg" alt="John Smith" />
                                </div>
                            </div>
                            <p className="italic text-gray-600">"As a freelancer, I've found consistent work and great clients through this platform. The payment system is reliable."</p>
                            <div className="mt-4 text-center">
                                <p className="font-semibold">- John Smith, Web Developer</p>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for Testimonial 3 */}
                    <div className="card bg-base-100 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="card-body">
                            <div className="avatar mb-4 flex justify-center">
                                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                     <img src="https://img.daisyui.com/images/stock/photo-1507003211169-0a1dd7228f2d.jpg" alt="Alice Brown" />
                                </div>
                            </div>
                            <p className="italic text-gray-600">"A fantastic marketplace for both clients and freelancers. The interface is user-friendly and support is responsive."</p>
                            <div className="mt-4 text-center">
                                <p className="font-semibold">- Alice Brown, Marketing Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;