// import { useState, useCallback } from "react";

// export const useToggle = (initialValue = false) => {
//   const [value, setValue] = useState(initialValue);

//   const toggle = useCallback(() => {
//     setValue((v) => !v);
//   }, []);

//   const setTrue = useCallback(() => {
//     setValue(true);
//   }, []);

//   const setFalse = useCallback(() => {
//     setValue(false);
//   }, []);

//   return [value, toggle, setTrue, setFalse];
// };

// // ==================== EXAMPLE USAGE ====================
// /*
// // Modal visibility
// const [isOpen, toggleModal, openModal, closeModal] = useToggle(false);

// // Sidebar
// const [isSidebarOpen, toggleSidebar] = useToggle(true);

// // Usage:
// <button onClick={openModal}>Open Modal</button>
// <button onClick={closeModal}>Close Modal</button>
// <button onClick={toggleModal}>Toggle Modal</button>
// */
