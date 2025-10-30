// import React from 'react';
// import { Loader2 } from 'lucide-react';

// const Loader = ({ 
//   size = 'md', 
//   text = 'Loading...', 
//   fullScreen = false,
//   className = '' 
// }) => {
//   const sizes = {
//     sm: 'w-6 h-6',
//     md: 'w-10 h-10',
//     lg: 'w-16 h-16',
//     xl: 'w-24 h-24',
//   };

//   const content = (
//     <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
//       <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
//       {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
//     </div>
//   );

//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
//         {content}
//       </div>
//     );
//   }

//   return content;
// };

// export default Loader;

// // Spinner only (no text)
// export const Spinner = ({ size = 'md', className = '' }) => {
//   const sizes = {
//     sm: 'w-4 h-4',
//     md: 'w-6 h-6',
//     lg: 'w-8 h-8',
//   };

//   return <Loader2 className={`${sizes[size]} animate-spin ${className}`} />;
// };