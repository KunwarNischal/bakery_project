import React from 'react';
import Hero from '../../components/client/Hero';
import CategoryQuickLinks from '../../components/client/CategoryQuickLinks';
import FeaturedProducts from '../../components/client/FeaturedProducts';
import Testimonials from '../../components/client/Testimonials';

const Home = ({ products, categories, onCategorySelect }) => {
  return (
    <div className="animate-fade-in-up">
      <Hero />
      <CategoryQuickLinks categories={categories} onCategorySelect={onCategorySelect} />
      <FeaturedProducts 
        products={products} 
        categories={categories} 
      />
      <Testimonials />
    </div>
  );
};

export default Home;
