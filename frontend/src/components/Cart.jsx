import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCart, selectCartCount } from "../redux/slices/cartSlice";
import { 
  useGetCartQuery, 
  useRemoveFromCartMutation, 
  useUpdateQuantityMutation,
  useClearCartMutation 
} from "../redux/slices/cartApi";
import { Trash2, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  
  // RTK Query hooks
  const { data: cartData, isLoading, isError } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateQuantityMutation();
  const [clearCart] = useClearCartMutation();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close cart when clicking outside (for mobile)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (isCartOpen && !event.target.closest('.cart-container') && !event.target.closest('.cart-button')) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, isMobile]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      updateQuantity({ index, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleOrder = () => {
    console.log("Cart items:", cart.items);
    navigate('/checkout');
    setIsCartOpen(false);
  };

  // Use cartData if available, otherwise fall back to Redux state
  const displayCart = cartData || cart;

  // Floating cart button for mobile
  const CartButton = () => (
    <button 
      onClick={toggleCart}
      className="cart-button fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg z-30 flex items-center justify-center"
    >
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-sm">
          {cartCount}
        </span>
      )}
    </button>
  );

  // Cart content
  const CartContent = () => {
    if (isLoading) return <div className="text-center py-8">Loading cart...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">Error loading cart</div>;
    
    return (
      <div className="border border-gray-300 rounded p-4 md:p-6 w-full bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">Order Summary</h2>
          <div className="flex items-center">
            {displayCart.items && displayCart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-500 text-sm hover:underline flex items-center mr-2"
              >
                <Trash2 size={16} className="mr-1" />
                <span className="hidden sm:inline">Clear Cart</span>
              </button>
            )}
            {isMobile && (
              <button onClick={toggleCart} className="text-gray-500">
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        <hr className="border-gray-300 mb-4" />

        {(!displayCart.items || displayCart.items.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Restaurant Name */}
            {displayCart.restaurantName && (
              <div className="mb-4">
                <h3 className="font-medium">{displayCart.restaurantName}</h3>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
              {displayCart.items.map((item, index) => {
                // Calculate item total price
                let itemBasePrice = item.price;
                if (item.sizePrice) itemBasePrice += item.sizePrice;
                if (item.addOnsPrices && item.addOnsPrices.length) {
                  itemBasePrice += item.addOnsPrices.reduce(
                    (sum, price) => sum + price,
                    0
                  );
                }

                return (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.size && item.size !== "Regular" && (
                          <div className="text-sm text-gray-600">
                            Size: {item.size}
                          </div>
                        )}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Add-ons: {item.addOns.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          Rs. {(itemBasePrice * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rs. {itemBasePrice.toFixed(2)} each
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>

                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity - 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus
                            size={14}
                            className={
                              item.quantity <= 1
                                ? "text-gray-300"
                                : "text-gray-600"
                            }
                          />
                        </button>
                        <span className="mx-2 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity + 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal and Fees */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {displayCart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span>Rs. {displayCart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>Rs. {displayCart.deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>Rs. {displayCart.total.toFixed(2)}</span>
            </div>

            <hr className="border-gray-300 mb-4" />

            {/* Order Button */}
            <button
              className="w-full bg-red-500 text-white py-3 rounded font-medium hover:bg-red-600 transition duration-200"
              onClick={handleOrder}
            >
              Order Now
            </button>
          </>
        )}
      </div>
    );
  };

  // For mobile: show either button or expanded cart
  if (isMobile) {
    return (
      <>
        <CartButton />
        
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center animate-fade-in">
            <div className="cart-container w-full max-h-[85vh] overflow-y-auto animate-slide-up">
              <CartContent />
            </div>
          </div>
        )}
      </>
    );
  }

  // For desktop: show the regular cart
  return (
    <div className="min-w-[360px] max-w-md">
      <CartContent />
    </div>
  );
};

export default Cart;