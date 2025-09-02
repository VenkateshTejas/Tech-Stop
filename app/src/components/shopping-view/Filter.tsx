import { filterOptions, FilterOption } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

/**
 * Props for the ProductFilter component.
 */
interface ProductFilterProps {
  /** Current selected filters. */
  filters: Record<string, string[]>;

  /**
   * Callback function to handle filter changes.
   * @param filterType - The type of filter (e.g., category, brand).
   * @param filterId - The ID of the selected filter option.
   */
  handleFilter: (
    filterType: keyof typeof filterOptions,
    filterId: string
  ) => void;
}

/**
 * Renders the product filter component.
 * Displays available filter options and their checkboxes.
 */
const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  handleFilter,
}) => {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(filterOptions).map(([keyItem, options]) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {options.map((option: FilterOption) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-2"
                  >
                    <Checkbox
                      checked={
                        (filters && filters[keyItem]?.includes(option.id)) ||
                        false
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
