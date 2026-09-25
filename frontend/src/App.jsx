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


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/pizzas" element={<Pizzas />}></Route>
        <Route path="/pizzas/:id" element={<PizzDetails />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
