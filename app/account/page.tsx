'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Loader2, 
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
} from 'lucide-react';

interface Order {
  id: number;
  number: string;
  status: string;
  dateCreated: string;
  total: string;
  currency: string;
  paymentMethod: string;
  lineItems: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image?: string;
  }>;
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
  processing: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50', label: 'Processing' },
  'on-hold': { icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50', label: 'On Hold' },
  completed: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50', label: 'Completed' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
  refunded: { icon: <XCircle className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50', label: 'Refunded' },
  failed: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'Failed' },
  shipped: { icon: <Truck className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50', label: 'Shipped' },
};

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [authLoading, isAuthenticated, router]);

  // 获取订单
  useEffect(() => {
    if (token && activeTab === 'orders') {
      fetchOrders();
    }
  }, [token, activeTab]);

  const fetchOrders = async () => {
    if (!token) return;
    
    setIsLoadingOrders(true);
    setOrdersError('');

    try {
      const response = await fetch('/api/auth/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        setOrdersError('Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrdersError('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.displayName || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm">
              {isLoadingOrders ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">Loading orders...</p>
                </div>
              ) : ordersError ? (
                <div className="p-12 text-center">
                  <p className="text-red-600">{ordersError}</p>
                  <button
                    onClick={fetchOrders}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                  <Link
                    href="/store"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Browse Store
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                Order #{order.number}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.icon}
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.dateCreated)}
                              </span>
                              <span>{order.paymentMethod}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              €{parseFloat(order.total).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.lineItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} · €{parseFloat(item.total).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.lineItems.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{order.lineItems.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Shipping Address */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {order.billing.city}, {order.billing.country}
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-sm text-black hover:underline">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="text-gray-900">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.displayName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Username</label>
                    <p className="text-gray-900">{user?.username || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                {user?.billing?.address_1 ? (
                  <div className="space-y-2 text-gray-700">
                    <p>{user.billing.first_name} {user.billing.last_name}</p>
                    {user.billing.company && <p>{user.billing.company}</p>}
                    <p>{user.billing.address_1}</p>
                    {user.billing.address_2 && <p>{user.billing.address_2}</p>}
                    <p>{user.billing.city}, {user.billing.postcode}</p>
                    <p>{user.billing.country}</p>
                    {user.billing.phone && <p>Phone: {user.billing.phone}</p>}
                  </div>
                ) : (
                  <p className="text-gray-500">No billing address saved</p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                {user?.shipping?.address_1 ? (
                  <div className="space-y-2 text-gray-700">
                    <p>{user.shipping.first_name} {user.shipping.last_name}</p>
                    {user.shipping.company && <p>{user.shipping.company}</p>}
                    <p>{user.shipping.address_1}</p>
                    {user.shipping.address_2 && <p>{user.shipping.address_2}</p>}
                    <p>{user.shipping.city}, {user.shipping.postcode}</p>
                    <p>{user.shipping.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping address saved</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/store"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">Continue Shopping</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  <Link
                    href="/support"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">Contact Support</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
