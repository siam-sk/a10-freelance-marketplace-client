import React from 'react';
import { Link } from 'react-router';
import logo from '../assets/logo2.png';

const Footer = () => {
    const socialLinks = [
        {
            name: 'Twitter',
            href: '#',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.426.23-2.164.083.616 1.952 2.444 3.372 4.604 3.417-1.73 1.354-3.91 2.165-6.28 2.165-.41 0-.814-.024-1.21-.071 2.236 1.438 4.896 2.274 7.735 2.274 9.284 0 14.376-7.618 14.376-14.376 0-.219 0-.437-.015-.654.984-.711 1.835-1.6 2.518-2.612z"></path></svg>
        },
        {
            name: 'GitHub',
            href: '#',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
        },
        {
            name: 'Facebook',
            href: '#',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
        }
    ];

    return (
        <footer className="bg-base-100 text-base-content">
            <div className="container mx-auto px-4 py-10">
                <div className="grid gap-10 md:grid-flow-col">
                    <aside>
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="TalentSphere Logo" className="h-12 w-auto" />
                            <span className="font-extrabold text-2xl text-primary">TalentSphere</span>
                        </Link>
                        <p className="mt-2 max-w-xs">
                            Connecting skilled freelancers with exciting projects from around the world.
                        </p>
                        <p className="mt-4 text-sm opacity-70">© {new Date().getFullYear()} TalentSphere. All rights reserved.</p>
                    </aside>
                    <nav className="flex flex-col gap-2">
                        <h6 className="footer-title">Quick Links</h6>
                        <Link to="/" className="link link-hover">Home</Link>
                        <Link to="/browse-tasks" className="link link-hover">Browse Tasks</Link>
                        <Link to="/add-task" className="link link-hover">Post a Task</Link>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <h6 className="footer-title">Company</h6>
                        <Link to="/about-us" className="link link-hover">About Us</Link>
                        <Link to="/contact" className="link link-hover">Contact</Link>
                        <a href="#" className="link link-hover">Terms of Service</a>
                        <a href="#" className="link link-hover">Privacy Policy</a>
                    </nav>
                    <nav>
                        <h6 className="footer-title">Follow Us</h6>
                        <div className="grid grid-flow-col gap-4">
                            {socialLinks.map(social => (
                                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-base-content/70 hover:text-primary transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;