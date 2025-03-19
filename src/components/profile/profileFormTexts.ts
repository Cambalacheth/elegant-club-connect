
export const getProfileFormTexts = (currentLanguage: string) => ({
  title: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
  saveButton: currentLanguage === "en" ? "Save Changes" : "Guardar Cambios",
  cancelButton: currentLanguage === "en" ? "Cancel" : "Cancelar",
  usernameLabel: currentLanguage === "en" ? "Username" : "Nombre de usuario",
  descriptionLabel: currentLanguage === "en" ? "Bio" : "Biografía",
  emailVisibleLabel: currentLanguage === "en" ? "Display Email to Others" : "Mostrar Email a Otros",
  emailVisibleDescription:
    currentLanguage === "en"
      ? "When enabled, your email address will be visible to other users on your profile page"
      : "Cuando está activado, tu dirección de email será visible para otros usuarios en tu página de perfil",
  websiteLabel: currentLanguage === "en" ? "Website" : "Sitio Web",
  genderLabel: currentLanguage === "en" ? "Gender" : "Género",
  genderMale: currentLanguage === "en" ? "Male" : "Masculino",
  genderFemale: currentLanguage === "en" ? "Female" : "Femenino",
  genderOther: currentLanguage === "en" ? "Other" : "Otro",
  categoriesLabel: currentLanguage === "en" ? "Categories" : "Categorías",
  selectCategoriesText: currentLanguage === "en" ? "Select categories of interest" : "Selecciona categorías de interés",
  birthDateLabel: currentLanguage === "en" ? "Birth Date" : "Fecha de Nacimiento",
  avatarLabel: currentLanguage === "en" ? "Profile Picture" : "Foto de Perfil",
  socialLinksLabel: currentLanguage === "en" ? "Social Links" : "Enlaces Sociales",
  addSocialLink: currentLanguage === "en" ? "Add Social Link" : "Añadir Enlace Social",
  platformLabel: currentLanguage === "en" ? "Platform" : "Plataforma",
  urlLabel: currentLanguage === "en" ? "Username or URL" : "Nombre de Usuario o URL",
  selectPlatform: currentLanguage === "en" ? "Select platform" : "Seleccionar plataforma",
  successMessage: currentLanguage === "en" ? "Success" : "Éxito",
  errorMessage: currentLanguage === "en" 
    ? "There was an error updating your profile" 
    : "Hubo un error al actualizar tu perfil"
});
