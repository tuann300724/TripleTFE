import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider } from "./admin/auth/AuthProvider";
import ProtectedAdmin from "./admin/auth/ProtectedAdmin";
import LoginPage from "./admin/pages/LoginPage";

import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import News from "./pages/News";
import Dashboard from "./admin/Dashboard";

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="product" element={<Product />} />
                            <Route path="news" element={<News />} />
                        </Route>

                        <Route path="/admin/login" element={<LoginPage />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedAdmin>
                                    <AdminLayout />
                                </ProtectedAdmin>
                            }
                        >
                            <Route index element={<Dashboard />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
