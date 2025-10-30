// import { useEffect, useRef, useState } from 'react';

// export const useIntersectionObserver = (options = {}) => {
//   const [isIntersecting, setIsIntersecting] = useState(false);
//   const [hasIntersected, setHasIntersected] = useState(false);
//   const targetRef = useRef(null);

//   useEffect(() => {
//     const target = targetRef.current;
//     if (!target) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       setIsIntersecting(entry.isIntersecting);
      
//       if (entry.isIntersecting) {
//         setHasIntersected(true);
//       }
//     }, options);

//     observer.observe(target);

//     return () => {
//       observer.unobserve(target);
//     };
//   }, [options]);

//   return { targetRef, isIntersecting, hasIntersected };
// };

// // ==================== EXAMPLE USAGE ====================
// /*
// // Lazy load images
// const ImageComponent = ({ src, alt }) => {
//   const { targetRef, hasIntersected } = useIntersectionObserver({
//     threshold: 0.1,
//   });

//   return (
//     <div ref={targetRef}>
//       {hasIntersected && <img src={src} alt={alt} />}
//     </div>
//   );
// };

// // Infinite scroll
// const InfiniteList = () => {
//   const { targetRef, isIntersecting } = useIntersectionObserver();

//   useEffect(() => {
//     if (isIntersecting) {
//       loadMoreItems();
//     }
//   }, [isIntersecting]);

//   return (
//     <div>
//       {items.map(item => <ItemCard key={item.id} item={item} />)}
//       <div ref={targetRef}>Loading...</div>
//     </div>
//   );
// };
// */