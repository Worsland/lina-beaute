import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import Establishments from './pages/client/Establishments';
import EstablishmentDetail from './pages/client/EstablishmentDetail';
import Booking from './pages/client/Booking';  // ← AJOUTER
import MyBookings from './pages/client/MyBookings'; 
// Layout
import MainLayout from './components/layout/MainLayout';

// Pages publiques (on les créera après)

import Home from './pages/client/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Route protégée
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Routes publiques */}
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="establishments" element={<Establishments />} />  {/* ← AJOUTER */}
            <Route path="establishments/:id" element={<EstablishmentDetail />} />  {/* ← AJOUTER */}
            {/* Routes protégées */}
            <Route path="booking/:id" element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            } />
            <Route path="bookings" element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } />
          </Route>

          {/* Routes privées (on les ajoutera après) */}
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;