import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/StarRating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";

// Define types for the product and review objects
interface ProductDetails {
  _id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number;
  image: string;
  totalStock: number;
}

interface Review {
  userName: string;
  reviewValue: number;
  reviewMessage: string;
}

interface ProductDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productDetails: ProductDetails | null;
}

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}: ProductDetailsDialogProps) {
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.shopCart);
  const { reviews } = useAppSelector((state) => state.shopReview);

  function handleRatingChange(getRating: number) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId: string, getTotalStock: number) {
    let getCartItems = cartItems || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item: any) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`);

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id || "",
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id || ""));
        toast("Product is added to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id || "",
        userId: user?.id || "",
        userName: user?.name || "",
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data: any) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id || ""));
        toast("Review added successfully!");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce(
          (sum: number, reviewItem: Review) => sum + reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

  console.log(productDetails);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {/* Dialog container that manages the open state */}
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Content section styled as a responsive grid */}

        {/* Left section: Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image} // Product image URL
            alt={productDetails?.title} // Product title as alt text for accessibility
            width={600}
            height={600}
            className="aspect-square w-full object-cover" // Maintain aspect ratio and fill the container
          />
        </div>

        {/* Right section: Product details */}
        <div className="">
          {/* Product Title and Description */}
          <div>
            <h1 className="text-3xl font-extrabold">
              {productDetails?.title} {/* Display product title */}
            </h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description} {/* Display product description */}
            </p>
          </div>

          {/* Product Pricing */}
          <div className="flex items-center justify-between">
            {/* Regular price */}
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : "" // Strikethrough if there's a sale price
              }`}
            >
              ${productDetails?.price} {/* Display regular price */}
            </p>
            {/* Sale price (if applicable) */}
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice} {/* Display sale price */}
              </p>
            ) : null}
          </div>

          {/* Average Review Rating */}
          <div className="flex items-center gap-2 mt-2">
            {/* Star rating */}
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />{" "}
              {/* Display average rating */}
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)}){" "}
              {/* Display formatted average rating */}
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              // If out of stock, disable the button
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              // Add to Cart button
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id || "", // Product ID
                    productDetails?.totalStock // Total stock available
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          {/* Separator line */}
          <Separator />

          {/* Reviews Section */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                // Render a list of reviews if available
                reviews.map((reviewItem: Review) => (
                  <div className="flex gap-4" key={reviewItem.reviewMessage}>
                    {/* User Avatar */}
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}{" "}
                        {/* First letter of username */}
                      </AvatarFallback>
                    </Avatar>
                    {/* Review Content */}
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                          {reviewItem?.userName} {/* Reviewer name */}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                        {/* Display review star rating */}
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage} {/* Review message */}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback if no reviews
                <h1>No Reviews</h1>
              )}
            </div>

            {/* Add a New Review */}
            <div className="mt-10 flex-col flex gap-2">
              {/* Review label */}
              <Label>Write a review</Label>
              {/* Star rating input */}
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating} // Current rating state
                  handleRatingChange={handleRatingChange} // Callback to update rating
                />
              </div>
              {/* Review message input */}
              <Input
                name="reviewMsg"
                value={reviewMsg} // Current review message state
                onChange={(event) => setReviewMsg(event.target.value)} // Update review message
                placeholder="Write a review..."
              />
              {/* Submit Review Button */}
              <Button
                onClick={handleAddReview} // Submit review callback
                disabled={reviewMsg.trim() === ""} // Disable if review message is empty
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
