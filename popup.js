document.addEventListener('DOMContentLoaded', loadVocabulary);

function loadVocabulary() {
  chrome.storage.local.get(['vocabulary'], (result) => {
    const vocabulary = result.vocabulary || [];
    const container = document.getElementById('vocabulary');
    container.innerHTML = '';
    
    vocabulary.forEach(word => {
      const div = document.createElement('div');
      div.className = `vocab-item ${isReviewDue(word) ? 'review-due' : ''}`;
      div.innerHTML = `
        <p><strong>Original:</strong> ${word.original}</p>
        <p><strong>Translation:</strong> ${word.translated}</p>
        <button onclick="reviewWord('${word.original}')">Review</button>
        <button onclick="deleteWord('${word.original}')">Delete</button>
      `;
      container.appendChild(div);
    });
  });
}

function reviewWord(original) {
  chrome.storage.local.get(['vocabulary'], (result) => {
    const vocabulary = result.vocabulary;
    const wordIndex = vocabulary.findIndex(w => w.original === original);
    if (wordIndex !== -1) {
      vocabulary[wordIndex].reviewCount++;
      vocabulary[wordIndex].lastReviewed = Date.now();
      chrome.storage.local.set({ vocabulary }, loadVocabulary);
    }
  });
}

function deleteWord(original) {
  chrome.storage.local.get(['vocabulary'], (result) => {
    const vocabulary = result.vocabulary.filter(w => w.original !== original);
    chrome.storage.local.set({ vocabulary }, loadVocabulary);
  });
}

function isReviewDue(word) {
  if (!word.lastReviewed) return true;
  const interval = Math.pow(2, word.reviewCount) 
  return Date.now() - word.lastReviewed > interval;
}