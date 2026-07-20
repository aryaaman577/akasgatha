/**
 * Space Topics Configuration for Rotating Topics Feature
 * 
 * Each topic has:
 * - id: unique identifier
 * - titleEn/titleHi/titleHinglish: topic name in 3 languages
 * - questions: 3 suggested questions per topic in all languages
 */

export type SpaceTopic = {
  id: string;
  titleEn: string;
  titleHi: string;
  titleHinglish: string;
  questions: {
    en: [string, string, string];
    hi: [string, string, string];
    hinglish: [string, string, string];
  };
};

export const spaceTopics: SpaceTopic[] = [
  {
    id: "eclipses",
    titleEn: "Eclipses & Rahu-Ketu",
    titleHi: "ग्रहण और राहु-केतु",
    titleHinglish: "Grahan aur Rahu-Ketu",
    questions: {
      en: [
        "Why do eclipses happen?",
        "What is the connection between Rahu-Ketu and eclipses?",
        "Why don't eclipses occur every month?"
      ],
      hi: [
        "ग्रहण क्यों होते हैं?",
        "राहु-केतु और ग्रहण का क्या संबंध है?",
        "हर महीने ग्रहण क्यों नहीं होते?"
      ],
      hinglish: [
        "Grahan kyon hote hain?",
        "Rahu-Ketu aur grahan ka kya relation hai?",
        "Har mahine grahan kyon nahi hote?"
      ]
    }
  },
  {
    id: "moon-phases",
    titleEn: "Moon Phases",
    titleHi: "चंद्र कलाएं",
    titleHinglish: "Chandra Kalayen",
    questions: {
      en: [
        "Why does the Moon change shape?",
        "What causes the full moon and new moon?",
        "How long is the lunar cycle?"
      ],
      hi: [
        "चंद्रमा का आकार क्यों बदलता है?",
        "पूर्णिमा और अमावस्या क्यों होती है?",
        "चंद्र चक्र कितने दिन का होता है?"
      ],
      hinglish: [
        "Chandrama ka shape kyon badalta hai?",
        "Poornima aur amavasya kyon hoti hai?",
        "Lunar cycle kitne din ka hota hai?"
      ]
    }
  },
  {
    id: "planets-orbit",
    titleEn: "Planets & Orbits",
    titleHi: "ग्रह और कक्षाएं",
    titleHinglish: "Grah aur Orbit",
    questions: {
      en: [
        "Why do planets orbit the Sun?",
        "How many planets are in our solar system?",
        "What makes planets different from stars?"
      ],
      hi: [
        "ग्रह सूर्य की परिक्रमा क्यों करते हैं?",
        "सौर मंडल में कितने ग्रह हैं?",
        "ग्रह और तारों में क्या अंतर है?"
      ],
      hinglish: [
        "Grah Surya ki parikrama kyon karte hain?",
        "Solar system mein kitne grah hain?",
        "Grah aur taaron mein kya difference hai?"
      ]
    }
  },
  {
    id: "stars-constellations",
    titleEn: "Stars & Constellations",
    titleHi: "तारे और तारामंडल",
    titleHinglish: "Taare aur Nakshatra",
    questions: {
      en: [
        "What are stars made of?",
        "Why do star patterns remain fixed?",
        "What is the Nakshatra system?"
      ],
      hi: [
        "तारे किससे बने हैं?",
        "तारों के पैटर्न स्थिर क्यों रहते हैं?",
        "नक्षत्र प्रणाली क्या है?"
      ],
      hinglish: [
        "Taare kisse bane hain?",
        "Star patterns fixed kyon rehte hain?",
        "Nakshatra system kya hai?"
      ]
    }
  },
  {
    id: "day-night",
    titleEn: "Day & Night",
    titleHi: "दिन और रात",
    titleHinglish: "Din aur Raat",
    questions: {
      en: [
        "Why does day turn into night?",
        "How fast does Earth rotate?",
        "Why are days longer in summer?"
      ],
      hi: [
        "दिन रात में क्यों बदलता है?",
        "पृथ्वी कितनी तेजी से घूमती है?",
        "गर्मियों में दिन लंबे क्यों होते हैं?"
      ],
      hinglish: [
        "Din raat mein kyon badalta hai?",
        "Prithvi kitni tezi se ghoomti hai?",
        "Summer mein din lambe kyon hote hain?"
      ]
    }
  },
  {
    id: "seasons",
    titleEn: "Seasons",
    titleHi: "ऋतुएं",
    titleHinglish: "Rituyen",
    questions: {
      en: [
        "Why do seasons change?",
        "What causes summer and winter?",
        "Why are seasons opposite in different hemispheres?"
      ],
      hi: [
        "ऋतुएं क्यों बदलती हैं?",
        "गर्मी और सर्दी क्यों होती है?",
        "अलग-अलग गोलार्धों में ऋतुएं विपरीत क्यों होती हैं?"
      ],
      hinglish: [
        "Seasons kyon badlte hain?",
        "Summer aur winter kyon hoti hai?",
        "Different hemispheres mein seasons opposite kyon hote hain?"
      ]
    }
  },
  {
    id: "black-holes",
    titleEn: "Black Holes",
    titleHi: "कृष्ण विवर",
    titleHinglish: "Black Holes",
    questions: {
      en: [
        "What is a black hole?",
        "Can anything escape a black hole?",
        "How are black holes formed?"
      ],
      hi: [
        "ब्लैक होल क्या है?",
        "क्या कोई चीज ब्लैक होल से बच सकती है?",
        "ब्लैक होल कैसे बनते हैं?"
      ],
      hinglish: [
        "Black hole kya hai?",
        "Kya koi cheez black hole se bach sakti hai?",
        "Black holes kaise bante hain?"
      ]
    }
  },
  {
    id: "satellites",
    titleEn: "Satellites & Spacecraft",
    titleHi: "उपग्रह और अंतरिक्ष यान",
    titleHinglish: "Satellites aur Spacecraft",
    questions: {
      en: [
        "How do satellites stay in orbit?",
        "What is the International Space Station?",
        "How do rockets work?"
      ],
      hi: [
        "उपग्रह कक्षा में कैसे रहते हैं?",
        "अंतर्राष्ट्रीय अंतरिक्ष स्टेशन क्या है?",
        "रॉकेट कैसे काम करते हैं?"
      ],
      hinglish: [
        "Satellites orbit mein kaise rehte hain?",
        "International Space Station kya hai?",
        "Rockets kaise kaam karte hain?"
      ]
    }
  },
  {
    id: "galaxies",
    titleEn: "Galaxies",
    titleHi: "आकाशगंगाएं",
    titleHinglish: "Galaxies",
    questions: {
      en: [
        "What is a galaxy?",
        "How many galaxies exist in the universe?",
        "What is the Milky Way?"
      ],
      hi: [
        "गैलेक्सी क्या है?",
        "ब्रह्मांड में कितनी गैलेक्सियां हैं?",
        "मिल्की वे क्या है?"
      ],
      hinglish: [
        "Galaxy kya hai?",
        "Universe mein kitni galaxies hain?",
        "Milky Way kya hai?"
      ]
    }
  },
  {
    id: "mars",
    titleEn: "Mars Exploration",
    titleHi: "मंगल अन्वेषण",
    titleHinglish: "Mars Exploration",
    questions: {
      en: [
        "Can humans live on Mars?",
        "What have we discovered on Mars?",
        "Why is Mars called the Red Planet?"
      ],
      hi: [
        "क्या मनुष्य मंगल पर रह सकते हैं?",
        "मंगल पर हमने क्या खोजा है?",
        "मंगल को लाल ग्रह क्यों कहते हैं?"
      ],
      hinglish: [
        "Kya humans Mars par reh sakte hain?",
        "Mars par humne kya discover kiya hai?",
        "Mars ko Red Planet kyon kehte hain?"
      ]
    }
  },
  {
    id: "exoplanets",
    titleEn: "Exoplanets",
    titleHi: "बाह्य ग्रह",
    titleHinglish: "Exoplanets",
    questions: {
      en: [
        "What is an exoplanet?",
        "How do we discover exoplanets?",
        "Could life exist on exoplanets?"
      ],
      hi: [
        "एक्सोप्लैनेट क्या है?",
        "हम एक्सोप्लैनेट कैसे खोजते हैं?",
        "क्या एक्सोप्लैनेट पर जीवन हो सकता है?"
      ],
      hinglish: [
        "Exoplanet kya hai?",
        "Hum exoplanets kaise discover karte hain?",
        "Kya exoplanets par life ho sakta hai?"
      ]
    }
  },
  {
    id: "telescopes",
    titleEn: "Telescopes",
    titleHi: "दूरबीन",
    titleHinglish: "Telescopes",
    questions: {
      en: [
        "How do telescopes work?",
        "What is the James Webb Space Telescope?",
        "Why do we need space telescopes?"
      ],
      hi: [
        "दूरबीन कैसे काम करती है?",
        "जेम्स वेब स्पेस टेलीस्कोप क्या है?",
        "हमें स्पेस टेलीस्कोप की जरूरत क्यों है?"
      ],
      hinglish: [
        "Telescopes kaise kaam karti hain?",
        "James Webb Space Telescope kya hai?",
        "Humein space telescopes ki zarurat kyon hai?"
      ]
    }
  },
  {
    id: "neutron-stars",
    titleEn: "Neutron Stars",
    titleHi: "न्यूट्रॉन तारे",
    titleHinglish: "Neutron Stars",
    questions: {
      en: [
        "What is a neutron star?",
        "How dense is a neutron star?",
        "What happens when stars collapse?"
      ],
      hi: [
        "न्यूट्रॉन स्टार क्या है?",
        "न्यूट्रॉन स्टार कितना घना होता है?",
        "जब तारे ढहते हैं तो क्या होता है?"
      ],
      hinglish: [
        "Neutron star kya hai?",
        "Neutron star kitna dense hota hai?",
        "Jab stars collapse hote hain to kya hota hai?"
      ]
    }
  },
  {
    id: "dark-matter",
    titleEn: "Dark Matter & Dark Energy",
    titleHi: "डार्क मैटर और डार्क एनर्जी",
    titleHinglish: "Dark Matter aur Dark Energy",
    questions: {
      en: [
        "What is dark matter?",
        "How do we know dark matter exists?",
        "What is dark energy?"
      ],
      hi: [
        "डार्क मैटर क्या है?",
        "हम कैसे जानते हैं कि डार्क मैटर मौजूद है?",
        "डार्क एनर्जी क्या है?"
      ],
      hinglish: [
        "Dark matter kya hai?",
        "Hum kaise jaante hain ki dark matter exist karta hai?",
        "Dark energy kya hai?"
      ]
    }
  },
  {
    id: "asteroids-comets",
    titleEn: "Asteroids & Comets",
    titleHi: "क्षुद्रग्रह और धूमकेतु",
    titleHinglish: "Asteroids aur Comets",
    questions: {
      en: [
        "What is the difference between asteroids and comets?",
        "Could an asteroid hit Earth?",
        "Why do comets have tails?"
      ],
      hi: [
        "क्षुद्रग्रह और धूमकेतु में क्या अंतर है?",
        "क्या कोई क्षुद्रग्रह पृथ्वी से टकरा सकता है?",
        "धूमकेतु की पूंछ क्यों होती है?"
      ],
      hinglish: [
        "Asteroids aur comets mein kya difference hai?",
        "Kya koi asteroid Earth se takra sakta hai?",
        "Comets ki tail kyon hoti hai?"
      ]
    }
  },
  {
    id: "sun",
    titleEn: "The Sun",
    titleHi: "सूर्य",
    titleHinglish: "Surya",
    questions: {
      en: [
        "How does the Sun produce energy?",
        "What is a solar flare?",
        "Will the Sun ever die?"
      ],
      hi: [
        "सूर्य ऊर्जा कैसे उत्पन्न करता है?",
        "सोलर फ्लेयर क्या है?",
        "क्या सूर्य कभी समाप्त हो जाएगा?"
      ],
      hinglish: [
        "Surya energy kaise produce karta hai?",
        "Solar flare kya hai?",
        "Kya Surya kabhi end ho jayega?"
      ]
    }
  },
  {
    id: "gravity",
    titleEn: "Gravity",
    titleHi: "गुरुत्वाकर्षण",
    titleHinglish: "Gravity",
    questions: {
      en: [
        "What is gravity?",
        "Why don't astronauts float on Earth?",
        "How does gravity keep planets in orbit?"
      ],
      hi: [
        "गुरुत्वाकर्षण क्या है?",
        "पृथ्वी पर अंतरिक्ष यात्री तैरते क्यों नहीं?",
        "गुरुत्वाकर्षण ग्रहों को कक्षा में कैसे रखता है?"
      ],
      hinglish: [
        "Gravity kya hai?",
        "Prithvi par astronauts float kyon nahi karte?",
        "Gravity planets ko orbit mein kaise rakhti hai?"
      ]
    }
  },
  {
    id: "light-years",
    titleEn: "Light Years & Distances",
    titleHi: "प्रकाश वर्ष और दूरियां",
    titleHinglish: "Light Years aur Distances",
    questions: {
      en: [
        "What is a light year?",
        "How far is the nearest star?",
        "Why do we use light years to measure space?"
      ],
      hi: [
        "प्रकाश वर्ष क्या है?",
        "निकटतम तारा कितना दूर है?",
        "हम अंतरिक्ष को मापने के लिए प्रकाश वर्ष का उपयोग क्यों करते हैं?"
      ],
      hinglish: [
        "Light year kya hai?",
        "Nearest star kitna door hai?",
        "Hum space measure karne ke liye light years ka use kyon karte hain?"
      ]
    }
  },
  {
    id: "big-bang",
    titleEn: "Big Bang & Universe Origin",
    titleHi: "महाविस्फोट और ब्रह्मांड की उत्पत्ति",
    titleHinglish: "Big Bang aur Universe ki Origin",
    questions: {
      en: [
        "What is the Big Bang theory?",
        "How old is the universe?",
        "What existed before the Big Bang?"
      ],
      hi: [
        "बिग बैंग सिद्धांत क्या है?",
        "ब्रह्मांड कितना पुराना है?",
        "बिग बैंग से पहले क्या था?"
      ],
      hinglish: [
        "Big Bang theory kya hai?",
        "Universe kitna purana hai?",
        "Big Bang se pehle kya tha?"
      ]
    }
  },
  {
    id: "planetary-rings",
    titleEn: "Planetary Rings",
    titleHi: "ग्रहीय वलय",
    titleHinglish: "Planetary Rings",
    questions: {
      en: [
        "Why does Saturn have rings?",
        "What are planetary rings made of?",
        "Do all planets have rings?"
      ],
      hi: [
        "शनि के पास वलय क्यों हैं?",
        "ग्रहीय वलय किससे बने हैं?",
        "क्या सभी ग्रहों के पास वलय हैं?"
      ],
      hinglish: [
        "Saturn ke paas rings kyon hain?",
        "Planetary rings kisse bane hain?",
        "Kya sabhi planets ke paas rings hain?"
      ]
    }
  },
  {
    id: "supernova",
    titleEn: "Supernovae",
    titleHi: "महानोवा",
    titleHinglish: "Supernova",
    questions: {
      en: [
        "What is a supernova?",
        "What happens when a star explodes?",
        "Can we see supernovae from Earth?"
      ],
      hi: [
        "सुपरनोवा क्या है?",
        "जब कोई तारा फटता है तो क्या होता है?",
        "क्या हम पृथ्वी से सुपरनोवा देख सकते हैं?"
      ],
      hinglish: [
        "Supernova kya hai?",
        "Jab koi star explode hota hai to kya hota hai?",
        "Kya hum Earth se supernova dekh sakte hain?"
      ]
    }
  },
  {
    id: "space-time",
    titleEn: "Space-Time",
    titleHi: "अंतरिक्ष-काल",
    titleHinglish: "Space-Time",
    questions: {
      en: [
        "What is space-time?",
        "How does gravity bend space-time?",
        "What is Einstein's theory of relativity?"
      ],
      hi: [
        "अंतरिक्ष-काल क्या है?",
        "गुरुत्वाकर्षण अंतरिक्ष-काल को कैसे मोड़ता है?",
        "आइंस्टीन का सापेक्षता सिद्धांत क्या है?"
      ],
      hinglish: [
        "Space-time kya hai?",
        "Gravity space-time ko kaise bend karta hai?",
        "Einstein ka theory of relativity kya hai?"
      ]
    }
  },
  {
    id: "meteorites",
    titleEn: "Meteorites",
    titleHi: "उल्कापिंड",
    titleHinglish: "Meteorites",
    questions: {
      en: [
        "What are shooting stars?",
        "What is the difference between meteors and meteorites?",
        "Can meteorites be dangerous?"
      ],
      hi: [
        "टूटते तारे क्या हैं?",
        "उल्का और उल्कापिंड में क्या अंतर है?",
        "क्या उल्कापिंड खतरनाक हो सकते हैं?"
      ],
      hinglish: [
        "Shooting stars kya hain?",
        "Meteors aur meteorites mein kya difference hai?",
        "Kya meteorites dangerous ho sakte hain?"
      ]
    }
  },
  {
    id: "space-weather",
    titleEn: "Space Weather",
    titleHi: "अंतरिक्ष मौसम",
    titleHinglish: "Space Weather",
    questions: {
      en: [
        "What is space weather?",
        "Can solar storms affect Earth?",
        "What are auroras?"
      ],
      hi: [
        "अंतरिक्ष मौसम क्या है?",
        "क्या सौर तूफान पृथ्वी को प्रभावित कर सकते हैं?",
        "ध्रुवीय ज्योति क्या है?"
      ],
      hinglish: [
        "Space weather kya hai?",
        "Kya solar storms Earth ko affect kar sakte hain?",
        "Auroras kya hain?"
      ]
    }
  },
  {
    id: "habitable-zones",
    titleEn: "Habitable Zones",
    titleHi: "रहने योग्य क्षेत्र",
    titleHinglish: "Habitable Zones",
    questions: {
      en: [
        "What is the habitable zone?",
        "Could life exist on Europa's ice moon?",
        "What conditions are needed for life?"
      ],
      hi: [
        "रहने योग्य क्षेत्र क्या है?",
        "क्या यूरोपा के बर्फ चंद्रमा पर जीवन हो सकता है?",
        "जीवन के लिए कौन सी स्थितियां आवश्यक हैं?"
      ],
      hinglish: [
        "Habitable zone kya hai?",
        "Kya Europa ke ice moon par life ho sakta hai?",
        "Life ke liye kaun si conditions zaroori hain?"
      ]
    }
  },
  {
    id: "cosmic-rays",
    titleEn: "Cosmic Rays",
    titleHi: "ब्रह्मांडीय किरणें",
    titleHinglish: "Cosmic Rays",
    questions: {
      en: [
        "What are cosmic rays?",
        "Where do cosmic rays come from?",
        "Are cosmic rays dangerous?"
      ],
      hi: [
        "ब्रह्मांडीय किरणें क्या हैं?",
        "ब्रह्मांडीय किरणें कहां से आती हैं?",
        "क्या ब्रह्मांडीय किरणें खतरनाक हैं?"
      ],
      hinglish: [
        "Cosmic rays kya hain?",
        "Cosmic rays kahan se aati hain?",
        "Kya cosmic rays dangerous hain?"
      ]
    }
  },
  {
    id: "pulsars",
    titleEn: "Pulsars",
    titleHi: "पल्सर",
    titleHinglish: "Pulsars",
    questions: {
      en: [
        "What is a pulsar?",
        "Why do pulsars spin so fast?",
        "How do we detect pulsars?"
      ],
      hi: [
        "पल्सर क्या है?",
        "पल्सर इतनी तेजी से क्यों घूमते हैं?",
        "हम पल्सर कैसे खोजते हैं?"
      ],
      hinglish: [
        "Pulsar kya hai?",
        "Pulsars itni tezi se kyon ghoomte hain?",
        "Hum pulsars kaise detect karte hain?"
      ]
    }
  },
  {
    id: "gravitational-waves",
    titleEn: "Gravitational Waves",
    titleHi: "गुरुत्वीय तरंगें",
    titleHinglish: "Gravitational Waves",
    questions: {
      en: [
        "What are gravitational waves?",
        "How do we detect gravitational waves?",
        "What causes gravitational waves?"
      ],
      hi: [
        "गुरुत्वीय तरंगें क्या हैं?",
        "हम गुरुत्वीय तरंगों का पता कैसे लगाते हैं?",
        "गुरुत्वीय तरंगें क्यों उत्पन्न होती हैं?"
      ],
      hinglish: [
        "Gravitational waves kya hain?",
        "Hum gravitational waves kaise detect karte hain?",
        "Gravitational waves kyon banti hain?"
      ]
    }
  },
  {
    id: "white-dwarfs",
    titleEn: "White Dwarfs",
    titleHi: "श्वेत वामन",
    titleHinglish: "White Dwarfs",
    questions: {
      en: [
        "What is a white dwarf?",
        "What will happen when the Sun becomes a white dwarf?",
        "Can white dwarfs explode?"
      ],
      hi: [
        "व्हाइट ड्वार्फ क्या है?",
        "जब सूर्य व्हाइट ड्वार्फ बनेगा तो क्या होगा?",
        "क्या व्हाइट ड्वार्फ विस्फोट कर सकते हैं?"
      ],
      hinglish: [
        "White dwarf kya hai?",
        "Jab Surya white dwarf banega to kya hoga?",
        "Kya white dwarfs explode kar sakte hain?"
      ]
    }
  },
  {
    id: "rocket-science",
    titleEn: "Rocket Science",
    titleHi: "रॉकेट विज्ञान",
    titleHinglish: "Rocket Science",
    questions: {
      en: [
        "How do rocket engines work?",
        "What fuel do rockets use?",
        "Why are multiple stages needed?"
      ],
      hi: [
        "रॉकेट इंजन कैसे काम करते हैं?",
        "रॉकेट किस ईंधन का उपयोग करते हैं?",
        "कई चरणों की आवश्यकता क्यों होती है?"
      ],
      hinglish: [
        "Rocket engines kaise kaam karte hain?",
        "Rockets kaun sa fuel use karte hain?",
        "Multiple stages ki zarurat kyon hoti hai?"
      ]
    }
  },
  {
    id: "jupiter-moons",
    titleEn: "Jupiter & Its Moons",
    titleHi: "बृहस्पति और उसके चंद्रमा",
    titleHinglish: "Jupiter aur uske Moons",
    questions: {
      en: [
        "How many moons does Jupiter have?",
        "What is the Great Red Spot on Jupiter?",
        "Could life exist under Europa's ice?"
      ],
      hi: [
        "बृहस्पति के कितने चंद्रमा हैं?",
        "बृहस्पति पर ग्रेट रेड स्पॉट क्या है?",
        "क्या यूरोपा की बर्फ के नीचे जीवन हो सकता है?"
      ],
      hinglish: [
        "Jupiter ke kitne moons hain?",
        "Jupiter par Great Red Spot kya hai?",
        "Kya Europa ki ice ke neeche life ho sakta hai?"
      ]
    }
  },
  {
    id: "galaxy-formation",
    titleEn: "Galaxy Formation",
    titleHi: "आकाशगंगा निर्माण",
    titleHinglish: "Galaxy Formation",
    questions: {
      en: [
        "How are galaxies formed?",
        "Will the Milky Way collide with other galaxies?",
        "What shapes can galaxies have?"
      ],
      hi: [
        "आकाशगंगाएं कैसे बनती हैं?",
        "क्या मिल्की वे अन्य आकाशगंगाओं से टकराएगी?",
        "आकाशगंगाओं के कौन से आकार हो सकते हैं?"
      ],
      hinglish: [
        "Galaxies kaise banti hain?",
        "Kya Milky Way dusri galaxies se takrayegi?",
        "Galaxies ke kaun se shapes ho sakte hain?"
      ]
    }
  },
  {
    id: "ancient-astronomy",
    titleEn: "Ancient Astronomy",
    titleHi: "प्राचीन खगोल विज्ञान",
    titleHinglish: "Prachin Astronomy",
    questions: {
      en: [
        "How did ancient astronomers track the sky?",
        "What is Vedanga Jyotisha?",
        "How were eclipses predicted in ancient times?"
      ],
      hi: [
        "प्राचीन खगोलविदों ने आकाश को कैसे ट्रैक किया?",
        "वेदांग ज्योतिष क्या है?",
        "प्राचीन काल में ग्रहणों की भविष्यवाणी कैसे की जाती थी?"
      ],
      hinglish: [
        "Prachin astronomers ne sky ko kaise track kiya?",
        "Vedanga Jyotisha kya hai?",
        "Prachin times mein eclipses predict kaise kiye jaate the?"
      ]
    }
  },
  {
    id: "space-exploration-history",
    titleEn: "Space Exploration History",
    titleHi: "अंतरिक्ष अन्वेषण इतिहास",
    titleHinglish: "Space Exploration History",
    questions: {
      en: [
        "When did humans first go to space?",
        "What was the Apollo mission?",
        "What are India's space achievements?"
      ],
      hi: [
        "मनुष्य पहली बार अंतरिक्ष में कब गए?",
        "अपोलो मिशन क्या था?",
        "भारत की अंतरिक्ष उपलब्धियां क्या हैं?"
      ],
      hinglish: [
        "Humans pehli baar space mein kab gaye?",
        "Apollo mission kya tha?",
        "India ki space achievements kya hain?"
      ]
    }
  },
  {
    id: "cosmic-inflation",
    titleEn: "Cosmic Inflation",
    titleHi: "ब्रह्मांडीय विस्तार",
    titleHinglish: "Cosmic Inflation",
    questions: {
      en: [
        "What is cosmic inflation?",
        "How fast is the universe expanding?",
        "Will the universe expand forever?"
      ],
      hi: [
        "ब्रह्मांडीय विस्तार क्या है?",
        "ब्रह्मांड कितनी तेजी से फैल रहा है?",
        "क्या ब्रह्मांड हमेशा फैलता रहेगा?"
      ],
      hinglish: [
        "Cosmic inflation kya hai?",
        "Universe kitni tezi se expand ho raha hai?",
        "Kya universe hamesha expand hota rahega?"
      ]
    }
  },
  {
    id: "multiverse",
    titleEn: "Multiverse Theory",
    titleHi: "बहुविश्व सिद्धांत",
    titleHinglish: "Multiverse Theory",
    questions: {
      en: [
        "What is the multiverse theory?",
        "Could other universes exist?",
        "How would we detect other universes?"
      ],
      hi: [
        "बहुविश्व सिद्धांत क्या है?",
        "क्या अन्य ब्रह्मांड मौजूद हो सकते हैं?",
        "हम अन्य ब्रह्मांडों का पता कैसे लगाएंगे?"
      ],
      hinglish: [
        "Multiverse theory kya hai?",
        "Kya dusre universes exist ho sakte hain?",
        "Hum dusre universes kaise detect karenge?"
      ]
    }
  },
  {
    id: "quasars",
    titleEn: "Quasars",
    titleHi: "क्वासर",
    titleHinglish: "Quasars",
    questions: {
      en: [
        "What is a quasar?",
        "Why are quasars so bright?",
        "How far away are quasars?"
      ],
      hi: [
        "क्वासर क्या है?",
        "क्वासर इतने उज्ज्वल क्यों होते हैं?",
        "क्वासर कितने दूर हैं?"
      ],
      hinglish: [
        "Quasar kya hai?",
        "Quasars itne bright kyon hote hain?",
        "Quasars kitne door hain?"
      ]
    }
  },
];

/**
 * Get random subset of topics for rotation
 */
export function getRandomTopics(count: number = 5): SpaceTopic[] {
  const shuffled = [...spaceTopics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, spaceTopics.length));
}

/**
 * Get topic by ID
 */
export function getTopicById(id: string): SpaceTopic | undefined {
  return spaceTopics.find(topic => topic.id === id);
}
