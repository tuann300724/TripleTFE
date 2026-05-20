import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import News from "./pages/News";
import Dashboard from "./admin/Dashboard";
import User from "./admin/User";

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


                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="users" element={<User />} />
                    </Route>
                </Routes>

            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
