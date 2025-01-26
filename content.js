chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SHOW_TRANSLATION') {
      showTranslation(message.translation);
    }
  });
  
  function showTranslation(translation) {
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      background: white;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
    `;
    
    popup.innerHTML = `
      <p>${translation}</p>
      <button onclick="this.parentElement.remove()">Close</button>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  }
  