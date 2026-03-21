const API_URL = 'http://localhost:5000/api/products';
const CATEGORY_API_URL = 'http://localhost:5000/api/categories';

export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.map(p => {
      let imageUrl = p.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = imageUrl.startsWith('/uploads') ? `http://localhost:5000${imageUrl}` : imageUrl;
      }
      return {
        ...p,
        id: p._id || p.id,
        image: imageUrl
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Product not found');
    const p = await response.json();
    let imageUrl = p.image;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = imageUrl.startsWith('/uploads') ? `http://localhost:5000${imageUrl}` : imageUrl;
    }
    return {
      ...p,
      id: p._id || p.id,
      image: imageUrl
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(CATEGORY_API_URL);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
