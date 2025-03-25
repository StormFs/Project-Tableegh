import react from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = () => {
    const navigate = useNavigate();
    return (
        <div className="login-prompt" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Please login to continue</h1>
            <button
                className="login-button"
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        </div>
    );
};

export default LoginPrompt;
