import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="product" element={<Product />} />
                </Route>
                   {/* ADMIN */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />                  
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;