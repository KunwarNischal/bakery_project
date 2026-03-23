/**
 * Checkout Page Component
 *
 * This page handles the entire checkout process for customers.
 * It allows users to:
 * - Fill in their billing and delivery information
 * - Choose delivery method (Local Pickup or Hatemalo Delivery)
 * - Select payment method (Cash on Delivery)
 * - Review their order summary with costs
 * - Place their order
 *
 * The page validates all form inputs, calculates delivery fees based on order total,
 * and handles free delivery for orders over ₨ 5000.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../assets/data';
import api from '../../services/api';
import { getCustomerInfo, verifyCustomer } from '../../services/api';

const Checkout = () => {
  // Get cart data, helper functions from cart context
  const { cart, subtotal, clearCart, addToast } = useCart();
  const navigate = useNavigate();
  const customerInfo = getCustomerInfo();

  // Form state to store customer's billing and delivery information
  const [form, setForm] = useState({
    firstName: '',
    country: 'Nepal',
    street: '',
    city: '',
    phone: '',
    email: '',
    notes: '',
  });

  // Track which form fields have been interacted with (for validation)
  const [touched, setTouched] = useState({});
  // Delivery method: either 'Local Pickup' or 'Hatemalo Delivery'
  const [deliveryMethod, setDeliveryMethod] = useState('Local Pickup');
  // Payment method: currently only 'Cash On Delivery' is supported
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  // Track if order is being submitted to prevent double submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate delivery fee: ₨ 0 for local pickup or orders over ₨ 5000, ₨ 300 otherwise
  const isFreeDelivery = subtotal >= 5000;
  const deliveryFee = deliveryMethod === 'Hatemalo Delivery' ? (isFreeDelivery ? 0 : 300) : 0;
  const total = subtotal + deliveryFee;

  // Store validation errors for form fields
  const [errors, setErrors] = useState({});

  // Validate entire form - checks all required fields
  const validateForm = (formData) => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Name is required';
    else if (formData.firstName.length < 2) newErrors.firstName = 'Name must be at least 2 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';

    if (!formData.city) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate individual field when user leaves the field (on blur)
  const validateField = (field, value) => {
    let errorMsg = '';
    if (field === 'firstName' && (!value || value.length < 2)) errorMsg = 'Name must be at least 2 characters';
    if (field === 'email' && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) errorMsg = 'Please enter a valid email address';
    if (field === 'phone' && (!value || !/^\d{10}/.test(value))) errorMsg = 'Please enter a valid phone number';
    if (field === 'city' && !value) errorMsg = 'City is required';

    setErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));
  };

  // Load customer's saved name and email when page loads
  useEffect(() => {
    if (customerInfo) {
      setForm(prev => ({
        ...prev,
        firstName: customerInfo.name || '',
        email: customerInfo.email || ''
      }));
    }
  }, []);

  // Check if customer is logged in when page loads, redirect to login if not
  useEffect(() => {
    const customerInfoData = getCustomerInfo();
    if (!customerInfoData) {
      navigate('/login');
      return;
    }

    if (customerInfoData.token) {
      verifyCustomer(customerInfoData.token).catch(() => {
        navigate('/login');
      });
    }
  }, [navigate]);

  // Update form field with error validation while typing
  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Mark field as touched and validate when user leaves the field
  const handleFieldBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, form[field]);
  };

  // Auto-select Hatemalo Delivery when order qualifies for free delivery (over ₨ 5000)
  useEffect(() => {
    if (isFreeDelivery) {
      setDeliveryMethod('Hatemalo Delivery');
    }
  }, [isFreeDelivery]);

  // Show empty cart message if no items
  if (cart.length === 0 && !isSubmitting) {
    return <div className="p-40 text-center font-display text-3xl">Your cart is empty</div>;
  }

  // Handle order submission - validate form, send to server, and redirect
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all form fields
    const isValid = validateForm(form);

    // Show validation errors and scroll to top if form is invalid
    if (!isValid) {
      setTouched({
        firstName: true,
        email: true,
        phone: true,
        city: true,
        street: true
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data with cart items and customer details
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image || item.icon || '/placeholder.png',
          price: item.price,
          product: item.id || item._id,
        })),
        customerDetails: {
          name: form.firstName,
          phone: form.phone,
          address: `${form.street ? form.street + ', ' : ''}${form.city}, ${form.country}`,
          email: form.email,
          notes: form.notes
        },
        deliveryMethod,
        paymentMethod,
        deliveryFee,
        totalAmount: total,
      };

      // Send order to server
      await api.post('/orders', orderData);

      // Clear cart and navigate to orders page on success
      addToast('Order placed successfully!');
      clearCart();
      setIsSubmitting(false);
      navigate('/my-orders');
    } catch (error) {
      // Handle errors - redirect to login if session expired
      if (error.response?.status === 401) {
        addToast('Session expired. Please login again.', 'error');
        navigate('/login');
      } else {
        addToast('Failed to place order. Please try again.', 'error');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 mt-10 animate-fade-in-up font-body text-dark-brown">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-3xl font-bold border-b border-gray-200 pb-4 mb-6">Billing & Delivery</h2>

          <div className="space-y-2">
            <label className="text-sm font-bold">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`w-full p-3 border rounded focus:outline-none transition-all ${errors.firstName && touched.firstName
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-light-brown focus:border-transparent'
                }`}
              value={form.firstName}
              onChange={e => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleFieldBlur('firstName')}
            />
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                ✕ {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Country / Region <span className="text-red-500">*</span></label>
            <input required readOnly type="text" className="w-full p-3 border border-gray-300 rounded bg-gray-50 focus:outline-none font-bold" value={form.country} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Street address (optional)</label>
            <input
              type="text"
              placeholder="House number and street name"
              className={`w-full p-3 border rounded focus:outline-none transition-all ${errors.street && touched.street
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-light-brown'
                }`}
              value={form.street}
              onChange={e => handleFieldChange('street', e.target.value)}
              onBlur={() => handleFieldBlur('street')}
            />
            {errors.street && touched.street && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                ✕ {errors.street}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Town / City <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`w-full p-3 border rounded focus:outline-none transition-all ${errors.city && touched.city
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-light-brown'
                }`}
              value={form.city}
              onChange={e => handleFieldChange('city', e.target.value)}
              onBlur={() => handleFieldBlur('city')}
            />
            {errors.city && touched.city && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                ✕ {errors.city}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              placeholder="e.g. 9841234567 or +977-9841234567"
              className={`w-full p-3 border rounded focus:outline-none transition-all ${errors.phone && touched.phone
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-light-brown'
                }`}
              value={form.phone}
              onChange={e => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
            />
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                ✕ {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Email address <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`w-full p-3 border rounded focus:outline-none transition-all ${errors.email && touched.email
                  ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-light-brown'
                }`}
              value={form.email}
              onChange={e => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                ✕ {errors.email}
              </p>
            )}
          </div>

          <div className="pt-6">
            <h3 className="text-xl font-bold mb-4 font-display">Additional information</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold">Order notes (optional)</label>
              <textarea rows="3" placeholder="Notes about your order, e.g. special notes for delivery." className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-light-brown outline-none transition-all" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="bg-gray-50/50 rounded-2xl p-8 border-2 border-light-brown/20 sticky top-32">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-2xl font-bold">Your order</h3>
              <div className="text-right text-[10px] uppercase tracking-widest text-primary/60 font-bold bg-white px-3 py-2 rounded-lg border border-primary/5 shadow-sm leading-relaxed">
                🚚 Free delivery<br />on orders over ₨ 5000
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 font-bold">Product</th>
                  <th className="py-3 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {cart.map(item => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-600 pr-4">{item.name} <strong className="text-dark-brown">× {item.quantity}</strong></td>
                    <td className="py-4 text-right font-bold whitespace-nowrap">₨ {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-gray-200">
                  <th className="py-4 font-bold text-gray-700">Subtotal</th>
                  <td className="py-4 text-right font-bold text-dark-brown">₨ {subtotal.toFixed(2)}</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <th className="py-4 font-bold text-gray-700 align-top">Delivery</th>
                  <td className="py-4">
                    <div className="space-y-3">
                      <label className="flex items-center justify-end gap-3 cursor-pointer group">
                        <span className="text-gray-600 group-hover:text-primary transition-colors font-bold text-sm">Local Pickup - ₨ 0</span>
                        <input type="radio" name="delivery" checked={deliveryMethod === 'Local Pickup'} onChange={() => setDeliveryMethod('Local Pickup')} className="accent-light-brown w-4 h-4 cursor-pointer" />
                      </label>

                      <label className="flex items-center justify-end gap-3 cursor-pointer group">
                        <div className="text-right">
                          <span className="block font-bold text-gray-700 group-hover:text-primary transition-colors text-sm">Hatemalo Delivery - ₨ {isFreeDelivery ? '0' : '300'}</span>
                          {isFreeDelivery && (
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded inline-block mt-1 border border-green-200">Free over ₨ 5000</span>
                          )}
                        </div>
                        <input type="radio" name="delivery" checked={deliveryMethod === 'Hatemalo Delivery'} onChange={() => setDeliveryMethod('Hatemalo Delivery')} className="accent-light-brown w-4 h-4 cursor-pointer" />
                      </label>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 font-bold text-gray-700 text-sm">Delivery Fee</th>
                  <td className="py-3 text-right font-bold text-dark-brown text-sm">₨ {deliveryFee.toFixed(2)}</td>
                </tr>

                <tr>
                  <th className="py-6 text-lg font-display font-bold">Total</th>
                  <td className="py-6 text-right text-xl font-display font-bold text-secondary">₨ {total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 relative shadow-sm">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <input type="radio" checked readOnly className="accent-light-brown w-4 h-4" /> Cash on Delivery
              </h4>
              <div className="bg-gray-50 p-4 rounded text-sm text-gray-500 mt-4 relative">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 border-t border-l border-gray-200 transform rotate-45"></div>
                Pay with cash upon delivery.
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-8">
              Your personal data will be used to process your order, support your experience throughout this website.
            </p>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-4 font-bold rounded uppercase tracking-widest text-sm shadow-md transition-colors bg-primary text-white hover:bg-secondary"
              >
                Place order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
