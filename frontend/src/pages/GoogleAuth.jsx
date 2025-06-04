import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('jwt', accessToken);
      // optionally fetch user info with this token
      navigate('/profile');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;
