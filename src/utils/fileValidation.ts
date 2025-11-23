export const validateFile = (file: File): boolean => {
  if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    alert("Veuillez sélectionner un fichier JPEG, PNG ou JPG.");
    return false;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Fichier trop volumineux ! La taille maximale autorisée est de 2 Mo.");
    return false;
  }

  return true;
};