
export const getProfileFormTexts = (currentLanguage: string) => ({
  title: currentLanguage === "en" ? "Edit Profile" : "Editar Perfil",
  saveButton: currentLanguage === "en" ? "Save Changes" : "Guardar Cambios",
  cancelButton: currentLanguage === "en" ? "Cancel" : "Cancelar",
  usernameLabel: currentLanguage === "en" ? "Username" : "Nombre de usuario",
  descriptionLabel: currentLanguage === "en" ? "Bio" : "Biografía",
  emailVisibleLabel: currentLanguage === "en" ? "Display Email" : "Mostrar Email",
  emailVisibleDescription:
    currentLanguage === "en"
      ? "Choose whether to show or hide your email on your profile"
      : "Elige si mostrar u ocultar tu email en tu perfil",
  emailVisibleOnDescription:
    currentLanguage === "en"
      ? "Your email will be visible to others on your profile"
      : "Tu email será visible para otros en tu perfil",
  emailVisibleOffDescription:
    currentLanguage === "en"
      ? "Your email is hidden from other users"
      : "Tu email está oculto para otros usuarios",
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
