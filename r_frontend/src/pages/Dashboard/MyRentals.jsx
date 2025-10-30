import React, { useState } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Loader,
  EmptyState,
  Alert,
} from "../../components/common";
import { useFetch } from "../../hooks";
import { rentalService } from "../../api";
import { formatDate, formatCurrency } from "../../utils";

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState("all"); // all, active, completed, cancelled

  const {
    data: rentals,
    loading,
    error,
  } = useFetch(() => rentalService.getUserRentals(), []);

  const filteredRentals = rentals?.filter((rental) => {
    if (activeTab === "all") return true;
    if (activeTab === "active")
      return rental.status === "pending" || rental.status === "approved";
    if (activeTab === "completed") return rental.status === "completed";
    if (activeTab === "cancelled") return rental.status === "cancelled";
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "approved":
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "gray";
    }
  };

  const tabs = [
    { key: "all", label: "All Rentals", count: rentals?.length || 0 },
    {
      key: "active",
      label: "Active",
      count:
        rentals?.filter(
          (r) => r.status === "pending" || r.status === "approved"
        ).length || 0,
    },
    {
      key: "completed",
      label: "Completed",
      count: rentals?.filter((r) => r.status === "completed").length || 0,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: rentals?.filter((r) => r.status === "cancelled").length || 0,
    },
  ];

  if (error) {
    return (
      <div className="container-custom py-12">
        <Alert
          type="error"
          title="Error loading rentals"
          message={error.message || "Failed to load your rentals"}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        My Rentals
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12">
          <Loader text="Loading rentals..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRentals?.length === 0 && (
        <EmptyState
          type="orders"
          actionLabel="Browse Items"
          onAction={() => (window.location.href = "/items")}
        />
      )}

      {/* Rentals List */}
      {!loading && filteredRentals?.length > 0 && (
        <div className="space-y-4">
          {filteredRentals.map((rental) => (
            <Card key={rental.id} hover>
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Item Image */}
                  <img
                    src={
                      rental.item?.images?.[0]?.image || "/placeholder-item.jpg"
                    }
                    alt={rental.item?.name}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {rental.item?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rental.item?.category_display}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusVariant(rental.status)}
                        icon={getStatusIcon(rental.status)}
                      >
                        {rental.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Start Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(rental.start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          End Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(rental.end_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {rental.duration} days
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Total
                        </p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(rental.total_price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/items/${rental.item?.id}`)
                        }
                      >
                        View Item
                      </Button>
                      {rental.status === "completed" && (
                        <Button variant="primary" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentals;
