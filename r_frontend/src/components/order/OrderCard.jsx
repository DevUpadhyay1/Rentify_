// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
// import { Badge, Button } from '../common';
// import { OrderStatus } from './OrderStatus';
// import { formatDate, formatCurrency } from '../../utils';

// const OrderCard = ({ order, onCancel }) => {
//   const canCancel = order.status === 'pending';

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Item Image */}
//         <Link to={`/items/${order.item?.id}`} className="flex-shrink-0">
//           <img
//             src={order.item?.images?.[0]?.image || '/placeholder-item.jpg'}
//             alt={order.item?.name}
//             className="w-full md:w-32 h-32 object-cover rounded-lg"
//           />
//         </Link>

//         {/* Order Details */}
//         <div className="flex-1 min-w-0">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-2">
//             <div className="flex-1 min-w-0">
//               <Link to={`/items/${order.item?.id}`}>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
//                   {order.item?.name}
//                 </h3>
//               </Link>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Order #{order.id} • {order.item?.category_display}
//               </p>
//             </div>
//             <OrderStatus status={order.status} />
//           </div>

//           {/* Info Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <Calendar size={16} />
//               <div>
//                 <p className="text-xs">Start Date</p>
//                 <p className="font-medium text-gray-900 dark:text-white">
//                   {formatDate(order.start_date)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <Calendar size={16} />
//               <div>
//                 <p className="text-xs">End Date</p>
//                 <p className="font-medium text-gray-900 dark:text-white">
//                   {formatDate(order.end_date)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <Clock size={16} />
//               <div>
//                 <p className="text-xs">Duration</p>
//                 <p className="font-medium text-gray-900 dark:text-white">
//                   {order.duration} days
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <DollarSign size={16} />
//               <div>
//                 <p className="text-xs">Total</p>
//                 <p className="font-medium text-blue-600 dark:text-blue-400">
//                   {formatCurrency(order.total_price)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Owner Info */}
//           <div className="flex items-center gap-2 mb-3">
//             <img
//               src={order.item?.owner?.avatar || '/default-avatar.png'}
//               alt={order.item?.owner?.first_name}
//               className="w-6 h-6 rounded-full"
//             />
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Rented from{' '}
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {order.item?.owner?.first_name} {order.item?.owner?.last_name}
//               </span>
//             </span>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2">
//             <Link to={`/items/${order.item?.id}`}>
//               <Button variant="outline" size="sm">
//                 View Item
//               </Button>
//             </Link>
            
//             {order.status === 'completed' && !order.review && (
//               <Button variant="primary" size="sm">
//                 Write Review
//               </Button>
//             )}

//             {canCancel && (
//               <Button
//                 variant="danger"
//                 size="sm"
//                 onClick={() => onCancel(order.id)}
//               >
//                 Cancel Order
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderCard;