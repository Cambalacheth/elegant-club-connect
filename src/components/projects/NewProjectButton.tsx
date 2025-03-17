
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import ProjectSubmitModal from './ProjectSubmitModal';

interface NewProjectButtonProps {
  user: User | null;
  language: string;
}

const NewProjectButton = ({ user, language }: NewProjectButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitted = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return null;
  }

  const buttonText = language === "en" ? "New Project" : "Nuevo Proyecto";

  return (
    <>
      <Button 
        className="bg-club-orange hover:bg-club-terracotta text-white"
        onClick={handleOpenModal}
      >
        <Plus className="w-5 h-5 mr-2" /> {buttonText}
      </Button>

      {isModalOpen && (
        <ProjectSubmitModal
          onClose={handleCloseModal}
          onSubmitted={handleSubmitted}
          language={language}
          projectToEdit={null}
        />
      )}
    </>
  );
};

export default NewProjectButton;
