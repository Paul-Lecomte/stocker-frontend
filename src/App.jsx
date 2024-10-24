import { useState } from 'react'
import './App.css'
import {Route, Router, Routes, useNavigate} from "react-router-dom";
import ErrorPage from "./pages/error_page/ErrorPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import UserManagement from "./pages/user_management/UserManagement.jsx";
import Movement from "./pages/movement/Movement.jsx";
import Products from "./pages/products/Products.jsx";
import Inventory from "./pages/inventory/Inventory.jsx";


function App() {
    const navigate = useNavigate()

  return (
      <Routes>
          <Route path='/' element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/movement" element={<Movement />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/*" element={<ErrorPage />} />
          </Route>
      </Routes>
  )
}

export default App
