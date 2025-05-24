import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="footer footer-center p-10 bg-base-300 text-base-content">
            <nav>
                <h6 className="footer-title">Company</h6>
                <Link to="/about-us" className="link link-hover">About us</Link>
                <Link to="/terms-conditions" className="link link-hover">Terms & Conditions</Link>
                <Link to="/privacy-policy" className="link link-hover">Privacy policy</Link>
            </nav>
            
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="link link-hover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.564-.665 2.458 0 1.488.76 2.795 1.905 3.563-.706-.023-1.368-.216-1.947-.538v.059c0 2.08 1.48 3.818 3.437 4.209-.359.097-.737.148-1.13.148-.276 0-.545-.027-.811-.076.544 1.7 2.123 2.958 3.99 2.994-1.472 1.148-3.336 1.832-5.357 1.832-.348 0-.692-.02-1.033-.062 1.905 1.223 4.163 1.936 6.59 1.936 7.906 0 12.23-6.56 12.23-12.234 0-.186-.004-.372-.012-.556.84-.603 1.568-1.356 2.143-2.224z"></path></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="link link-hover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="link link-hover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                    </a>
                </div>
            </nav>
            
            <nav>
                <h6 className="footer-title">Legal & Contact</h6>
                <p className="text-sm">Contact: support@talentsphere.com</p>
                <p className="text-sm">Copyright © {new Date().getFullYear()} - All right reserved by TalentSphere Ltd</p>
            </nav>
        </footer>
    );
};

export default Footer;