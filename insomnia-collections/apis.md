# Accounting System API Documentation for B2B Platform Integration

این سند شامل لیست APIهای مورد نیاز جهت یکپارچه‌سازی سیستم حسابداری با پلتفرم B2B است. هر API با توضیح، متد، ورودی و خروجی نمونه آورده شده است.

---

## 1. دریافت موجودی فعلی محصول
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

## 2. کسر موجودی پس از ثبت سفارش
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

## 3. دریافت لیست محصولات و اطلاعات پایه
- **Endpoint:** `GET /products`
- **Description:** دریافت لیست کامل محصولات با اطلاعات پایه (نام، شناسه، قیمت پایه، واحد، ...).
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
      "unit": "کارتن"
    },
    ...
  ]
  ```

---

## 4. ثبت تراکنش مالی (افزایش/کاهش اعتبار)
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

## 5. دریافت وضعیت سفارش
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

## 6. سایر APIهای مورد نیاز
در صورت نیاز به APIهای بیشتر، بر اساس نیازمندی‌های دقیق پروژه، این لیست به‌روزرسانی خواهد شد. 