import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";



import MainLayout from "./layouts/MainLayout";

import AdminLayout from "./admin/AdminLayout";



import Home from "./pages/Home";

import About from "./pages/About";

import Product from "./pages/Product";

import ProductDetail from "./pages/ProductDetail";

import News from "./pages/News";

import NewsDetail from "./pages/NewsDetail";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Cart from "./pages/Cart";

import Checkout from "./pages/Checkout";

import Success from "./pages/Success";

import Profile from "./pages/profile/Profile";
import CourtBooking from "./pages/CourtBooking";

import Dashboard from "./admin/Dashboard";

import User from "./admin/User";

import AdminProduct from "./admin/Product";

import ProductCreate from "./admin/ProductCreate";

import AdminOrder from "./admin/Order";

import AdminCategory from "./admin/Category";

import AdminPayment from "./admin/Payment";
import ProductEdit from "./admin/ProductEdit";
import CategoryAdd from "./admin/CategoryAdd";
import CategoryEdit from "./admin/CategoryEdit";
import NewsAdmin from "./admin/NewsAdmin";
import AddNews from "./admin/AddNews";
import EditNews from "./admin/EditNews";
import AdminCourt from "./admin/Court";
import CourtDetail from "./admin/CourtDetail";
import CourtEdit from "./admin/CourtEdit";



function App() {

    return (

        <ThemeProvider>

            <BrowserRouter>



                <Routes>

                    <Route path="/" element={<MainLayout />}>

                        <Route index element={<Home />} />

                        <Route path="about" element={<About />} />

                        <Route path="product" element={<Product />} />

                        <Route path="product/:id" element={<ProductDetail />} />

                        <Route path="cart" element={<Cart />} />

                        <Route path="checkout" element={<Checkout />} />

                        <Route path="success" element={<Success />} />

                        <Route path="news" element={<News />} />

                        <Route path="news/:id" element={<NewsDetail />} />

                        <Route path="profile" element={<Profile />} />

                        <Route path="booking" element={<CourtBooking />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />

                    </Route>





                    <Route path="/admin" element={<AdminLayout />}>

                        <Route index element={<Dashboard />} />

                        <Route path="users" element={<User />} />

                        <Route path="products" element={<AdminProduct />} />
                         <Route path="products/:id" element={<ProductEdit />} />

                        <Route path="products/new" element={<ProductCreate />} />

                        <Route path="orders" element={<AdminOrder />} />
                        <Route path="categories/add" element={<CategoryAdd />} />
                        <Route path="categories/edit/:id" element={<CategoryEdit />} />

                        <Route path="categories" element={<AdminCategory />} />
                        <Route path="news" element={<NewsAdmin />} />
                        <Route path="news/add" element={<AddNews />} />
                        <Route path="news/edit/:id" element={<EditNews />} />

                        <Route path="payments" element={<AdminPayment />} />
                        <Route path="courts" element={<AdminCourt />} />
                        <Route path="courts/edit/:id" element={<CourtEdit />} />
                        <Route path="courts/:id" element={<CourtDetail />} />

                    </Route>

                </Routes>



            </BrowserRouter>

        </ThemeProvider>

    );

}



export default App;


