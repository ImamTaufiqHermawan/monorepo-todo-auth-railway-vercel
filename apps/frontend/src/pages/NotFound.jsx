import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '8rem',
          fontWeight: 'bold',
          margin: '0',
          color: '#6366f1',
          lineHeight: '1'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          margin: '1rem 0',
          color: '#1f2937'
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          margin: '1rem 0 2rem 0',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6366f1',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#6366f1',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              border: '2px solid #6366f1',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#6366f1';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6366f1';
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

