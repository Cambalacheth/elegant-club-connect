
import React from 'react';

interface CategoryItem {
  original: string;
  translated: string;
}

interface ProjectCategoriesProps {
  categories: CategoryItem[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  currentLanguage: string;
}

const ProjectCategories = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  currentLanguage
}: ProjectCategoriesProps) => {
  // Translation
  const filterByText = currentLanguage === "en" ? "Filter by category" : "Filtrar por categoría";

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-club-brown mb-3">{filterByText}</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.original}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.original
                ? 'bg-club-orange text-white'
                : 'bg-white text-club-brown hover:bg-club-beige'
            }`}
            onClick={() => setSelectedCategory(category.original)}
          >
            {category.translated}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCategories;
