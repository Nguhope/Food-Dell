import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Invalid cart JSON in localStorage:", error);
      localStorage.removeItem("cart");
      return {};
    }
  });

  const url = "http://localhost:4000";
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const syncCartWithBackend = useCallback(async (itemId, operation) => {
    if (!token) return;
    
    try {
      const endpoint = operation === 'add' ? "/api/cart/add" : "/api/cart/remove";
      await axios.post(url + endpoint, { itemId }, { 
        headers: { token } 
      });
    } catch (error) {
      console.error(`Failed to ${operation} item in backend cart:`, error);
      setError(`Failed to ${operation} item. Please try again.`);
    }
  }, [token, url]);

  const addToCart = useCallback(async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { 
        ...prev, 
        [itemId]: (prev[itemId] || 0) + 1 
      };
      return updatedCart;
    });
    await syncCartWithBackend(itemId, 'add');
  }, [syncCartWithBackend]);

  const removeFromCart = useCallback(async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
    await syncCartWithBackend(itemId, 'remove');
  }, [syncCartWithBackend]);

  const getTotalCartAmount = useCallback(() => {
    if (!food_list.length || !Object.keys(cartItems).length) return 0;
    
    return Object.entries(cartItems).reduce((total, [id, quantity]) => {
      const item = food_list.find(product => product._id === id);
      return total + (item?.price || 0) * quantity;
    }, 0);
  }, [cartItems, food_list]);

  const fetchFoodList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
      setError("Failed to load menu. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const loadCartData = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(
        url + "/api/cart/get", 
        {}, 
        { headers: { token } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart from backend:", error);
      setError("Failed to load your cart. Please try again.");
    }
  }, [token, url]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      await loadCartData();
    };
    loadData();
  }, [fetchFoodList, loadCartData]);

  const clearCart = useCallback(() => {
    setCartItems({});
    if (token) {
      axios.post(url + "/api/cart/clear", {}, { headers: { token } })
        .catch(error => console.error("Failed to clear cart:", error));
    }
  }, [token, url]);

  const ContextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
    token,
    setToken,
    loading,
    error,
    setError
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;