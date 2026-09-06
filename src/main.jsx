import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../script.js';

// Mount whole-site Antigravity background
const bgRoot = document.getElementById('antigravity-bg');
if (bgRoot) {
  createRoot(bgRoot).render(<App />);
}
