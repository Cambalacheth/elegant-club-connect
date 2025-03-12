
interface ProjectCardCategoriesProps {
  categories: string[];
}

const ProjectCardCategories = ({ categories }: ProjectCardCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {categories.map((category) => (
        <span
          key={category}
          className="text-xs bg-club-beige px-2 py-1 rounded-full text-club-brown"
        >
          {category}
        </span>
      ))}
    </div>
  );
};

export default ProjectCardCategories;
