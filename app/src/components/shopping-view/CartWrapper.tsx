import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./CartItemsContent";

// Define the types for the cart item
interface CartItem {
  productId: string;
  image: string;
  title: string;
  price: number;
  salePrice: number;
  quantity: number;
}

interface CartItemsWrapper {
  items: CartItem[]; // Array of cart items
  userID: string; // User ID
  cartId: string; // Cart ID
}

// Define the types for the props of the UserCartWrapper component
interface UserCartWrapperProps {
  cartItems: CartItemsWrapper; // Array of cart items
  setOpenCartSheet: React.Dispatch<React.SetStateAction<boolean>>; // Function to set the open cart sheet state
}

const UserCartWrapper: React.FC<UserCartWrapperProps> = ({
  cartItems,
  setOpenCartSheet,
}) => {
  const navigate = useNavigate();

  // Calculate the total cart amount
  const totalCartAmount =
    cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems.items && cartItems.items.length > 0
          ? cartItems.items.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
};

export default UserCartWrapper;
