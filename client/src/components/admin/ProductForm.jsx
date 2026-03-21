import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Save, Upload, XCircle, Loader2 } from 'lucide-react';

/**
 * ProductForm Component
 * Reusable product form for creating and editing products
 * Handles form state, image upload, and validation
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.mode] - 'create' or 'edit' mode
 * @param {Object} [props.product] - Initial product data for edit mode
 * @param {Array} props.categories - List of available categories
 * @param {Function} props.onSubmit - Submit handler with form data
 * @param {Function} [props.onCancel] - Cancel handler
 * @param {boolean} [props.isLoading] - Show loading state
 * @param {boolean} [props.isSubmitting] - Show submitting state
 * 
 * @example
 * <ProductForm
 *   mode="create"
 *   categories={categories}
 *   onSubmit={(formData) => handleCreateProduct(formData)}
 *   onCancel={() => navigate(-1)}
 * />
 * 
 * @example
 * <ProductForm
 *   mode="edit"
 *   product={productData}
 *   categories={categories}
 *   onSubmit={(formData) => handleUpdateProduct(formData)}
 *   onCancel={() => navigate(-1)}
 * />
 */
const ProductForm = ({
  mode = 'create',
  product = null,
  categories = [],
  onSubmit,
  onCancel,
  isLoading = false,
  isSubmitting = false
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: ''
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form with product data on edit mode
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        description: product.description || ''
      });

      if (product.image) {
        setImagePreview(product.image);
      }
    } else if (mode === 'create' && categories.length > 0) {
      // Set default category for create mode
      setFormData(prev => ({
        ...prev,
        category: categories[0].name
      }));
    }
  }, [mode, product, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!formData.price) {
      alert('Price is required');
      return;
    }
    if (!formData.stock) {
      alert('Stock is required');
      return;
    }
    if (!formData.description.trim()) {
      alert('Description is required');
      return;
    }
    if (mode === 'create' && !image) {
      alert('Product image is required');
      return;
    }

    // Call parent submit handler with form data
    onSubmit({
      ...formData,
      image
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-light-brown" />
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  const isCreateMode = mode === 'create';
  const pageTitle = isCreateMode ? 'Add New Treat' : 'Edit Treat';
  const pageSubtitle = isCreateMode 
    ? 'Create a delicious new addition to your menu'
    : `Refine your delicious creation: ${formData.name}`;
  const submitButtonText = isCreateMode
    ? 'Save & Publish Treat'
    : 'Save Changes';
  const cancelButtonText = isCreateMode
    ? 'Discard Changes'
    : 'Cancel Updates';
  const submittingText = isCreateMode
    ? 'Creating Treat...'
    : 'Updating Treat...';
  const toastIcon = isCreateMode ? '🧁' : '✏️';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-dark-brown cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark-brown">{pageTitle}</h1>
              <p className="text-gray-500">{pageSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Dreamy Vanilla Cake"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="1500"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe your delicious creation..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-brown resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Image Upload */}
              <div className="space-y-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Product Image
                </label>
                <div
                  className={`relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                    imagePreview
                      ? 'border-light-brown'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {isCreateMode ? (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-md hover:text-red-700 transition-all"
                        >
                          <XCircle size={24} />
                        </button>
                      ) : (
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                          <label
                            htmlFor="image-upload"
                            className="px-6 py-2 bg-white text-dark-brown rounded-full font-bold cursor-pointer hover:bg-cream transition-all inline-block shadow-lg"
                          >
                            Change Image
                          </label>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <div className="mx-auto h-16 w-16 bg-light-brown/10 rounded-full flex items-center justify-center mb-4 text-light-brown">
                        <Upload size={32} />
                      </div>
                      <p className="text-gray-500 font-medium mb-4">
                        Click below to upload a photo
                      </p>
                      <input
                        type="file"
                        id="image-upload-empty"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      <label
                        htmlFor="image-upload-empty"
                        className="px-6 py-2 bg-light-brown text-white rounded-full font-bold cursor-pointer hover:bg-dark-brown transition-all inline-block"
                      >
                        Select File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 text-center cursor-pointer"
              >
                {cancelButtonText}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-light-brown text-white py-4 rounded-xl font-bold hover:bg-dark-brown transition-all shadow-lg shadow-light-brown/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {isSubmitting ? submittingText : submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ProductForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    image: PropTypes.string
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool
};

export default ProductForm;
