// import React from "react";
// import { Clock, CheckCircle, XCircle, Truck, Package } from "lucide-react";
// import { Badge } from "../common";

// const OrderStatus = ({ status, size = "md" }) => {
//   const statusConfig = {
//     pending: {
//       icon: Clock,
//       variant: "warning",
//       label: "Pending",
//     },
//     approved: {
//       icon: CheckCircle,
//       variant: "info",
//       label: "Approved",
//     },
//     in_transit: {
//       icon: Truck,
//       variant: "info",
//       label: "In Transit",
//     },
//     delivered: {
//       icon: Package,
//       variant: "success",
//       label: "Delivered",
//     },
//     completed: {
//       icon: CheckCircle,
//       variant: "success",
//       label: "Completed",
//     },
//     cancelled: {
//       icon: XCircle,
//       variant: "error",
//       label: "Cancelled",
//     },
//   };

//   const config = statusConfig[status] || statusConfig.pending;
//   const Icon = config.icon;

//   return (
//     <Badge
//       variant={config.variant}
//       size={size}
//       icon={<Icon size={size === "sm" ? 14 : 16} />}
//     >
//       {config.label}
//     </Badge>
//   );
// };

// export { OrderStatus };
