import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      product_id: '12345',
      name: 'دستمال کاغذی کلین‌آپ',
      base_price: 94750,
      unit: 'کارتن',
      pack_size: 24,
      stock: 30,
      image_url: 'https://cdn.example.com/products/12345.jpg',
      category: 'شوینده',
      brand: 'CleanUp',
      is_active: true
    },
    {
      product_id: '67890',
      name: 'مایع سفیدکننده تاژ',
      base_price: 50000,
      unit: 'بطری',
      pack_size: 12,
      stock: 100,
      image_url: 'https://cdn.example.com/products/67890.jpg',
      category: 'شوینده',
      brand: 'Taj',
      is_active: true
    },
    {
      product_id: '24680',
      name: 'پودر لباسشویی برف',
      base_price: 120000,
      unit: 'بسته',
      pack_size: 6,
      stock: 0,
      image_url: 'https://cdn.example.com/products/24680.jpg',
      category: 'شوینده',
      brand: 'Barf',
      is_active: false
    },
    {
      product_id: '13579',
      name: 'شامپو مو صحت',
      base_price: 85000,
      unit: 'بطری',
      pack_size: 6,
      stock: 20,
      image_url: '',
      category: 'آرایشی',
      brand: 'Sehat',
      is_active: true
    },
    {
      product_id: '11223',
      name: 'برنج هاشمی گلستان',
      base_price: 480000,
      unit: 'کیسه',
      pack_size: 1,
      stock: 10,
      image_url: '',
      category: 'غذایی',
      brand: 'Golestan',
      is_active: true
    }
  ]);
} 