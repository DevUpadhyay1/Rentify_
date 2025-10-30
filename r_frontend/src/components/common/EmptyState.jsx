// import React from 'react';
// import { PackageOpen, Search, FileX, ShoppingBag, Inbox } from 'lucide-react';
// import Button from './button';

// const EmptyState = ({
//   type = 'default',
//   title,
//   message,
//   icon,
//   action,
//   actionLabel,
//   onAction,
//   className = '',
// }) => {
//   const types = {
//     default: {
//       icon: <Inbox className="w-16 h-16" />,
//       title: 'No data found',
//       message: 'There is nothing to display here yet.',
//     },
//     search: {
//       icon: <Search className="w-16 h-16" />,
//       title: 'No results found',
//       message: 'Try adjusting your search or filters to find what you\'re looking for.',
//     },
//     items: {
//       icon: <PackageOpen className="w-16 h-16" />,
//       title: 'No items available',
//       message: 'Start adding items to rent them out or browse available items.',
//     },
//     orders: {
//       icon: <ShoppingBag className="w-16 h-16" />,
//       title: 'No orders yet',
//       message: 'Your rental orders will appear here once you start renting items.',
//     },
//     error: {
//       icon: <FileX className="w-16 h-16" />,
//       title: 'Something went wrong',
//       message: 'We couldn\'t load the data. Please try again later.',
//     },
//   };

//   const config = types[type] || types.default;
//   const displayIcon = icon || config.icon;
//   const displayTitle = title || config.title;
//   const displayMessage = message || config.message;

//   return (
//     <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
//       <div className="text-gray-400 dark:text-gray-600 mb-4">
//         {displayIcon}
//       </div>
      
//       <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//         {displayTitle}
//       </h3>
      
//       <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
//         {displayMessage}
//       </p>
      
//       {(action || onAction) && (
//         <div>
//           {action || (
//             <Button onClick={onAction}>
//               {actionLabel || 'Take Action'}
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmptyState;

// // ==================== USAGE ====================
// /*
// // Search results empty
// <EmptyState
//   type="search"
//   actionLabel="Clear Filters"
//   onAction={handleClearFilters}
// />

// // No items
// <EmptyState
//   type="items"
//   actionLabel="Add First Item"
//   onAction={() => navigate('/items/add')}
// />

// // No orders
// <EmptyState
//   type="orders"
//   actionLabel="Browse Items"
//   onAction={() => navigate('/items')}
// />

// // Custom
// <EmptyState
//   icon={<Heart className="w-16 h-16" />}
//   title="No favorites yet"
//   message="Start adding items to your favorites list"
//   actionLabel="Browse Items"
//   onAction={() => navigate('/items')}
// />

// // With custom action
// <EmptyState
//   type="error"
//   action={
//     <Button variant="primary" onClick={refetch}>
//       Retry
//     </Button>
//   }
// />
// */