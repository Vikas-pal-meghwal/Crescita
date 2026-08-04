import localProducts from '../data/products.json';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch {
    // Backend not running — use local data
    return localProducts;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch {
    // Backend not running — use local data
    const product = localProducts.find((p) => p.id === id);
    if (!product) throw new Error(`Product ${id} not found`);
    return product;
  }
};

export const fetchProductsByCategory = async (category: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch products by category');
    return await response.json();
  } catch {
    // Backend not running — use local data
    return localProducts.filter((p) => p.category === category);
  }
};
