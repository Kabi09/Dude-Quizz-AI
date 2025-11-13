import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subHeading}>Page Not Found</h2>

      
      <Link 
        to="/" 
        style={styles.homeButton}
      >
        🏠 Home-ku Thirumba Po
      </Link>
    </div>
  );
}

const styles = {
  container: {
    // Kandippa theriyurathuku Dark Background set panrom
    backgroundColor: '#1e293b', 
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    marginTop: '20px',
    borderRadius: '10px',
  },
  heading: {
    fontSize: '6rem',
    fontWeight: '900',
    color: '#fff', // Pure White Text
    margin: 0,
    lineHeight: 1,
  },
  subHeading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.2rem',
    color: '#cbd5e1',
    marginBottom: '30px',
  },
  homeButton: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
};