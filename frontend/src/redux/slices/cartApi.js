import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/order",
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (restaurantId) => ({
        url: "/cart",
        params: restaurantId ? { restaurantId } : undefined,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: "/cart",
        method: "POST",
        body: cartItem,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (index) => ({
        url: `/cart/${index}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),

    updateQuantity: builder.mutation({
      query: ({ index, quantity }) => ({
        url: `/cart/${index}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
  useClearCartMutation,
} = cartApi;
