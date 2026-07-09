export const defaultLang = "en" as const;
export type Lang = "en" | "fr" | "de" | "ar";

export const languages: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
};

export const dir: Record<Lang, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  de: "ltr",
  ar: "rtl",
};

// Path to a locale home (en has no prefix)
export function localeHref(lang: Lang, sub = ""): string {
  const base = lang === "en" ? "/" : `/${lang}/`;
  return sub ? `${base}${sub}` : base;
}

type Strings = {
  title: string;
  description: string;
  eyebrow: string;
  h1a: string;
  h1accent: string;
  h1b: string;
  lead: string;
  navCta: string;
  emailPlaceholder: string;
  cta: string;
  note: string;
  ok: string;
  err: string;
  cardLabel: string;
  cardNote: string;
  confidence: string;
  chips: [string, string, string];
  featuresTitle: string;
  values: { t: string; p: string }[];
  visionPre: string;
  visionEm: string;
  visionPost: string;
  rights: string;
  skip: string;
  privacy: string;
  terms: string;
};

export const ui: Record<Lang, Strings> = {
  en: {
    title: "Aptelle | Find your right size in any brand",
    description:
      "Aptelle helps you find the right size in any brand before you buy, powered by your body profile and real fit data. Join the waitlist.",
    eyebrow: "Fit intelligence, launching soon",
    h1a: "Your ",
    h1accent: "right size",
    h1b: " in any brand",
    lead: "Aptelle helps you find the right size in any brand before you buy, powered by your body profile and real fit data.",
    navCta: "Join the waitlist",
    emailPlaceholder: "you@email.com",
    cta: "Notify me",
    note: "No spam. One email when we open early access.",
    ok: "You are on the list. We will email you when early access opens.",
    err: "Please enter a valid email.",
    cardLabel: "Your size in",
    cardNote: "recommended, based on your profile and shoppers like you",
    confidence: "confidence",
    chips: ["Body profile", "Sizes you own", "Similar shoppers"],
    featuresTitle: "Core features",
    values: [
      { t: "A profile that learns you", p: "Tell us a little about your body and the sizes you already wear. Aptelle builds a fit profile that gets sharper over time." },
      { t: "A cross-brand fit graph", p: "Sizing is different at every label. Aptelle maps how brands actually fit, so a size in one place translates to the right size in another." },
      { t: "A confidence score", p: "Every recommendation comes with a clear confidence score, so you know when to buy and when to size up or down." },
    ],
    visionPre: "We are building the ",
    visionEm: "fit layer",
    visionPost: " for online fashion, so buying online feels as sure as trying it on.",
    rights: "All rights reserved.",
    skip: "Skip to content",
    privacy: "Privacy",
    terms: "Terms",
  },
  fr: {
    title: "Aptelle | Trouvez votre bonne taille dans chaque marque",
    description:
      "Aptelle vous aide à trouver la bonne taille dans chaque marque avant d'acheter, grâce à votre profil corporel et à des données d'ajustement réelles. Rejoignez la liste d'attente.",
    eyebrow: "Intelligence d'ajustement, bientôt disponible",
    h1a: "Votre ",
    h1accent: "bonne taille",
    h1b: " dans chaque marque",
    lead: "Aptelle vous aide à trouver la bonne taille dans chaque marque avant d'acheter, grâce à votre profil corporel et à des données d'ajustement réelles.",
    navCta: "Rejoindre la liste d'attente",
    emailPlaceholder: "vous@email.com",
    cta: "Prévenez-moi",
    note: "Pas de spam. Un seul e-mail à l'ouverture de l'accès anticipé.",
    ok: "Vous êtes inscrit. Nous vous écrirons à l'ouverture de l'accès anticipé.",
    err: "Veuillez saisir une adresse e-mail valide.",
    cardLabel: "Votre taille chez",
    cardNote: "recommandée, d'après votre profil et des acheteurs comme vous",
    confidence: "confiance",
    chips: ["Profil corporel", "Tailles que vous portez", "Acheteurs similaires"],
    featuresTitle: "Fonctionnalités clés",
    values: [
      { t: "Un profil qui vous apprend", p: "Indiquez quelques informations sur votre corps et les tailles que vous portez déjà. Aptelle construit un profil d'ajustement qui s'affine avec le temps." },
      { t: "Un graphe d'ajustement multi-marques", p: "Chaque marque taille différemment. Aptelle cartographie la façon dont les marques taillent vraiment, pour qu'une taille se traduise par la bonne taille ailleurs." },
      { t: "Un indice de confiance", p: "Chaque recommandation s'accompagne d'un indice de confiance clair, pour savoir quand acheter et quand prendre une taille au-dessus ou en dessous." },
    ],
    visionPre: "Nous construisons la ",
    visionEm: "couche d'ajustement",
    visionPost: " de la mode en ligne, pour que l'achat en ligne soit aussi sûr que l'essayage.",
    rights: "Tous droits réservés.",
    skip: "Aller au contenu",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
  de: {
    title: "Aptelle | Finde deine richtige Größe in jeder Marke",
    description:
      "Aptelle hilft dir, in jeder Marke die richtige Größe zu finden, bevor du kaufst, auf Basis deines Körperprofils und echter Passform-Daten. Trag dich in die Warteliste ein.",
    eyebrow: "Passform-Intelligenz, bald verfügbar",
    h1a: "Deine ",
    h1accent: "richtige Größe",
    h1b: " in jeder Marke",
    lead: "Aptelle hilft dir, in jeder Marke die richtige Größe zu finden, bevor du kaufst, auf Basis deines Körperprofils und echter Passform-Daten.",
    navCta: "Zur Warteliste",
    emailPlaceholder: "du@email.com",
    cta: "Benachrichtige mich",
    note: "Kein Spam. Eine E-Mail, sobald der frühe Zugang startet.",
    ok: "Du bist auf der Liste. Wir melden uns, sobald der frühe Zugang startet.",
    err: "Bitte gib eine gültige E-Mail-Adresse ein.",
    cardLabel: "Deine Größe bei",
    cardNote: "empfohlen, basierend auf deinem Profil und ähnlichen Käufern",
    confidence: "Konfidenz",
    chips: ["Körperprofil", "Größen, die du trägst", "Ähnliche Käufer"],
    featuresTitle: "Kernfunktionen",
    values: [
      { t: "Ein Profil, das dich kennenlernt", p: "Sag uns ein wenig über deinen Körper und die Größen, die du bereits trägst. Aptelle baut ein Passform-Profil, das mit der Zeit schärfer wird." },
      { t: "Ein markenübergreifender Passform-Graph", p: "Jede Marke fällt anders aus. Aptelle bildet ab, wie Marken wirklich sitzen, damit eine Größe sich anderswo in die richtige Größe übersetzt." },
      { t: "Ein Konfidenzwert", p: "Jede Empfehlung kommt mit einem klaren Konfidenzwert, damit du weißt, wann du kaufen und wann du eine Größe größer oder kleiner wählen solltest." },
    ],
    visionPre: "Wir bauen die ",
    visionEm: "Passform-Ebene",
    visionPost: " für Online-Mode, damit der Online-Kauf so sicher wird wie das Anprobieren.",
    rights: "Alle Rechte vorbehalten.",
    skip: "Zum Inhalt springen",
    privacy: "Datenschutz",
    terms: "AGB",
  },
  ar: {
    title: "Aptelle | اعرف مقاسك الصحيح في أي علامة تجارية",
    description:
      "يساعدك Aptelle على معرفة المقاس الصحيح في أي علامة تجارية قبل الشراء، اعتمادًا على ملف جسمك وبيانات قياس حقيقية. انضم إلى قائمة الانتظار.",
    eyebrow: "ذكاء المقاسات، قريبًا",
    h1a: "",
    h1accent: "مقاسك الصحيح",
    h1b: " في أي علامة تجارية",
    lead: "يساعدك Aptelle على معرفة المقاس الصحيح في أي علامة تجارية قبل الشراء، اعتمادًا على ملف جسمك وبيانات قياس حقيقية.",
    navCta: "انضم إلى قائمة الانتظار",
    emailPlaceholder: "you@email.com",
    cta: "أبلغني",
    note: "بدون رسائل مزعجة. رسالة واحدة عند فتح الوصول المبكر.",
    ok: "أنت الآن على القائمة. سنراسلك عند فتح الوصول المبكر.",
    err: "يرجى إدخال بريد إلكتروني صحيح.",
    cardLabel: "مقاسك لدى",
    cardNote: "موصى به، بناءً على ملفك ومتسوّقين مثلك",
    confidence: "الثقة",
    chips: ["ملف الجسم", "المقاسات التي ترتديها", "متسوّقون مشابهون"],
    featuresTitle: "الميزات الأساسية",
    values: [
      { t: "ملف يتعرّف عليك", p: "أخبرنا قليلًا عن جسمك والمقاسات التي ترتديها بالفعل. يبني Aptelle ملف قياس يزداد دقة مع الوقت." },
      { t: "رسم بياني للمقاسات عبر العلامات", p: "كل علامة تجارية تختلف في المقاس. يرسم Aptelle كيف تناسب العلامات فعليًا، ليتحوّل مقاسك في مكان إلى المقاس الصحيح في مكان آخر." },
      { t: "درجة ثقة", p: "تأتي كل توصية بدرجة ثقة واضحة، لتعرف متى تشتري ومتى تختار مقاسًا أكبر أو أصغر." },
    ],
    visionPre: "نحن نبني ",
    visionEm: "طبقة المقاسات",
    visionPost: " للأزياء على الإنترنت، ليصبح الشراء عبر الإنترنت مؤكدًا كأنك تجرّب الملابس.",
    rights: "جميع الحقوق محفوظة.",
    skip: "تخطَّ إلى المحتوى",
    privacy: "الخصوصية",
    terms: "الشروط",
  },
};

export function t(lang: Lang): Strings {
  return ui[lang] ?? ui.en;
}
