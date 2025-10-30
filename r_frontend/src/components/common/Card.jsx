// import React from 'react';

// const Card = ({
//   children,
//   className = '',
//   padding = 'md',
//   shadow = 'md',
//   rounded = 'lg',
//   border = false,
//   hover = false,
//   onClick,
//   ...props
// }) => {
//   // Padding options
//   const paddings = {
//     none: '',
//     sm: 'p-3',
//     md: 'p-4',
//     lg: 'p-6',
//     xl: 'p-8',
//   };

//   // Shadow options
//   const shadows = {
//     none: '',
//     sm: 'shadow-sm',
//     md: 'shadow-md',
//     lg: 'shadow-lg',
//     xl: 'shadow-xl',
//     card: 'shadow-card',
//   };

//   // Rounded options
//   const roundeds = {
//     none: '',
//     sm: 'rounded-sm',
//     md: 'rounded-md',
//     lg: 'rounded-lg',
//     xl: 'rounded-xl',
//     '2xl': 'rounded-2xl',
//     full: 'rounded-full',
//   };

//   const baseStyles = 'bg-white dark:bg-gray-800';
//   const borderStyle = border ? 'border border-gray-200 dark:border-gray-700' : '';
//   const hoverStyle = hover ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

//   const cardClasses = `
//     ${baseStyles}
//     ${paddings[padding]}
//     ${shadows[shadow]}
//     ${roundeds[rounded]}
//     ${borderStyle}
//     ${hoverStyle}
//     ${className}
//   `.trim();

//   return (
//     <div className={cardClasses} onClick={onClick} {...props}>
//       {children}
//     </div>
//   );
// };

// // Card Header Component
// export const CardHeader = ({ children, className = '' }) => (
//   <div className={`mb-4 ${className}`}>{children}</div>
// );

// // Card Body Component
// export const CardBody = ({ children, className = '' }) => (
//   <div className={className}>{children}</div>
// );

// // Card Footer Component
// export const CardFooter = ({ children, className = '' }) => (
//   <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
//     {children}
//   </div>
// );

// export default Card;

// // ==================== USAGE EXAMPLES ====================
// /*
// import Card, { CardHeader, CardBody, CardFooter } from './Card';

// // Basic card
// <Card>
//   <h3>Card Content</h3>
// </Card>

// // Card with sections
// <Card>
//   <CardHeader>
//     <h3 className="text-xl font-bold">Title</h3>
//   </CardHeader>
//   <CardBody>
//     <p>Content goes here</p>
//   </CardBody>
//   <CardFooter>
//     <Button>Action</Button>
//   </CardFooter>
// </Card>

// // Hoverable card
// <Card hover onClick={handleClick}>
//   Click me!
// </Card>

// // Custom styling
// <Card padding="lg" shadow="xl" rounded="2xl" border>
//   Custom card
// </Card>
// */