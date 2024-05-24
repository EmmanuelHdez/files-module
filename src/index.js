import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./styles/App.css";
import "./styles/home.css";
import "./styles/Dashboard.css";
import { DocumentsDashboard } from "./components/Documents_Dash/DocumentsDashboard";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DocumentsDashboard />
  </React.StrictMode>
);

