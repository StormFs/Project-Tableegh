import React from 'react';
import './css/Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const Navigate = useNavigate();
    return (
        <footer>
            
            <pre style={{fontSize: 20}}>&copy;  Copyright 2025 Tableegh</pre>
            <br />
            <p>Made with ❤️ by</p>
            <br />
            <div className="footer-content">
                <a href='https://github.com/avexxx3'><pre>Armaghan Atiq     </pre></a>
                <pre>|</pre>
                <a href='https://github.com/StormFs'><pre>    Faheem Sarwar     </pre></a>
                <pre>|</pre>
                <a href='https://github.com/Rebelhere'><pre>    Rahim Usman</pre></a>
            </div>
        </footer>
    );
};

export default Footer;


