import { useAddToCartMutation } from "../redux/slices/cartApi";

export const useCartOperations = () => {
  const [addToCartMutation, { isLoading: isAddingToCart }] = useAddToCartMutation();
  
  const addItemToCart = async (item, restaurantId, restaurantName) => {
    try {
      await addToCartMutation({
        item,
        restaurantId,
        restaurantName
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return { success: false, error };
    }
  };
  
  return {
    addItemToCart,
    isAddingToCart
  };
};