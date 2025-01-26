import { config } from './config.js';

chrome.runtime.onInstalled.addListener(() => {
 chrome.contextMenus.create({
   id: "translate",
   title: "Translate Selection",
   contexts: ["selection"]
 });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
 if (info.menuItemId === "translate") {
   translateText(info.selectionText, tab.id);
 }
});

async function translateText(text, tabId) {
 try {
   const response = await fetch(`https://translation-api.googleapis.com/language/translate/v2`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${config.API_KEY}`
     },
     body: JSON.stringify({
       q: text,
       target: 'en'
     })
   });
   
   const data = await response.json();
   
   if (data.error) {
     throw new Error(data.error.message);
   }

   chrome.storage.local.get(['vocabulary'], (result) => {
     const vocabulary = result.vocabulary || [];
     vocabulary.push({
       original: text,
       translated: data.data.translations[0].translatedText,
       timestamp: Date.now(),
       reviewCount: 0
     });
     chrome.storage.local.set({ vocabulary });
   });

   chrome.tabs.sendMessage(tabId, {
     type: 'SHOW_TRANSLATION',
     translation: data.data.translations[0].translatedText
   });

 } catch (error) {
   console.error('Translation failed:', error);
 }
}