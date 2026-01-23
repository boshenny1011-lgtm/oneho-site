'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { createCheckoutSession } from '@/lib/store-api';
import Header from '@/components/Header';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    shippingMethod: 'standard',
    sameAsBilling: true,
  });

  const subtotal = getSubtotal();
  const tax = subtotal * 0.21; // 21% VAT
  const shipping = subtotal > 100 ? 0 : 10;
  const total = getTotal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除该字段的错误
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const session = await createCheckoutSession({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: formData.sameAsBilling ? {
          address: formData.billingAddress,
          city: formData.billingCity,
          postcode: formData.billingPostcode,
          country: formData.billingCountry,
        } : {
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
        shippingMethod: formData.shippingMethod,
      });

      // Bolt 环境：直接跳转到成功页面
      // 真实环境：跳转到 Stripe Checkout
      if (session.url.startsWith('/')) {
        clearCart();
        router.push(session.url);
      } else {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center py-20">
              <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
              <a href="/store" className="text-blue-600 hover:underline">
                Continue shopping
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-medium mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 左侧：表单 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 联系信息 */}
              <section>
                <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* 账单地址 */}
              <section>
                <h2 className="text-xl font-medium mb-4">Billing Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">VAT ID (Optional)</label>
                    <input
                      type="text"
                      name="vatId"
                      value={formData.vatId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                    {errors.billingAddress && <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                      {errors.billingCity && <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postcode *</label>
                      <input
                        type="text"
                        name="billingPostcode"
                        value={formData.billingPostcode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                      {errors.billingPostcode && <p className="text-red-500 text-sm mt-1">{errors.billingPostcode}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country *</label>
                    <select
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
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
                      <label className="block text-sm font-medium mb-1">Shipping Address *</label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required={!formData.sameAsBilling}
                      />
                      {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md"
                          required={!formData.sameAsBilling}
                        />
                        {errors.shippingCity && <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Postcode *</label>
                        <input
                          type="text"
                          name="shippingPostcode"
                          value={formData.shippingPostcode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md"
                          required={!formData.sameAsBilling}
                        />
                        {errors.shippingPostcode && <p className="text-red-500 text-sm mt-1">{errors.shippingPostcode}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 配送方式 */}
              <section>
                <h2 className="text-xl font-medium mb-4">Shipping Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-sm text-gray-600">€10.00 (Free over €100)</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-gray-600">€25.00</div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* 右侧：订单摘要 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.product?.name || `Product ${item.productId}`} × {item.quantity}
                      </span>
                      <span>€{(item.product?.price || 0) * item.quantity}.00</span>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
