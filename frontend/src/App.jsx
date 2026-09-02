import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { setUser } from "./redux/authSlice";
import API from "./api/axios";

import Layout from "./components/Layout";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPasswod from "./components/pages/ResetPassword";
import Contact from "./components/pages/Contact";
import Newlisting from "./components/listings/Newlisting";
import AllListings from "./components/listings/AllListings";
import ListingDetails from "./components/listings/getPropertyDetails";
import Me from "./components/user/Me";
import MyProperties from "./components/user/MyProperties";
import UpdateProfile from "./components/user/updateProfile";
import MySecurity from "./components/user/Security";
import MyFavorites from "./components/user/MyFavorites";
import AllUsers from "./components/admin/Allusers";
import AdminMessages from "./components/admin/AdminMessages";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserLogin = async function () {
      try {
        const response = await API.get("/me");
        if (response.data?.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    checkUserLogin();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-slate-900 h-screen w-full flex items-center justify-center text-emerald-400 font-semibold text-lg animate-pulse">
        Loading Apna Ashiyana...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />

          <Route path="listings" element={<AllListings />} />
          <Route path="listing/:id" element={<ListingDetails />} />
          <Route path="me" element={<Me />} />
          <Route path="listing/new" element={<Newlisting />} />

          <Route path="me/listings" element={<MyProperties />} />
          <Route path="me/favorites" element={<MyFavorites />} />
          <Route path="me/update" element={<UpdateProfile />} />
          <Route path="me/security" element={<MySecurity />} />

          <Route path="admin/users" element={<AllUsers />} />
          <Route path="admin/messages" element={<AdminMessages />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="password/forgot" element={<ForgotPassword />} />
        <Route path="password/reset/:token" element={<ResetPasswod />} />
      </Routes>
    </div>
  );
}

export default App;
