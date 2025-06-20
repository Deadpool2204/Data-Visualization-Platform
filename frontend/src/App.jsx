import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home'
import LoginSignup from './pages/LoginSignup'
import Analysis from './pages/Analysis'
 import 'jspdf-autotable';



function App() {
  const router = createBrowserRouter([
    {
    path: '/',
    element: <LoginSignup />,
  },
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/Analysis',
    element: <Analysis />,
  }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
