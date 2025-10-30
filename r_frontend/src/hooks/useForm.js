// import { useState, useCallback } from 'react';

// export const useForm = (initialValues = {}, onSubmit) => {
//   const [values, setValues] = useState(initialValues);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [touched, setTouched] = useState({});

//   // Handle input change
//   const handleChange = useCallback((e) => {
//     const { name, value, type, checked } = e.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   }, [errors]);

//   // Handle input blur
//   const handleBlur = useCallback((e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({
//       ...prev,
//       [name]: true,
//     }));
//   }, []);

//   // Handle form submit
//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       await onSubmit(values);
//     } catch (error) {
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [values, onSubmit]);

//   // Reset form
//   const resetForm = useCallback(() => {
//     setValues(initialValues);
//     setErrors({});
//     setTouched({});
//     setIsSubmitting(false);
//   }, [initialValues]);

//   // Set field value manually
//   const setFieldValue = useCallback((name, value) => {
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }, []);

//   // Set field error manually
//   const setFieldError = useCallback((name, error) => {
//     setErrors((prev) => ({
//       ...prev,
//       [name]: error,
//     }));
//   }, []);

//   return {
//     values,
//     errors,
//     touched,
//     isSubmitting,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     resetForm,
//     setFieldValue,
//     setFieldError,
//     setValues,
//   };
// };

// // ==================== EXAMPLE USAGE ====================
// /*
// const LoginForm = () => {
//   const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
//     { email: '', password: '' },
//     async (values) => {
//       await authService.login(values);
//     }
//   );

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         name="email"
//         value={values.email}
//         onChange={handleChange}
//       />
//       {errors.email && <span>{errors.email}</span>}
      
//       <button disabled={isSubmitting}>
//         {isSubmitting ? 'Logging in...' : 'Login'}
//       </button>
//     </form>
//   );
// };
// */