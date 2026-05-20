import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import News from "./pages/News";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/Dashboard";
import CreateProduct from "./admin/CreateProduct";

function App() {
    return (
        <ThemeProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="product" element={<Product />} />
                    <Route path="news" element={<News />} />
                </Route>
                   {/* ADMIN */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />      
                     <Route path="/admin/create-product" element={<CreateProduct />} />   
                </Route>
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;