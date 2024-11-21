let translationTimer;
let deferredPrompt;

function debounceTranslation(fn, delay = 500) {
  return function (...args) {
    clearTimeout(translationTimer);
    translationTimer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedHandleSourceInput = debounceTranslation(handleSourceInput);
const debouncedHandleTargetInput = debounceTranslation(handleTargetInput);

const translations = {
  ko: {
    placeholder: '번역할 텍스트를 입력하세요',
    installButton: {
      desktop: '데스크톱 앱으로 설치',
      mobile: '모바일 앱으로 설치'
    },
    languages: {
      ko: '한국어',
      en: '영어',
      ja: '일본어',
      zh: '중국어 (간체)',
      'zh-TW': '중국어 (번체)',
      vi: '베트남어',
      th: '태국어',
      es: '스페인어',
      fr: '프랑스어',
      de: '독일어',
      ru: '러시아어',
      it: '이탈리아어',
      id: '인도네시아어',
      ar: '아랍어',
      hi: '힌디어',
      pt: '포르투갈어',
      nl: '네덜란드어',
      pl: '폴란드어',
      tr: '터키어',
      uk: '우크라이나어',
      eo: '에스페란토어'
    }
  },
  en: {
    placeholder: 'Enter text to translate',
    installButton: {
      desktop: 'Install as Desktop App',
      mobile: 'Install as Mobile App'
    },
    languages: {
      ko: 'Korean',
      en: 'English',
      ja: 'Japanese',
      zh: 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      vi: 'Vietnamese',
      th: 'Thai',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ru: 'Russian',
      it: 'Italian',
      id: 'Indonesian',
      ar: 'Arabic',
      hi: 'Hindi',
      pt: 'Portuguese',
      nl: 'Dutch',
      pl: 'Polish',
      tr: 'Turkish',
      uk: 'Ukrainian',
      eo: 'Esperanto'
    }
  },
  ja: {
    placeholder: '翻訳するテキストを入力してください',
    installButton: {
      desktop: 'デスクトップアプリとしてインストール',
      mobile: 'モバイルアプリとしてインストール'
    },
    languages: {
      ko: '韓国語',
      en: '英語',
      ja: '日本語',
      zh: '中国語 (簡体字)',
      'zh-TW': '中国語 (繁体字)',
      vi: 'ベトナム語',
      th: 'タイ語',
      es: 'スペイン語',
      fr: 'フランス語',
      de: 'ドイツ語',
      ru: 'ロシア語',
      it: 'イタリア語',
      id: 'インドネシア語',
      ar: 'アラビア語',
      hi: 'ヒンディー語',
      pt: 'ポルトガル語',
      nl: 'オランダ語',
      pl: 'ポーランド語',
      tr: 'トルコ語',
      uk: 'ウクライナ語',
      eo: 'エスペラント語'
    }
  },
  zh: {
    placeholder: '请输入要翻译的文本',
    installButton: {
      desktop: '安装为桌面应用',
      mobile: '安装为移动应用'
    },
    languages: {
      ko: '韩语',
      en: '英语',
      ja: '日语',
      zh: '中文（简体）',
      'zh-TW': '中文（繁体）',
      vi: '越南语',
      th: '泰语',
      es: '西班牙语',
      fr: '法语',
      de: '德语',
      ru: '俄语',
      it: '意大利语',
      id: '印尼语',
      ar: '阿拉伯语',
      hi: '印地语',
      pt: '葡萄牙语',
      nl: '荷兰语',
      pl: '波兰语',
      tr: '土耳其语',
      uk: '乌克兰语',
      eo: '世界语'
    }
  }
};

function getQueryParam(param) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return translations[value] ? value : null;
  } catch (error) {
    console.error('URL 파라미터 처리 중 오류:', error);
    return null;
  }
}

function updateQueryString(lang) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  } catch (error) {
    console.error('URL 업데이트 중 오류:', error);
  }
}

function setLanguage(lang) {
  if (!translations[lang]) {
    console.error('지원하지 않는 언어:', lang);
    lang = 'en';
  }

  document.documentElement.lang = lang;
  
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.placeholder = translations[lang].placeholder;
  });
  
  document.querySelectorAll('#sourceLanguage option, #targetLanguage option').forEach(option => {
    const langCode = option.value;
    if (translations[lang].languages[langCode]) {
      option.textContent = translations[lang].languages[langCode];
    }
  });

  document.querySelectorAll('#interfaceLang option').forEach(option => {
    const langCode = option.value;
    if (translations[langCode]) {
      option.textContent = translations[langCode].languages[langCode];
    }
  });

  updateQueryString(lang);
  updateInstallButtonText(lang);
}

function initLanguage() {
  if (window.isLanguageInitialized) return;
  
  const urlLang = getQueryParam('lang');
  const userLang = navigator.language.split('-')[0];
  const lang = urlLang || (translations[userLang] ? userLang : 'en');
  
  setLanguage(lang);
  
  const interfaceLang = document.getElementById('interfaceLang');
  if (interfaceLang) {
    interfaceLang.value = lang;
  }
  
  window.isLanguageInitialized = true;
}

window.defaultLang = initLanguage();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function updateInstallButtonText(lang) {
  const installButton = document.getElementById('installButton');
  if (installButton) {
    const type = isMobileDevice() ? 'mobile' : 'desktop';
    installButton.textContent = translations[lang].installButton[type];
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'block';
    updateInstallButtonText(document.documentElement.lang);
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installButton.style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'none';
  }
});