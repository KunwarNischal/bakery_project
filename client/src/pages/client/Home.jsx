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
import Hero from '../../components/client/Hero';
import CategoryQuickLinks from '../../components/client/CategoryQuickLinks';
import FeaturedProducts from '../../components/client/FeaturedProducts';
import Testimonials from '../../components/client/Testimonials';

const Home = ({ products, categories, onCategorySelect }) => {
  return (
    <div className="animate-fade-in-up">
      {/* Hero banner with bakery introduction */}
      <Hero />

      {/* Quick category navigation links */}
      <CategoryQuickLinks categories={categories} onCategorySelect={onCategorySelect} />

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
