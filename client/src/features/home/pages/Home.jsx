/**
 * Home / Landing Page Component
 *
 * This is the main landing page that customers see when they first visit the website.
 * It showcases:
 * - Hero section with bakery branding and call-to-action
 * - Category quick links for easy navigation to product categories
 * - Featured products section displaying best-selling items
 * - Customer testimonials and reviews
 *
 * This page serves as the entry point to the bakery application.
 */

import React from 'react';
import Hero from '../components/Hero';
import CategoryQuickLinks from '../components/CategoryQuickLinks';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';

const Home = () => {
  const { products } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Quick link category select handler navigation is handled by Menu using URL state natively, or we can leave it
  const onCategorySelect = undefined;
  
  return (
    <div className="animate-fade-in-up">
      {/* Hero banner with bakery introduction */}
      <Hero />

      {/* Quick category navigation links */}
      <CategoryQuickLinks 
        categories={categories} 
        loading={categoriesLoading}
        onCategorySelect={onCategorySelect} 
      />

      {/* Showcase of featured/popular products */}
      <FeaturedProducts
        products={products}
        categories={categories}
      />

      {/* Customer reviews and testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;
