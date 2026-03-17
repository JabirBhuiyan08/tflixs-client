import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Supported Languages ────────────────────────────────────────────────────
// Each entry: country code → { currency, symbol, language, languageName, locale }
const LOCALE_MAP = {
  US: { currency: 'USD', symbol: '$',   language: 'en', languageName: 'English',    locale: 'en-US' },
  GB: { currency: 'GBP', symbol: '£',   language: 'en', languageName: 'English',    locale: 'en-GB' },
  AU: { currency: 'AUD', symbol: 'A$',  language: 'en', languageName: 'English',    locale: 'en-AU' },
  NG: { currency: 'NGN', symbol: '₦',   language: 'en', languageName: 'English',    locale: 'en-NG' },
  GH: { currency: 'GHS', symbol: '₵',   language: 'en', languageName: 'English',    locale: 'en-GH' },
  KE: { currency: 'KES', symbol: 'KSh', language: 'en', languageName: 'English',    locale: 'en-KE' },
  BD: { currency: 'BDT', symbol: '৳',   language: 'bn', languageName: 'বাংলা',      locale: 'bn-BD' },
  IN: { currency: 'INR', symbol: '₹',   language: 'hi', languageName: 'हिंदी',      locale: 'hi-IN' },
  PK: { currency: 'PKR', symbol: '₨',   language: 'ur', languageName: 'اردو',       locale: 'ur-PK' },
  NP: { currency: 'NPR', symbol: '₨',   language: 'ne', languageName: 'नेपाली',     locale: 'ne-NP' },
  LK: { currency: 'LKR', symbol: 'Rs',  language: 'si', languageName: 'සිංහල',      locale: 'si-LK' },
  ID: { currency: 'IDR', symbol: 'Rp',  language: 'id', languageName: 'Indonesia',  locale: 'id-ID' },
  PH: { currency: 'PHP', symbol: '₱',   language: 'fil',languageName: 'Filipino',   locale: 'fil-PH' },
  TH: { currency: 'THB', symbol: '฿',   language: 'th', languageName: 'ภาษาไทย',    locale: 'th-TH' },
  VN: { currency: 'VND', symbol: '₫',   language: 'vi', languageName: 'Tiếng Việt', locale: 'vi-VN' },
  MY: { currency: 'MYR', symbol: 'RM',  language: 'ms', languageName: 'Melayu',     locale: 'ms-MY' },
  CN: { currency: 'CNY', symbol: '¥',   language: 'zh', languageName: '中文',        locale: 'zh-CN' },
  JP: { currency: 'JPY', symbol: '¥',   language: 'ja', languageName: '日本語',      locale: 'ja-JP' },
  KR: { currency: 'KRW', symbol: '₩',   language: 'ko', languageName: '한국어',      locale: 'ko-KR' },
  EG: { currency: 'EGP', symbol: 'E£',  language: 'ar', languageName: 'العربية',    locale: 'ar-EG' },
  SA: { currency: 'SAR', symbol: '﷼',   language: 'ar', languageName: 'العربية',    locale: 'ar-SA' },
  ET: { currency: 'ETB', symbol: 'Br',  language: 'am', languageName: 'አማርኛ',       locale: 'am-ET' },
  DE: { currency: 'EUR', symbol: '€',   language: 'de', languageName: 'Deutsch',    locale: 'de-DE' },
  FR: { currency: 'EUR', symbol: '€',   language: 'fr', languageName: 'Français',   locale: 'fr-FR' },
  BR: { currency: 'BRL', symbol: 'R$',  language: 'pt', languageName: 'Português',  locale: 'pt-BR' },
  MX: { currency: 'MXN', symbol: '$',   language: 'es', languageName: 'Español',    locale: 'es-MX' },
};

const DEFAULT_LOCALE = {
  country: 'US', countryName: 'United States',
  currency: 'USD', symbol: '$',
  language: 'en', languageName: 'English',
  locale: 'en-US',
};

// ─── Translations ───────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    tryCalculator:   'Try Calculator',
    startCalculating:'🧮 Start Calculating',
    readFarmingTips: 'Read Farming Tips',
    freeForFarmers:  'Free for All Farmers',
    heroTitle:       'Smart Fertilizer Calculator',
    heroSubtitle:    'for Better Harvests',
    heroDesc:        'Get accurate NPK fertilizer recommendations for any crop. Input your soil data, land area, and crop type — receive a precise fertilizer plan in seconds.',
    calculator:      'Calculator',
    blog:            'Blog',
    about:           'About',
    contact:         'Contact',
    home:            'Home',
    selectCrop:      'Select Crop',
    enterArea:       'Enter Area',
    soilData:        'Soil Data',
    results:         'Results',
    calculate:       '🧮 Calculate Now',
    calculating:     '⏳ Calculating...',
    nextStep:        'Next',
    back:            'Back',
    estCost:         'Est. Cost',
    totalCost:       'Total Est. Cost',
    disclaimer:      'General recommendations based on FAO/ICAR research. Actual needs vary by soil, variety & climate. Consult your local agronomist.',
    sendMessage:     '📤 Send Message',
    sending:         '⏳ Sending...',
    footerTagline:   'Smart fertilizer recommendations for modern farmers.',
    copyright:       '© {year} Tflixs. All rights reserved.',
    currencyNote:    'Prices shown in {currency}. Rates are approximate and may vary.',
  },
  bn: {
    tryCalculator:   'ক্যালকুলেটর ব্যবহার করুন',
    startCalculating:'🧮 হিসাব শুরু করুন',
    readFarmingTips: 'কৃষি টিপস পড়ুন',
    freeForFarmers:  'সকল কৃষকের জন্য বিনামূল্যে',
    heroTitle:       'স্মার্ট সার ক্যালকুলেটর',
    heroSubtitle:    'ভালো ফসলের জন্য',
    heroDesc:        'যেকোনো ফসলের জন্য সঠিক NPK সুপারিশ পান। মাটির তথ্য, জমির আকার ও ফসলের ধরন দিন — সেকেন্ডের মধ্যে সার পরিকল্পনা পান।',
    calculator:      'ক্যালকুলেটর',
    blog:            'ব্লগ',
    about:           'আমাদের সম্পর্কে',
    contact:         'যোগাযোগ',
    home:            'হোম',
    selectCrop:      'ফসল নির্বাচন করুন',
    enterArea:       'জমির পরিমাণ',
    soilData:        'মাটির তথ্য',
    results:         'ফলাফল',
    calculate:       '🧮 হিসাব করুন',
    calculating:     '⏳ হিসাব হচ্ছে...',
    nextStep:        'পরবর্তী',
    back:            'পিছনে',
    estCost:         'আনুমানিক খরচ',
    totalCost:       'মোট আনুমানিক খরচ',
    disclaimer:      'এগুলি FAO/ICAR গবেষণার উপর ভিত্তি করে সাধারণ সুপারিশ। প্রকৃত প্রয়োজনীয়তা মাটি, জাত ও আবহাওয়া অনুযায়ী পরিবর্তন হতে পারে। স্থানীয় কৃষি বিশেষজ্ঞের পরামর্শ নিন।',
    sendMessage:     '📤 বার্তা পাঠান',
    sending:         '⏳ পাঠানো হচ্ছে...',
    footerTagline:   'আধুনিক কৃষকদের জন্য স্মার্ট সার সুপারিশ।',
    copyright:       '© {year} Tflixs. সর্বস্বত্ব সংরক্ষিত।',
    currencyNote:    'মূল্য {currency}-তে দেখানো হচ্ছে। মূল্য পরিবর্তনশীল।',
  },
  hi: {
    tryCalculator:   'कैलकुलेटर आज़माएं',
    startCalculating:'🧮 गणना शुरू करें',
    readFarmingTips: 'खेती के टिप्स पढ़ें',
    freeForFarmers:  'सभी किसानों के लिए मुफ़्त',
    heroTitle:       'स्मार्ट उर्वरक कैलकुलेटर',
    heroSubtitle:    'बेहतर फसल के लिए',
    heroDesc:        'किसी भी फसल के लिए सटीक NPK अनुशंसा पाएं। मिट्टी का डेटा, क्षेत्रफल और फसल का प्रकार दर्ज करें — सेकंड में सटीक योजना पाएं।',
    calculator:      'कैलकुलेटर',
    blog:            'ब्लॉग',
    about:           'हमारे बारे में',
    contact:         'संपर्क',
    home:            'होम',
    selectCrop:      'फसल चुनें',
    enterArea:       'क्षेत्र दर्ज करें',
    soilData:        'मिट्टी डेटा',
    results:         'परिणाम',
    calculate:       '🧮 अभी गणना करें',
    calculating:     '⏳ गणना हो रही है...',
    nextStep:        'अगला',
    back:            'वापस',
    estCost:         'अनुमानित लागत',
    totalCost:       'कुल अनुमानित लागत',
    disclaimer:      'FAO/ICAR दिशानिर्देशों पर आधारित सामान्य सिफारिशें। वास्तविक आवश्यकताएं मिट्टी, किस्म और जलवायु के अनुसार भिन्न हो सकती हैं।',
    sendMessage:     '📤 संदेश भेजें',
    sending:         '⏳ भेजा जा रहा है...',
    footerTagline:   'आधुनिक किसानों के लिए स्मार्ट उर्वरक सिफारिशें।',
    copyright:       '© {year} Tflixs. सर्वाधिकार सुरक्षित।',
    currencyNote:    'कीमतें {currency} में। दरें अनुमानित हैं।',
  },
  ar: {
    tryCalculator:   'جرب الحاسبة',
    startCalculating:'🧮 ابدأ الحساب',
    readFarmingTips: 'اقرأ نصائح الزراعة',
    freeForFarmers:  'مجاني لجميع المزارعين',
    heroTitle:       'حاسبة الأسمدة الذكية',
    heroSubtitle:    'لمحاصيل أفضل',
    heroDesc:        'احصل على توصيات دقيقة لأسمدة NPK لأي محصول. أدخل بيانات التربة والمساحة ونوع المحصول.',
    calculator:      'الحاسبة',
    blog:            'المدونة',
    about:           'من نحن',
    contact:         'اتصل بنا',
    home:            'الرئيسية',
    selectCrop:      'اختر المحصول',
    enterArea:       'أدخل المساحة',
    soilData:        'بيانات التربة',
    results:         'النتائج',
    calculate:       '🧮 احسب الآن',
    calculating:     '⏳ جاري الحساب...',
    nextStep:        'التالي',
    back:            'رجوع',
    estCost:         'التكلفة التقديرية',
    totalCost:       'إجمالي التكلفة',
    disclaimer:      'توصيات عامة بناءً على إرشادات FAO. قد تختلف المتطلبات الفعلية. استشر خبيراً زراعياً.',
    sendMessage:     '📤 إرسال',
    sending:         '⏳ جاري الإرسال...',
    footerTagline:   'توصيات أسمدة ذكية للمزارعين الحديثين.',
    copyright:       '© {year} Tflixs. جميع الحقوق محفوظة.',
    currencyNote:    'الأسعار بـ {currency}. الأسعار تقريبية.',
  },
  id: {
    tryCalculator:   'Coba Kalkulator',
    startCalculating:'🧮 Mulai Hitung',
    readFarmingTips: 'Baca Tips Pertanian',
    freeForFarmers:  'Gratis untuk Semua Petani',
    heroTitle:       'Kalkulator Pupuk Cerdas',
    heroSubtitle:    'untuk Panen Lebih Baik',
    heroDesc:        'Dapatkan rekomendasi pupuk NPK untuk tanaman apapun. Masukkan data tanah, luas lahan, dan jenis tanaman.',
    calculator:      'Kalkulator',
    blog:            'Blog',
    about:           'Tentang Kami',
    contact:         'Hubungi',
    home:            'Beranda',
    selectCrop:      'Pilih Tanaman',
    enterArea:       'Masukkan Luas',
    soilData:        'Data Tanah',
    results:         'Hasil',
    calculate:       '🧮 Hitung Sekarang',
    calculating:     '⏳ Menghitung...',
    nextStep:        'Lanjut',
    back:            'Kembali',
    estCost:         'Estimasi Biaya',
    totalCost:       'Total Estimasi Biaya',
    disclaimer:      'Rekomendasi umum berdasarkan panduan FAO. Kebutuhan aktual berbeda tergantung tanah dan iklim.',
    sendMessage:     '📤 Kirim Pesan',
    sending:         '⏳ Mengirim...',
    footerTagline:   'Rekomendasi pupuk cerdas untuk petani modern.',
    copyright:       '© {year} Tflixs. Hak cipta dilindungi.',
    currencyNote:    'Harga dalam {currency}. Harga perkiraan dan dapat berbeda.',
  },
};

// Translate a key, with variable substitution
const translate = (lang, key, vars = {}) => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  return str;
};

// ─── Exchange Rates ─────────────────────────────────────────────────────────
// Fallback rates (USD base) — used when API is unavailable
const FALLBACK_RATES = {
  USD:1, EUR:0.92, GBP:0.79, INR:83.5, BDT:110, PKR:278, NPR:133,
  IDR:15700, PHP:57, THB:35, VND:24500, MYR:4.7, LKR:325,
  CNY:7.2, JPY:149, KRW:1320, NGN:1550, GHS:14, KES:130,
  EGP:31, SAR:3.75, BRL:5.0, MXN:17, AUD:1.53, ETB:56,
};

let cachedRates = null;
const fetchRates = async () => {
  if (cachedRates) return cachedRates;
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data.result === 'success') { cachedRates = data.rates; return cachedRates; }
  } catch (_) {}
  cachedRates = FALLBACK_RATES;
  return cachedRates;
};

// ─── Context ────────────────────────────────────────────────────────────────
const LocaleContext = createContext(null);
export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [rates,  setRates]  = useState(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 1. Load exchange rates
      const r = await fetchRates();
      setRates(r);

      // 2. Check saved user preference first
      try {
        const saved = localStorage.getItem('tflixs_locale');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate it has required fields
          if (parsed.country && parsed.currency && parsed.language) {
            setLocale(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (_) {}

      // 3. Auto-detect from IP (no permission needed)
      try {
        const res  = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code && LOCALE_MAP[data.country_code]) {
          const locData = LOCALE_MAP[data.country_code];
          const newLocale = {
            ...locData,
            country:     data.country_code,
            countryName: data.country_name || data.country_code,
          };
          setLocale(newLocale);
          // Don't save to localStorage — IP detection shouldn't override future manual choice
          setLoading(false);
          return;
        }
      } catch (_) {}

      // 4. Fallback: browser language
      try {
        const parts  = (navigator.language || 'en-US').split('-');
        const lang   = parts[0];
        const ctry   = parts[1];
        if (ctry && LOCALE_MAP[ctry]) {
          setLocale({ ...LOCALE_MAP[ctry], country: ctry, countryName: ctry });
        } else {
          const match = Object.entries(LOCALE_MAP).find(([, v]) => v.language === lang);
          if (match) setLocale({ ...match[1], country: match[0], countryName: match[0] });
        }
      } catch (_) {}

      setLoading(false);
    };
    init();
  }, []);

  // Manual language override — user-initiated, saved to localStorage
  const setManualLocale = useCallback((countryCode) => {
    const data = LOCALE_MAP[countryCode];
    if (!data) return;
    const newLocale = { ...data, country: countryCode, countryName: countryCode };
    setLocale(newLocale);
    localStorage.setItem('tflixs_locale', JSON.stringify(newLocale));
  }, []);

  // Reset to auto-detection
  const resetLocale = useCallback(() => {
    localStorage.removeItem('tflixs_locale');
    window.location.reload(); // re-run init with fresh detection
  }, []);

  // Convert a USD amount to local currency
  const convertPrice = useCallback((usdAmt) => {
    const rate = rates[locale.currency] || 1;
    return Math.round(usdAmt * rate * 100) / 100;
  }, [rates, locale.currency]);

  // Format price with symbol
  const formatPrice = useCallback((usdAmt) => {
    const converted = convertPrice(usdAmt);
    // For currencies with large numbers (IDR, VND, KRW), don't show decimals
    const largeDecimals = ['IDR','VND','KRW','KHR','MMK'].includes(locale.currency);
    const formatted = largeDecimals
      ? Math.round(converted).toLocaleString()
      : converted.toLocaleString(locale.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return `${locale.symbol}${formatted}`;
  }, [convertPrice, locale]);

  const t = useCallback((key, vars = {}) => translate(locale.language, key, vars), [locale.language]);

  const isRTL = ['ar', 'ur', 'he', 'fa'].includes(locale.language);

  return (
    <LocaleContext.Provider value={{
      locale, loading, rates,
      convertPrice, formatPrice,
      t, translate: t,
      setManualLocale, resetLocale,
      isRTL,
      LOCALE_MAP,
    }}>
      {/* Apply RTL and lang attribute at document level */}
      {isRTL
        ? <div dir="rtl" lang={locale.language}>{children}</div>
        : <div dir="ltr" lang={locale.language}>{children}</div>
      }
    </LocaleContext.Provider>
  );
};
