import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/routes.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BidProvider } from './contexts/BidContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BidProvider>
        <RouterProvider router={router} />
      </BidProvider>
    </AuthProvider>
  </React.StrictMode>,
)
