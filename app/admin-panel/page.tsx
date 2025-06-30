'use client';
import React, { useState, useEffect } from 'react';

const sections = [
  { key: 'products', label: 'محصولات', icon: '🛒' },
  { key: 'plan', label: 'پلن‌ها', icon: '💎' },
  { key: 'inventory', label: 'موجودی', icon: '📦' },
  { key: 'wallet', label: 'کیف پول', icon: '💰' },
  { key: 'orders', label: 'سفارش‌ها', icon: '📄' },
];

const sampleOrders = [
  {
    order_id: 'ORD-1001',
    customer: 'مشتری تست',
    status: 'در انتظار',
    items: [
      { name: 'دستمال کاغذی کلین‌آپ', quantity: 2, unit: 'کارتن', price: 94750 },
      { name: 'مایع سفیدکننده تاژ', quantity: 1, unit: 'بطری', price: 50000 },
    ],
  },
  {
    order_id: 'ORD-1002',
    customer: 'مشتری تست',
    status: 'تایید شده',
    items: [
      { name: 'شامپو مو صحت', quantity: 3, unit: 'بطری', price: 85000 },
    ],
  },
];

const samplePlans = [
  {
    plan_id: 'planA',
    name: 'پلن عمده‌فروشی A',
    profit_percent: 12,
    products: [
      { product_id: '12345', name: 'دستمال کاغذی کلین‌آپ', special_price: 90000 },
      { product_id: '67890', name: 'مایع سفیدکننده تاژ', special_price: 48000 },
    ],
  },
  {
    plan_id: 'planB',
    name: 'پلن ویژه سوپرمارکت',
    profit_percent: 8,
    products: [
      { product_id: '12345', name: 'دستمال کاغذی کلین‌آپ', special_price: 92000 },
      { product_id: '13579', name: 'شامپو مو صحت', special_price: 83000 },
    ],
  },
];

export default function AdminPanel() {
  const [active, setActive] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('همه');
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [plans, setPlans] = useState(samplePlans);

  useEffect(() => {
    if (active === 'products') {
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
    }
    if (active === 'inventory') {
      setInventoryLoading(true);
      setInventoryError(null);
      fetch('/api/products')
        .then((res) => {
          if (!res.ok) throw new Error('خطا در دریافت محصولات');
          return res.json();
        })
        .then((data) => setInventory(data))
        .catch((err) => setInventoryError(err.message))
        .finally(() => setInventoryLoading(false));
    }
  }, [active]);

  const filteredOrders = sampleOrders.filter(order => {
    const matchesSearch =
      order.order_id.includes(orderSearch) ||
      order.customer.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'همه' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir="rtl" className="container-fluid p-0" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffe5d0 0%, #ffd6e0 100%)', fontFamily: 'Vazirmatn, Tahoma, Arial' }}>
      <div className="row g-0" style={{ minHeight: '100vh' }}>
        {/* Right-side menu */}
        <div className="col-12 col-md-3 col-lg-2 bg-white shadow-sm d-flex flex-column align-items-end p-0" style={{ borderLeft: '1px solid #f3f4f6', minHeight: '100vh' }}>
          <nav className="nav flex-column w-100 pt-4">
            {sections.map((s) => (
              <button
                key={s.key}
                className={`nav-link text-end px-4 py-3 border-0 bg-transparent ${active === s.key ? 'active fw-bold text-primary' : ''}`}
                style={{ fontSize: 18, borderRadius: '2rem 0 0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                onClick={() => setActive(s.key)}
                type="button"
              >
                <span style={{ fontSize: 22, marginLeft: 10 }}>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* Main content */}
        <div className="col-12 col-md-9 col-lg-10 p-4" style={{ minHeight: '100vh' }}>
          {active === 'products' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">🛒 مدیریت محصولات</h4>
              {loading && <div className="text-center my-4">در حال بارگذاری...</div>}
              {error && <div className="alert alert-danger text-end">{error}</div>}
              {!loading && !error && (
                <div className="row g-3">
                  {products.length === 0 && <div className="text-center">محصولی یافت نشد.</div>}
                  {products.map((p) => (
                    <div className="col-12 col-md-6 col-lg-4" key={p.product_id}>
                      <div className="card p-3 shadow-sm border-0 rounded-4 mb-2" style={{ background: '#fff' }}>
                        <div className="d-flex align-items-center mb-2">
                          <span style={{ fontSize: 40, marginLeft: 12 }}>🛍️</span>
                          <div className="flex-grow-1 text-end">
                            <div className="fw-bold" style={{ fontSize: 18 }}>{p.name}</div>
                            <div className="text-secondary" style={{ fontSize: 13 }}>{p.category}</div>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between align-items-center mt-2" style={{ gap: 8 }}>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>برند:</b> {p.brand}</span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>قیمت:</b> {p.base_price?.toLocaleString()} تومان</span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>واحد:</b> {p.unit}</span>
                          {p.pack_size && (
                            <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>تعداد در هر {p.unit}:</b> {p.pack_size}</span>
                          )}
                          <span className={`badge ${p.is_active ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 13 }}>
                            {p.is_active ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {active === 'plan' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">💎 مدیریت پلن‌ها و قیمت‌های اختصاصی</h4>
              <div className="row g-4">
                {plans.map((plan, idx) => (
                  <div className="col-12 col-lg-6" key={plan.plan_id}>
                    <div className="card p-4 shadow-sm border-0 rounded-4 mb-2" style={{ background: '#fff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ fontSize: 16 }}>{plan.name}</span>
                        <span className="badge bg-info text-dark" style={{ fontSize: 13 }}>درصد سود: 
                          <input type="number" min={0} max={100} value={plan.profit_percent} onChange={e => {
                            const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                            setPlans(plans => plans.map((p, i) => i === idx ? { ...p, profit_percent: val } : p));
                          }} style={{ width: 50, marginRight: 6, borderRadius: 8, border: '1px solid #eee', fontSize: 13, textAlign: 'center' }} /> %
                        </span>
                      </div>
                      <div className="mb-2">
                        <table className="table table-sm mb-0 text-end" style={{ fontSize: 14 }}>
                          <thead>
                            <tr>
                              <th>محصول</th>
                              <th>قیمت پلنی</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.products.map((prod, pidx) => (
                              <tr key={prod.product_id}>
                                <td>{prod.name}</td>
                                <td>
                                  <input type="number" min={0} value={prod.special_price} onChange={e => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    setPlans(plans => plans.map((pl, i) => i === idx ? {
                                      ...pl,
                                      products: pl.products.map((pr, j) => j === pidx ? { ...pr, special_price: val } : pr)
                                    } : pl));
                                  }} style={{ width: 90, borderRadius: 8, border: '1px solid #eee', fontSize: 14, textAlign: 'center' }} /> تومان
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-end mt-2">
                        <button className="btn btn-sm btn-primary rounded-pill" onClick={() => alert('تغییرات پلن ذخیره شد (شبیه‌سازی).')}>ذخیره پلن</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {active === 'inventory' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">📦 مدیریت موجودی</h4>
              {inventoryLoading ? (
                <div className="text-center my-4">در حال بارگذاری...</div>
              ) : inventoryError ? (
                <div className="alert alert-danger text-end">{inventoryError}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered text-end align-middle" style={{ fontSize: 15 }}>
                    <thead className="table-light">
                      <tr>
                        <th>نام محصول</th>
                        <th>دسته‌بندی</th>
                        <th>واحد</th>
                        <th>تعداد در بسته</th>
                        <th>موجودی</th>
                        <th>وضعیت</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((p, idx) => (
                        <tr key={p.product_id}>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td>{p.unit}</td>
                          <td>{p.pack_size}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              value={p.stock}
                              onChange={e => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setInventory(inv => inv.map((item, i) => i === idx ? { ...item, stock: val } : item));
                              }}
                              className="form-control form-control-sm text-center"
                              style={{ width: 80, display: 'inline-block' }}
                            />
                          </td>
                          <td>
                            <span className={`badge ${p.is_active ? 'bg-success' : 'bg-danger'}`}>{p.is_active ? 'فعال' : 'غیرفعال'}</span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-primary rounded-pill" onClick={() => alert('موجودی با موفقیت به‌روزرسانی شد (شبیه‌سازی).')}>ذخیره</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {active === 'wallet' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">💰 مدیریت کیف پول</h4>
              <div className="alert alert-info text-end">(نمایش و مدیریت تراکنش‌های کیف پول - Placeholder)</div>
            </div>
          )}
          {active === 'orders' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">📄 مدیریت سفارش‌ها</h4>
              <div className="row mb-3 g-2 align-items-end">
                <div className="col-12 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="جستجو بر اساس کد سفارش یا مشتری..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    style={{ fontSize: 15 }}
                  />
                </div>
                <div className="col-12 col-md-3">
                  <select
                    className="form-select"
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    style={{ fontSize: 15 }}
                  >
                    <option value="همه">همه وضعیت‌ها</option>
                    <option value="تایید شده">تایید شده</option>
                    <option value="در انتظار">در انتظار</option>
                    <option value="رد شده">رد شده</option>
                  </select>
                </div>
              </div>
              {filteredOrders.length === 0 ? (
                <div className="alert alert-info text-end">سفارشی یافت نشد.</div>
              ) : (
                <div className="row g-4">
                  {filteredOrders.map((order, idx) => (
                    <div className="col-12 col-lg-6" key={order.order_id}>
                      <div className="card p-4 shadow-sm border-0 rounded-4 mb-2" style={{ background: '#fff' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold" style={{ fontSize: 16 }}>کد سفارش: {order.order_id}</span>
                          <span className="badge bg-secondary" style={{ fontSize: 13 }}>{order.status}</span>
                        </div>
                        <div className="mb-2" style={{ color: '#888', fontSize: 14 }}><b>مشتری:</b> {order.customer}</div>
                        <div className="mb-2">
                          <table className="table table-sm mb-0 text-end" style={{ fontSize: 14 }}>
                            <thead>
                              <tr>
                                <th>محصول</th>
                                <th>تعداد</th>
                                <th>واحد</th>
                                <th>جمع</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.unit}</td>
                                  <td>{(item.price * item.quantity).toLocaleString()} تومان</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="fw-bold">جمع کل:</span>
                          <span className="badge bg-primary rounded-pill" style={{ fontSize: 15 }}>
                            {order.items.reduce((sum, it) => sum + it.price * it.quantity, 0).toLocaleString()} تومان
                          </span>
                        </div>
                        <div className="mt-3 text-end">
                          <label className="me-2">وضعیت:</label>
                          <select className="form-select d-inline-block w-auto" style={{ fontSize: 14 }} defaultValue={order.status}>
                            <option value="تایید شده">تایید شده</option>
                            <option value="در انتظار">در انتظار</option>
                            <option value="رد شده">رد شده</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 