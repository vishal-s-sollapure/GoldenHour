/**
 * GoldenHour — Multilingual Translation Dictionary
 * Languages: English (en), Hindi (hi), Kannada (kn)
 * Phase 2 Interface & Instruction strings thoroughly translated.
 */

const TRANSLATIONS = {
  en: {
    appTitle: "GoldenHour",
    appSubtitle: "Help Before the Ambulance Arrives",
    purposeStatement: "GoldenHour helps bystanders take safe, appropriate first steps while professional medical help is on the way.",
    urgentNotice: "For life-threatening emergencies, call 112 immediately. GoldenHour provides guidance while help is on the way.",
    priorityNotice: "⚡ Call 112 is always prioritized. GoldenHour never delays emergency calling.",
    simulatedTag: "SIMULATED DEMO - MVP",

    // Nav
    navSos: "SOS",
    navFirstAid: "First Aid",
    navVolunteers: "Volunteers",
    navHospital: "Hospital",
    navMetrics: "Metrics",

    // Quick Access Section (Phase 2)
    quickAccessTitle: "Quick Emergency Actions",
    qaFirstAid: "First Aid Guides",
    qaFirstAidDesc: "Step-by-step guidance for CPR, bleeding, and recovery position",
    qaContacts: "Emergency Contacts",
    qaContactsDesc: "Add, call, and manage trusted contacts locally",
    qaLocation: "Location Sharing",
    qaLocationDesc: "Check and share your GPS coordinates with consent",
    qaHistory: "Incident History",
    qaHistoryDesc: "Traceable event logs and safety metrics",

    // Emergency Calling (Phase 2)
    call112Btn: "📞 CALL INDIA 112 NOW",
    call112Note: "Direct connection to India's Emergency Response Support System (ERSS 112). Works without login, network, or location permission.",
    callDisclaimer: "Tapping opens your device telephone dialer. Calls are handled by your mobile network.",

    // Location Feature (Phase 2 - Permission & Pre-prompt)
    locationSectionTitle: "Location Sharing",
    locExplainPrePrompt: "Why location is requested: Obtaining your GPS coordinates helps you share your location with trusted contacts during an emergency. Coordinates stay on your device and are never sent to external servers in this phase.",
    locFetchBtn: "📍 Get My Current Location",
    locRetryBtn: "🔄 Retry Location Request",
    locIdleText: "Location not requested yet. Tap below when you need to fetch coordinates.",
    locLoadingText: "Requesting satellite & network GPS coordinates...",
    locSuccessText: "GPS Coordinates Successfully Obtained",
    locDeniedText: "Location permission denied. You can still use the Call 112 button directly and access all first-aid guides. To enable location, please update your browser site settings.",
    locUnavailableText: "Location information is unavailable. Please check that GPS/location services are enabled on your device.",
    locTimeoutText: "Location request timed out. Please check your signal and retry.",
    locUnsupportedText: "Geolocation is not supported by this browser.",
    locPrivacyNotice: "🔒 Privacy Disclosure: Coordinates are processed locally in your browser session. They are never transmitted to any server or third party.",
    stopSharingBtn: "Pause Location Display",
    startSharingBtn: "Resume Location Display",

    // Emergency Contacts (Phase 2)
    contactsHeader: "Emergency Contacts",
    contactsPrivacyNotice: "🔒 Privacy Disclosure: Contacts are saved locally in your browser's local storage and are never uploaded to any server.",
    contactNameLabel: "Contact Name",
    contactNamePlaceholder: "e.g. Dr. Ramesh Kumar / Smt. Priya",
    contactPhoneLabel: "Phone Number",
    contactPhonePlaceholder: "e.g. 9876543210 (10 digits)",
    contactSaveBtn: "Save Contact",
    contactCallBtn: "📞 Call",
    contactRemoveBtn: "Remove",
    contactEmptyState: "No emergency contacts saved yet. Add your trusted family, friends, or doctor above.",
    contactValidationName: "Please enter a contact name (minimum 2 characters).",
    contactValidationPhone: "Please enter a valid phone number (10 to 15 digits).",
    contactSuccessAdded: "Contact saved successfully!",
    contactRemoved: "Contact removed.",
    shareSmsBtn: "📱 Share Location via SMS",
    shareWhatsappBtn: "💬 Share Location via WhatsApp",

    // First Aid Section
    firstAidHeader: "Verified First-Aid Guidance",
    firstAidSubHeader: "Step-by-step instructions with voice support. Sourced from European Resuscitation Council (ERC 2025) & Indian Resuscitation Council (IRC).",
    langSelectLabel: "Language / भाषा / ಭಾಷೆ:",
    ttsPlay: "🔊 Read Aloud",
    ttsPause: "⏸ Pause Voice",
    ttsStop: "⏹ Stop Voice",
    verifiedSource: "Verified Source: European Resuscitation Council (ERC 2025) & IRC (Reviewed Oct 2026)",

    // CPR Guide
    cprTitle: "Cardiac Arrest / CPR Guide",
    cprDesc: "Victim is unresponsive and not breathing normally.",
    cprMetronomeStart: "🎵 Start CPR Compression Metronome (110 BPM)",
    cprMetronomeStop: "⏹ Stop Metronome",
    cprSteps: [
      {
        step: 1,
        title: "Check Responsiveness & Breathing",
        desc: "Tap shoulders firmly and ask loudly 'Are you OK?'. Look at chest for 5-10 seconds to check for normal breathing."
      },
      {
        step: 2,
        title: "Call 112 & Request AED",
        desc: "Call 112 immediately or instruct a bystander to call 112 and get an Automated External Defibrillator (AED) if available."
      },
      {
        step: 3,
        title: "Chest Compressions (100-120 / min)",
        desc: "Place heel of hand on center of chest. Interlock fingers. Push hard and fast 5-6 cm deep at the metronome beat. 30 compressions."
      },
      {
        step: 4,
        title: "Rescue Breaths & AED",
        desc: "Give 2 rescue breaths if trained, then resume compressions immediately. Follow AED voice prompts when available."
      }
    ],

    // Bleeding Guide
    bleedingTitle: "Severe Bleeding Control",
    bleedingDesc: "Heavy arterial or deep wound bleeding.",
    bleedingSteps: [
      {
        step: 1,
        title: "Direct Firm Pressure",
        desc: "Apply firm, continuous direct pressure over the wound using a clean cloth or sterile bandage. Do not remove soaked cloths."
      },
      {
        step: 2,
        title: "Elevate & Keep Firm",
        desc: "Keep the injured limb elevated above heart level if possible while keeping strong pressure."
      },
      {
        step: 3,
        title: "Apply Pressure Bandage",
        desc: "Wrap a bandage tightly over the dressing to maintain continuous pressure. Check pulse below bandage to avoid stopping circulation completely."
      },
      {
        step: 4,
        title: "Tourniquet for Severe Limb Bleeding",
        desc: "If bleeding is life-threatening and uncontrolled, apply a tourniquet 5 cm above wound (not over joint). Note exact application time."
      }
    ],

    // Recovery Position Guide
    recoveryTitle: "Recovery Position Guide",
    recoveryDesc: "Unconscious victim who IS breathing normally.",
    recoverySteps: [
      {
        step: 1,
        title: "Position Near Arm",
        desc: "Kneel beside victim. Place closest arm at right angles to body, elbow bent with palm up."
      },
      {
        step: 2,
        title: "Cross Opposite Hand",
        desc: "Bring their far arm across chest and hold back of hand against their near cheek."
      },
      {
        step: 3,
        title: "Roll onto Side",
        desc: "Pull far knee up, keep foot flat. Gently pull knee to roll victim toward you onto their side."
      },
      {
        step: 4,
        title: "Open Airway & Monitor",
        desc: "Tilt head back slightly to ensure airway remains open and fluid can drain. Monitor breathing until 112 arrives."
      }
    ],

    // Coordination
    volunteersHeader: "Nearby Volunteer Alert Network (Simulated)",
    volunteersSubHeader: "Community responders in a 1km radius receiving instant notification.",
    broadcastAlertBtn: "📡 Broadcast Alert to Nearby Volunteers",
    volunteersStatus: "Simulated Radar Active. 4 Nearby Trained Volunteers Available.",
    regVolunteerBtn: "Register as Volunteer",
    availabilityToggle: "My Responder Status: ACTIVE",

    // Hospital
    hospitalHeader: "Hospital Emergency Desk (Pre-Alert Prototype)",
    hospitalSubHeader: "Authorized trauma centers receive patient payload before arrival.",
    hospitalSimLabel: "PROTOTYPE DEMO — Simulated Trauma Desk Integration",
    incomingAlertsTitle: "Active Incoming Incident Alerts",
    prepBayBtn: "🚨 Acknowledge & Prepare Trauma Bay 1",
    dispatchAmbulanceBtn: "🚑 Confirm Hospital Ambulance En Route",

    // Metrics
    metricsHeader: "Demo Impact & Safety Compliance Dashboard",
    metricsSubHeader: "Live measurement of response actions, prototype metrics, and safety rules.",
    timeToAction: "Time to First Action: ",
    volunteersCount: "Simulated Volunteers Reached: ",
    guideCompleted: "First-Aid Guides Completed: ",
    safetyCheckTitle: "Safety & Privacy Verification Matrix"
  },

  hi: {
    appTitle: "गोल्डन अवर (GoldenHour)",
    appSubtitle: "एम्बुलेंस आने से पहले मदद",
    purposeStatement: "गोल्डन अवर आपातकालीन स्थिति में एम्बुलेंस आने से पहले सुरक्षित और सही कदम उठाने में मदद करता है।",
    urgentNotice: "गंभीर आपात स्थिति में तुरंत 112 पर कॉल करें। जब तक मदद आ रही है, गोल्डन अवर मार्गदर्शन प्रदान करता है।",
    priorityNotice: "⚡ 112 कॉल को हमेशा प्राथमिकता दी जाती है। गोल्डन अवर आपातकालीन कॉल में कभी देरी नहीं करता।",
    simulatedTag: "सिम्युलेटेड डेमो - MVP",

    navSos: "एसओएस",
    navFirstAid: "प्राथमिक उपचार",
    navVolunteers: "स्वयंसेवक",
    navHospital: "अस्पताल",
    navMetrics: "आंकड़े",

    quickAccessTitle: "त्वरित आपातकालीन कार्य",
    qaFirstAid: "प्राथमिक चिकित्सा निर्देश",
    qaFirstAidDesc: "सीपीआर, रक्तस्राव और रिकवरी स्थिति के चरण-दर-चरण निर्देश",
    qaContacts: "आपातकालीन संपर्क",
    qaContactsDesc: "विश्वसनीय संपर्कों को स्थानीय रूप से जोड़ें, कॉल करें और प्रबंधित करें",
    qaLocation: "स्थान साझाकरण",
    qaLocationDesc: "सहमति से अपने जीपीएस निर्देशांक जांचें और साझा करें",
    qaHistory: "घटना इतिहास",
    qaHistoryDesc: "सत्यापनीय इवेंट लॉग और सुरक्षा आंकड़े",

    call112Btn: "📞 112 आपातकालीन नंबर पर कॉल करें",
    call112Note: "भारत के राष्ट्रीय आपातकालीन नंबर (ERSS 112) से सीधा संपर्क। बिना किसी लॉगिन या अनुमति के कार्य करता है।",
    callDisclaimer: "टैप करने पर आपके फोन का डायलर खुलता है। कॉल का संचालन आपके मोबाइल नेटवर्क द्वारा किया जाता है।",

    locationSectionTitle: "स्थान साझाकरण",
    locExplainPrePrompt: "स्थान की आवश्यकता क्यों है: जीपीएस निर्देशांक प्राप्त करने से आप आपात स्थिति में अपने संपर्कों के साथ सटीक स्थान साझा कर सकते हैं। यह जानकारी केवल आपके डिवाइस पर रहती है और किसी बाहरी सर्वर पर नहीं भेजी जाती है।",
    locFetchBtn: "📍 मेरा वर्तमान स्थान प्राप्त करें",
    locRetryBtn: "🔄 स्थान पुनः प्राप्त करें",
    locIdleText: "स्थान का अनुरोध अभी नहीं किया गया है। निर्देशांक प्राप्त करने के लिए नीचे टैप करें।",
    locLoadingText: "जीपीएस उपग्रह और नेटवर्क निर्देशांक प्राप्त किए जा रहे हैं...",
    locSuccessText: "जीपीएस निर्देशांक सफलतापूर्वक प्राप्त हुए",
    locDeniedText: "स्थान की अनुमति अस्वीकृत कर दी गई। आप अभी भी सीधे 112 पर कॉल कर सकते हैं और सभी निर्देश देख सकते हैं।",
    locUnavailableText: "स्थान संकेत अनुपलब्ध है। कृपया सुनिश्चित करें कि आपके डिवाइस का जीपीएस चालू है।",
    locTimeoutText: "स्थान अनुरोध का समय समाप्त हो गया। कृपया पुनः प्रयास करें।",
    locUnsupportedText: "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।",
    locPrivacyNotice: "🔒 गोपनीयता प्रकटीकरण: निर्देशांक केवल आपके ब्राउज़र सत्र में स्थानीय रूप से संसाधित होते हैं। वे कभी किसी सर्वर पर नहीं भेजे जाते हैं।",
    stopSharingBtn: "स्थान का प्रदर्शन रोकें",
    startSharingBtn: "स्थान का प्रदर्शन फिर से शुरू करें",

    contactsHeader: "आपातकालीन संपर्क",
    contactsPrivacyNotice: "🔒 गोपनीयता प्रकटीकरण: संपर्क आपके ब्राउज़र के लोकल स्टोरेज में सुरक्षित रूप से सहेजे जाते हैं और कभी किसी सर्वर पर अपलोड नहीं होते हैं।",
    contactNameLabel: "संपर्क का नाम",
    contactNamePlaceholder: "उदा. डॉ. रमेश कुमार / श्रीमती प्रिया",
    contactPhoneLabel: "फ़ोन नंबर",
    contactPhonePlaceholder: "उदा. 9876543210 (10 अंक)",
    contactSaveBtn: "संपर्क सहेजें",
    contactCallBtn: "📞 कॉल करें",
    contactRemoveBtn: "हटाएं",
    contactEmptyState: "अभी तक कोई आपातकालीन संपर्क सहेजा नहीं गया है। ऊपर अपने परिवार या मित्र को जोड़ें।",
    contactValidationName: "कृपया एक मान्य नाम दर्ज करें (कम से कम 2 अक्षर)।",
    contactValidationPhone: "कृपया एक मान्य फ़ोन नंबर दर्ज करें (10 से 15 अंक)।",
    contactSuccessAdded: "संपर्क सफलतापूर्वक सहेजा गया!",
    contactRemoved: "संपर्क हटा दिया गया।",
    shareSmsBtn: "📱 एसएमएस द्वारा स्थान साझा करें",
    shareWhatsappBtn: "💬 व्हाट्सएप द्वारा स्थान साझा करें",

    firstAidHeader: "सत्यापित प्राथमिक चिकित्सा निर्देश",
    firstAidSubHeader: "आवाज सहायता के साथ चरण-दर-चरण निर्देश। यूरोपियन रिससिटेशन काउंसिल (ERC 2025) और आईआरसी द्वारा सत्यापित।",
    langSelectLabel: "भाषा चुनें / Language / ಭಾಷೆ:",
    ttsPlay: "🔊 जोर से पढ़ें (Read Aloud)",
    ttsPause: "⏸ आवाज रोकें",
    ttsStop: "⏹ आवाज बंद करें",
    verifiedSource: "सत्यापित स्रोत: यूरोपियन रिससिटेशन काउंसिल (ERC 2025) और आईआरसी (समीक्षा अक्टूबर 2026)",

    cprTitle: "कार्डियक अरेस्ट / सीपीआर गाइड",
    cprDesc: "पीड़ित बेहोश है और सामान्य रूप से सांस नहीं ले रहा है।",
    cprMetronomeStart: "🎵 सीपीआर कम्प्रेशन मेट्रोनोम शुरू करें (110 बीपीएम)",
    cprMetronomeStop: "⏹ मेट्रोनोम बंद करें",
    cprSteps: [
      {
        step: 1,
        title: "प्रतिक्रिया और सांस की जांच करें",
        desc: "कंधों को जोर से थपथपाएं और पूछें 'क्या आप ठीक हैं?'। सामान्य सांस की जांच के लिए 5-10 सेकंड तक छाती को देखें।"
      },
      {
        step: 2,
        title: "112 पर कॉल करें और एईडी मांगें",
        desc: "तुरंत 112 पर कॉल करें या किसी राहगीर को 112 पर कॉल करने और एईडी लाने को कहें।"
      },
      {
        step: 3,
        title: "छाती को दबाना (100-120 प्रति मिनट)",
        desc: "हथेली के निचले हिस्से को छाती के बीच में रखें। उंगलियों को आपस में फंसाएं। मेट्रोनोम बीट पर 5-6 सेमी गहरा और तेजी से दबाएं। 30 बार दबाएं।"
      },
      {
        step: 4,
        title: "कृत्रिम सांसें और एईडी",
        desc: "यदि प्रशिक्षित हैं तो 2 बार मुंह से सांस दें, फिर तुरंत दबाना शुरू करें। उपलब्ध होने पर एईडी के निर्देशों का पालन करें।"
      }
    ],

    bleedingTitle: "गंभीर रक्तस्राव नियंत्रण",
    bleedingDesc: "तेज धमनी या गहरे घाव से खून बह रहा है।",
    bleedingSteps: [
      {
        step: 1,
        title: "सीधा और तेज दबाव",
        desc: "साफ कपड़े या बाँझ पट्टी का उपयोग करके घाव पर लगातार सीधा दबाव डालें। खून से सने कपड़े न हटाएं।"
      },
      {
        step: 2,
        title: "ऊँचा उठाएं और दबाव बनाए रखें",
        desc: "मजबूत दबाव बनाए रखते हुए यदि संभव हो तो घायल अंग को दिल के स्तर से ऊपर उठाएं।"
      },
      {
        step: 3,
        title: "प्रेशर बैंडेज लगाएं",
        desc: "लगातार दबाव बनाए रखने के लिए पट्टी को कसकर लपेटें। रक्त संचार पूरी तरह से रुकने से बचने के लिए पट्टी के नीचे नाड़ी की जांच करें।"
      },
      {
        step: 4,
        title: "गंभीर रक्तस्राव के लिए टॉरनिक्वेट",
        desc: "यदि रक्तस्राव जानलेवा है और नियंत्रित नहीं हो रहा है, तो घाव से 5 सेमी ऊपर (जोड़ के ऊपर नहीं) टॉरनिक्वेट लगाएं। सटीक समय नोट करें।"
      }
    ],

    recoveryTitle: "रिकवरी स्थिति (Recovery Position) गाइड",
    recoveryDesc: "बेहोश पीड़ित जो सामान्य रूप से सांस ले रहा है।",
    recoverySteps: [
      {
        step: 1,
        title: "पास के हाथ की स्थिति",
        desc: "पीड़ित के बगल में घुटने टेकें। निकटतम हाथ को शरीर से समकोण पर रखें, कोहनी मुड़ी हुई और हथेली ऊपर हो।"
      },
      {
        step: 2,
        title: "दूसरे हाथ को मोड़ें",
        desc: "उनके दूर वाले हाथ को छाती पर लाएं और हाथ के पिछले हिस्से को उनके पास वाले गाल से सटाकर रखें।"
      },
      {
        step: 3,
        title: "करवट पर मोड़ें",
        desc: "दूर वाले घुटने को ऊपर उठाएं, पैर सपाट रखें। पीड़ित को अपनी ओर करवट दिलाने के लिए धीरे से घुटने को खींचें।"
      },
      {
        step: 4,
        title: "वायुमार्ग खोलें और निगरानी करें",
        desc: "यह सुनिश्चित करने के लिए कि वायुमार्ग खुला रहे, सिर को थोड़ा पीछे झुकाएं। 112 के आने तक सांस लेने की निगरानी करें।"
      }
    ],

    volunteersHeader: "निकटतम स्वयंसेवक अलर्ट नेटवर्क (सिम्युलेटेड)",
    volunteersSubHeader: "1 किमी के दायरे में सामुदायिक स्वयंसेवकों को तुरंत सूचना।",
    broadcastAlertBtn: "📡 पास के स्वयंसेवकों को अलर्ट भेजें",
    volunteersStatus: "सिम्युलेटेड रडार सक्रिय। 4 निकटतम प्रशिक्षित स्वयंसेवक उपलब्ध।",
    regVolunteerBtn: "स्वयंसेवक के रूप में पंजीकरण करें",
    availabilityToggle: "मेरी स्थिति: सक्रिय (ACTIVE)",

    hospitalHeader: "अस्पताल आपातकालीन डेस्क (प्री-अलर्ट प्रोटोटाइप)",
    hospitalSubHeader: "अधिकृत आघात केंद्रों को पहुंचने से पहले मरीज का विवरण प्राप्त होता है।",
    hospitalSimLabel: "प्रोटोटाइप डेमो — सिम्युलेटेड ट्रॉमा डेस्क एकीकरण",
    incomingAlertsTitle: "सक्रिय आगामी घटना अलर्ट",
    prepBayBtn: "🚨 स्वीकार करें और ट्रॉमा बे 1 तैयार करें",
    dispatchAmbulanceBtn: "🚑 अस्पताल एम्बुलेंस की पुष्टि करें",

    metricsHeader: "डेमो प्रभाव और सुरक्षा अनुपालन डैशबोर्ड",
    metricsSubHeader: "प्रतिक्रिया कार्यों, प्रोटोटाइप मेट्रिक्स और सुरक्षा नियमों का लाइव मापन।",
    timeToAction: "प्रथम कार्रवाई तक का समय: ",
    volunteersCount: "पहुंचे गए स्वयंसेवक (सिम्युलेटेड): ",
    guideCompleted: "पूर्ण किए गए प्राथमिक चिकित्सा निर्देश: ",
    safetyCheckTitle: "सुरक्षा एवं गोपनीयता सत्यापन मैट्रिक्स"
  },

  kn: {
    appTitle: "ಗೋಲ್ಡನ್ ಅವರ್ (GoldenHour)",
    appSubtitle: "ಅಂಬ್ಯುಲೆನ್ಸ್ ಬರುವ ಮೊದಲು ನೆರವು",
    purposeStatement: "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಅಂಬ್ಯುಲೆನ್ಸ್ ಬರುವ ಮೊದಲು ಸುರಕ್ಷಿತ ಆರಂಭಿಕ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಲು ಗೋಲ್ಡನ್ ಅವರ್ ನೆರವಾಗುತ್ತದೆ.",
    urgentNotice: "ತೀವ್ರ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ. ಸಹಾಯ ಬರುವವರೆಗೆ ಗೋಲ್ಡನ್ ಅವರ್ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
    priorityNotice: "⚡ 112 ಕರೆಗೆ ಯಾವಾಗಲೂ ಮೊದಲ ಆದ್ಯತೆ. ಗೋಲ್ಡನ್ ಅವರ್ ತುರ್ತು ಕರೆಗೆ ಎಂದಿಗೂ ವಿಳಂಬ ಮಾಡುವುದಿಲ್ಲ.",
    simulatedTag: "ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೆಮೊ - MVP",

    navSos: "SOS",
    navFirstAid: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",
    navVolunteers: "ಸ್ವಯಂಸೇವಕರು",
    navHospital: "ಆಸ್ಪತ್ರೆ",
    navMetrics: "ಅಂಕಿಅಂಶ",

    quickAccessTitle: "ತ್ವರಿತ ತುರ್ತು ಕ್ರಮಗಳು",
    qaFirstAid: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿ",
    qaFirstAidDesc: "ಸಿಪಿಆರ್, ರಕ್ತಸ್ರಾವ ಮತ್ತು ರಿಕವರಿ ಪೊಸಿಷನ್ ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶನ",
    qaContacts: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    qaContactsDesc: "ಕುಟುಂಬ ಮತ್ತು ಸ್ನೇಹಿತರ ಸಂಪರ್ಕಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ನಿರ್ವಹಿಸಿ",
    qaLocation: "ಸ್ಥಳ ಹಂಚಿಕೆ",
    qaLocationDesc: "ಅನುಮತಿಯೊಂದಿಗೆ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    qaHistory: "ಘಟನೆಗಳ ಇತಿಹಾಸ",
    qaHistoryDesc: "ಇವೆಂಟ್ ಲಾಗ್ ಮತ್ತು ಸುರಕ್ಷತಾ ಅಂಕಿಅಂಶಗಳ ವರದಿ",

    call112Btn: "📞 ಭಾರತ 112 ತುರ್ತು ಕರೆ ಮಾಡಿ",
    call112Note: "ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಹಾಯವಾಣಿಗೆ (ERSS 112) ನೇರ ಸಂಪರ್ಕ. ಲಾಗಿನ್ ಅಥವಾ ಅನುಮತಿ ಇಲ್ಲದೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    callDisclaimer: "ಟ್ಯಾಪ್ ಮಾಡಿದಾಗ ನಿಮ್ಮ ಸಾಧನದ ಡಯಲರ್ ತೆರೆಯುತ್ತದೆ. ಕರೆಯನ್ನು ನಿಮ್ಮ ಮೊಬೈಲ್ ನೆಟ್‌ವರ್ಕ್ ನಿರ್ವಹಿಸುತ್ತದೆ.",

    locationSectionTitle: "ಸ್ಥಳ ಹಂಚಿಕೆ",
    locExplainPrePrompt: "ಸ್ಥಳದ ಅಗತ್ಯತೆ ಏಕೆ: ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪಡೆಯುವುದರಿಂದ ನಿಮ್ಮ ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ತುರ್ತು ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಬಹುದು. ಈ ಮಾಹಿತಿ ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ ಸರ್ವರ್‌ಗೆ ರವಾನೆಯಾಗುವುದಿಲ್ಲ.",
    locFetchBtn: "📍 ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಪಡೆಯಿರಿ",
    locRetryBtn: "🔄 ಸ್ಥಳವನ್ನು ಮರುಪಡೆಯಿರಿ",
    locIdleText: "ಸ್ಥಳದ ವಿನಂತಿ ಇನ್ನೂ ಮಾಡಲಾಗಿಲ್ಲ. ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪಡೆಯಲು ಕೆಳಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ.",
    locLoadingText: "ಜಿಪಿಎಸ್ ಉಪಗ್ರಹ ಮತ್ತು ನೆಟ್‌ವರ್ಕ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    locSuccessText: "ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳು ಲಭ್ಯವಾಗಿವೆ",
    locDeniedText: "ಸ್ಥಳದ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ನೀವು ಈಗಲೂ 112 ಗೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಬಹುದು ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಬಳಸಬಹುದು.",
    locUnavailableText: "ಸ್ಥಳದ ಸಿಗ್ನಲ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಾಧನದ ಜಿಪಿಎಸ್ ಆನ್ ಆಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.",
    locTimeoutText: "ಸ್ಥಳ ವಿನಂತಿಯ ಸಮಯ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.",
    locUnsupportedText: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಯೋಲೋಕೇಶನ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
    locPrivacyNotice: "🔒 ಗೌಪ್ಯತೆ ಸೂಚನೆ: ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಸ್ಥಳೀಯವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.",
    stopSharingBtn: "ಸ್ಥಳ ಪ್ರದರ್ಶನವನ್ನು ನಿಲ್ಲಿಸಿ",
    startSharingBtn: "ಸ್ಥಳ ಪ್ರದರ್ಶನವನ್ನು ಮುಂದುವರಿಸಿ",

    contactsHeader: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    contactsPrivacyNotice: "🔒 ಗೌಪ್ಯತೆ ಸೂಚನೆ: ಸಂಪರ್ಕಗಳನ್ನು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಸುರಕ್ಷಿತವಾಗಿ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಸರ್ವರ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದಿಲ್ಲ.",
    contactNameLabel: "ಸಂಪರ್ಕದ ಹೆಸರು",
    contactNamePlaceholder: "ಉದಾ. ಡಾ. ರಮೇಶ್ ಕುಮಾರ್ / ಪ್ರಿಯಾ",
    contactPhoneLabel: "ಫೋನ್ ಸಂಖ್ಯೆ",
    contactPhonePlaceholder: "ಉದಾ. 9876543210 (10 ಅಂಕಿಗಳು)",
    contactSaveBtn: "ಸಂಪರ್ಕವನ್ನು ಉಳಿಸಿ",
    contactCallBtn: "📞 ಕರೆ ಮಾಡಿ",
    contactRemoveBtn: "ತೆಗೆದುಹಾಕಿ",
    contactEmptyState: "ಇನ್ನೂ ಯಾವುದೇ ತುರ್ತು ಸಂಪರ್ಕಗಳನ್ನು ಉಳಿಸಲಾಗಿಲ್ಲ. ಮೇಲೆ ನಿಮ್ಮ ಕುಟುಂಬ ಅಥವಾ ಸ್ನೇಹಿತರನ್ನು ಸೇರಿಸಿ.",
    contactValidationName: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳು).",
    contactValidationPhone: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (10 ರಿಂದ 15 ಅಂಕಿಗಳು).",
    contactSuccessAdded: "ಸಂಪರ್ಕವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    contactRemoved: "ಸಂಪರ್ಕವನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.",
    shareSmsBtn: "📱 SMS ಮೂಲಕ ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ",
    shareWhatsappBtn: "💬 ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ",

    firstAidHeader: "ದೃಢೀಕರಿಸಿದ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶನ",
    firstAidSubHeader: "ಧ್ವನಿ ಬೆಂಬಲದೊಂದಿಗೆ ಹಂತ ಹಂತದ ಸೂಚನೆಗಳು. ಯುರೋಪಿಯನ್ ರಿಸಸಿಟೇಶನ್ ಕೌನ್ಸಿಲ್ (ERC 2025) ಮತ್ತು IRC ಇಂದ.",
    langSelectLabel: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ / Language / भाषा:",
    ttsPlay: "🔊 ಜೋರಾಗಿ ಓದಿ (Read Aloud)",
    ttsPause: "⏸ ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
    ttsStop: "⏹ ಧ್ವನಿ ಮುಕ್ತಾಯ",
    verifiedSource: "ದೃಢೀಕರಿಸಿದ ಮೂಲ: ERC 2025 ಮತ್ತು ಇಂಡಿಯನ್ ರಿಸಸಿಟೇಶನ್ ಕೌನ್ಸಿಲ್ (ಪರಿಶೀಲನೆ ಅಕ್ಟೋಬರ್ 2026)",

    cprTitle: "ಕಾರ್ಡಿಯಾಕ್ ಅರೆಸ್ಟ್ / CPR ಮಾರ್ಗದರ್ಶಿ",
    cprDesc: "ಸಂತ್ರಸ್ತರು ಪ್ರಜ್ಞಾಹೀನರಾಗಿದ್ದಾರೆ ಮತ್ತು ಉಸಿರಾಡುತ್ತಿಲ್ಲ.",
    cprMetronomeStart: "🎵 CPR ಕಂಪ್ರೆಷನ್ ಮೆಟ್ರೊನೊಮ್ ಪ್ರಾರಂಭಿಸಿ (110 BPM)",
    cprMetronomeStop: "⏹ ಮೆಟ್ರೊನೊಮ್ ನಿಲ್ಲಿಸಿ",
    cprSteps: [
      {
        step: 1,
        title: "ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ",
        desc: "ಹೆಗಲನ್ನು ಗಟ್ಟಿಯಾಗಿ ತಟ್ಟಿ 'ನೀವು ಚೆನ್ನಾಗಿದ್ದೀರಾ?' ಎಂದು ಜೋರಾಗಿ ಕೇಳಿ. 5-10 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಎದೆಯ ಚಲನೆಯನ್ನು ಗಮನಿಸಿ."
      },
      {
        step: 2,
        title: "112 ಗೆ ಕರೆ ಮಾಡಿ & AED ತರಿಸಿಕೊಳ್ಳಿ",
        desc: "ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಪಕ್ಕದಲ್ಲಿರುವವರಿಗೆ 112 ಗೆ ಕರೆ ಮಾಡಲು ಮತ್ತು AED ಸಾಧನ ತರಲು ಹೇಳಿ."
      },
      {
        step: 3,
        title: "ಎದೆ ಒತ್ತುವುದು (ನಿಮಿಷಕ್ಕೆ 100-120 ಬಾರಿ)",
        desc: "ಅಂಗೈ ಕೆಳಭಾಗವನ್ನು ಎದೆಯ ಮಧ್ಯದಲ್ಲಿಡಿ. ಬೆರಳುಗಳನ್ನು ಜೋಡಿಸಿ. ಮೆಟ್ರೊನೊಮ್ ವೇಗದಲ್ಲಿ 5-6 ಸೆಂ.ಮೀ ಆಳಕ್ಕೆ 30 ಬಾರಿ ವೇಗವಾಗಿ ಒತ್ತಿ."
      },
      {
        step: 4,
        title: "ಕೃತಕ ಉಸಿರಾಟ ಮತ್ತು AED",
        desc: "ತರಬೇತಿ ಪಡೆದಿದ್ದರೆ 2 ಬಾರಿ ಬಾಯಿಯಿಂದ ಉಸಿರು ನೀಡಿ, ನಂತರ ತಕ್ಷಣ ಒತ್ತುವುದನ್ನು ಮುಂದುವರಿಸಿ."
      }
    ],

    bleedingTitle: "ತೀವ್ರ ರಕ್ತಸ್ರಾವ ನಿಯಂತ್ರಣ",
    bleedingDesc: "ಆಳವಾದ ಗಾಯ ಅಥವಾ ರಕ್ತನಾಳದಿಂದ ತೀವ್ರ ರಕ್ತಸ್ರಾವ.",
    bleedingSteps: [
      {
        step: 1,
        title: "ನೇರ ಗಟ್ಟಿ ಒತ್ತಡ",
        desc: "ಶುದ್ಧ ಬಟ್ಟೆ ಅಥವಾ ಬ್ಯಾಂಡೇಜ್ ಬಳಸಿ ಗಾಯದ ಮೇಲೆ ನಿರಂತರ ನೇರ ಒತ್ತಡ ಹಾಕಿ. ರಕ್ತದಿಂದ ನೆನೆದ ಬಟ್ಟೆಯನ್ನು ತೆಗೆಯಬೇಡಿ."
      },
      {
        step: 2,
        title: "ಮೇಲಕ್ಕೆತ್ತಿ ಒತ್ತಡ ಕಾಯ್ದುಕೊಳ್ಳಿ",
        desc: "ಸಾಧ್ಯವಿದ್ದಲ್ಲಿ ಗಾಯಗೊಂಡ ಭಾಗವನ್ನು ಹೃದಯದ ಮಟ್ಟಕ್ಕಿಂತ ಮೇಲಕ್ಕೆತ್ತಿ ಒತ್ತಡ ಮುಂದುವರಿಸಿ."
      },
      {
        step: 3,
        title: "ಪ್ರೆಷರ್ ಬ್ಯಾಂಡೇಜ್ ಕಟ್ಟಿ",
        desc: "ಒತ್ತಡ ಕಾಯ್ದುಕೊಳ್ಳಲು ಬ್ಯಾಂಡೇಜ್‌ ಅನ್ನು ಬಿಗಿಯಾಗಿ ಸುತ್ತಿ."
      },
      {
        step: 4,
        title: "ಟೂರ್ನಿಕೆಟ್ (Tourniquet) ಅಳವಡಿಕೆ",
        desc: "ರಕ್ತಸ್ರಾವ ಜೀವಕ್ಕೆ ಅಪಾಯಕಾರಿಯಾಗಿದ್ದರೆ, ಗಾಯದಿಂದ 5 ಸೆಂ.ಮೀ ಮೇಲೆ ಟೂರ್ನಿಕೆಟ್ ಕಟ್ಟಿ. ಸಮಯವನ್ನು ಗುರುತಿಸಿ."
      }
    ],

    recoveryTitle: "ರಿಕವರಿ ಪೊಸಿಷನ್ (Recovery Position) ಮಾರ್ಗದರ್ಶಿ",
    recoveryDesc: "ಉಸಿರಾಡುತ್ತಿರುವ ಆದರೆ ಪ್ರಜ್ಞಾಹೀನವಾಗಿರುವ ವ್ಯಕ್ತಿ.",
    recoverySteps: [
      {
        step: 1,
        title: "ಸಮೀಪದ ಕೈ ಜೋಡಣೆ",
        desc: "ಸಂತ್ರಸ್ತರ ಪಕ್ಕದಲ್ಲಿ ಮೊಣಕಾಲು ಯೂರಿ ಕುಳಿತುಕೊಳ್ಳಿ. ಸಮೀಪದ ಕೈಯನ್ನು ದೇಹಕ್ಕೆ ಲಂಬ ಕೋನದಲ್ಲಿರಿಸಿ."
      },
      {
        step: 2,
        title: "ಮತ್ತೊಂದು ಕೈ ಜೋಡಣೆ",
        desc: "ಅವರ ದೂರದ ಕೈಯನ್ನು ಎದೆಯ ಅಡ್ಡಲಾಗಿ ತಂದು ಕೆನ್ನೆಯ ಭಾಗದಲ್ಲಿಡಿ."
      },
      {
        step: 3,
        title: "ಪಕ್ಕಕ್ಕೆ ಹೊರಳಿಸಿ",
        desc: "ದೂರದ ಮೊಣಕಾಲನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ. ನಿಧಾನವಾಗಿ ನಿಮ್ಮ ಕಡೆಗೆ ಪಕ್ಕಕ್ಕೆ ಹೊರಳಿಸಿ."
      },
      {
        step: 4,
        title: "ಉಸಿರಾಟದ ಹಾದಿ ತೆರೆಯಿರಿ",
        desc: "ಉಸಿರಾಟದ ಹಾದಿ ತೆರೆದಿರಲು ತಲೆಯನ್ನು ಕೊಂಚ ಹಿಂದಕ್ಕೆ ಬಾಗಿಸಿ. 112 ಬರುವವರೆಗೆ ಗಮನಿಸಿ."
      }
    ],

    volunteersHeader: "ಹತ್ತಿರದ ಸ್ವಯಂಸೇವಕರ ನೆಟ್‌ವರ್ಕ್ (ಸಿಮ್ಯುಲೇಟೆಡ್)",
    volunteersSubHeader: "1 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ತರಬೇತಿ ಪಡೆದ ಸ್ವಯಂಸೇವಕರಿಗೆ ತಕ್ಷಣದ ಮಾಹಿತಿ.",
    broadcastAlertBtn: "📡 ಹತ್ತಿರದ ಸ್ವಯಂಸೇವಕರಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ",
    volunteersStatus: "ಸಿಮ್ಯುಲೇಟೆಡ್ ರೇಡಾರ್ ಸಕ್ರಿಯವಾಗಿದೆ. 4 ಹತ್ತಿರದ ಸ್ವಯಂಸೇವಕರು ಲಭ್ಯವಿದ್ದಾರೆ.",
    regVolunteerBtn: "ಸ್ವಯಂಸೇವಕರಾಗಿ ನೋಂದಾಯಿಸಿ",
    availabilityToggle: "ನನ್ನ ಸ್ಥಿತಿ: ಸಕ್ರಿಯ (ACTIVE)",

    hospitalHeader: "ಆಸ್ಪತ್ರೆ ತುರ್ತು ಡೆಸ್ಕ್ (ಪ್ರಿ-ಅಲರ್ಟ್ ಪ್ರೋಟೋಟೈಪ್)",
    hospitalSubHeader: "ರೋಗಿ ತಲುಪುವ ಮೊದಲೇ ಆಸ್ಪತ್ರೆಗೆ ತುರ್ತು ಮಾಹಿತಿ ರವಾನೆ.",
    hospitalSimLabel: "ಪ್ರೋಟೋಟೈಪ್ ಡೆಮೊ — ಸಿಮ್ಯುಲೇಟೆಡ್ ಆಸ್ಪತ್ರೆ ಇಂಟಿಗ್ರೇಷನ್",
    incomingAlertsTitle: "ಸಕ್ರಿಯ ತುರ್ತು ಪ್ರಕರಣಗಳು",
    prepBayBtn: "🚨 ಸ್ವೀಕರಿಸಿ & ಟ್ರಾಮಾ ಬೆಡ್ 1 ಸಿದ್ಧಗೊಳಿಸಿ",
    dispatchAmbulanceBtn: "🚑 ಆಸ್ಪತ್ರೆ ಅಂಬ್ಯುಲೆನ್ಸ್ ದೃಢೀಕರಿಸಿ",

    metricsHeader: "ಡೆಮೊ ಪ್ರಭಾವ ಮತ್ತು ಸುರಕ್ಷತಾ ವರದಿ",
    metricsSubHeader: "ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ, ಪ್ರೋಟೋಟೈಪ್ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳ ಲೈವ್ ವರದಿ.",
    timeToAction: "ಮೊದಲ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ: ",
    volunteersCount: "ಸಂದೇಶ ತಲುಪಿದ ಸ್ವಯಂಸೇವಕರು: ",
    guideCompleted: "ಪೂರ್ಣಗೊಳಿಸಿದ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿಗಳು: ",
    safetyCheckTitle: "ಸುರಕ್ಷತೆ ಮತ್ತು ಗೌಪ್ಯತೆ ಪರಿಶೀಲನೆ"
  }
};
