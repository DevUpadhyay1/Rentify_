// import React, { useEffect } from "react";
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Button from "./button";

// const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   footer,
//   size = "md",
//   closeOnOverlayClick = true,
//   showCloseButton = true,
// }) => {
//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   // Close on Escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isOpen) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [isOpen, onClose]);

//   // Size options
//   const sizes = {
//     sm: "max-w-md",
//     md: "max-w-lg",
//     lg: "max-w-2xl",
//     xl: "max-w-4xl",
//     full: "max-w-full mx-4",
//   };

//   const handleOverlayClick = (e) => {
//     if (closeOnOverlayClick && e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={handleOverlayClick}
//           />

//           {/* Modal */}
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ duration: 0.2 }}
//               className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
//             >
//               {/* Header */}
//               {(title || showCloseButton) && (
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//                   {title && (
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                       {title}
//                     </h3>
//                   )}
//                   {showCloseButton && (
//                     <button
//                       onClick={onClose}
//                       className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                     >
//                       <X size={24} />
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Body */}
//               <div className="flex-1 overflow-y-auto p-6">{children}</div>

//               {/* Footer */}
//               {footer && (
//                 <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
//                   {footer}
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;

// // ==================== USAGE EXAMPLES ====================
// /*
// import { useState } from 'react';
// import Modal from './Modal';
// import Button from './Button';

// const MyComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

//       <Modal
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         title="Confirm Action"
//         footer={
//           <>
//             <Button variant="ghost" onClick={() => setIsOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="danger" onClick={handleDelete}>
//               Delete
//             </Button>
//           </>
//         }
//       >
//         <p>Are you sure you want to delete this item?</p>
//       </Modal>
//     </>
//   );
// };
// */
