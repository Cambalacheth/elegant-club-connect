
export const getProfileFormTexts = (currentLanguage: string) => ({
  title: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
  saveButton: currentLanguage === "en" ? "Save Changes" : "Guardar Cambios",
  cancelButton: currentLanguage === "en" ? "Cancel" : "Cancelar",
  usernameLabel: currentLanguage === "en" ? "Username" : "Nombre de usuario",
  descriptionLabel: currentLanguage === "en" ? "Bio" : "Biografía",
  emailVisibleLabel: currentLanguage === "en" ? "Email Visible" : "Email Visible",
  emailVisibleDescription:
    currentLanguage === "en"
      ? "Make your email visible to other users"
      : "Hacer tu email visible para otros usuarios",
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
  urlLabel: currentLanguage === "en" ? "Username" : "Nombre de Usuario",
  selectPlatform: currentLanguage === "en" ? "Select platform" : "Seleccionar plataforma",
  successMessage: currentLanguage === "en" ? "Success" : "Éxito",
  errorMessage: currentLanguage === "en" 
    ? "There was an error updating your profile" 
    : "Hubo un error al actualizar tu perfil"
});
