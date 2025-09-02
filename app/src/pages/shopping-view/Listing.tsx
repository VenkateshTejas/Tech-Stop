import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductFilter from "@/components/shopping-view/Filter";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetail";

/**
 * Helper function to create URL search parameters from a filter parameters object.
 * This function converts an object with array values into a query string format
 * suitable for appending to a URL.
 *
 * @param filterParams - An object where keys are filter names and values are arrays of filter options.
 * @returns A string representing the query parameters in the format of `key=value&key=value&...`.
 *          If no valid filters are provided, an empty string will be returned.
 */
function createSearchParamsHelper(
  filterParams: Record<string, string[]>
): string {
  // Array to hold the query parameters in the "key=value" format
  const queryParams: string[] = [];

  // Iterate over each entry in the filterParams object
  for (const [key, value] of Object.entries(filterParams)) {
    // Check if the value is an array and has elements
    if (Array.isArray(value) && value.length > 0) {
      // Join the array elements into a single string, separated by commas
      const paramValue = value.join(",");

      // Push the query parameter in the format "key=encodedValue" to the queryParams array
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  // Return the query parameters joined by "&"
  // If no parameters were added, this will return an empty string
  return queryParams.join("&");
}

const ShoppingListing = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>("price-lowtohigh");
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const { productList, productDetails } = useAppSelector(
    (state) => state.shopProducts
  );
  const { user } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.shopCart);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the 'category' query parameter from the URL
  const categorySearchParam = searchParams.get("category");

  function handleGetProductDetails(getCurrentProductId: string) {
    console.log(getCurrentProductId);
    setOpenDetailsDialog(true);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId: string, getTotalStock: number) {
    // Access the 'items' array from cartItems
    const getCartItems = cartItems.items || []; // 'cartItems' now contains an object, so we get 'items' here

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`, {
            position: "top-center",
          });
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
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id || ""));
        toast("Product is added to cart", { position: "top-center" });
      }
    });
  }

  // useEffect to set filters and sorting from sessionStorage, if available
  useEffect(() => {
    const storedFilters = sessionStorage.getItem("filters");
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters)); // Only parse if storedFilters is not null
    } else {
      setFilters({}); // Set to an empty object if no filters are found in sessionStorage
    }
  }, [categorySearchParam]); // Effect re-runs whenever 'categorySearchParam' changes

  /**
   * This function updates the filters state when a user selects or deselects a filter option.
   * It also updates the filters in sessionStorage and the URL query parameters.
   *
   * @param getSectionId - The section ID of the filter (e.g., category, brand).
   * @param getCurrentOption - The option selected/deselected by the user.
   */
  const handleFilter = (
    getSectionId: string,
    getCurrentOption: string
  ): void => {
    let cpyFilters: Record<string, string[]> = { ...filters };

    // Find the index of the section ID in the keys of the filters object
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      // If the section ID doesn't exist in the filters, add it with the current option as its value
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption] };
    } else {
      // Find the index of the current option in the array of options for the section
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        // If the current option doesn't exist, add it
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        // If the current option exists, remove it
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    // Update the filters state with the modified copy
    setFilters(cpyFilters);

    // Save the updated filters in session storage
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));

    // Update the URL with the new filters while keeping the 'category' intact
    const queryString = createSearchParamsHelper(cpyFilters);
    setSearchParams(new URLSearchParams(queryString)); // Don't remove `category` from the URL
  };

  /**
   * This function updates the sort order state and updates the URL with the new sort option.
   *
   * @param value - The selected sort option (e.g., price-lowtohigh, price-hightolow).
   */
  const handleSort = (value: string) => {
    setSort(value);
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(queryString + `&sort=${value}`)); // Add sort to URL
  };

  /**
   * This effect hook fetches the filtered products based on the 'filters' and 'sort' state.
   * It will dispatch the `fetchAllFilteredProducts` action whenever 'filters' or 'sort' changes.
   */
  useEffect(() => {
    if ((filters && Object.keys(filters).length > 0) || sort) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters, // Passes the filter parameters (categories, brands, etc.) to the action.
          sortParams: sort, // Passes the sorting option (e.g., price or title sorting) to the action.
        })
      );
    }
  }, [dispatch, filters, sort]); // Dependency array: The effect runs whenever 'filters' or 'sort' changes

  /**
   * This effect hook ensures the 'category' query parameter remains in the URL whenever the component mounts
   * or whenever the 'categorySearchParam' changes. If a category is found, it updates the searchParams
   * accordingly, ensuring that it is always available.
   */
  useEffect(() => {
    if (categorySearchParam) {
      // Ensure the 'category' is always in the URL
      setSearchParams(new URLSearchParams({ category: categorySearchParam }));
    }
  }, [categorySearchParam]); // Dependency array: Runs whenever 'categorySearchParam' changes

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length || "0"} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] p-2 bg-white border rounded-lg shadow-md z-10"
              >
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSort}
                  className="space-y-1 cursor-pointer"
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={sortItem.id}
                        checked={sort === sortItem.id}
                        onChange={() => setSort(sortItem.id)}
                        className="mr-2"
                      />
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList?.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              handleGetProductDetails={handleGetProductDetails}
              product={productItem}
              handleAddtoCart={handleAddtoCart}
            />
          ))}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingListing;
