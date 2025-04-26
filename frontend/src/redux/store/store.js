import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import cartReducer from '../slices/cartSlice';
import { cartApi } from '../slices/cartApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware)
});

setupListeners(store.dispatch);

export default store;

