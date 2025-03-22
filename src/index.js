import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1";
document.head.appendChild(meta);

document.addEventListener("focusin", function () {
  document.documentElement.style.zoom = "1"; // Prevents Safari from zooming in
});
document.addEventListener("focusout", function () {
  document.documentElement.style.zoom = "1"; // Resets zoom after typing
});



