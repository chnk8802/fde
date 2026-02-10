import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import initSocket, { joinOrder, on, off } from "@/services/socket";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Edit2, Loader, Save } from "lucide-react";
import { fetchOrders, updateOrderStatus } from "@/services/api";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "confirmed":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "preparing":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "out_for_delivery":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderManagement() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    getCartCount, 
    updateQuantity 
  } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrder, setModalOrder] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    initSocket();

    const handleOrderUpdate = (updatedOrder: any) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    };

    on("orderUpdate", handleOrderUpdate);

    return () => {
      try {
        off("orderUpdate", handleOrderUpdate);
      } catch (err) {
        console.error("Failed to clean up socket listeners:", err);
      }
    };
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      try {
        if (Array.isArray(data)) {
          data.forEach((o: any) => {
            joinOrder(o._id);
          });
        }
      } catch (err) {
        console.error("Failed to join order rooms:", err);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const openModalEditor = (order: any) => {
    setModalOrder(order);
    setModalStatus(order.status || "");
    setModalOpen(true);
  };

  const closeModalEditor = () => {
    setModalOpen(false);
    setModalOrder(null);
    setModalStatus("");
  };

  const saveModalStatus = async () => {
    if (!modalOrder) return;
    try {
      setSavingOrderId(modalOrder._id);
      const updatedOrder = await updateOrderStatus(modalOrder._id, modalStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === modalOrder._id ? updatedOrder : order,
        ),
      );
      closeModalEditor();
    } catch (error) {
      alert("Failed to update order status");
    } finally {
      setSavingOrderId(null);
    }
  };

  const copyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (error) {
      console.error("Failed to copy order ID:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header cartCount={getCartCount()} onCartClick={() => setIsCartOpen(true)} />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage and update order statuses
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAllOrders}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-lg font-medium">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">No orders found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/")}
              >
                Back to Menu
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Order ID
                        </p>
                        <div className="flex items-center gap-2 group relative">
                          <code className="bg-muted px-2 py-0.5 rounded text-xs font-semibold">
                            {order._id.substring(0, 8)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyOrderId(order._id)}
                            className="h-6 w-6 hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Copy Full ID"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {copiedOrderId === order._id && (
                            <span className="absolute -top-6 left-0 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded shadow-sm animate-in fade-in zoom-in duration-200">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                        <div className="mr-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Status
                          </p>
                          <Badge className={getStatusBadgeColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModalEditor(order)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Customer
                        </p>
                        <p className="font-semibold truncate">
                          {order.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Phone
                        </p>
                        <p className="font-semibold">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Total
                        </p>
                        <p className="font-semibold">
                          ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Date
                        </p>
                        <p className="font-semibold text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Delivery Address
                      </p>
                      <p className="text-sm break-words">{order.address}</p>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Items
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                          {order.items.map((item: any, idx: number) => (
                            <>
                            <div key={idx} className="flex justify-between">
                              <div className="">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                              </div>
                              <span className="truncate">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-medium">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <Separator />
                            </>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={items}
        onUpdate={(id: string, delta: number) => {
          const itemInCart = items.find((i) => i._id === id);
          if (itemInCart) updateQuantity(itemInCart, delta);
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate("/"); 
        }}
      />
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Edit Order Status</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Order ID: <span className="font-mono">{modalOrder?._id}</span>
                </p>
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-input rounded-md"
                  autoFocus
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeModalEditor}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={saveModalStatus}
                  disabled={!!savingOrderId}
                >
                  {savingOrderId ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
