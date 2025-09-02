import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux-helper";

const PaypalReturnPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const currentOrderId = sessionStorage.getItem("currentOrderId");
      const orderId = currentOrderId ? JSON.parse(currentOrderId) : null;

      if (orderId) {
        dispatch(capturePayment({ paymentId, payerId, orderId })).then(
          (data: any) => {
            if (data?.payload?.success) {
              sessionStorage.removeItem("currentOrderId");
              window.location.href = "/shop/payment-success";
            }
          }
        );
      }
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PaypalReturnPage;
