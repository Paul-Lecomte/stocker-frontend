import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import ErrorPage from "./pages/error_page/ErrorPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import UserManagement from "./pages/user_management/UserManagement.jsx";
import Movement from "./pages/movement/Movement.jsx";
import ProductsDetails from "./pages/products_details/ProductsDetails.jsx";
import Inventory from "./pages/inventory/Inventory.jsx";
import Login from "./pages/login/Login.jsx";
import Products from "./pages/products/Products.jsx";
import StockMovementHistory from "./pages/historic/StockMovementHistory.jsx";
import NotificationsComp from "./pages/notification/NotificationPage.jsx";
import { NotificationProvider } from "./components/popup/NotificationContext.jsx";

function App() {
    const navigate = useNavigate();

    return (
        //notification provider is here to be able to be shown sitewide
        <NotificationProvider>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="movement" element={<Movement />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products_details/:id" element={<ProductsDetails />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="stock_movement_history" element={<StockMovementHistory />} />
                    <Route path="notifications" element={<NotificationsComp />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
        </NotificationProvider>
    );
}

export default App;
