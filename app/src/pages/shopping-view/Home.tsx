import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Apple,
  Building2,
  WatchIcon,
  Headphones,
  Smartphone,
  Laptop,
  Hand,
  Tablet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetail";
import { getFeatureImages } from "@/store/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";

// Define types for categories and brands
interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Define the categories with icons
const categoriesWithIcon: Category[] = [
  { id: "phones", label: "Phones", icon: Smartphone },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "audibles", label: "Audibles", icon: Headphones },
  { id: "accessories", label: "Accessories", icon: Hand },
  { id: "smartwatches", label: "Smart Watches", icon: WatchIcon },
  { id: "tablets", label: "Tablets", icon: Tablet },
];

interface Brand {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Define a type for the brand structure
interface Brand {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Type for React component (icon)
}

// Define the brands with icons
const brandsWithIcon: Brand[] = [
  { id: "apple", label: "Aplple", icon: Apple },
  { id: "samsung", label: "Samsung", icon: Building2 },
  { id: "Intel", label: "Intel", icon: Building2 },
  { id: "xiomi", label: "Xiomi", icon: Building2 },
  { id: "oneplus", label: "Oneplus", icon: Building2 },
  { id: "asus", label: "Asus", icon: Building2 },
];

interface Product {
  _id: string;
  image: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  totalStock: number;
}

interface FeatureImage {
  image: string;
}

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState<number>(0); // Current slide index for carousel
  const { productList, productDetails } = useAppSelector(
    (state) => state.shopProducts
  ); // Redux selector for products
  const { featureImageList } = useAppSelector((state) => state.commonFeature); // Redux selector for feature images
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false); // Dialog state for product details

  const { user } = useAppSelector((state) => state.auth); // Current user info from Redux

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Navigate to listing page based on the selected category or brand
  function handleNavigateToListingPage(
    getCurrentItem: Category | Brand,
    section: string
  ) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // Fetch product details for a given product ID
  function handleGetProductDetails(getCurrentProductId: string) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // Add the product to the cart
  function handleAddtoCart(getCurrentProductId: string) {
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

  // Open product details dialog when product details are updated
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Auto-slide the feature images every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  // Fetch all filtered products when the component mounts
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  // Fetch feature images when the component mounts
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel for feature images */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide: FeatureImage, index: number) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem: Category) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={categoryItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem: Brand) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={brandItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList
                  .slice(0, 4)
                  .map((productItem: Product) => (
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                      key={productItem._id}
                    />
                  ))
              : null}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
