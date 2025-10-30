import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, DollarSign, MapPin, User } from "lucide-react";
import { Card, Button, Input, Alert, Badge } from "../../components/common";
import { useFetch } from "../../hooks";
import { itemService } from "../../api";
import { formatCurrency, formatDate } from "../../utils";

const ProductRent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch item details
  const { data: item, loading } = useFetch(() => itemService.getById(id), [id]);

  // Calculate rental details
  const calculateRental = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) return null;

    const subtotal = days * (item?.price_per_day || 0);
    const serviceFee = subtotal * 0.1; // 10% service fee
    const securityDeposit = item?.security_deposit || 0;
    const total = subtotal + serviceFee + securityDeposit;

    return {
      days,
      subtotal,
      serviceFee,
      securityDeposit,
      total,
    };
  };

  const rental = calculateRental();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }

      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Navigate to payment with rental data
      navigate("/payment", {
        state: {
          orderData: {
            item,
            start_date: startDate,
            end_date: endDate,
            duration: rental.days,
            subtotal: rental.subtotal,
            service_fee: rental.serviceFee,
            security_deposit: rental.securityDeposit,
            total_price: rental.total,
          },
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container-custom py-12">
        <Alert type="error" message="Item not found" />
      </div>
    );
  }

  return (
    <div className="container-custom max-w-6xl py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Rent This Item
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Rental Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) {
                      setErrors((prev) => ({ ...prev, startDate: "" }));
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  error={errors.startDate}
                  icon={<Calendar size={18} />}
                  required
                  fullWidth
                />

                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) {
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }
                  }}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  error={errors.endDate}
                  icon={<Calendar size={18} />}
                  required
                  fullWidth
                />
              </div>

              {/* Rental Summary */}
              {rental && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Rental Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Duration
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {rental.days} {rental.days === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.price_per_day)} × {rental.days}{" "}
                        days
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(rental.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Service Fee (10%)
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(rental.serviceFee)}
                      </span>
                    </div>
                    {rental.securityDeposit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Security Deposit
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(rental.securityDeposit)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {formatCurrency(rental.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <Alert
                type="info"
                message="By proceeding, you agree to our rental terms and conditions"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={!rental}
                icon={<DollarSign size={18} />}
              >
                Proceed to Payment
              </Button>
            </form>
          </Card>
        </div>

        {/* Item Summary */}
        <div>
          <Card padding="lg" className="sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Item Details
            </h2>

            {/* Item Image */}
            <img
              src={item.images?.[0]?.image || "/placeholder-item.jpg"}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            {/* Item Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <Badge variant="primary">{item.category_display}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign size={16} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.price_per_day)}
                </span>
                <span>per day</span>
              </div>

              {item.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
              )}

              {/* Owner Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Rented by
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={item.owner?.avatar || "/default-avatar.png"}
                    alt={item.owner?.first_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.owner?.first_name} {item.owner?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Member since{" "}
                      {new Date(item.owner?.date_joined).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductRent;
