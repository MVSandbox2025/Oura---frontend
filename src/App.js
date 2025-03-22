import "./App.css";
import { useEffect, useState } from "react";
import Home from "./components/home";
import LoginPage from "./components/login";
import PricingPage from "./pages/PricingPage";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import AOS from "aos";
import {jwtDecode} from 'jwt-decode';

AOS.init();

function App() {
  const [user, setUser] = useState(null);


  function processTokenInURL() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
  
    // Check if the token parameter exists
    if (params.has('token')) {
      const tokenValue = params.get('token');
      localStorage.setItem('userToken',tokenValue)

      setUser(jwtDecode(tokenValue));

  
      params.delete('token');
  
      url.search = params.toString();
  
      window.history.pushState({}, '', url.toString());
    } else {
     const read_token = localStorage.getItem('userToken') || '';
     if(read_token){
      setUser(jwtDecode(read_token))
     }
    }
  }
  
  

  useEffect(() => {
    // getUser();
  processTokenInURL();

  }, []);

  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home user={user} />,
      // errorElement: <ErrorPage />,
    },
    {
      path: "/Login",
      element: user ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: "/Upgrade",
      element: user ? <PricingPage user={user} /> : <LoginPage />,
    },
    {
      path: "/Success",
      element: <SuccessPage />,
    },
    {
      path: "/Cancel",
      element: <CancelPage />,
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return <RouterProvider router={myRouter} />;
}

export default App;