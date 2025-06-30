'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const sections = [
  { key: 'products', label: 'محصولات', icon: '🛒' },
  { key: 'order', label: 'سفارش‌ها', icon: '📄' },
  { key: 'wallet', label: 'کیف پول', icon: '💰' },
];

const fakeBalance = 200000;

const fontUrl = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap';

const categoryIcons: Record<string, string> = {
  'شوینده': '🧴',
  'آرایشی': '💄',
  'غذایی': '🍚',
};

const userPlan = {
  plan_id: 'planA',
  name: 'پلن عمده‌فروشی A',
  profit_percent: 12,
  products: [
    { product_id: '12345', special_price: 90000 },
    { product_id: '67890', special_price: 48000 },
  ],
};

const SkeletonCard = () => (
  <div className="card p-4 shadow border-0 rounded-5 mb-4" style={{ background: '#f3f3f3', minHeight: 140, boxShadow: '0 4px 24px #ffd6e0', opacity: 0.7 }}>
    <div className="d-flex align-items-center justify-content-between mb-2">
      <div style={{ width: 120, height: 24, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: 8, animation: 'skeleton 1.2s infinite linear' }}></div>
      <div style={{ width: 56, height: 56, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: '50%', animation: 'skeleton 1.2s infinite linear' }}></div>
    </div>
    <div style={{ width: 80, height: 20, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: 8, marginBottom: 8, animation: 'skeleton 1.2s infinite linear' }}></div>
    <div style={{ width: 100, height: 16, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: 8, marginBottom: 6, animation: 'skeleton 1.2s infinite linear' }}></div>
    <div style={{ width: 80, height: 16, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: 8, marginBottom: 6, animation: 'skeleton 1.2s infinite linear' }}></div>
    <div style={{ width: 120, height: 16, background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', borderRadius: 8, marginBottom: 6, animation: 'skeleton 1.2s infinite linear' }}></div>
  </div>
);

export default function MobileView() {
  const [active, setActive] = useState<'categories' | 'products' | 'order' | 'wallet'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('خطا در دریافت محصولات');
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (orderError) {
      const timer = setTimeout(() => setOrderError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderError]);

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setActive('products');
  };

  const handleBack = () => {
    setActive('categories');
    setSelectedCategory(null);
    setOrderError(null);
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, value) }));
  };

  const isValidQuantity = (qty: number) => Number.isInteger(qty) && qty > 0;

  const handleAddOrder = (product: any) => {
    setOrderError(null);
    if (!product.is_active) {
      setOrderError('این محصول در حال حاضر موجود نیست.');
      return;
    }
    const qty = quantities[product.product_id] || 1;
    if (!isValidQuantity(qty)) {
      setOrderError('تعداد وارد شده معتبر نیست.');
      return;
    }
    if (qty > (product.stock || 0)) {
      setOrderError('تعداد درخواستی بیشتر از موجودی انبار است.');
      return;
    }
    if (orders.some((o) => o.product_id === product.product_id)) {
      setOrderError('این محصول قبلاً به سفارش اضافه شده است.');
      return;
    }
    setOrders((prev) => [...prev, { ...product, quantity: qty }]);
    setQuantities((prev) => ({ ...prev, [product.product_id]: 1 }));
  };

  const handleOrderQuantityChange = (idx: number, value: number) => {
    setOrders((prev) => {
      const updated = [...prev];
      const order = updated[idx];
      if (!order) return prev;
      const newQty = Math.max(1, Math.min(order.stock || 1, value));
      updated[idx] = { ...order, quantity: newQty };
      return updated;
    });
  };

  return (
    <>
      <Head>
        <link href={fontUrl} rel="stylesheet" />
      </Head>
      <div dir="rtl" className="container-fluid p-0" style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', fontFamily: 'Vazirmatn, Tahoma, Arial' }}>
        <div className="p-3 pb-5" style={{ minHeight: '90vh' }}>
          {active === 'categories' && (
            <>
              <h5 className="text-end mb-4 fw-bold" style={{ fontSize: 22 }}>دسته‌بندی محصولات</h5>
              {loading && <div className="text-center my-4">در حال بارگذاری...</div>}
              {error && <div className="alert alert-danger text-end" style={{ fontSize: 15 }}>{error}</div>}
              <div className="row g-4">
                {categories.map((cat) => (
                  <div className="col-12 col-sm-6" key={cat}>
                    <button
                      className="w-100 border-0 shadow-sm rounded-4 d-flex flex-column align-items-center justify-content-center px-0 py-4 category-card"
                      style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #ffe5d0 100%)', color: '#d35400', fontWeight: 700, fontSize: 18, fontFamily: 'Vazirmatn', letterSpacing: 0.5, boxShadow: '0 2px 8px #ffd6e0', transition: 'transform 0.1s, box-shadow 0.1s' }}
                      onClick={() => handleCategorySelect(cat)}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{ fontSize: 48, marginBottom: 8 }}>{categoryIcons[cat] || '📂'}</span>
                      <span style={{ fontSize: 20, fontWeight: 700 }}>{cat}</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {active === 'products' && selectedCategory && (
            <>
              <div className="d-flex align-items-center mb-3">
                <button className="btn btn-link text-secondary px-2 py-0 ms-2" style={{ fontSize: 22 }} onClick={handleBack}>&larr;</button>
                <h5 className="fw-bold mb-0" style={{ fontSize: 20 }}>{selectedCategory}</h5>
              </div>
              <div className="mb-3 d-flex flex-column align-items-end">
                <span className="fw-bold" style={{ fontSize: 18, color: '#222', textShadow: '0 1px 4px #fff7e6' }}>{userPlan.name}</span>
                <span className="badge bg-info text-dark mt-1" style={{ fontSize: 13 }}>درصد سود: {userPlan.profit_percent}%</span>
              </div>
              {orderError && <div className="alert alert-warning text-end" style={{ fontSize: 15 }}>{orderError}</div>}
              <div className="row g-3">
                {loading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  <>
                    {products.filter((p) => p.category === selectedCategory).length === 0 && <div className="text-center">محصولی در این دسته‌بندی یافت نشد.</div>}
                    {products.filter((p) => p.category === selectedCategory).map((p) => {
                      const planProduct = userPlan.products.find(pr => pr.product_id === p.product_id);
                      const showSpecial = !!planProduct;
                      return (
                        <div className="col-12" key={p.product_id}>
                          <div className="card p-4 shadow border-0 rounded-5 mb-4 d-flex flex-column justify-content-center" style={{ background: '#fff', minHeight: 140, boxShadow: '0 4px 24px #ffd6e0' }}>
                            <div className="fw-bold mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: 20, color: '#222' }}>
                              {p.name}
                              <span style={{ fontSize: 44, color: '#ffb347', background: '#fff7e6', borderRadius: '50%', padding: 12, boxShadow: '0 2px 8px #ffe5d0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 56, minHeight: 56 }}>{categoryIcons[p.category] || '📂'}</span>
                            </div>
                            <div className="mb-1">
                              {showSpecial ? (
                                <>
                                  <span className="badge rounded-pill ms-2" style={{ background: 'linear-gradient(90deg, #ffb347 0%, #ff7e5f 100%)', color: '#fff', fontSize: 15, fontWeight: 700, padding: '6px 16px' }}>
                                    قیمت پلنی: {planProduct.special_price.toLocaleString()} تومان
                                  </span>
                                  <span className="text-decoration-line-through text-muted" style={{ fontSize: 14, marginRight: 8 }}>
                                    {p.base_price?.toLocaleString()} تومان
                                  </span>
                                </>
                              ) : (
                                <span className="badge rounded-pill" style={{ background: 'linear-gradient(90deg, #ffb347 0%, #ff7e5f 100%)', color: '#fff', fontSize: 15, fontWeight: 700, padding: '6px 16px' }}>
                                  {p.base_price?.toLocaleString()} تومان
                                </span>
                              )}
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-2" style={{ minHeight: 48 }}>
                              <div className="flex-grow-1 text-end pe-2">
                                <div className="mb-1" style={{ color: '#888', fontSize: 13 }}><b>برند:</b> {p.brand}</div>
                                <div className="mb-1" style={{ color: '#888', fontSize: 13 }}><b>واحد:</b> {p.unit}</div>
                                {p.pack_size && (
                                  <div className="mb-1" style={{ color: '#888', fontSize: 13 }}><b>تعداد در هر {p.unit}:</b> {p.pack_size}</div>
                                )}
                              </div>
                            </div>
                            <div className="d-flex align-items-center my-3 justify-content-end" style={{ gap: 10 }}>
                              <button className="btn btn-light px-2 py-1 rounded-pill border-0" style={{ fontSize: 20, background: '#f8fafc' }} onClick={() => handleQuantityChange(p.product_id, (quantities[p.product_id] || 1) - 1)}>-</button>
                              <input
                                type="number"
                                min={1}
                                value={quantities[p.product_id] || 1}
                                onChange={e => handleQuantityChange(p.product_id, parseInt(e.target.value) || 1)}
                                style={{ width: 60, height: 44, textAlign: 'center', borderRadius: 16, border: '2px solid #ffb347', fontWeight: 700, fontSize: 20, background: '#fff', color: '#ff5e62', boxShadow: '0 1px 4px #ffd6e0' }}
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                              <button className="btn btn-light px-2 py-1 rounded-pill border-0" style={{ fontSize: 20, background: '#f8fafc' }} onClick={() => handleQuantityChange(p.product_id, (quantities[p.product_id] || 1) + 1)}>+</button>
                            </div>
                            <button
                              className="btn rounded-pill mt-2 w-100 fw-bold"
                              style={{ fontSize: 17, background: 'linear-gradient(90deg, #ff7e5f 0%, #ffb347 100%)', color: '#fff', boxShadow: '0 2px 8px #ffd6e0', padding: '10px 0' }}
                              onClick={() => handleAddOrder(p)}
                              disabled={!isValidQuantity(quantities[p.product_id] || 1) || orders.some((o) => o.product_id === p.product_id) || (quantities[p.product_id] || 1) > (p.stock || 0)}
                            >
                              افزودن
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
          {/* سفارش‌ها */}
          {active === 'order' && (
            <div>
              <h5 className="text-end mb-4 fw-bold">📄 سفارش‌های شما</h5>
              {orders.length === 0 ? (
                <div className="alert alert-info text-end">سفارشی ثبت نشده است.</div>
              ) : (
                <>
                  <div className="list-group mb-3">
                    {orders.map((o, idx) => (
                      <div className="list-group-item d-flex align-items-center justify-content-between mb-2 rounded-4 shadow-sm border-0" style={{ background: '#fff', fontSize: 15 }} key={idx}>
                        <div className="text-end flex-grow-1">
                          <div className="fw-bold">{o.name}</div>
                          <div style={{ color: '#888', fontSize: 13 }}>
                            <b>تعداد:</b>
                            <span className="d-inline-flex align-items-center mx-2">
                              <button className="btn btn-light btn-sm px-2 py-1 rounded-pill border-0" style={{ fontSize: 16 }} onClick={() => handleOrderQuantityChange(idx, o.quantity - 1)} disabled={o.quantity <= 1}>-</button>
                              <input type="number" min={1} max={o.stock || 1} value={o.quantity} onChange={e => handleOrderQuantityChange(idx, parseInt(e.target.value) || 1)} style={{ width: 40, textAlign: 'center', borderRadius: 8, border: '1px solid #eee', fontSize: 15, margin: '0 4px' }} />
                              <button className="btn btn-light btn-sm px-2 py-1 rounded-pill border-0" style={{ fontSize: 16 }} onClick={() => handleOrderQuantityChange(idx, o.quantity + 1)} disabled={o.quantity >= (o.stock || 1)}>+</button>
                            </span>
                            <b>{o.unit}</b>
                            {' | '}<b>قیمت واحد:</b> {o.base_price?.toLocaleString()} تومان
                            {' | '}<b>جمع:</b> {(o.base_price * o.quantity).toLocaleString()} تومان
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-danger ms-2 rounded-pill" onClick={() => setOrders(orders.filter((_, i) => i !== idx))}>
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                    <span className="fw-bold" style={{ fontSize: 16 }}>جمع کل:</span>
                    <span className="badge rounded-pill" style={{ background: 'linear-gradient(90deg, #ffb347 0%, #ff7e5f 100%)', color: '#fff', fontSize: 16, fontWeight: 700, padding: '8px 20px' }}>
                      {orders.reduce((sum, o) => sum + o.base_price * o.quantity, 0).toLocaleString()} تومان
                    </span>
                  </div>
                  <button
                    className="btn rounded-pill w-100 fw-bold"
                    style={{ fontSize: 17, background: 'linear-gradient(90deg, #ff7e5f 0%, #ffb347 100%)', color: '#fff', boxShadow: '0 2px 8px #ffd6e0', padding: '12px 0' }}
                    onClick={() => {
                      setOrderError(null);
                      setTimeout(() => {
                        setOrders([]);
                        setOrderError('سفارش با موفقیت ثبت شد!');
                      }, 800);
                    }}
                  >
                    ثبت نهایی سفارش
                  </button>
                </>
              )}
            </div>
          )}
          {/* کیف پول */}
          {active === 'wallet' && (
            <div>
              <h5 className="text-end mb-4 fw-bold">💰 کیف پول</h5>
              <div className="alert alert-info text-end">اعتبار فعلی شما: {fakeBalance.toLocaleString()} تومان</div>
            </div>
          )}
        </div>
        <nav className="nav nav-pills nav-justified bg-white shadow-lg rounded-4 px-2 py-1 position-fixed bottom-0 w-100" style={{ maxWidth: 430, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, border: '1px solid #e5e7eb' }}>
          {sections.map((s) => (
            <button
              key={s.key}
              className={`nav-link border-0 bg-transparent ${
                (s.key === 'products' && (active === 'categories' || active === 'products')) || active === s.key ? 'active fw-bold text-primary' : ''
              }`}
              style={{ fontSize: 18, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {
                if (s.key === 'products') {
                  if (selectedCategory) {
                    setActive('products');
                  } else {
                    setActive('categories');
                  }
                } else if (s.key === 'order' || s.key === 'wallet') {
                  setActive(s.key as any);
                }
              }}
              type="button"
            >
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 13 }}>{s.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <style>{`
      @keyframes skeleton {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }
      `}</style>
    </>
  );
} 