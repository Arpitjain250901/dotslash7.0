import "./App.css";
import { useEffect, useState} from "react";
import Header from "./component/layout/Header/header.js";
import { BrowserRouter as Router, Route, Routes,useLocation,Outlet,Navigate ,useNavigate} from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/footer/footer";
import Home from "./component/Home/Home";
//import Loader from "./component/layout/loader/Loader.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/useraction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
//import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/myOrder";
import OrderDetails from "./component/Order/orderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";






function App() {
  
  const {user,isAuthenticated} =useSelector(state => state.user);

 



  function RequireAuth({isAdmin}) {
    //let auth = useAuth();
    let location = useLocation();
  
    if (isAuthenticated===false) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} />;
    }

    if(isAdmin===true && user.role!=="admin")
    {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return <Outlet />;
  }
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

   //getStripeApiKey();

   
  }, []);

  const stripePromise = loadStripe("pk_test_51NRRndSFJWvopOadWDdWD8O3yKRYfLCwnM80KDZTTEEbNQFAR5T25YehTsFQlz09NLkpt8AcoI9kBCvc8CqU4H8Z00B72N0fBf");

  const ParentComponent= () => (
    <Elements  stripe={stripePromise}>
      <Payment />
    </Elements>
  );

  
  return (
    <Router>
      <Header />
       
      {isAuthenticated && <UserOptions user={user} />}

     
    
     

      <Routes>

      {isAuthenticated &&  <Route exact path="/process/payment" element={<ParentComponent />} />}
        
     
       
  
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/contact" element={<Contact />} />

        <Route exact path="/about" element={<About />} />

        
        
        <Route element={<RequireAuth />}>
        <Route exact path="/account" element={<Profile />} />
        <Route exact path="/me/update" element={<UpdateProfile />} />
        <Route exact path="/password/update" element={<UpdatePassword />} /> 
        <Route exact path="/login/shipping" element={<Shipping />} />
         <Route exact path="/order/confirm" element={<ConfirmOrder/>} /> 
         <Route exact path="/process/payment" element={<Payment/>} /> 
          

      <Route exact path="/success" element={<OrderSuccess />} />

      <Route exact path="/orders" element={<MyOrders />} />
      
      
      <Route exact path="/order/:id" element={<OrderDetails />} />
      <Route exact path="/order/confirm" element={<ConfirmOrder/>} />
      



  


 {/* <Route exact path="/process/payment" element={<ParentComponent />} /> */}


        
      <Route
          isAdmin={true}
          exact
          path="/admin/dashboard"
          element={<Dashboard />}
        />

    <Route
          exact
          path="/admin/products"
          isAdmin={true}
          element={<ProductList />}
        />

  <Route
          exact
          path="/admin/product"
          isAdmin={true}
          element={<NewProduct />}
        />

<Route
          exact
          path="/admin/product/:id"
          isAdmin={true}
          element={<UpdateProduct />}
        />

    <Route
          exact
          path="/admin/orders"
          isAdmin={true}
          element={<OrderList />}
        />

  <Route
          exact
          path="/admin/order/:id"
          isAdmin={true}
          element={<ProcessOrder />}
        />

    <Route
          exact
          path="/admin/users"
          isAdmin={true}
          element={<UsersList />}
        />

        <Route
          exact
          path="/admin/user/:id"
          isAdmin={true}
          element={<UpdateUser />}
        />

  <Route
          exact
          path="/admin/reviews"
          isAdmin={true}
          element={<ProductReviews />}
        />

        </Route>

        <Route exact path="/password/forgot" element={<ForgotPassword />} />         
        <Route exact path="/password/reset/:token" element={<ResetPassword />} /> 
        <Route path="/login" element={<LoginSignUp />} />
        
        <Route path="/cart" element={<Cart />} />
        


        </Routes>
        
      
    
        <Footer />
    </Router>
  );
}



export default App;
