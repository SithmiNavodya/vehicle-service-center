// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
//
//     if (!token || !userData) {
//       navigate('/login');
//       return;
//     }
//
//     try {
//       setUser(JSON.parse(userData));
//     } catch (error) {
//       navigate('/login');
//     }
//   }, [navigate]);
//
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };
//
//   if (!user) {
//     return <div style={styles.loading}>Loading...</div>;
//   }
//
//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h1 style={styles.logo}>🚗 Vehicle Service Center</h1>
//         <div style={styles.userInfo}>
//           <span>Welcome, {user.firstName}!</span>
//           <button onClick={handleLogout} style={styles.logoutBtn}>
//             Logout
//           </button>
//         </div>
//       </header>
//
//       <main style={styles.main}>
//         <div style={styles.welcomeCard}>
//           <h2>Welcome to Dashboard</h2>
//           <p>You have successfully logged in to the Vehicle Service Center Management System.</p>
//
//           <div style={styles.userDetails}>
//             <h3>Your Information:</h3>
//             <div style={styles.detailsGrid}>
//               <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
//               <div><strong>Email:</strong> {user.email}</div>
//               <div><strong>Role:</strong> {user.role}</div>
//             </div>
//           </div>
//
//           <div style={styles.actions}>
//             <button style={styles.actionBtn} onClick={() => alert('Customers feature coming soon!')}>
//               👥 Manage Customers
//             </button>
//             <button style={styles.actionBtn} onClick={() => alert('Vehicles feature coming soon!')}>
//               🚘 Manage Vehicles
//             </button>
//             <button style={styles.actionBtn} onClick={() => alert('Services feature coming soon!')}>
//               🔧 Manage Services
//             </button>
//             <button style={styles.actionBtn} onClick={() => alert('Appointments feature coming soon!')}>
//               📅 Manage Appointments
//             </button>
//           </div>
//         </div>
//       </main>
//
//       <footer style={styles.footer}>
//         <p>© 2024 Vehicle Service Center Management System</p>
//       </footer>
//     </div>
//   );
// };
//
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#f5f5f5',
//   },
//   loading: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     fontSize: '20px',
//   },
//   header: {
//     backgroundColor: '#1890ff',
//     color: 'white',
//     padding: '20px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logo: {
//     margin: 0,
//     fontSize: '24px',
//   },
//   userInfo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//   },
//   logoutBtn: {
//     backgroundColor: '#ff4d4f',
//     color: 'white',
//     border: 'none',
//     padding: '8px 16px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   main: {
//     maxWidth: '1200px',
//     margin: '40px auto',
//     padding: '0 20px',
//   },
//   welcomeCard: {
//     backgroundColor: 'white',
//     padding: '40px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//   },
//   userDetails: {
//     marginTop: '30px',
//     padding: '20px',
//     backgroundColor: '#fafafa',
//     borderRadius: '4px',
//   },
//   detailsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '20px',
//     marginTop: '15px',
//   },
//   actions: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '20px',
//     marginTop: '40px',
//   },
//   actionBtn: {
//     padding: '20px',
//     backgroundColor: '#f0f0f0',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//   },
//   footer: {
//     textAlign: 'center',
//     padding: '20px',
//     marginTop: '40px',
//     backgroundColor: '#fff',
//     borderTop: '1px solid #ddd',
//   },
// };
//
// export default Dashboard;