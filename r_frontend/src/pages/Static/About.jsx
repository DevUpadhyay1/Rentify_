// import React, { useState } from "react";
// import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
// import { Card, Button, Input, Textarea, Alert } from "../../components/common";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const contactInfo = [
//     {
//       icon: <Mail size={24} />,
//       title: "Email",
//       value: "support@rentify.com",
//       link: "mailto:support@rentify.com",
//       color: "text-blue-600",
//       bg: "bg-blue-50 dark:bg-blue-900/20",
//     },
//     {
//       icon: <Phone size={24} />,
//       title: "Phone",
//       value: "+91 9876543210",
//       link: "tel:+919876543210",
//       color: "text-green-600",
//       bg: "bg-green-50 dark:bg-green-900/20",
//     },
//     {
//       icon: <MapPin size={24} />,
//       title: "Address",
//       value: "123 Tech Park, Mumbai, India",
//       link: null,
//       color: "text-purple-600",
//       bg: "bg-purple-50 dark:bg-purple-900/20",
//     },
//     {
//       icon: <Clock size={24} />,
//       title: "Business Hours",
//       value: "Mon-Fri: 9AM-6PM IST",
//       link: null,
//       color: "text-orange-600",
//       bg: "bg-orange-50 dark:bg-orange-900/20",
//     },
//   ];

//   const faqs = [
//     {
//       question: "How do I list an item for rent?",
//       answer:
//         'Sign up, click "Add Item", upload photos, set your price, and publish!',
//     },
//     {
//       question: "Is my payment secure?",
//       answer:
//         "Yes! All payments are encrypted and processed through secure payment gateways.",
//     },
//     {
//       question: "What if an item is damaged?",
//       answer:
//         "All rentals are insured. Report damage immediately, and our team will assist.",
//     },
//     {
//       question: "How do I contact a seller?",
//       answer: 'Click "Message Owner" on any item page to start a conversation.',
//     },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name?.trim()) newErrors.name = "Name is required";
//     if (!formData.email?.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Invalid email";
//     if (!formData.subject?.trim()) newErrors.subject = "Subject is required";
//     if (!formData.message?.trim()) newErrors.message = "Message is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     setLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setSuccess(true);
//       setFormData({ name: "", email: "", subject: "", message: "" });

//       setTimeout(() => setSuccess(false), 5000);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
//         <div className="container-custom text-center">
//           <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
//           <p className="text-xl text-blue-100">
//             Have questions? We'd love to hear from you.
//           </p>
//         </div>
//       </section>

//       {/* Contact Info Cards */}
//       <section className="py-12">
//         <div className="container-custom">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {contactInfo.map((info, index) => (
//               <Card key={index} padding="lg" hover className="text-center">
//                 <div
//                   className={`${info.bg} ${info.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}
//                 >
//                   {info.icon}
//                 </div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
//                   {info.title}
//                 </h3>
//                 {info.link ? (
//                   <a
//                     href={info.link}
//                     className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                   >
//                     {info.value}
//                   </a>
//                 ) : (
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {info.value}
//                   </p>
//                 )}
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Form & Map */}
//       <section className="py-12">
//         <div className="container-custom">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Contact Form */}
//             <Card padding="lg">
//               <div className="flex items-center gap-2 mb-6">
//                 <MessageCircle className="text-blue-600" size={24} />
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   Send us a Message
//                 </h2>
//               </div>

//               {success && (
//                 <Alert
//                   type="success"
//                   message="Thank you! We'll get back to you soon."
//                   dismissible
//                   onClose={() => setSuccess(false)}
//                   className="mb-6"
//                 />
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <Input
//                   label="Your Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="John Doe"
//                   error={errors.name}
//                   required
//                   fullWidth
//                 />

//                 <Input
//                   label="Email Address"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="john@example.com"
//                   error={errors.email}
//                   required
//                   fullWidth
//                 />

//                 <Input
//                   label="Subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   placeholder="How can we help?"
//                   error={errors.subject}
//                   required
//                   fullWidth
//                 />

//                 <Textarea
//                   label="Message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Tell us more about your inquiry..."
//                   rows={6}
//                   maxLength={1000}
//                   showCount
//                   error={errors.message}
//                   required
//                   fullWidth
//                 />

//                 <Button
//                   type="submit"
//                   fullWidth
//                   size="lg"
//                   loading={loading}
//                   disabled={loading}
//                   icon={<Send size={18} />}
//                 >
//                   Send Message
//                 </Button>
//               </form>
//             </Card>

//             {/* Map & FAQs */}
//             <div className="space-y-6">
//               {/* Map */}
//               <Card padding="none" className="overflow-hidden">
//                 <div className="h-64 bg-gray-200 dark:bg-gray-700">
//                   <iframe
//                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709658!3d19.082502005621423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
//                     width="100%"
//                     height="100%"
//                     style={{ border: 0 }}
//                     allowFullScreen=""
//                     loading="lazy"
//                     title="Office Location"
//                   ></iframe>
//                 </div>
//               </Card>

//               {/* FAQs */}
//               <Card padding="lg">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//                   Frequently Asked Questions
//                 </h3>
//                 <div className="space-y-4">
//                   {faqs.map((faq, index) => (
//                     <div key={index}>
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
//                         {faq.question}
//                       </h4>
//                       <p className="text-gray-600 dark:text-gray-400 text-sm">
//                         {faq.answer}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-white dark:bg-gray-800">
//         <div className="container-custom text-center">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//             Need Immediate Help?
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-8">
//             Check our help center for instant answers to common questions
//           </p>
//           <Button size="lg" variant="primary">
//             Visit Help Center
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Contact;
