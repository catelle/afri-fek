export const handleUserCommentSubmit = async (
  commentData: { name: string; phone: string; message: string },
  pendingResourceData: any,
  setShowUserComment: (show: boolean) => void,
  setShowSubmit: (show: boolean) => void,
  setSubmitMessage: (message: string) => void,
  setPendingResourceData: (data: any) => void
) => {
  try {
    const response = await fetch("/api/send-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...commentData,
        resourceData: pendingResourceData,
      }),
    });

    if (response.ok) {
      setShowUserComment(false);
      setShowSubmit(false);
      setSubmitMessage("");
      setPendingResourceData(null);
      alert("Commentaire envoyé avec succès!");
    } else {
      throw new Error("Failed to send comment");
    }
  } catch (error) {
    console.error("Error sending comment:", error);
    alert("Erreur lors de l'envoi du commentaire");
  }
};