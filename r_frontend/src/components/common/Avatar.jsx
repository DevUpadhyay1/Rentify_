// import React from 'react';
// import { User } from 'lucide-react';
// import { getInitials, getRandomColor } from '../../utils/helpers';

// const Avatar = ({
//   src,
//   alt,
//   name,
//   size = 'md',
//   shape = 'circle',
//   status,
//   badge,
//   fallback,
//   className = '',
//   onClick,
// }) => {
//   const sizes = {
//     xs: 'w-6 h-6 text-xs',
//     sm: 'w-8 h-8 text-sm',
//     md: 'w-10 h-10 text-base',
//     lg: 'w-12 h-12 text-lg',
//     xl: 'w-16 h-16 text-xl',
//     '2xl': 'w-20 h-20 text-2xl',
//   };

//   const shapes = {
//     circle: 'rounded-full',
//     square: 'rounded-lg',
//   };

//   const statusSizes = {
//     xs: 'w-1.5 h-1.5',
//     sm: 'w-2 h-2',
//     md: 'w-2.5 h-2.5',
//     lg: 'w-3 h-3',
//     xl: 'w-3.5 h-3.5',
//     '2xl': 'w-4 h-4',
//   };

//   const statusColors = {
//     online: 'bg-green-500',
//     offline: 'bg-gray-400',
//     away: 'bg-yellow-500',
//     busy: 'bg-red-500',
//   };

//   const [imageError, setImageError] = React.useState(false);

//   const renderFallback = () => {
//     if (fallback) return fallback;
    
//     if (name) {
//       return (
//         <div
//           className={`
//             ${sizes[size]} ${shapes[shape]}
//             flex items-center justify-center
//             font-semibold text-white
//             ${getRandomColor()}
//           `}
//         >
//           {getInitials(name)}
//         </div>
//       );
//     }

//     return (
//       <div
//         className={`
//           ${sizes[size]} ${shapes[shape]}
//           flex items-center justify-center
//           bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400
//         `}
//       >
//         <User size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20} />
//       </div>
//     );
//   };

//   return (
//     <div className={`relative inline-block ${className}`}>
//       {src && !imageError ? (
//         <img
//           src={src}
//           alt={alt || name || 'Avatar'}
//           className={`
//             ${sizes[size]} ${shapes[shape]}
//             object-cover border-2 border-white dark:border-gray-800
//             ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
//           `}
//           onError={() => setImageError(true)}
//           onClick={onClick}
//         />
//       ) : (
//         <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
//           {renderFallback()}
//         </div>
//       )}

//       {/* Status indicator */}
//       {status && (
//         <span
//           className={`
//             absolute bottom-0 right-0
//             ${statusSizes[size]} ${statusColors[status]}
//             rounded-full border-2 border-white dark:border-gray-800
//           `}
//           title={status}
//         />
//       )}

//       {/* Badge (notification count) */}
//       {badge !== undefined && badge !== null && (
//         <span
//           className="
//             absolute -top-1 -right-1
//             min-w-[20px] h-5 px-1
//             flex items-center justify-center
//             bg-red-500 text-white text-xs font-bold
//             rounded-full border-2 border-white dark:border-gray-800
//           "
//         >
//           {badge > 99 ? '99+' : badge}
//         </span>
//       )}
//     </div>
//   );
// };

// export default Avatar;

// // Avatar Group Component
// export const AvatarGroup = ({ children, max = 3, size = 'md', className = '' }) => {
//   const childArray = React.Children.toArray(children);
//   const visibleChildren = childArray.slice(0, max);
//   const hiddenCount = childArray.length - max;

//   const overlapClass = {
//     xs: '-space-x-2',
//     sm: '-space-x-3',
//     md: '-space-x-4',
//     lg: '-space-x-5',
//     xl: '-space-x-6',
//     '2xl': '-space-x-7',
//   };

//   return (
//     <div className={`flex items-center ${overlapClass[size]} ${className}`}>
//       {visibleChildren.map((child, index) => (
//         <div key={index} className="ring-2 ring-white dark:ring-gray-800 rounded-full">
//           {child}
//         </div>
//       ))}
//       {hiddenCount > 0 && (
//         <Avatar
//           size={size}
//           name={`+${hiddenCount}`}
//           fallback={
//             <div className="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
//               +{hiddenCount}
//             </div>
//           }
//         />
//       )}
//     </div>
//   );
// };

// // ==================== USAGE ====================
// /*
// // Basic
// <Avatar src="/user.jpg" alt="John Doe" />

// // With initials fallback
// <Avatar name="John Doe" />

// // With status
// <Avatar src="/user.jpg" status="online" />

// // With notification badge
// <Avatar src="/user.jpg" badge={5} />

// // Different sizes
// <Avatar src="/user.jpg" size="xs" />
// <Avatar src="/user.jpg" size="2xl" />

// // Square shape
// <Avatar src="/user.jpg" shape="square" />

// // Avatar Group
// <AvatarGroup max={3}>
//   <Avatar src="/user1.jpg" />
//   <Avatar src="/user2.jpg" />
//   <Avatar src="/user3.jpg" />
//   <Avatar src="/user4.jpg" />
// </AvatarGroup>
// */