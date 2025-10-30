import React, { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Select,
  Loader,
  EmptyState,
  Alert,
  Badge,
} from "../../components/common";
import { OrderCard } from "../../components/order";
import { useFetch } from "../../hooks";
import { orderService } from "../../api";

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("all"); // all, pending, approved, completed, cancelled
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, price_high, price_low

  // Fetch orders
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useFetch(() => orderService.getUserOrders(), []);

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    // Filter by status
    if (activeTab !== "all" && order.status !== activeTab) return false;

    // Filter by search
    if (
      searchQuery &&
      !order.item?.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort orders
  const sortedOrders = filteredOrders?.sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "price_high":
        return b.total_price - a.total_price;
      case "price_low":
        return a.total_price - b.total_price;
      default:
        return 0;
    }
  });

  const tabs = [
    {
      key: "all",
      label: "All Orders",
      icon: <Package size={16} />,
      count: orders?.length || 0,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock size={16} />,
      count: orders?.filter((o) => o.status === "pending").length || 0,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle size={16} />,
      count: orders?.filter((o) => o.status === "approved").length || 0,
    },
    {
      key: "completed",
      label: "Completed",
      icon: <CheckCircle size={16} />,
      count: orders?.filter((o) => o.status === "completed").length || 0,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: <XCircle size={16} />,
      count: orders?.filter((o) => o.status === "cancelled").length || 0,
    },
  ];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "price_low", label: "Price: Low to High" },
  ];

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancel(orderId);
      refetch();
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  if (error) {
    return (
      <div className="container-custom py-12">
        <Alert
          type="error"
          title="Error loading orders"
          message={error.message || "Failed to load your orders"}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all your rental orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {tabs.slice(1).map((tab) => (
          <Card key={tab.key} padding="md" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {tab.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tab.count}
                </p>
              </div>
              <div className="text-blue-600 dark:text-blue-400">{tab.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="mb-6" padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search orders by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              fullWidth
            />
          </div>

          {/* Sort */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            className="md:w-48"
          />
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            <Badge
              variant={activeTab === tab.key ? "secondary" : "gray"}
              size="sm"
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <Loader text="Loading orders..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedOrders?.length === 0 && (
        <EmptyState
          icon={<Package size={64} />}
          title="No orders found"
          message={
            searchQuery
              ? "No orders match your search. Try different keywords."
              : activeTab === "all"
              ? "You haven't placed any orders yet"
              : `No ${activeTab} orders`
          }
          actionLabel="Browse Items"
          onAction={() => (window.location.href = "/items")}
        />
      )}

      {/* Orders List */}
      {!loading && sortedOrders?.length > 0 && (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
