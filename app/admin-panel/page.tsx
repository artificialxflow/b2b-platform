'use client';
import React, { useState, useEffect } from 'react';

const sections = [
  { key: 'products', label: 'محصولات', icon: '🛒' },
  { key: 'plan', label: 'پلن‌ها', icon: '💎' },
  { key: 'inventory', label: 'موجودی', icon: '📦' },
  { key: 'wallet', label: 'کیف پول', icon: '💰' },
  { key: 'orders', label: 'سفارش‌ها', icon: '📄' },
  { key: 'members', label: 'اعضا', icon: '👥' },
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

const sampleMembers = [
  { username: 'store1', plan: 'پلن عمده‌فروشی A' },
  { username: 'store2', plan: 'پلن ویژه سوپرمارکت' },
];

const samplePlans = [
  {
    plan_id: 'planA',
    name: 'پلن عمده‌فروشی A',
    discount_percent: 12,
    products: [
      { product_id: '12345', name: 'دستمال کاغذی کلین‌آپ', special_price: 90000 },
      { product_id: '67890', name: 'مایع سفیدکننده تاژ', special_price: 48000 },
    ],
  },
  {
    plan_id: 'planB',
    name: 'پلن ویژه سوپرمارکت',
    discount_percent: 8,
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
  const [productImages, setProductImages] = useState<Record<string, string[]>>({});
  const [members, setMembers] = useState(sampleMembers);
  const [newMember, setNewMember] = useState({ username: '', password: '', plan: samplePlans[0].plan_id });
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);

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
                  {products.map((p, idx) => (
                    <div className="col-12 col-md-6 col-lg-4" key={p.product_id}>
                      <div className="card p-3 shadow-sm border-0 rounded-4 mb-2" style={{ background: '#fff' }}>
                        <div className="d-flex align-items-center mb-2 justify-content-between">
                          <span className="fw-bold" style={{ fontSize: 18 }}>
                            <input
                              type="text"
                              value={p.name}
                              onChange={e => setProducts(ps => ps.map((item, i) => i === idx ? { ...item, name: e.target.value } : item))}
                              className="form-control d-inline-block w-auto"
                              style={{ fontSize: 18, fontWeight: 700, minWidth: 120, display: 'inline-block' }}
                            />
                          </span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}>ID: {p.product_id}</span>
                        </div>
                        <div className="mb-2 d-flex flex-wrap align-items-center" style={{ gap: 8 }}>
                          {(productImages[p.product_id] || (p.image_url ? [p.image_url] : [])).map((img, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img src={img} alt="product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                              <button className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle" style={{ fontSize: 10, padding: 2 }} onClick={() => setProductImages(imgs => ({ ...imgs, [p.product_id]: (imgs[p.product_id] || [p.image_url]).filter((_, j) => j !== i) }))}>×</button>
                            </div>
                          ))}
                          <label className="btn btn-sm btn-outline-primary mb-0" style={{ fontSize: 13 }}>
                            + عکس
                            <input type="file" accept="image/*" multiple hidden onChange={e => {
                              const files = Array.from(e.target.files || []);
                              const urls = files.map(f => URL.createObjectURL(f));
                              setProductImages(imgs => ({ ...imgs, [p.product_id]: [...(imgs[p.product_id] || (p.image_url ? [p.image_url] : [])), ...urls] }));
                            }} />
                          </label>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between align-items-center mt-2" style={{ gap: 8 }}>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>برند:</b> {p.brand}</span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>قیمت:</b> {p.base_price?.toLocaleString()} تومان</span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>واحد:</b> {p.unit}</span>
                          <span className="badge bg-light text-dark border" style={{ fontSize: 13 }}><b>تعداد در هر {p.unit}:</b> {p.pack_size}</span>
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
                {plans.map((plan) => (
                  <div className="col-12 col-lg-6" key={plan.plan_id}>
                    <div className="card p-4 shadow-sm border-0 rounded-4 mb-2" style={{ background: '#fff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ fontSize: 16 }}>{plan.name}</span>
                        <span className="badge bg-info text-dark" style={{ fontSize: 13 }}>
                          درصد تخفیف: {plan.discount_percent} %
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
                            {plan.products.map((prod) => (
                              <tr key={prod.product_id}>
                                <td>{prod.name}</td>
                                <td>{prod.special_price?.toLocaleString()} تومان</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
          {active === 'members' && (
            <div>
              <h4 className="fw-bold mb-4 text-end">👥 مدیریت اعضا (فروشگاه‌ها)</h4>
              {memberError && <div className="alert alert-danger text-end">{memberError}</div>}
              {memberSuccess && <div className="alert alert-success text-end">{memberSuccess}</div>}
              <div className="mb-4">
                <form className="row g-2 align-items-end" onSubmit={e => {
                  e.preventDefault();
                  setMemberError(null);
                  setMemberSuccess(null);
                  if (!newMember.username || !newMember.password) {
                    setMemberError('یوزرنیم و پسورد الزامی است.');
                    return;
                  }
                  if (members.some(m => m.username === newMember.username)) {
                    setMemberError('این یوزرنیم قبلاً ثبت شده است.');
                    return;
                  }
                  setMembers(members => [...members, { username: newMember.username, plan: plans.find(p => p.plan_id === newMember.plan)?.name || '' }]);
                  setMemberSuccess('عضو جدید با موفقیت اضافه شد.');
                  setNewMember({ username: '', password: '', plan: samplePlans[0].plan_id });
                }}>
                  <div className="col-md-3">
                    <label className="form-label">یوزرنیم</label>
                    <input type="text" className="form-control" value={newMember.username} onChange={e => setNewMember(n => ({ ...n, username: e.target.value }))} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">پسورد</label>
                    <input type="password" className="form-control" value={newMember.password} onChange={e => setNewMember(n => ({ ...n, password: e.target.value }))} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">پلن</label>
                    <select className="form-select" value={newMember.plan} onChange={e => setNewMember(n => ({ ...n, plan: e.target.value }))}>
                      {plans.map(p => <option key={p.plan_id} value={p.plan_id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">افزودن عضو</button>
                  </div>
                </form>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered text-end align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>یوزرنیم</th>
                      <th>پلن اختصاصی</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 && <tr><td colSpan={3} className="text-center">عضوی ثبت نشده است.</td></tr>}
                    {members.map((m, idx) => (
                      <tr key={m.username}>
                        <td>{m.username}</td>
                        <td>{m.plan}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => {
                            setMembers(members => members.filter((_, i) => i !== idx));
                            setMemberSuccess('عضو با موفقیت حذف شد.');
                          }}>حذف</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 