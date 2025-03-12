
import { Dispatch, SetStateAction } from 'react';

interface ProjectCategoriesProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

const ProjectCategories = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}: ProjectCategoriesProps) => {
  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-lg md:text-xl font-medium text-club-brown mb-3 md:mb-4">
        Filtrar por categoría:
      </h2>
      <div className="flex overflow-x-auto pb-2 md:flex-wrap gap-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-club-orange text-white'
                : 'bg-white border border-club-olive text-club-brown hover:bg-club-beige-dark'
            }`}
          >
            {category === 'all' ? 'Todos' : category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCategories;
