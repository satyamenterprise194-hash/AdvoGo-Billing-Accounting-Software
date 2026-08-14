/* ============================================================
   ADVO GO — Landing page interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    var toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = (c.getAttribute('data-target') || '0') + (c.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Language toggle (EN / हिंदी) for the whole site ----------
     English lives in index.html (default). Hindi translations are in the
     I18N_HI dictionary below — the `data-i18n` attribute on an element
     points to its key. Add a new key here whenever you translate new text. */
  var LANG_KEY = 'advogo_lang';
  var curLang = 'en';

  var I18N_HI = {
    /* nav */
    navFeat: 'फ़ीचर्स', navProd: 'प्रोडक्ट', navRev: 'रिव्यूज़', navCmp: 'तुलना',
    navPrice: 'कीमत', navDown: 'डाउनलोड', navFaq: 'सवाल-जवाब', navPart: 'पार्टनर', navContact: 'संपर्क',
    navCta: 'शुरू करें',
    /* hero */
    heroPill: '🇮🇳 भारत के लिए बना · 40+ देशों में चलता है',
    heroH1: 'बिज़नेस बिलिंग और अकाउंटिंग जो <span class="grad-text">ऑफलाइन चलती है</span> — हमेशा के लिए।',
    heroSub: 'ADVO GO एक पूरा बिलिंग, POS, इन्वेंट्री और अकाउंटिंग सूट है जो आपके कंप्यूटर पर <strong>100% ऑफलाइन</strong> चलता है। कोई अनिवार्य सब्सक्रिप्शन नहीं। कोई अकाउंट नहीं। कोई छिपा चार्ज नहीं। आपका डेटा कभी आपकी मशीन से बाहर नहीं जाता।',
    heroCta1: 'ADVO GO पाएं',
    heroCta2: 'फ़ीचर्स देखें',
    heroRating: '[भारत भर के 500+ कारोबारियों द्वारा रेटेड]',
    trust1: '<span class="tick">✓</span> फ्री प्लान उपलब्ध',
    trust2: '<span class="tick">✓</span> 7 दिन का पूरा ट्रायल',
    trust3: '<span class="tick">✓</span> कोई क्रेडिट कार्ड नहीं',
    trust4: '<span class="tick">✓</span> कभी भी कैंसल करें',
    /* hero */
    mkTitle: 'ADVO GO — डैशबोर्ड',
    chip1b: 'इनवॉइस #1240 सेव हो गया', chip1i: 'GST अपने आप कैलकुलेट हुआ',
    chip2b: 'ऑर्डर WhatsApp पर भेजा गया', chip2i: '“ऑर्डर मिल गया” की सूचना',
    /* marquee */
    mq1: 'GST बिलिंग', mq3: 'इन्वेंट्री और BOM', mq4: 'खाता / लेजर',
    mq5: 'WhatsApp मार्केटिंग', mq8: 'फाइनेंशियल रिपोर्ट्स', mq9: '100% ऑफलाइन',
    /* stats */
    st1: 'देशों में सपोर्ट', st2: '% ऑफलाइन — कहीं भी चलता है',
    st3: 'बिज़नेस मॉड्यूल एक ही ऐप में', st4: 'दिन का फ्री ट्रायल',
    /* features */
    fPill: 'आपके बिज़नेस के लिए सब कुछ',
    fH2: 'एक ऐप। हर रुपया हिसाब में।',
    fSub: 'चाहे तुरंत POS सेल हो या GSTR-3B फाइलिंग — ADVO GO पाँच ऐप्स की जगह एक ऐप देता है, जिसे इंटरनेट की ज़रूरत ही नहीं।',
    f1h: 'बिजली-सी तेज़ POS',
    f1p: 'आइटम ग्रिड, कार्ट, डिस्काउंट और पेमेंट मोड वाली बिलिंग स्क्रीन। सेकंडों में सेल सेव करें।',
    f2h: 'GST इनवॉइस और डॉक्यूमेंट',
    f2p: 'CGST/SGST/IGST विभाजन और एक-क्लिक प्रिंट के साथ सेल, खरीद, कोटेशन, ऑर्डर और चालान।',
    f3h: 'इन्वेंट्री और BOM',
    f3p: 'स्टॉक, HSN कोड, GST दरें और यूनिट ट्रैक करें। बिल ऑफ मैटेरियल्स बनाएं और कम-स्टॉक अलर्ट पाएं।',
    f4h: 'खाता और लेजर',
    f4p: 'ग्राहक/सप्लायर बैलेंस, बकाया ट्रैकिंग और एक-टैप WhatsApp पेमेंट रिमाइंडर।',
    f5h: 'WhatsApp मार्केटिंग',
    f5p: 'ऑडियंस फ़िल्टर वाले कैम्पेन, ऑटो “ऑर्डर मिल गया” मैसेज, इनवॉइस शेयरिंग और पूरा सेंड लॉग।',
    f6p: 'पोर्टल JSON एक्सपोर्ट, एडिटेबल वैल्यू वाली IMS-आधारित GSTR-3B, रिकंसिलेशन और TDS/TCS रजिस्टर।',
    f7h: 'फाइनेंशियल रिपोर्ट्स',
    f7p: 'बैलेंस शीट, P&amp;L, ट्रायल बैलेंस, कैश फ्लो और GST समरी — आपके बुक्स से तुरंत तैयार।',
    f8h: 'कैश और बैंक, UPI QR',
    f8p: 'बैंक स्टेटमेंट PDF इम्पोर्ट जो एंट्री खुद पोस्ट करता है, साथ में हर इनवॉइस पर स्कैन-टू-पे UPI QR।',
    f9h: 'ई-इनवॉइस और ई-वे बिल',
    f9p: 'सेव इनवॉइस से IRN + EWB जनरेशन, सरकारी पोर्टल के लिए तैयार।',
    f10h: 'मल्टी-कंपनी',
    f10p: 'कई बिज़नेस एक साथ चलाएं — एक-क्लिक स्विचिंग और अलग डेटाबेस के साथ।',
    f11h: 'लाइसेंस्ड और सुरक्षित',
    f11p: 'साइन्ड, मशीन-लॉक्ड लाइसेंस। डेटाबेस आपके कंप्यूटर पर असली SQLite है — कुछ भी कहीं नहीं भेजा जाता।',
    f12h: 'ग्लोबल, डिफ़ॉल्ट रूप से',
    f12p: '40+ देश: GST, VAT, सेल्स टैक्स या कुछ नहीं। करेंसी, लेबल और डेट फॉर्मेट आपके देश के हिसाब से अपने आप बदलते हैं।',
    /* product deep dive */
    pPill: 'ADVO GO के अंदर',
    pH2: 'भारतीय बिज़नेस जिस तरह चलते हैं, उसी के लिए बना',
    pSub: 'हर स्क्रीन स्पीड के लिए डिज़ाइन की गई है — कीबोर्ड-फर्स्ट, सर्चेबल, और ज़रूरत पड़ते ही प्रिंट करने लायक।',
    d1h: 'क्विक एक्शन और ग्लोबल सर्च',
    d1p: 'क्विक-एक्शन पैलेट के लिए <span class="kbd">Esc</span> दबाएं, कुछ भी सर्च करने के लिए <span class="kbd">Ctrl+K</span> — आइटम, पार्टी, इनवॉइस — ऐप में कहीं से भी।',
    d2h: 'असली SQLite डेटाबेस',
    d2p: 'आपकी बुक्स असली SQLite फाइल में रहती हैं। <code>.db</code> डाउनलोड करें, किसी भी SQLite टूल में खोलें, या JSON बैकअप से कभी भी रिस्टोर करें।',
    d3h: 'हर चीज़ पर ऑडिट ट्रेल',
    d3p: 'ऐप में हर क्रिएट, एडिट और डिलीट टाइमस्टैम्प के साथ लॉग होता है — ज़रूरत पड़ने पर CSV में एक्सपोर्ट करें।',
    d4h: 'प्रिंट-रेडी डॉक्यूमेंट',
    d4p: 'इनवॉइस, कोटेशन, ई-वे बिल और फाइनेंशियल रिपोर्ट्स — सब साफ A4 लेआउट में सही GST फॉर्मेटिंग के साथ।',
    d6h: 'बैकअप, अपने आप',
    d6p: 'ऑप्शनल ऑटो-बैकअप हर 7 दिन में ताज़ा कॉपी रखता है। रिस्टोर एक क्लिक में — या सीधे .db फाइल इम्पोर्ट करें।',
    /* how it works */
    sPill: 'शुरुआत कैसे करें',
    sH2: '3 मिनट से भी कम में शुरू',
    s1h: 'इंस्टॉल करें और खोलें',
    s1p: 'इंस्टॉलर चलाएं (या वेबसाइट खोलें) — सब कुछ आपके ब्राउज़र में काम करता है, बिना साइन-अप के।',
    s2h: 'अपना बिज़नेस जोड़ें',
    s2p: 'बिज़नेस प्रोफाइल सेट करें, देश चुनें, आइटम और पार्टी जोड़ें। कुछ ही मिनटों में तैयार।',
    s3h: 'बिल करें, ट्रैक करें, बढ़ें',
    s3p: 'GST इनवॉइस बनाएं, UPI QR से पेमेंट पाएं, WhatsApp रिमाइंडर भेजें — और रिपोर्ट्स खुद बनती देखें।',
    /* testimonials (placeholders — apne real reviews se replace karein) */
    tPill: 'कारोबारियों की पसंद',
    tH2: 'दुकानदार, CA और व्यापारी ADVO GO पर भरोसा करते हैं',
    tSub: 'किराना स्टोर से लेकर इलेक्ट्रिकल होलसेलर तक — देखिए उन्होंने क्यों स्विच किया।',
    t1q: '[ग्राहक 1 का असली रिव्यू — जैसे “बिलिंग आसान और फास्ट है, WhatsApp इनवॉइस भी सीधा चला जाता है।”]',
    t1n: '[ग्राहक 1 का नाम]', t1b: '[बिज़नेस का नाम · शहर]',
    t2q: '[ग्राहक 2 का असली रिव्यू — जैसे “GST रिटर्न और स्टॉक रिपोर्ट से समय की बचत हुई।”]',
    t2n: '[ग्राहक 2 का नाम]', t2b: '[बिज़नेस का नाम · शहर]',
    t3q: '[ग्राहक 3 का असली रिव्यू — जैसे “100% ऑफलाइन, डेटा भी हमारे कंप्यूटर पर ही रहता है।”]',
    t3n: '[ग्राहक 3 का नाम]', t3b: '[बिज़नेस का नाम · शहर]',
    /* pricing */
    prPill: 'सरल कीमत',
    prH2: 'फ्री शुरू करें। बढ़ने पर अपग्रेड करें।',
    prSub: 'हमेशा फ्री शुरू करें, या सालाना प्लान चुनें — हर पेड प्लान एक आसान सालाना सब्सक्रिप्शन है, जिसमें सब कुछ शामिल है।',
    freePrice: '₹ 0 <span>हमेशा</span>',
    freeD: 'बेसिक बिलिंग के साथ शुरुआत के लिए।',
    free1: 'GST बिलिंग और प्रिंट',
    free2: 'महीने में 5 इनवॉइस तक',
    free3: '1 यूज़र', free4: 'बेसिक रिपोर्ट्स', free5: 'कम्युनिटी सपोर्ट',
    freeBtn: 'फ्री शुरू करें',
    allModules: 'सारे मॉड्यूल शामिल',
    unlimInv: 'अनलिमिटेड इनवॉइस',
    prioSupport: 'प्रायोरिटी सपोर्ट',
    silPrice: '₹ 1,599 <span>/ साल</span>',
    silD: 'एक कंप्यूटर पर ADVO GO का 1 साल।',
    sil1: '1 यूज़र · मशीन-लॉक्ड',
    sil4: '1 साल शामिल',
    emailSupport: 'ईमेल सपोर्ट',
    silBtn: 'SILVER लें',
    diaPrice: '₹ 2,999 <span>/ साल</span>',
    diaD: 'कई मशीनों पर ADVO GO का 1 साल।',
    dia1: '5 यूज़र · पोर्टेबल',
    diaBtn: 'DIAMOND लें',
    golPrice: '₹ 6,999 <span>/ साल</span>',
    golD: 'टीम और मल्टी-कंपनी के लिए ADVO GO का 1 साल।',
    gol1: '10 यूज़र · पोर्टेबल',
    gol3: 'मल्टी-कंपनी सपोर्ट',
    gol5: 'समर्पित ऑनबोर्डिंग',
    golBtn: 'GOLD लें',
    priceNote: 'हर प्लान पूरे वर्जन के <strong>7-दिन के फ्री ट्रायल</strong> से शुरू होता है। सभी पेड प्लान <strong>सालाना सब्सक्रिप्शन</strong> हैं — कभी भी कैंसल या रिन्यू करें। FREE प्लान हमेशा के लिए फ्री है।',
    ptTitle: 'प्लान्स की साथ-साथ तुलना करें',
    ptFeat: 'फ़ीचर्स', ptPrice: 'कीमत', ptUsers: 'यूज़र', ptInvoices: 'इनवॉइस',
    pt30: '5 / माह', ptUnlim: 'अनलिमिटेड', ptBasic: 'बेसिक',
    ptGST: 'GST बिलिंग और प्रिंट', ptInv: 'इन्वेंट्री और BOM',
    ptKhata: 'खाता / लेजर', ptWa: 'WhatsApp मार्केटिंग',
    ptEinv: 'ई-इनवॉइस · ई-वे बिल',
    ptFin: 'फाइनेंशियल रिपोर्ट्स', ptMc: 'मल्टी-कंपनी',
    ptSup: 'प्रायोरिटी / ऑनबोर्डिंग',
    /* FAQ */
    faqPill: 'सवाल-जवाब',
    faqH2: 'सवालों के जवाब',
    faq1q: 'क्या ADVO GO सच में बिना इंटरनेट चलता है?',
    faq1a: 'हाँ — 100%। ऐप और आपका सारा डेटा पूरी तरह आपके कंप्यूटर पर चलता है। सिर्फ ऑप्शनल इंटरनेट फ़ीचर्स हैं — लोकेशन डिटेक्शन, GSTIN लुकअप और WhatsApp Cloud API — और इन्हें भी बिना डेटा ऑनलाइन स्टोर किए इस्तेमाल कर सकते हैं।',
    faq2q: 'मेरा डेटा कहाँ स्टोर होता है?',
    faq2a: 'आपके कंप्यूटर पर असली SQLite डेटाबेस फाइल में। कुछ भी किसी सर्वर पर अपलोड नहीं होता। .db फाइल डाउनलोड करके स्टैंडर्ड SQLite टूल्स से खोल सकते हैं, या JSON बैकअप एक्सपोर्ट कर सकते हैं।',
    faq3q: 'क्या यह भारत के लिए GST-कम्प्लायंट है?',
    faq3a: 'हाँ। यह CGST/SGST/IGST के साथ GST इनवॉइस बनाता है, सही फॉर्मेट प्रिंट करता है, GSTR-1/IFF/GSTR-3B पोर्टल JSON एक्सपोर्ट करता है, ई-इनवॉइस (IRN) और ई-वे बिल सपोर्ट करता है, और TDS/TCS रजिस्टर व रिकंसिलेशन भी देता है।',
    faq4q: 'क्या मैं इसे भारत के बाहर इस्तेमाल कर सकता हूँ?',
    faq4a: 'बिल्कुल। 40+ देश पहले से शामिल हैं — VAT, सेल्स टैक्स या नो-टैक्स मोड, लोकल करेंसी सिंबल, टैक्स लेबल और डेट फॉर्मेट — सब आपके चुने हुए देश के हिसाब से।',
    faq5q: 'लाइसेंस कैसे काम करता है?',
    faq5a: 'सभी प्लान <b>सालाना सब्सक्रिप्शन</b> हैं। <b>FREE</b> प्लान हमेशा के लिए बेसिक बिलिंग देता है; <b>SILVER ₹1,599</b> / <b>DIAMOND ₹2,999</b> / <b>GOLD ₹6,999</b> सारे फ़ीचर्स और ज़्यादा यूज़र देते हैं — हर एक ADVO GO का 1 साल देता है। मशीन-लॉक्ड टियर एक कंप्यूटर से बंधे होते हैं; पोर्टेबल टियर आपकी सीट लिमिट तक चलते हैं। हर पेड प्लान 7-दिन के फ्री ट्रायल से शुरू होता है।',
    faq6q: 'अगर मैं पहले से दूसरा सॉफ्टवेयर इस्तेमाल करता हूँ तो?',
    faq6a: 'पार्टी और आइटम लिस्ट Excel से इम्पोर्ट कर सकते हैं, और पुराने BusinessBook फॉर्मेट के बैकअप भी रिस्टोर कर सकते हैं। WhatsApp पर संपर्क करें — हम आपका डेटा माइग्रेट करने में मदद करेंगे।',
    faq7q: 'सालाना प्लान रिन्यू होने पर क्या होता है?',
    faq7a: 'कुछ नहीं टूटता — आपका डेटा कंप्यूटर पर रहता है और ऐप चलता रहता है। साल खत्म होने पर उसी कीमत पर रिन्यू करके सारे फ़ीचर्स जारी रखें, या FREE प्लान (5 इनवॉइस/माह) पर वापस आ जाएं — दोनों ही स्थिति में डेटा कभी नहीं जाता।',
    /* partners */
    paPill: 'पार्टनर प्रोग्राम',
    paH2: 'ADVO GO पार्टनर बनें',
    paSub: 'रीसेलर, CA/अकाउंटेंट, कंप्यूटर शॉप और फ्रीलांसर — आपके लाए हर लाइसेंस पर कमाएं। नो स्टॉक, नो इन्वेस्टमेंट, नो पेपरवर्क।',
    pb1h: 'ऊँचा कमीशन',
    pb1p: 'आपके बेचे हर SILVER, DIAMOND और GOLD लाइसेंस पर मार्जिन कमाएं — हर बार जल्दी पेमेंट।',
    pb2h: 'मार्केटिंग किट',
    pb2p: 'अपने शहर में ADVO GO प्रमोट करने के लिए बैनर, ब्रोशर, सैंपल इनवॉइस और डेमो वीडियो पाएं।',
    pb3h: 'डेमो और इंस्टॉलेशन मदद',
    pb3p: 'हम आपके ग्राहकों के लिए सॉफ्टवेयर इंस्टॉल, एक्टिवेट और डेमो करने में मदद करते हैं — कोई तकनीकी स्किल ज़रूरी नहीं।',
    pb4h: 'आपका अपना कस्टमर बेस',
    pb4p: 'जिन दुकानों को आप पहले से सर्विस करते हैं, उन्हें बिलिंग सॉफ्टवेयर दें — CA क्लाइंट, हार्डवेयर स्टोर, व्यापारी।',
    pfH3: 'पार्टनर बनने के लिए जुड़ें',
    pfSub: 'फॉर्म भरें — 24 घंटे के अंदर WhatsApp पर डिटेल्स भेज देंगे।',
    pfNameL: 'पूरा नाम', pfPhoneL: 'WhatsApp नंबर', pfBizL: 'व्यवसाय / पेशा',
    pfStateL: 'राज्य', pfCityL: 'शहर / कस्बा',
    pfMsgL: 'कुछ और?', pfMsgOpt: '(वैकल्पिक)',
    pfStatePh: 'राज्य चुनें…',
    pfOther: 'अन्य (भारत के बाहर)',
    pfSubmit: 'WhatsApp पर भेजें',
    pfOk: '✅ आपकी जानकारी तैयार है — WhatsApp मैसेज के साथ खुलेगा। बस Send दबाएं।',
    pfErr: 'कृपया अपना नाम, सही WhatsApp नंबर भरें और राज्य चुनें।',
    /* CTA + footer */
    ctaH2: 'ऑफलाइन बिलिंग पर आने के लिए तैयार?',
    ctaP: 'आज ही अपना 7-दिन का फ्री ट्रायल शुरू करें। न अकाउंट, न क्रेडिट कार्ड, न इंटरनेट।',
    ctaBtn1: 'फ्री ट्रायल शुरू करें',
    ctaBtn2: 'WhatsApp करें',
    ctaHrs: '🕙 सोम–शनि, सुबह 10–शाम 7',
    ftTagline: 'बिलिंग और अकाउंटिंग <b>PR Component</b> द्वारा',
    ftProd: 'प्रोडक्ट', ftFeat: 'फ़ीचर्स', ftPrice: 'कीमत', ftFaq: 'सवाल-जवाब',
    ftCmp: 'Vyapar, Busy, Tally से तुलना',
    ftComp: 'कंपनी', ftContact: 'संपर्क',
    ftWaHelp: 'WhatsApp सहायता', ftPartner: 'पार्टनर बनें',
    ftMuted: 'सोम–शनि, सुबह 10–शाम 7',
    ftHigh: 'खास बातें',
    ftGst: 'GST रिटर्न्स', ftWaMkt: 'WhatsApp मार्केटिंग',
    ftUpi: 'UPI QR पेमेंट्स', ftEinv: 'ई-इनवॉइस / ई-वे बिल',
    ftRights: 'सर्वाधिकार सुरक्षित।',
    ftTag: '💜 भारत में बना — धरती पर कहीं भी चलता है।',
    /* downloads */
    dlPill: 'ADVO GO पाएं',
    dlH2: 'अपने डिवाइस के लिए डाउनलोड करें',
    dlSub: 'Windows डेस्कटॉप ऐप इंस्टॉल करने के लिए तैयार है।',
    dlWinH: 'Windows के लिए ADVO GO',
    dlWinP: 'आपके PC पर पूरी बिलिंग, POS, इन्वेंट्री और अकाउंटिंग — 100% ऑफलाइन, A4 इनवॉइस प्रिंट, GST रिटर्न्स, ई-इनवॉइस और ई-वे बिल।',
    dlVerPh: 'नवीनतम वर्शन',
    dlWinBtn: '⬇ EXE डाउनलोड करें',
    dlNote: 'इंस्टॉलर में कोई दिक्कत? WhatsApp करें — हम आपको ताज़ा सेटअप फाइल सीधे भेज देंगे।',
    /* document title + meta description */
    title: 'ADVO GO — बिलिंग और अकाउंटिंग, 100% ऑफलाइन',
    desc: 'ADVO GO by PR Component — GST बिलिंग, POS, इन्वेंट्री, अकाउंटिंग, WhatsApp मार्केटिंग और रिपोर्ट्स। पूरी तरह ऑफलाइन। आपका डेटा कभी आपके कंप्यूटर से बाहर नहीं जाता।'
  };

  /* Dynamic strings + input placeholders (used by data-i18n-ph and JS text) */
  var I18N_DYN = {
    pfNamePh: { en: 'e.g. Ramesh Kumar', hi: 'जैसे: रमेश कुमार' },
    pfPhonePh: { en: 'e.g. 98765 43210', hi: 'जैसे: 98765 43210' },
    pfBizPh: { en: 'e.g. Computer shop, CA, freelancer', hi: 'जैसे: कंप्यूटर शॉप, CA, फ्रीलांसर' },
    pfCityPh: { en: 'Type to pick a city…', hi: 'शहर टाइप करें…' },
    pfMsgPh: { en: 'How many customers do you expect to bring per month?', hi: 'हर महीने कितने ग्राहक लाने की उम्मीद है?' },
    cityFirst: { en: 'Select a state first', hi: 'पहले राज्य चुनें' },
    cityType: { en: 'Type to pick a city…', hi: 'शहर टाइप करें…' },
    cityType2: { en: 'Type your city…', hi: 'अपना शहर टाइप करें…' }
  };

  // Capture the original English HTML once, before any swap
  var i18nEls = document.querySelectorAll('[data-i18n]');
  var i18nPhEls = document.querySelectorAll('[data-i18n-ph]');
  var enHtml = {};
  i18nEls.forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (k && !(k in enHtml)) enHtml[k] = el.innerHTML;
  });

  var navLangBtns = document.querySelectorAll('#navLang .lang-btn');
  var metaDesc = document.querySelector('meta[name="description"]');
  var EN_TITLE = document.title;
  var EN_DESC = metaDesc ? metaDesc.getAttribute('content') : '';

  function dyn(key) {
    var pair = I18N_DYN[key];
    if (!pair) return '';
    return curLang === 'hi' ? pair.hi : pair.en;
  }

  var cmpSec = document.getElementById('compare');
  var cmpLangBtns = cmpSec ? cmpSec.querySelectorAll('.lang-btn') : [];
  var cmpLangEls = cmpSec ? cmpSec.querySelectorAll('[data-lang]') : [];
  function setCompareLang(lang) {
    if (!cmpSec) return;
    cmpLangEls.forEach(function (el) {
      el.classList.toggle('hidden', el.getAttribute('data-lang') !== lang);
    });
    cmpLangBtns.forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyLang(lang) {
    curLang = lang === 'hi' ? 'hi' : 'en';
    document.documentElement.lang = curLang;
    i18nEls.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      el.innerHTML = curLang === 'hi' && I18N_HI[k] ? I18N_HI[k] : enHtml[k];
    });
    i18nPhEls.forEach(function (el) {
      el.setAttribute('placeholder', dyn(el.getAttribute('data-i18n-ph')));
    });
    navLangBtns.forEach(function (b) {
      var on = b.getAttribute('data-nav-lang') === curLang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.title = curLang === 'hi' && I18N_HI.title ? I18N_HI.title : EN_TITLE;
    if (metaDesc) metaDesc.setAttribute('content', curLang === 'hi' && I18N_HI.desc ? I18N_HI.desc : EN_DESC);
    // keep social sharing tags in sync with the selected language
    var T = curLang === 'hi' && I18N_HI.title ? I18N_HI.title : EN_TITLE;
    var D = curLang === 'hi' && I18N_HI.desc ? I18N_HI.desc : EN_DESC;
    ['ogTitle', 'twTitle'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('content', T);
    });
    ['ogDesc', 'twDesc'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('content', D);
    });
    setCompareLang(curLang);
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
    try { localStorage.setItem(LANG_KEY, curLang); } catch (e) { /* file:// may block */ }
  }

  navLangBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(b.getAttribute('data-nav-lang'));
    });
  });
  // Compare-section buttons now drive the whole site's language too
  cmpLangBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(b.getAttribute('data-lang-btn'));
    });
  });
  // remember the visitor's last language choice (migrate the old compare key)
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (!saved) saved = localStorage.getItem('advogo_cmp_lang');
    applyLang(saved === 'hi' ? 'hi' : 'en');
  } catch (e) { applyLang('en'); }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close others for a tidy accordion
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ---------- Partner form → WhatsApp ---------- */
  var PARTNER_WHATSAPP = '919718437209';
  var partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    /* State → popular cities, for the city autosuggest */
    var CITIES = {
      'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Rajahmundry'],
      'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
      'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
      'Chandigarh': ['Chandigarh'],
      'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
      'Delhi': ['New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Karol Bagh', 'Lajpat Nagar', 'Saket'],
      'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand'],
      'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat'],
      'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Mandi', 'Solan', 'Kullu'],
      'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur'],
      'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
      'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere'],
      'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha'],
      'Ladakh': ['Leh', 'Kargil'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Ratlam'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Navi Mumbai'],
      'Manipur': ['Imphal', 'Thoubal', 'Bishnupur'],
      'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
      'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
      'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
      'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri', 'Berhampur'],
      'Puducherry': ['Puducherry', 'Karaikal', 'Yanam'],
      'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Sikar'],
      'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'],
      'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
      'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad', 'Meerut', 'Prayagraj', 'Bareilly', 'Gorakhpur'],
      'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani', 'Roorkee'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Bardhaman', 'Malda'],
      'Andaman & Nicobar': ['Port Blair'],
      'Dadra & Nagar Haveli': ['Silvassa'],
      'Daman & Diu': ['Daman', 'Diu'],
      'Lakshadweep': ['Kavaratti', 'Agatti']
    };

    var stateSel = document.getElementById('pf-state');
    var cityInput = document.getElementById('pf-city');
    var cityList = document.getElementById('pf-city-list');
    var lastState = '';

    if (cityInput) cityInput.placeholder = dyn('cityFirst');

    function fillCitySuggestions() {
      var state = stateSel.value;
      if (!state || state === lastState) return;
      lastState = state;
      cityList.innerHTML = '';
      var cities = CITIES[state] || [];
      cities.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        cityList.appendChild(opt);
      });
      cityInput.value = ''; // start fresh for the new state
      cityInput.placeholder = cities.length ? dyn('cityType') : dyn('cityType2');
    }
    if (stateSel) stateSel.addEventListener('change', fillCitySuggestions);

    partnerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('pf-name').value || '').trim();
      var phone = (document.getElementById('pf-phone').value || '').trim().replace(/[^0-9]/g, '');
      var business = (document.getElementById('pf-biz').value || '').trim();
      var state = stateSel ? stateSel.value : '';
      var city = (document.getElementById('pf-city').value || '').trim();
      var msg = (document.getElementById('pf-msg').value || '').trim();
      var okEl = document.getElementById('pfOk');
      var errEl = document.getElementById('pfErr');
      if (okEl) okEl.classList.add('hidden');
      if (errEl) errEl.classList.add('hidden');

      // accept "+91 98765 43210" too — strip a leading country code before validating
      var localPhone = /^91\d{10}$/.test(phone) ? phone.slice(2) : phone;
      var valid = name.length > 0 && /^[6-9]\d{9}$/.test(localPhone) && state.length > 0;
      if (!valid) {
        if (errEl) errEl.classList.remove('hidden');
        return;
      }

      var lines = ['*New ADVO GO Partner Enquiry*', '']; // markdown bold works on WhatsApp
      lines.push('Name: ' + name);
      lines.push('Phone: +91 ' + localPhone);
      if (business) lines.push('Business: ' + business);
      if (state) lines.push('State: ' + state);
      if (city) lines.push('City: ' + city);
      if (msg) lines.push('Note: ' + msg);
      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + PARTNER_WHATSAPP + '?text=' + text;
      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url; // popup blocked → open in same tab
      if (okEl) okEl.classList.remove('hidden');
      partnerForm.reset();
      if (cityList) cityList.innerHTML = '';
      lastState = '';
    });
  }

  /* ---------- 3D tilt on cards (mouse-following) ---------- */
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (finePointer && !noMotion) {
    var TILT_CARDS = '.f-card, .price-card, .testi-card, .step, .pb-item';
    var tiltCards = document.querySelectorAll(TILT_CARDS);
    var MAX_TILT = 7;
    function tiltCard(card) {
      card.classList.add('tiltable');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var rx = -py * MAX_TILT;
        var ry = px * MAX_TILT;
        var scale = card.classList.contains('featured') ? 1.04 : 1.02;
        card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(' + scale + ',' + scale + ',' + scale + ')';
        card.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    }
    tiltCards.forEach(tiltCard);

    /* Hero mockup 3D parallax — the window leans toward the cursor and the
       floating chips pop at different depths. */
    var heroVisual = document.querySelector('.hero-visual');
    var mockWin = document.querySelector('.mock-window');
    if (heroVisual && mockWin) {
      heroVisual.addEventListener('mousemove', function (e) {
        var r = heroVisual.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        mockWin.style.transform = 'perspective(1200px) rotateY(' + (px * 10).toFixed(2) + 'deg) rotateX(' + (-py * 8).toFixed(2) + 'deg)';
      });
      heroVisual.addEventListener('mouseleave', function () {
        mockWin.style.transform = '';
      });
    }
  }

  /* ---------- Downloads & software updates ----------
     The website reads updates.json at the site root. That file is edited with
     the separate ADVO GO Update Tool (update-tool.html / update-tool.mjs) —
     the website itself never edits it. The Download button always points to
     the newest EXE and starts the download directly. */
  var EXE_BTN = document.getElementById('dlExeBtn');
  var EXE_VER = document.getElementById('dlExeVer');
  var updateState = { exe: { version: '', url: '' } };

  function applyUpdates(u) {
    updateState = u || updateState;
    var exe = updateState.exe || {};
    if (EXE_VER && exe.version) {
      EXE_VER.textContent = curLang === 'hi'
        ? ('वर्शन ' + exe.version)
        : ('Version ' + exe.version);
    }
  }

  // read the published updates.json (written by the Update Tool, never by this page)
  // Sirf real JSON accept karo — koi host/redirect HTML de de (jaise parked page)
  // to ignore karo, defaults stay.
  fetch('updates.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) return null;
      var ct = (r.headers.get('content-type') || '');
      if (ct.indexOf('json') === -1) return null;
      return r.json();
    })
    .then(function (j) { if (j && j.exe) applyUpdates(j); })
    .catch(function () { /* file:// or offline — defaults stay */ });

  // EXE button → direct download
  // Google Drive ka "view" link click karne par sirf page kholta hai —
  // use direct download link me convert karo taaki EXE khud download ho.
  function directDownloadUrl(u) {
    if (!u) return '';
    var m = String(u).match(/drive\.google\.com\/file\/d\/([^\/?#]+)/);
    // confirm=t: bade files (>100 MB) par Drive ka "virus scan" warning page skip
    // karne ki koshish — taaki EXE seedha download ho.
    return m ? 'https://drive.google.com/uc?export=download&confirm=t&id=' + m[1] : u;
  }
  function openTab(u) {
    var w = window.open(u, '_blank', 'noopener');
    if (!w) { // popup blocked → fall back to a click on a temp link
      var a = document.createElement('a');
      a.href = u;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
  function setDlMsg(text, ok) {
    var el = document.getElementById('dlMsg');
    if (!el) return;
    if (!text) { el.style.display = 'none'; return; }
    el.textContent = text;
    el.style.display = 'block';
    el.style.background = ok ? '#ecfdf5' : '#fef3c7';
    el.style.color = ok ? '#059669' : '#b45309';
  }
  if (EXE_BTN) {
    EXE_BTN.addEventListener('click', function () {
      var raw = (updateState.exe || {}).url || '';
      var url = directDownloadUrl(raw);
      // Sirf real http(s) link kholo. Empty/garbage URL par WhatsApp section mein
      // silently jump mat karo — clear message dikhao.
      if (!url || !/^https?:\/\//i.test(url)) {
        setDlMsg('⚠ Setup file ka download link abhi available nahi hai. Thodi der baad try karein, ya niche diye WhatsApp button se turant setup file paayein.', false);
        var dlSec = document.getElementById('downloads');
        if (dlSec) dlSec.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      setDlMsg('');
      openTab(url);
    });
  }

  /* ---------- 3D hero (Three.js) ----------
     Renders the app screenshot on a floating 3D window with a grid floor,
     particles and floating mini-cards. Falls back to the flat CSS mockup
     when WebGL / the CDN is unavailable or reduced motion is preferred. */
  var hero3dCanvas = document.getElementById('hero3d');
  var heroVisual = document.getElementById('heroVisual');
  var mockWindow = document.getElementById('mockWindow');
  var THREE3D = (typeof THREE !== 'undefined') ? THREE : null;

  function webglOk() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function initHero3D() {
    if (!THREE3D || !hero3dCanvas || !webglOk() || noMotion) return;
    var scene = new THREE3D.Scene();
    scene.background = null;
    var camera = new THREE3D.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 8.2);

    var renderer = new THREE3D.WebGLRenderer({ canvas: hero3dCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // lights
    scene.add(new THREE3D.AmbientLight(0xffffff, 1.05));
    var key = new THREE3D.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    var rim = new THREE3D.PointLight(0x7c3aed, 1.2, 20);
    rim.position.set(-3, -1, 2);
    scene.add(rim);
    var rim2 = new THREE3D.PointLight(0x4f46e5, 1.0, 20);
    rim2.position.set(3, 2, -2);
    scene.add(rim2);

    var root = new THREE3D.Group();
    scene.add(root);

    // grid floor
    var grid = new THREE3D.GridHelper(14, 26, 0x6366f1, 0x312e81);
    grid.position.y = -2.1;
    grid.material.transparent = true;
    grid.material.opacity = 0.55;
    root.add(grid);

    // floating particles
    var pGeo = new THREE3D.BufferGeometry();
    var N = 220;
    var pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    pGeo.setAttribute('position', new THREE3D.BufferAttribute(pos, 3));
    var pMat = new THREE3D.PointsMaterial({ color: 0x8b9cf7, size: 0.035, transparent: true, opacity: 0.75, depthWrite: false });
    var points = new THREE3D.Points(pGeo, pMat);
    root.add(points);

    // the app window: frame + screenshot "screen"
    var W = 4.6, H = 2.4, D = 0.16;
    var frameMat = new THREE3D.MeshStandardMaterial({ color: 0x1e2745, metalness: 0.55, roughness: 0.35 });
    var frame = new THREE3D.Mesh(new THREE3D.BoxGeometry(W + 0.14, H + 0.14, D), frameMat);
    frame.position.z = -0.02;
    root.add(frame);

    var screenMat = new THREE3D.MeshStandardMaterial({ color: 0xffffff });
    var screen = new THREE3D.Mesh(new THREE3D.PlaneGeometry(W, H), screenMat);
    root.add(screen);

    var texture = null;
    var texLoader = new THREE3D.TextureLoader();
    texLoader.load('app-shot.jpg', function (t) {
      texture = t;
      screen.material.map = t;
      screen.material.color.set(0xffffff);
      screen.material.needsUpdate = true;
    });

    // floating mini-cards (invoice saved + WhatsApp)
    function makeChip(bg, txtColor, lines) {
      var cv = document.createElement('canvas');
      cv.width = 512; cv.height = 150;
      var g = cv.getContext('2d');
      g.fillStyle = 'rgba(255,255,255,0.96)';
      g.beginPath();
      g.roundRect(8, 8, 496, 134, 22);
      g.fill();
      g.strokeStyle = 'rgba(203,213,225,0.9)';
      g.lineWidth = 3;
      g.stroke();
      var col = g.createLinearGradient(28, 20, 28, 130);
      col.addColorStop(0, bg[0]); col.addColorStop(1, bg[1]);
      g.fillStyle = col;
      g.beginPath();
      g.roundRect(28, 22, 96, 96, 20);
      g.fill();
      g.fillStyle = '#ffffff';
      g.font = '600 52px "Plus Jakarta Sans",sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(lines.ico, 76, 70);
      g.fillStyle = txtColor;
      g.font = '700 44px "Plus Jakarta Sans",sans-serif';
      g.textAlign = 'left';
      g.fillText(lines.t1, 150, 62);
      g.font = '500 30px "Plus Jakarta Sans",sans-serif';
      g.fillStyle = 'rgba(91,107,131,1)';
      g.fillText(lines.t2, 150, 104);
      var tex = new THREE3D.CanvasTexture(cv);
      var mat = new THREE3D.MeshBasicMaterial({ map: tex, transparent: true, side: THREE3D.DoubleSide });
      var mesh = new THREE3D.Mesh(new THREE3D.PlaneGeometry(1.9, 0.56), mat);
      return mesh;
    }
    var chipA = makeChip(['#10b981', '#059669'], '#0f172a', { ico: '⚡', t1: 'Invoice #1240 saved', t2: 'GST computed automatically' });
    chipA.position.set(-3.05, 0.75, 0.7);
    root.add(chipA);
    var chipB = makeChip(['#25d366', '#128c4b'], '#0f172a', { ico: '💬', t1: 'Order sent on WhatsApp', t2: '"Order Received" notified' });
    chipB.position.set(3.05, -0.9, 0.9);
    root.add(chipB);

    // gentle float + slow rotation
    var t = 0;
    var targetRot = { x: -0.06, y: 0.42 };
    var curRot = { x: -0.06, y: 0.42 };
    var reduced = noMotion;

    function resize() {
      var w = heroVisual.clientWidth || 600;
      var h = Math.min(w * 0.78, 560);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    if (finePointer) {
      heroVisual.addEventListener('mousemove', function (e) {
        var r = heroVisual.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        targetRot.y = 0.42 + px * 0.55;
        targetRot.x = -0.06 - py * 0.34;
      });
      heroVisual.addEventListener('mouseleave', function () {
        targetRot.y = 0.42; targetRot.x = -0.06;
      });
    }

    // pause off-screen to save CPU
    var visible = true;
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
      }, { threshold: 0.05 });
      vio.observe(heroVisual);
    }

    var raf = null;
    function loop() {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      t += 0.008;
      if (!reduced) {
        curRot.y += (targetRot.y - curRot.y) * 0.06;
        curRot.x += (targetRot.x - curRot.x) * 0.06;
        root.rotation.y = curRot.y + Math.sin(t * 0.8) * 0.05;
        root.rotation.x = curRot.x + Math.sin(t * 0.6) * 0.03;
        root.position.y = Math.sin(t * 1.1) * 0.08;
        chipA.position.y = 0.75 + Math.sin(t * 1.4) * 0.06;
        chipB.position.y = -0.9 + Math.sin(t * 1.7 + 2) * 0.07;
        points.rotation.y = t * 0.02;
      }
      renderer.render(scene, camera);
    }
    if (!reduced) { loop(); } else { renderer.render(scene, camera); }

    // success — swap the flat mockup for the 3D canvas
    heroVisual.classList.add('three-active');
    if (mockWindow) mockWindow.style.display = 'none';
  }
  if (hero3dCanvas) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHero3D);
    } else { initHero3D(); }
  }

  /* ---------- Smooth anchor scroll (mobile fix) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
        try { history.replaceState(null, '', id); } catch (err) { /* file:// and some browsers disallow it */ }
      }
    });
  });
})();
