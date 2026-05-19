import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider } from "./admin/auth/AuthProvider";
import ProtectedAdmin from "./admin/auth/ProtectedAdmin";
import LoginPage from "./admin/pages/LoginPage";

import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import Dashboard from "./admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="product" element={<Product />} />
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
  );
}

export default App;
