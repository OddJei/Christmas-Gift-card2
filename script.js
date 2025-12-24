// Change this if you want the button to open a different page or an external link.
const GIFT_CARD_URL = "gift-card.html";

const openGiftButton = document.getElementById("openGift");

if (openGiftButton) {
  openGiftButton.addEventListener("click", () => {
    window.location.href = GIFT_CARD_URL;
  });
}
