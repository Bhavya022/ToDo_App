import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
    {/* ToastContainer is added here, so it's available globally */}
    <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop />
  </React.StrictMode>
);
