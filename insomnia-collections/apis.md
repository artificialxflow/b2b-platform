# Accounting System API Documentation for B2B Platform Integration

این سند شامل لیست APIهای مورد نیاز جهت یکپارچه‌سازی سیستم حسابداری با پلتفرم B2B است. ترتیب و جزییات بر اساس نیازهای فعلی و آینده تنظیم شده است.

---

## 1. دریافت لیست محصولات و اطلاعات پایه
- **Endpoint:** `GET /products`
- **Description:** دریافت لیست کامل محصولات با اطلاعات پایه و جزییات بیشتر (نام، شناسه، قیمت پایه، واحد، تصویر، دسته‌بندی، برند، وضعیت فعال).
- **Request Example:**
  ```http
  GET /products
  ```
- **Response Example:**
  ```json
  [
    {
      "product_id": "12345",
      "name": "دستمال کاغذی کلین‌آپ",
      "base_price": 94750,
      "unit": "کارتن",
      "image_url": "https://cdn.example.com/products/12345.jpg",
      "category": "شوینده",
      "brand": "CleanUp",
      "is_active": true
    },
    ...
  ]
  ```

---

## 2. دریافت پلن قیمتی و گرید مشتری
- **Endpoint:** `GET /customers/{customer_id}/plan`
- **Description:** دریافت اطلاعات پلن قیمتی و گرید مشتری شامل نام پلن، سطح (گرید)، و لیست محصولات مجاز با قیمت اختصاصی.
- **Request Example:**
  ```http
  GET /customers/super_market_alef/plan
  ```
- **Response Example:**
  ```json
  {
    "customer_id": "super_market_alef",
    "grade": "Silver",
    "plan_name": "پلن عمده‌فروشی A",
    "products": [
      {
        "product_id": "12345",
        "special_price": 76709,
        "allowed": true
      },
      {
        "product_id": "67890",
        "special_price": 50000,
        "allowed": false
      }
    ]
  }
  ```

---

## 3. دریافت موجودی فعلی محصول
- **Endpoint:** `GET /inventory/{product_id}`
- **Description:** دریافت موجودی لحظه‌ای یک محصول خاص بر اساس شناسه محصول.
- **Request Example:**
  ```http
  GET /inventory/12345
  ```
- **Response Example:**
  ```json
  {
    "product_id": "12345",
    "stock": 27
  }
  ```

---

## 4. کسر موجودی پس از ثبت سفارش
- **Endpoint:** `POST /inventory/decrement`
- **Description:** کسر تعداد مشخصی از موجودی یک محصول پس از ثبت سفارش موفق.
- **Request Example:**
  ```json
  {
    "product_id": "12345",
    "quantity": 5
  }
  ```
- **Response Example:**
  ```json
  {
    "success": true,
    "remaining_stock": 22
  }
  ```

---

## 5. ثبت تراکنش مالی (افزایش/کاهش اعتبار)
- **Endpoint:** `POST /wallet/transaction`
- **Description:** ثبت تراکنش افزایش یا کاهش اعتبار کیف پول مشتری.
- **Request Example:**
  ```json
  {
    "customer_id": "super_market_alef",
    "amount": 200000,
    "type": "increase", // یا "decrease"
    "description": "افزایش اعتبار اولیه"
  }
  ```
- **Response Example:**
  ```json
  {
    "success": true,
    "new_balance": 250000
  }
  ```

---

## 6. دریافت وضعیت سفارش
- **Endpoint:** `GET /orders/{order_id}`
- **Description:** دریافت وضعیت فعلی یک سفارش خاص.
- **Request Example:**
  ```http
  GET /orders/98765
  ```
- **Response Example:**
  ```json
  {
    "order_id": "98765",
    "status": "confirmed"
  }
  ```

---

## 7. سایر APIهای مورد نیاز (آینده)
- مدیریت مرجوعی سفارش‌ها
- گزارش‌های تحلیلی پیشرفته
- ثبت سفارش در حسابداری (در فاز بعدی در صورت نیاز)

---

**توجه:**
در این فاز، ثبت سفارش در سیستم حسابداری الزامی نیست اما زیرساخت لازم برای افزودن آن در آینده پیش‌بینی شده است. 