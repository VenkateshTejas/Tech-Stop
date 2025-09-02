import { useEffect, useState, FormEvent } from "react";
import CommonForm from "../common/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./AddressCard";
import { toast } from "react-toastify";

// Define types for the component props
interface AddressProps {
  userId?: string; // Optional user ID, fallback to global state
  maxAddresses?: number; // Optional limit for the number of addresses
  onAddressChange?: (addresses: AddressInfo[]) => void; // Callback for when addresses change
  selectedId?: string | null; // selectedId should be a string or null (address ID)
  setCurrentSelectedAddress?: React.Dispatch<
    React.SetStateAction<string | null>
  >; // setter for selectedId (string or null)
}

// Define types for the address form data
interface AddressFormData {
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

// Define the shape of a single address object
interface AddressInfo {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

const initialAddressFormData: AddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address: React.FC<AddressProps> = ({
  userId,
  maxAddresses = 3, // Default max address limit to 3
  onAddressChange,
  selectedId,
  setCurrentSelectedAddress,
}) => {
  const [formData, setFormData] = useState<AddressFormData>(
    initialAddressFormData
  );
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { addressList } = useAppSelector((state) => state.shopAddress);

  const effectiveUserId = userId || user?.id; // Fallback to global user ID

  // Manage address add/update
  const handleManageAddress = (event: FormEvent) => {
    event.preventDefault();

    if (addressList.length >= maxAddresses && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast(`You can add a maximum of ${maxAddresses} addresses`);
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editAddress({
          userId: effectiveUserId || "",
          addressId: currentEditedId,
          formData,
        })
      ).then((data: any) => {
        if (data?.payload?.success) {
          fetchAddresses();
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast("Address updated successfully");
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: effectiveUserId || "",
        })
      ).then((data: any) => {
        if (data?.payload?.success) {
          fetchAddresses();
          setFormData(initialAddressFormData);
          toast("Address added successfully");
        }
      });
    }
  };

  // Fetch addresses
  const fetchAddresses = () => {
    if (effectiveUserId) {
      dispatch(fetchAllAddresses(effectiveUserId));
    }
  };

  // Handle deleting address
  const handleDeleteAddress = (getCurrentAddress: AddressInfo) => {
    dispatch(
      deleteAddress({
        userId: effectiveUserId || "",
        addressId: getCurrentAddress._id,
      })
    ).then((data: any) => {
      if (data?.payload?.success) {
        fetchAddresses();
        toast("Address deleted successfully");
      }
    });
  };

  // Handle editing address
  const handleEditAddress = (getCurrentAddress: AddressInfo) => {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes || "",
    });
  };

  // Check if form is valid
  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key as keyof AddressFormData].trim() !== "")
      .every((item) => item);
  };

  // Fetch address data on mount
  useEffect(() => {
    fetchAddresses();
  }, [effectiveUserId]);

  // Invoke callback on address list change
  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(addressList || []);
    }
  }, [addressList, onAddressChange]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                selectedId={singleAddressItem._id} // Pass the address ID (string)
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
