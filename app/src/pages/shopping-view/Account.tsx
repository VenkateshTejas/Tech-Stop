import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/Address";
import ShoppingOrders from "@/components/shopping-view/Orders";

interface Address {
  _id: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

// ShoppingAccount component
const ShoppingAccount: React.FC = () => {
  const techStopImage =
    "https://scontent-bos5-1.xx.fbcdn.net/v/t39.30808-6/461938670_8693280377383786_1143422129075714444_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=gs26fvJ51PwQ7kNvgGDz0S_&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=AoEjUxJcZJvpmw0F4cPuXmV&oh=00_AYBLfrJJ-q34I3bsZOGgdXDm0agE0pMMWVh4WRsX9OfkrQ&oe=67591FF4";

  const address: Address = {
    _id: "1",
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={techStopImage}
          alt="Account banner"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
