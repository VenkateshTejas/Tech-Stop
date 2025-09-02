import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface Product {
  _id: number | string;
  image: string;
  title: string;
  price: number;
  salePrice?: number;
}

interface AdminProductTileProps {
  product: Product;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setOpenCreateProductsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditedId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: (productId: string) => void;
}

const AdminProductTile: React.FC<AdminProductTileProps> = ({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) => {
  const handleEditClick = () => {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product._id.toString());
    setFormData(product);
  };

  const handleDeleteClick = () => {
    handleDelete(product._id.toString());
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative overflow-hidden cursor-pointer">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg transform transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>

        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product.salePrice ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product.price.toFixed(2)}
            </span>
            {product.salePrice ? (
              <span className="text-lg font-bold text-gray-600">
                ${product.salePrice.toFixed(2)}
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={handleEditClick}>Edit</Button>
          <Button onClick={handleDeleteClick} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AdminProductTile;
