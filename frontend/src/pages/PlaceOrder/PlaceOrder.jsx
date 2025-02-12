import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (e) => {
    e.preventDefault();

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const amount = getTotalCartAmount() + 5; // Total amount including delivery fee
    const orderData = {
      address: data,
      items: orderItems,
      amount,
    };

    try {
      setLoading(true); // Set loading to true
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (!response.data.success) {
        setLoading(false); // Set loading to false
        toast.error("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Food Delivery App",
        description: "Order Payment",
        handler: async function (paymentResponse) {
          console.log("Payment Response:", paymentResponse);

          if (paymentResponse.razorpay_payment_id) {
            toast.success("Payment Successful!");
            try {
              const { data } = await axios.post(
                `${url}/api/order/verify`,
                {
                  orderId: response.data.orderId,
                  paymentId: paymentResponse.razorpay_payment_id,
                  success: true,
                },
                { headers: { token } }
              );

              if (data.success) {
                toast.success("Order placed successfully.");
                navigate("/myorders");
              } else {
                toast.error("Order verification failed: " + data.message);
              }
            } catch (err) {
              toast.error("Error while confirming payment. Please try again.");
            }
          } else {
            try {
              const { data } = await axios.post(
                `${url}/api/order/verify`,
                {
                  orderId: response.data.orderId,
                  paymentId: paymentResponse.razorpay_payment_id,
                  success: false,
                },
                { headers: { token } }
              );
            } catch (err) {}
            toast.error("Payment failed. No payment ID received.");
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        notes: {
          address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment window closed.");
            toast.info("Payment window was closed. Payment not completed.");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setLoading(false); // Set loading to false on error
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("To place an order, please sign in first.");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={displayRazorpay} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}
              </b>
            </div>
          </div>
        </div>
        <button className="place-order-submit" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Proceed To Payment"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
