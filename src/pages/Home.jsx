import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Typewriter } from 'react-simple-typewriter';
import {
    BriefcaseIcon, UserGroupIcon, CodeBracketIcon, PaintBrushIcon,
    PencilSquareIcon, MegaphoneIcon, VideoCameraIcon, CurrencyDollarIcon, CalendarDaysIcon,
    SparklesIcon, ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext'; 

const slidesData = [
    {
        id: 1,
        titleWords: ["Unlock Your Freelance Potential", "Discover New Opportunities", "Build Your Dream Career"],
        description: "Join TalentSphere to find exciting projects that match your skills and passion. Start building your dream career today!",
        ctaText: "Explore Opportunities",
        ctaLink: "/browse-tasks",
        bgClass: "bg-gradient-to-br from-primary via-purple-500 to-secondary",
        icon: <SparklesIcon className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-accent" />
    },
    {
        id: 2,
        titleWords: ["Hire Top Talent, Effortlessly", "Find Skilled Freelancers", "Get Quality Work Done"],
        description: "Post your project and connect with skilled freelancers ready to bring your ideas to life. Quality work, delivered on time.",
        ctaText: "Post a Task",
        ctaLink: "/add-task",
        bgClass: "bg-gradient-to-br from-accent via-teal-500 to-neutral",
        icon: <BriefcaseIcon className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-primary" />
    },
    {
        id: 3,
        titleWords: ["Flexible Work, Meaningful Impact", "Work From Anywhere", "Join Our Community"],
        description: "Discover a world of freelance jobs that offer flexibility and the chance to work on impactful projects from anywhere.",
        ctaText: "Sign Up Now",
        ctaLink: "/signup",
        bgClass: "bg-gradient-to-br from-info via-sky-500 to-success",
        icon: <UserGroupIcon className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-secondary" />
    }
];

const popularCategories = [
    { name: "Web Development", icon: <CodeBracketIcon className="h-10 w-10" />, link: "/browse-tasks?category=Web Development", color: "text-primary" },
    { name: "Graphic Design", icon: <PaintBrushIcon className="h-10 w-10" />, link: "/browse-tasks?category=Design", color: "text-secondary" },
    { name: "Writing", icon: <PencilSquareIcon className="h-10 w-10" />, link: "/browse-tasks?category=Writing", color: "text-accent" },
    { name: "Marketing", icon: <MegaphoneIcon className="h-10 w-10" />, link: "/browse-tasks?category=Marketing", color: "text-info" },
    { name: "Video Editing", icon: <VideoCameraIcon className="h-10 w-10" />, link: "/browse-tasks?category=Video Editing", color: "text-success" },
];

const Home = () => {
    const { user } = useAuth(); 
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredTasks, setFeaturedTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [errorTasks, setErrorTasks] = useState(null);

    
    const SLIDE_INTERVAL = 7000; 

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slidesData.length);
        }, SLIDE_INTERVAL);

        
        return () => clearTimeout(timer);
    }, [currentSlide]);

    
    useEffect(() => {
        const fetchFeaturedTasks = async () => {
            setLoadingTasks(true);
            setErrorTasks(null);
            try {
                
                const response = await fetch('http://a10-freelance-marketplace-server.vercel.app/tasks?sortBy=deadline_asc&limit=6&status=open');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFeaturedTasks(data);
            } catch (err) {
                console.error("Failed to fetch featured tasks:", err);
                setErrorTasks(err.message || "Could not load featured tasks.");
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchFeaturedTasks();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatBudget = (budget) => {
        if (typeof budget === 'number') return `$${budget.toLocaleString()}`;
        return budget || 'N/A';
    };

    return (
        <div className="bg-base-100 text-base-content min-h-screen">
            
            {!user && (
                <section className="relative w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] overflow-hidden group shadow-lg"> {/* Reduced height */}
                    {slidesData.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.bgClass} text-primary-content flex flex-col items-center justify-center text-center p-6 md:p-12 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <div className="container mx-auto max-w-3xl">
                                {slide.icon && <div className="mb-3 md:mb-4 opacity-90">{React.cloneElement(slide.icon, { className: `${slide.icon.props.className} animate-pulse` })}</div>}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                                    {index === currentSlide ? (
                                        <Typewriter words={slide.titleWords} loop={true} cursor cursorStyle='|' typeSpeed={60} deleteSpeed={40} delaySpeed={2200} />
                                    ) : (
                                        <span>{slide.titleWords[0]}</span>
                                    )}
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 max-w-xl mx-auto">{slide.description}</p>
                                <Link to={slide.ctaLink} className="btn btn-accent btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                    {slide.ctaText}
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                        {slidesData.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125 ring-2 ring-white/50' : 'bg-white/50 hover:bg-white/75'}`} aria-label={`Go to slide ${index + 1}`} />
                        ))}
                    </div>
                </section>
            )}

            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
                    <span className="bg-clip-text text-primary">Hot Opportunities</span>
                </h2>
                {loadingTasks && <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-primary"></span></div>}
                {errorTasks && !loadingTasks && (
                    <div className="text-center py-10 px-4 bg-error/10 rounded-lg">
                        <ShieldCheckIcon className="h-16 w-16 mx-auto text-error mb-4" />
                        <p className="text-xl font-semibold text-error mb-2">Oops! Something went wrong.</p>
                        <p className="text-base-content/70 mb-6">{errorTasks}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
                    </div>
                )}
                {!loadingTasks && !errorTasks && featuredTasks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {featuredTasks.map(task => (
                            <div key={task._id} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col border border-base-300/50 hover:border-primary/50">
                                <div className="card-body flex-grow p-5 md:p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="card-title text-lg md:text-xl font-semibold group-hover:text-primary transition-colors leading-tight">{task.title}</h3>
                                        <span className="badge badge-ghost badge-md whitespace-nowrap ml-2 mt-1">{task.category}</span>
                                    </div>
                                    <p className="text-sm text-base-content/75 mt-1 mb-4 flex-grow min-h-[60px] line-clamp-3">{task.description}</p>
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center text-sm text-base-content/80">
                                            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-success flex-shrink-0" />
                                            <strong>Budget:</strong>&nbsp;<span className="font-medium">{formatBudget(task.budget)}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-base-content/80">
                                            <CalendarDaysIcon className="h-5 w-5 mr-2 text-error flex-shrink-0" />
                                            <strong>Deadline:</strong>&nbsp;<span className="font-medium">{formatDate(task.deadline)}</span>
                                        </div>
                                        <div className="card-actions justify-end pt-3">
                                            <Link to={`/task/${task._id}`} className="btn btn-primary btn-sm shadow-md hover:shadow-lg">View Details</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loadingTasks && !errorTasks && featuredTasks.length === 0 && (
                     <div className="text-center py-10 px-4 bg-base-200/50 rounded-lg">
                        <BriefcaseIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                        <p className="text-xl font-semibold text-base-content/70">No featured tasks available right now.</p>
                        <p className="text-base-content/50 mt-2">Check back soon or explore all tasks!</p>
                    </div>
                )}
                <div className="text-center mt-12 md:mt-16">
                    <Link to="/browse-tasks" className="btn btn-outline btn-primary btn-wide shadow-sm hover:shadow-md">Browse All Tasks</Link>
                </div>
            </section>

            <section className="bg-base-200 py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">Explore Popular Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {popularCategories.map(category => (
                            <Link key={category.name} to={category.link} className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 text-center items-center group transform hover:scale-105 hover:border-2 ${category.color.replace('text-', 'border-')}`}>
                                <div className={`mb-3 group-hover:scale-110 transition-transform ${category.color}`}>{category.icon}</div>
                                <h3 className={`font-semibold text-sm md:text-base text-base-content group-hover:${category.color} transition-colors`}>{category.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            
            {!user && (
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12">How <span className="text-primary">TalentSphere</span> Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { icon: <PencilSquareIcon className="h-12 w-12 md:h-16 md:w-16 text-primary" />, title: "1. Post Your Task", description: "Clients easily describe project needs, set a budget, and publish tasks for skilled freelancers to discover." },
                                { icon: <BriefcaseIcon className="h-12 w-12 md:h-16 md:w-16 text-secondary" />, title: "2. Find & Hire Talent", description: "Freelancers browse tasks, submit proposals, and clients select the best fit for their project." },
                                { icon: <ShieldCheckIcon className="h-12 w-12 md:h-16 md:w-16 text-accent" />, title: "3. Get Quality Work Done", description: "Collaborate seamlessly, track progress, and receive high-quality work securely through our platform." }
                            ].map(step => (
                                <div key={step.title} className="card bg-base-100 shadow-lg p-6 md:p-8 transform hover:scale-105 transition-transform duration-300 border border-transparent hover:border-primary/30">
                                    <div className="flex justify-center mb-4 md:mb-6">{step.icon}</div>
                                    <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">{step.title}</h3>
                                    <p className="text-base-content/70 text-sm md:text-base">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;