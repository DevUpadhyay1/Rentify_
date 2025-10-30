import { lazy } from "react";

// ==================== HOME ====================
const LandingPage = lazy(() => import("../components/main/LandingPage"));

// ==================== AUTH ====================
const Login = lazy(() => import("../components/auth/Login"));
const EmailVerification = lazy(() =>
  import("../components/auth/EmailVerification")
);
const EmailVerifiedSuccess = lazy(() =>
  import("../components/auth/EmailVerifiedSuccess")
);
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"));

// ==================== ITEMS ====================
const Product = lazy(() => import("../components/items/Product"));
const ItemDetail = lazy(() => import("../components/items/ItemDetail"));
const AddItem = lazy(() => import("../components/items/AddItem"));
const EditItem = lazy(() => import("../components/items/EditItem"));
const Favorite = lazy(() => import("../components/items/Favorite"));

// ==================== USER/DASHBOARD ====================
const Profile = lazy(() => import("../components/User/Profile"));
const MyRentals = lazy(() => import("../components/User/MyRentals"));
const ProductRent = lazy(() => import("../components/User/ProductRent"));
const MyReviews = lazy(() => import("../components/User/MyReviews"));
const PendingReviews = lazy(() => import("../components/User/PendingReviews"));

// ==================== ORDER ====================
const OrderManagement = lazy(() =>
  import("../components/order/OrderManagement")
);
const BillingPayment = lazy(() => import("../components/order/BillingPayment"));

// ==================== STATIC PAGES ====================
const About = lazy(() => import("../components/common/About"));
const Contact = lazy(() => import("../components/common/Contact"));

// ==================== ERROR ====================
const NotFound = lazy(() => import("../pages/Error/NotFound"));

// ==================== ROUTE CONFIGURATION ====================
export const routeConfig = {
  // Public routes (accessible to everyone)
  public: [
    {
      path: "/",
      element: LandingPage,
      title: "Home - Rentify",
      description: "Rent anything, anytime - Your trusted rental marketplace",
    },
    {
      path: "/about",
      element: About,
      title: "About Us - Rentify",
      description: "Learn more about Rentify",
    },
    {
      path: "/contact",
      element: Contact,
      title: "Contact - Rentify",
      description: "Get in touch with us",
    },
    {
      path: "/products",
      element: Product,
      title: "Browse Products - Rentify",
      description: "Browse all available items for rent",
    },
    {
      path: "/items/:id",
      element: ItemDetail,
      title: "Item Details - Rentify",
      description: "View item details and reviews",
    },
  ],

  // Auth routes (redirect to home if already logged in)
  auth: [
    {
      path: "/login",
      element: Login,
      title: "Login - Rentify",
      description: "Login to your Rentify account",
    },
    {
      path: "/verify-email",
      element: EmailVerification,
      title: "Verify Email - Rentify",
      description: "Verify your email address",
    },
    {
      path: "/verify-email/:uidb64/:token",
      element: EmailVerifiedSuccess,
      title: "Email Verified - Rentify",
      description: "Email verification successful",
    },
    {
      path: "/auth/verify-email/:uidb64/:token",
      element: EmailVerifiedSuccess,
      title: "Email Verified - Rentify",
      description: "Email verification successful",
    },
    {
      path: "/forgot-password",
      element: ForgotPassword,
      title: "Forgot Password - Rentify",
      description: "Reset your password",
    },
    {
      path: "/reset-password/:uidb64/:token",
      element: ResetPassword,
      title: "Reset Password - Rentify",
      description: "Create a new password",
    },
  ],

  // Protected routes (require authentication)
  protected: [
    // User Profile & Management
    {
      path: "/profile",
      element: Profile,
      title: "My Profile - Rentify",
      description: "Manage your profile",
    },
    {
      path: "/dashboard/my-listings",
      element: MyRentals,
      title: "My Listings - Rentify",
      description: "Manage your rental listings",
    },
    {
      path: "/my-rentals", // Keep old route for backward compatibility
      element: MyRentals,
      title: "My Rentals - Rentify",
      description: "View your rentals",
    },

    // Item Management
    {
      path: "/items/add",
      element: AddItem,
      title: "Add New Item - Rentify",
      description: "List a new item for rent",
    },
    {
      path: "/items/:id/edit",
      element: EditItem,
      title: "Edit Item - Rentify",
      description: "Edit your item listing",
    },
    {
      path: "/items/:id/rent",
      element: ProductRent,
      title: "Rent Item - Rentify",
      description: "Rent this item",
      useParams: true, // Flag to indicate this route needs params
    },

    // Wishlist
    {
      path: "/favorite",
      element: Favorite,
      title: "My Wishlist - Rentify",
      description: "View your saved items",
    },

    // Orders
    {
      path: "/orders",
      element: OrderManagement,
      title: "My Orders - Rentify",
      description: "Manage your rental orders",
    },

    // Billing
    {
      path: "/billing/:billId",
      element: BillingPayment,
      title: "Payment - Rentify",
      description: "Complete your payment",
      useParams: true,
    },

    // Reviews
    {
      path: "/reviews",
      element: MyReviews,
      title: "My Reviews - Rentify",
      description: "View your reviews",
    },
    {
      path: "/reviews/pending",
      element: PendingReviews,
      title: "Pending Reviews - Rentify",
      description: "Write pending reviews",
    },
  ],
};

export { NotFound };
