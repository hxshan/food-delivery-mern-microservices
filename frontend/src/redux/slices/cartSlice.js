import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: "",
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if restaurant is different, clear cart if so
      if (
        state.restaurantId &&
        state.restaurantId !== action.payload.restaurantId
      ) {
        return {
          ...initialState,
          items: [action.payload.item],
          restaurantId: action.payload.restaurantId,
          restaurantName: action.payload.restaurantName,
        };
      }

      // Check if the item already exists with same customizations
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.item.id &&
          item.size === action.payload.item.size &&
          JSON.stringify(item.addOns) ===
            JSON.stringify(action.payload.item.addOns)
      );

      if (existingItemIndex !== -1) {
        // If item exists, increment quantity
        state.items[existingItemIndex].quantity += action.payload.item.quantity;
      } else {
        // Otherwise add new item
        state.items.push(action.payload.item);
      }

      // Set restaurant info if adding first item
      if (!state.restaurantId) {
        state.restaurantId = action.payload.restaurantId;
        state.restaurantName = action.payload.restaurantName;
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((_, index) => index !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      if (state.items[index]) {
        state.items[index].quantity = quantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    clearCart: () => {
      return initialState;
    },
    calculateTotals: (state) => {
      // Calculate subtotal
      state.subtotal = state.items.reduce((total, item) => {
        let itemPrice = item.price;

        // Add size price
        if (item.sizePrice) {
          itemPrice += item.sizePrice;
        }

        // Add addOns prices
        if (item.addOnsPrices && item.addOnsPrices.length) {
          itemPrice += item.addOnsPrices.reduce((sum, price) => sum + price, 0);
        }

        return total + itemPrice * item.quantity;
      }, 0);

      // Calculate tax and delivery fee
      state.tax = Math.round(state.subtotal * 0.1); // Assuming 10% tax
      state.deliveryFee = state.subtotal > 0 ? 150 : 0; // Example delivery fee

      // Calculate total
      state.total = state.subtotal + state.tax + state.deliveryFee;
    },

    getCart: (state, action) => {
      const restaurantId = action.payload;
      console.log("Getting cart for restaurant:", restaurantId);
      console.log("Current cart state:", state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, getCart } =
  cartSlice.actions;

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
