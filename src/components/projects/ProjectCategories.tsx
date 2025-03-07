
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from './utils/categoryColors';

interface ProjectCategoriesProps {
  categories: string[];
}

const ProjectCategories = ({ categories }: ProjectCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {categories.map((category, index) => (
        <Badge
          key={index}
          variant="outline"
          className={getCategoryColor(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default ProjectCategories;
