
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: string;
  images: string[];
  variants: ProductVariant[];
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Boudha Heavy Hoodie',
    slug: 'boudha-heavy-hoodie',
    description: '400GSM heavy cotton hoodie with minimalist Boudha embroidery.',
    basePrice: 4850,
    category: 'hoodies',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000', 'https://images.unsplash.com/photo-1512411874258-299f2a9693eb?q=80&w=1000'],
    featured: true,
    variants: [{ id: 'v1', color: 'Night', colorHex: '#0A0A0A', size: 'L', stock: 10, sku: 'AB-HD-1' }]
  },
  {
    id: '2',
    name: 'Essential Tee 01',
    slug: 'essential-tee-01',
    description: 'The perfect oversized tee. 240GSM premium jersey.',
    basePrice: 1950,
    category: 'tees',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000'],
    featured: true,
    variants: [{ id: 'v2', color: 'Cloud', colorHex: '#F5F5F5', size: 'M', stock: 20, sku: 'AB-TS-1' }]
  },
  {
    id: '3',
    name: 'Urban Cargo Pants',
    slug: 'urban-cargo-pants',
    description: 'Water-resistant technical cargos for the urban explorer.',
    basePrice: 3500,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000'],
    variants: [{ id: 'v3', color: 'Olive', colorHex: '#3D3D3D', size: '32', stock: 8, sku: 'AB-PA-1' }]
  },
  {
    id: '4',
    name: 'Stupa Element Tee',
    slug: 'stupa-element-tee',
    description: 'Abstract graphic tee inspired by Boudha elements.',
    basePrice: 1800,
    category: 'tees',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000'],
    variants: [{ id: 'v4', color: 'Bone', colorHex: '#E5E4E2', size: 'L', stock: 5, sku: 'AB-TS-2' }]
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'New Arrivals', slug: 'all' },
  { id: '2', name: 'Hoodies', slug: 'hoodies' },
  { id: '3', name: 'T-Shirts', slug: 'tees' },
  { id: '4', name: 'Pants', slug: 'pants' }
];
