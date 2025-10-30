
// const Breadcrumbs = () => {
//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);

//   return (
//     <nav className="flex items-center space-x-2 text-sm">
//       <Link to="/">Home</Link>
//       {pathnames.map((name, index) => {
//         const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//         const isLast = index === pathnames.length - 1;

//         return (
//           <React.Fragment key={name}>
//             <span>/</span>
//             {isLast ? (
//               <span className="text-gray-500">{name}</span>
//             ) : (
//               <Link to={routeTo}>{name}</Link>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </nav>
//   );
// };
