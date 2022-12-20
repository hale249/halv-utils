export const closeAllModals = () => {
  // Close all opening modal
  const btnCloseModal = document.getElementsByClassName("btn-close-modal") as HTMLCollectionOf<HTMLButtonElement>;

  for (const btn of btnCloseModal) {
    if (btn.offsetParent) {
      // Click button if it is visible
      btn.click();
    }
  }
};
