import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PizzaCard from "./components/PizzaCard";
import Pizzas from "./pages/Pizzas";
import PizzDetails from "./pages/PizzaDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import AIChatbot from "./components/AIChatbot";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AddPizza from "./pages/AddPizza";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AIChatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route path="/pizzas/:id" element={<PizzDetails />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pizzas/add" element={<AddPizza />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
