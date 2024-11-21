async function translateText(text, source = 'ko', target = 'en') {
  const url = "https://translate.googleapis.com/translate_a/single";
  const params = new URLSearchParams({
      client: "gtx",
      sl: source,
      tl: target,
      dt: "t",
      q: text
  });
  
  const response = await fetch(`${url}?${params}`);
  const result = await response.json();
  
  return result[0].map(part => part[0]).join('');
}

function splitText(text, maxLength = 5000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

let isTranslating = false; // 번역 중복 실행 방지를 위한 플래그

async function handleSourceInput() {
    if (isTranslating) return;
    
    try {
        isTranslating = true;
        const sourceText = document.getElementById('sourceText').value;
        const sourceLanguage = document.getElementById('sourceLanguage').value;
        const targetLanguage = document.getElementById('targetLanguage').value;
        
        if (!sourceText.trim()) {
            document.getElementById('targetText').value = '';
            return;
        }

        const splitTexts = splitText(sourceText);
        const translatedTexts = await Promise.all(
            splitTexts.map(part => translateText(part, sourceLanguage, targetLanguage))
        );
        document.getElementById('targetText').value = translatedTexts.join('');
    } catch (error) {
        console.error('번역 중 오류가 발생했습니다:', error);
    } finally {
        isTranslating = false;
    }
}

async function handleTargetInput() {
    if (isTranslating) return;
    
    try {
        isTranslating = true;
        const targetText = document.getElementById('targetText').value;
        const sourceLanguage = document.getElementById('targetLanguage').value;
        const targetLanguage = document.getElementById('sourceLanguage').value;
        
        if (!targetText.trim()) {
            document.getElementById('sourceText').value = '';
            return;
        }

        const splitTexts = splitText(targetText);
        const translatedTexts = await Promise.all(
            splitTexts.map(part => translateText(part, sourceLanguage, targetLanguage))
        );
        document.getElementById('sourceText').value = translatedTexts.join('');
    } catch (error) {
        console.error('번역 중 오류가 발생했습니다:', error);
    } finally {
        isTranslating = false;
    }
}

let selectionTimer;

async function handleTextSelection(textarea) {
    clearTimeout(selectionTimer);
    
    selectionTimer = setTimeout(async () => {
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        const translationDiv = document.getElementById(textarea.id === 'sourceText' 
            ? 'sourceSelectionTranslation' 
            : 'targetSelectionTranslation');
        
        if (!selectedText.trim()) {
            translationDiv.style.display = 'none';
            return;
        }

        try {
            const sourceLanguage = textarea.id === 'sourceText' 
                ? document.getElementById('sourceLanguage').value 
                : document.getElementById('targetLanguage').value;
            const targetLanguage = textarea.id === 'sourceText'
                ? document.getElementById('targetLanguage').value
                : document.getElementById('sourceLanguage').value;

            const translation = await translateText(selectedText, sourceLanguage, targetLanguage);
            translationDiv.textContent = `${selectedText}\n→\n${translation}`;
            translationDiv.style.display = 'block';
        } catch (error) {
            console.error('선택 텍스트 번역 중 오류:', error);
            translationDiv.style.display = 'none';
        }
    }, 300);
}