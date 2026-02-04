'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { ChevronDown, ChevronUp, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/StripePaymentForm';

// 初始化 Stripe（使用 publishable key）
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type CheckoutStep = 'info' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    vatId: '',
    phone: '',
    billingAddress: '',
    billingCity: '',
    billingPostcode: '',
    billingCountry: 'NL',
    shippingAddress: '',
    shippingCity: '',
    shippingPostcode: '',
    shippingCountry: 'NL',
    sameAsBilling: true,
  });

  const subtotal = getSubtotal();
  const tax = subtotal * 0.21; // 21% VAT
  const shipping = subtotal > 100 ? 0 : 10;
  const total = getTotal();

  // 如果用户已登录，预填充表单
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        // 如果有保存的账单地址
        ...(user.billing ? {
          company: user.billing.company || prev.company,
          phone: user.billing.phone || prev.phone,
          billingAddress: user.billing.address_1 || prev.billingAddress,
          billingCity: user.billing.city || prev.billingCity,
          billingPostcode: user.billing.postcode || prev.billingPostcode,
          billingCountry: user.billing.country || prev.billingCountry,
        } : {}),
        // 如果有保存的配送地址
        ...(user.shipping?.address_1 ? {
          shippingAddress: user.shipping.address_1 || prev.shippingAddress,
          shippingCity: user.shipping.city || prev.shippingCity,
          shippingPostcode: user.shipping.postcode || prev.shippingPostcode,
          shippingCountry: user.shipping.country || prev.shippingCountry,
        } : {}),
      }));
    }
  }, [isAuthenticated, user]);

  // 检测 Bolt 环境
  const isBolt = typeof window !== 'undefined' && (
    window.location.hostname.includes('bolt.new') ||
    window.location.hostname.includes('stackblitz.com') ||
    process.env.NEXT_PUBLIC_USE_MOCK === 'true'
  );

  const getInputClassName = (fieldName: string) => {
    return `w-full px-4 py-2.5 border rounded-md transition-colors ${
      errors[fieldName]
        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
        : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
    } outline-none`;
  };

  const renderError = (fieldName: string) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
        <span className="font-medium">⚠</span> {errors[fieldName]}
      </p>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.billingAddress) newErrors.billingAddress = 'Address is required';
    if (!formData.billingCity) newErrors.billingCity = 'City is required';
    if (!formData.billingPostcode) newErrors.billingPostcode = 'Postcode is required';

    if (!formData.sameAsBilling) {
      if (!formData.shippingAddress) newErrors.shippingAddress = 'Shipping address is required';
      if (!formData.shippingCity) newErrors.shippingCity = 'Shipping city is required';
      if (!formData.shippingPostcode) newErrors.shippingPostcode = 'Shipping postcode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 创建 PaymentIntent 并进入支付步骤
  const handleContinueToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Bolt 环境：直接跳转到成功页面
    if (isBolt) {
      clearCart();
      router.push(`/checkout/success?order=MOCK${Date.now()}`);
      return;
    }

    setLoading(true);
    setPaymentError(null);

    try {
      // 创建 PaymentIntent
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.product?.name || `Product ${item.productId}`,
            price: item.product?.price || 0,
          })),
          amount: total,
          // 如果用户已登录，传递 customerId
          customerId: isAuthenticated && user?.id ? user.id : null,
          shippingAddress: formData.sameAsBilling ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.billingAddress,
            city: formData.billingCity,
            postcode: formData.billingPostcode,
            country: formData.billingCountry,
          } : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.shippingAddress,
            city: formData.shippingCity,
            postcode: formData.shippingPostcode,
            country: formData.shippingCountry,
          },
          billingAddress: {
            address: formData.billingAddress,
            city: formData.billingCity,
            postcode: formData.billingPostcode,
            country: formData.billingCountry,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            vatId: formData.vatId,
            phone: formData.phone,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to initialize payment');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error: any) {
      console.error('Payment init error:', error);
      setPaymentError(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/checkout/success');
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  // 空购物车
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center py-20">
              <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add some products to your cart before checking out.
              </p>
              <Link
                href="/store"
                className="inline-block px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // 订单摘要组件
  const OrderSummary = ({ showButton = true }: { showButton?: boolean }) => (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.product?.name || `Product ${item.productId}`} × {item.quantity}
            </span>
            <span>€{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>VAT (21%)</span>
          <span>€{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      {showButton && step === 'info' && (
        <button
          type="button"
          onClick={handleContinueToPayment}
          disabled={loading}
          className="w-full mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Continue to Payment
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* 步骤指示器 */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'info' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'info' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="font-medium">Information</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {paymentError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 左侧：表单或支付 */}
            <div className="lg:col-span-2">
              {step === 'info' ? (
                <div className="space-y-8">
                  {/* 联系信息 */}
                  <section>
                    <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={getInputClassName('email')}
                          required
                        />
                        {renderError('email')}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={getInputClassName('firstName')}
                            required
                          />
                          {renderError('firstName')}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={getInputClassName('lastName')}
                            required
                          />
                          {renderError('lastName')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={getInputClassName('phone')}
                        />
                      </div>
                    </div>
                  </section>

                  {/* 账单地址 */}
                  <section>
                    <h2 className="text-xl font-medium mb-4">Billing Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Company (Optional)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={getInputClassName('company')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">VAT ID (Optional)</label>
                        <input
                          type="text"
                          name="vatId"
                          value={formData.vatId}
                          onChange={handleChange}
                          className={getInputClassName('vatId')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Address *</label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          className={getInputClassName('billingAddress')}
                          required
                        />
                        {renderError('billingAddress')}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
                          <input
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleChange}
                            className={getInputClassName('billingCity')}
                            required
                          />
                          {renderError('billingCity')}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Postcode *</label>
                          <input
                            type="text"
                            name="billingPostcode"
                            value={formData.billingPostcode}
                            onChange={handleChange}
                            className={getInputClassName('billingPostcode')}
                            required
                          />
                          {renderError('billingPostcode')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Country *</label>
                        <select
                          name="billingCountry"
                          value={formData.billingCountry}
                          onChange={handleChange}
                          className={getInputClassName('billingCountry')}
                        >
                          <option value="NL">Netherlands</option>
                          <option value="BE">Belgium</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* 配送地址 */}
                  <section>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={(e) => setFormData(prev => ({ ...prev, sameAsBilling: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="sameAsBilling" className="text-sm font-medium">
                        Shipping address same as billing
                      </label>
                    </div>

                    {!formData.sameAsBilling && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Shipping Address *</label>
                          <input
                            type="text"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            className={getInputClassName('shippingAddress')}
                            required={!formData.sameAsBilling}
                          />
                          {renderError('shippingAddress')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
                            <input
                              type="text"
                              name="shippingCity"
                              value={formData.shippingCity}
                              onChange={handleChange}
                              className={getInputClassName('shippingCity')}
                              required={!formData.sameAsBilling}
                            />
                            {renderError('shippingCity')}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Postcode *</label>
                            <input
                              type="text"
                              name="shippingPostcode"
                              value={formData.shippingPostcode}
                              onChange={handleChange}
                              className={getInputClassName('shippingPostcode')}
                              required={!formData.sameAsBilling}
                            />
                            {renderError('shippingPostcode')}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Mobile: Continue Button */}
                  <div className="lg:hidden">
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      disabled={loading}
                      className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Continue to Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Step */
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Information
                  </button>

                  {/* 客户信息摘要 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ship to:</span>
                        <p className="font-medium">
                          {formData.billingAddress}, {formData.billingCity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment Element */}
                  {clientSecret && stripePromise ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#000000',
                            borderRadius: '8px',
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        total={total}
                      />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 右侧：订单摘要 */}
            <div className="lg:col-span-1">
              {/* Mobile: Collapsible Summary */}
              <div className="lg:hidden mb-8">
                <button
                  type="button"
                  onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                  className="w-full flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Order Summary</span>
                    <span className="text-sm text-gray-600">
                      ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">€{total.toFixed(2)}</span>
                    {orderSummaryOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {orderSummaryOpen && (
                  <div className="bg-gray-50 p-4 rounded-b-lg border border-t-0 border-gray-200">
                    <div className="space-y-2 mb-4">
                      {items.map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>
                            {item.product?.name || `Product ${item.productId}`} × {item.quantity}
                          </span>
                          <span>€{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (21%)</span>
                        <span>€{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop: Sticky Summary */}
              <div className="hidden lg:block sticky top-24">
                <OrderSummary showButton={step === 'info'} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
