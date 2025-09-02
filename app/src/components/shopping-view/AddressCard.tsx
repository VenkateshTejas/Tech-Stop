import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

// Define the type for the address info
interface AddressInfo {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

// Define the props type for AddressCard
interface AddressCardProps {
  addressInfo: AddressInfo;
  handleDeleteAddress: (address: AddressInfo) => void;
  handleEditAddress: (address: AddressInfo) => void;
  setCurrentSelectedAddress?: (id: string | null) => void; // Change type here
  selectedId: string | null;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo._id) // Pass ID here
          : undefined
      }
      className={`cursor-pointer border-red-700 ${
        selectedId === addressInfo._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
