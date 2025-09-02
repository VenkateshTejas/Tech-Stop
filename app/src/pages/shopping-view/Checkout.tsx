import Address from "@/components/shopping-view/Address";
import UserCartItemsContent from "@/components/shopping-view/CartItemsContent";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";

interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
}

interface CartItems {
  items: CartItem[]; // Array of cart items,
  userID: string;
  _id: string;
}

interface AddressInfo {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
}

function ShoppingCheckout() {
  const { cartItems }: { cartItems: CartItems } = useAppSelector(
    (state) => state.shopCart
  );
  const { user } = useAppSelector((state) => state.auth);
  const { approvalURL }: { approvalURL: string | null } = useAppSelector(
    (state) => state.shopOrder
  );
  const [currentSelectedAddress, setCurrentSelectedAddress] =
    useState<AddressInfo | null>(null);
  const [isPaymentStart, setIsPaymemntStart] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const techStopImage =
    "https://scontent-bos5-1.xx.fbcdn.net/v/t39.30808-6/461938670_8693280377383786_1143422129075714444_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=gs26fvJ51PwQ7kNvgGDz0S_&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=AoEjUxJcZJvpmw0F4cPuXmV&oh=00_AYBLfrJJ-q34I3bsZOGgdXDm0agE0pMMWVh4WRsX9OfkrQ&oe=67591FF4";

  console.log(currentSelectedAddress, cartItems);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.items.length === 0) {
      toast("Your cart is empty. Please add items to proceed");

      return;
    }
    if (currentSelectedAddress === null) {
      toast("Please select one address to proceed.");

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "sangam");
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={techStopImage}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress?._id}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} key={item.productId} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
