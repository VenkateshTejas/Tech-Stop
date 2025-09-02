import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./AdminOrderDetailsView";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

// Types for Order and OrderDetails based on the Redux slice
interface OrderItem {
  _id: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
}

interface OrderDetails extends OrderItem {
  cartItems: { title: string; quantity: number; price: number }[];
  addressInfo: { address: string; city: string; phone: string };
}

const AdminOrdersView: React.FC = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // Access the order list and order details from the Redux store
  const { orderList, orderDetails, isLoading } = useAppSelector(
    (state) => state.adminOrders
  );

  const handleFetchOrderDetails = (orderId: string) => {
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem: OrderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell>{orderItem._id}</TableCell>
                      <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${orderItem.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem._id)
                            }
                          >
                            View Details
                          </Button>
                          {orderDetails && (
                            <AdminOrderDetailsView
                              orderDetails={orderDetails}
                            />
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrdersView;
