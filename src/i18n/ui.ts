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
  home?: string;
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
  answersLabel: string;
  answersTitle: string;
  faqs: { q: string; a: string }[];
  visionPre: string;
  visionEm: string;
  visionPost: string;
  rights: string;
  skip: string;
  privacy: string;
  terms: string;
  projectPre: string;
  projectPost: string;
  joinedTitle: string;
  joinedH1: string;
  joinedBody: string;
  backHome: string;
  contactNav: string;
  contactTitle: string;
  contactH1: string;
  contactBody: string;
  contactCta: string;
  cookieText: string;
  cookieAccept: string;
  cookieReject: string;
  surveyTab: string;
};

export const ui: Record<Lang, Strings> = {
  en: {
    title: "Aptelle | Fit intelligence for finding your size",
    description:
      "Aptelle is building fit intelligence to help you find your likely size across clothing brands before you buy. Join the pre-launch waitlist.",
    eyebrow: "Fit intelligence, launching soon",
    h1a: "Your ",
    h1accent: "right size",
    h1b: " in any brand",
    lead: "Aptelle is being built to help you find your likely size in any brand before you buy, using your body profile and real fit data",
    home: "Home",
    navCta: "Join the Waitlist",
    emailPlaceholder: "you@email.com",
    cta: "Notify me",
    note: "No spam. One email when we open early access",
    ok: "You are on the list. We will email you when early access opens",
    err: "Please enter a valid email",
    cardLabel: "Your size in",
    cardNote: "recommended, based on your profile and shoppers like you",
    confidence: "confidence",
    chips: ["Body profile", "Sizes you own", "Similar shoppers"],
    featuresTitle: "Core features",
    values: [
      {
        t: "A profile that learns you",
        p: "Tell us a little about your body and the sizes you already wear. Aptelle builds a fit profile that gets sharper over time",
      },
      {
        t: "A cross-brand fit graph",
        p: "Sizing is different at every label. Aptelle maps how brands actually fit, so a size in one place translates to the right size in another",
      },
      {
        t: "A confidence score",
        p: "Every recommendation comes with a clear confidence score, so you know when to buy and when to size up or down",
      },
    ],
    answersLabel: "Aptelle, clearly",
    answersTitle: "Questions, answered",
    faqs: [
      { q: "What is Aptelle?", a: "Aptelle is a pre-launch fit-intelligence platform for online clothing. It is being built to recommend the size most likely to fit you in a new brand before you buy." },
      { q: "How will Aptelle recommend a size?", a: "Aptelle combines your body profile, the sizes you already wear, fit preferences and real fit outcomes from similar shoppers. Each recommendation is designed to include a confidence score." },
      { q: "Can I use Aptelle today?", a: "Not yet. Aptelle is in development. Joining the waitlist means we can tell you when early access opens. It does not guarantee access or a specific feature." },
    ],
    visionPre: "We are building the ",
    visionEm: "fit layer",
    visionPost:
      " for online fashion, so buying online feels as sure as trying it on",
    rights: "All rights reserved.",
    skip: "Skip to content",
    privacy: "Privacy",
    terms: "Terms",
    projectPre: "A ",
    projectPost: " project",
    joinedTitle: "Aptelle | You are on the list",
    joinedH1: "You are on the list",
    joinedBody: "One email when early access opens, nothing else until then. Your right size in any brand is on its way",
    backHome: "Back to home",
    contactNav: "Contact",
    contactTitle: "Aptelle | Contact",
    contactH1: "Contact",
    contactBody: "Questions, feedback or press. One inbox, read by the founder",
    contactCta: "Write to us",
    cookieText: "We use cookies to run this site and to load our survey form. Accept to enable the embedded survey.",
    cookieAccept: "Accept",
    cookieReject: "Reject",
    surveyTab: "Shape Aptelle",
  },
  fr: {
    title: "Aptelle | L’intelligence d’ajustement pour votre taille",
    description:
      "Aptelle développe une intelligence d’ajustement pour vous aider à trouver votre taille probable dans chaque marque avant l’achat. Rejoignez la liste d’attente.",
    eyebrow: "Intelligence d'ajustement, bientôt disponible",
    h1a: "Votre ",
    h1accent: "bonne taille",
    h1b: " dans chaque marque",
    lead: "Aptelle est conçu pour vous aider à trouver votre taille probable dans chaque marque avant l’achat, grâce à votre profil corporel et à des données d’ajustement réelles",
    home: "Accueil",
    navCta: "Rejoindre la liste d'attente",
    emailPlaceholder: "vous@email.com",
    cta: "Prévenez-moi",
    note: "Pas de spam. Un seul e-mail à l'ouverture de l'accès anticipé",
    ok: "Vous êtes inscrit. Nous vous écrirons à l'ouverture de l'accès anticipé",
    err: "Veuillez saisir une adresse e-mail valide.",
    cardLabel: "Votre taille chez",
    cardNote: "recommandée, d'après votre profil et des acheteurs comme vous",
    confidence: "confiance",
    chips: [
      "Profil corporel",
      "Tailles que vous portez",
      "Acheteurs similaires",
    ],
    featuresTitle: "Fonctionnalités clés",
    values: [
      {
        t: "Un profil qui vous apprend",
        p: "Indiquez quelques informations sur votre corps et les tailles que vous portez déjà. Aptelle construit un profil d'ajustement qui s'affine avec le temps",
      },
      {
        t: "Un graphe d'ajustement multi-marques",
        p: "Chaque marque taille différemment. Aptelle cartographie la façon dont les marques taillent vraiment, pour qu'une taille se traduise par la bonne taille ailleurs",
      },
      {
        t: "Un indice de confiance",
        p: "Chaque recommandation s'accompagne d'un indice de confiance clair, pour savoir quand acheter et quand prendre une taille au-dessus ou en dessous",
      },
    ],
    answersLabel: "Aptelle, clairement",
    answersTitle: "Vos questions, nos réponses",
    faqs: [
      { q: "Qu’est-ce qu’Aptelle ?", a: "Aptelle est une plateforme d’intelligence d’ajustement pour les vêtements en ligne, actuellement en pré-lancement. Elle est conçue pour recommander la taille la plus susceptible de vous convenir dans une nouvelle marque avant l’achat." },
      { q: "Comment Aptelle recommandera-t-elle une taille ?", a: "Aptelle combinera votre profil corporel, les tailles que vous portez déjà, vos préférences d’ajustement et les résultats réels d’acheteurs similaires. Chaque recommandation devrait inclure un indice de confiance." },
      { q: "Puis-je utiliser Aptelle aujourd’hui ?", a: "Pas encore. Aptelle est en développement. Rejoindre la liste d’attente nous permet de vous prévenir à l’ouverture de l’accès anticipé. Cela ne garantit pas l’accès ni une fonctionnalité précise." },
    ],
    visionPre: "Nous construisons la ",
    visionEm: "couche d'ajustement",
    visionPost:
      " de la mode en ligne, pour que l'achat en ligne soit aussi sûr que l'essayage",
    rights: "Tous droits réservés.",
    skip: "Aller au contenu",
    privacy: "Confidentialité",
    terms: "Conditions",
    projectPre: "Un projet ",
    projectPost: "",
    joinedTitle: "Aptelle | Vous êtes sur la liste",
    joinedH1: "Vous êtes sur la liste",
    joinedBody: "Un seul e-mail à l'ouverture de l'accès anticipé, rien d'autre d'ici là. Votre bonne taille dans chaque marque arrive",
    backHome: "Retour à l'accueil",
    contactNav: "Contact",
    contactTitle: "Aptelle | Contact",
    contactH1: "Contact",
    contactBody: "Questions, retours ou presse. Une seule boîte, lue par le fondateur",
    contactCta: "Écrivez-nous",
    cookieText: "Nous utilisons des cookies pour faire fonctionner ce site et charger notre formulaire. Acceptez pour activer le sondage intégré.",
    cookieAccept: "Accepter",
    cookieReject: "Refuser",
    surveyTab: "Façonner Aptelle",
  },
  de: {
    title: "Aptelle | Passform-Intelligenz für deine Größe",
    description:
      "Aptelle entwickelt Passform-Intelligenz, die dir vor dem Kauf deine wahrscheinliche Größe in verschiedenen Marken empfehlen soll. Jetzt auf die Warteliste.",
    eyebrow: "Passform-Intelligenz, bald verfügbar",
    h1a: "Deine ",
    h1accent: "richtige Größe",
    h1b: " in jeder Marke",
    lead: "Aptelle wird entwickelt, um dir vor dem Kauf deine wahrscheinliche Größe in jeder Marke auf Basis deines Körperprofils und echter Passform-Daten zu empfehlen",
    home: "Startseite",
    navCta: "Zur Warteliste",
    emailPlaceholder: "du@email.com",
    cta: "Benachrichtige mich",
    note: "Kein Spam. Eine E-Mail, sobald der frühe Zugang startet",
    ok: "Du bist auf der Liste. Wir melden uns, sobald der frühe Zugang startet",
    err: "Bitte gib eine gültige E-Mail-Adresse ein",
    cardLabel: "Deine Größe bei",
    cardNote: "empfohlen, basierend auf deinem Profil und ähnlichen Käufern",
    confidence: "Konfidenz",
    chips: ["Körperprofil", "Größen, die du trägst", "Ähnliche Käufer"],
    featuresTitle: "Kernfunktionen",
    values: [
      {
        t: "Ein Profil, das dich kennenlernt",
        p: "Sag uns ein wenig über deinen Körper und die Größen, die du bereits trägst. Aptelle baut ein Passform-Profil, das mit der Zeit schärfer wird",
      },
      {
        t: "Ein markenübergreifender Passform-Graph",
        p: "Jede Marke fällt anders aus. Aptelle bildet ab, wie Marken wirklich sitzen, damit eine Größe sich anderswo in die richtige Größe übersetzt",
      },
      {
        t: "Ein Konfidenzwert",
        p: "Jede Empfehlung kommt mit einem klaren Konfidenzwert, damit du weißt, wann du kaufen und wann du eine Größe größer oder kleiner wählen solltest",
      },
    ],
    answersLabel: "Aptelle, klar erklärt",
    answersTitle: "Fragen, beantwortet",
    faqs: [
      { q: "Was ist Aptelle?", a: "Aptelle ist eine Fit-Intelligence-Plattform für Online-Mode in der Vorbereitungsphase. Sie wird entwickelt, um dir vor dem Kauf die Größe zu empfehlen, die in einer neuen Marke am wahrscheinlichsten passt." },
      { q: "Wie wird Aptelle eine Größe empfehlen?", a: "Aptelle kombiniert dein Körperprofil, die Größen, die du bereits trägst, deine Passformvorlieben und echte Passformergebnisse ähnlicher Käufer. Jede Empfehlung soll einen Konfidenzwert enthalten." },
      { q: "Kann ich Aptelle heute nutzen?", a: "Noch nicht. Aptelle befindet sich in Entwicklung. Mit der Warteliste können wir dich informieren, wenn der frühe Zugang öffnet. Sie garantiert keinen Zugang und keine bestimmte Funktion." },
    ],
    visionPre: "Wir bauen die ",
    visionEm: "Passform-Ebene",
    visionPost:
      " für Online-Mode, damit der Online-Kauf so sicher wird wie das Anprobieren",
    rights: "Alle Rechte vorbehalten.",
    skip: "Zum Inhalt springen",
    privacy: "Datenschutz",
    terms: "AGB",
    projectPre: "Ein Projekt von ",
    projectPost: "",
    joinedTitle: "Aptelle | Du stehst auf der Liste",
    joinedH1: "Du stehst auf der Liste",
    joinedBody: "Genau eine E-Mail, sobald der frühe Zugang startet, bis dahin nichts weiter. Deine richtige Größe in jeder Marke ist unterwegs",
    backHome: "Zurück zur Startseite",
    contactNav: "Kontakt",
    contactTitle: "Aptelle | Kontakt",
    contactH1: "Kontakt",
    contactBody: "Fragen, Feedback oder Presse. Ein Postfach, gelesen vom Gründer",
    contactCta: "Schreib uns",
    cookieText: "Wir verwenden Cookies, um diese Seite zu betreiben und unser Formular zu laden. Akzeptiere, um die eingebettete Umfrage zu aktivieren.",
    cookieAccept: "Akzeptieren",
    cookieReject: "Ablehnen",
    surveyTab: "Aptelle mitgestalten",
  },
  ar: {
    title: "Aptelle | ذكاء المقاسات لمعرفة مقاسك",
    description:
      "يعمل Aptelle على بناء ذكاء للمقاسات لمساعدتك على معرفة مقاسك المحتمل عبر علامات الملابس قبل الشراء. انضم إلى قائمة الانتظار قبل الإطلاق.",
    eyebrow: "ذكاء المقاسات، قريبًا",
    h1a: "",
    h1accent: "مقاسك الصحيح",
    h1b: " في أي علامة تجارية",
    lead: "يجري تطوير Aptelle لمساعدتك على معرفة مقاسك المحتمل في أي علامة تجارية قبل الشراء، اعتمادًا على ملف جسمك وبيانات قياس حقيقية",
    home: "الرئيسية",
    navCta: "انضم إلى قائمة الانتظار",
    emailPlaceholder: "you@email.com",
    cta: "أبلغني",
    note: "بدون رسائل مزعجة. رسالة واحدة عند فتح الوصول المبكر",
    ok: "أنت الآن على القائمة. سنراسلك عند فتح الوصول المبكر",
    err: "يرجى إدخال بريد إلكتروني صحيح.",
    cardLabel: "مقاسك لدى",
    cardNote: "موصى به، بناءً على ملفك ومتسوّقين مثلك",
    confidence: "الثقة",
    chips: ["ملف الجسم", "المقاسات التي ترتديها", "متسوّقون مشابهون"],
    featuresTitle: "الميزات الأساسية",
    values: [
      {
        t: "ملف يتعرّف عليك",
        p: "أخبرنا قليلًا عن جسمك والمقاسات التي ترتديها بالفعل. يبني Aptelle ملف قياس يزداد دقة مع الوقت",
      },
      {
        t: "رسم بياني للمقاسات عبر العلامات",
        p: "كل علامة تجارية تختلف في المقاس. يرسم Aptelle كيف تناسب العلامات فعليًا، ليتحوّل مقاسك في مكان إلى المقاس الصحيح في مكان آخر",
      },
      {
        t: "درجة ثقة",
        p: "تأتي كل توصية بدرجة ثقة واضحة، لتعرف متى تشتري ومتى تختار مقاسًا أكبر أو أصغر.",
      },
    ],
    answersLabel: "Aptelle بوضوح",
    answersTitle: "إجابات واضحة",
    faqs: [
      { q: "ما هو Aptelle؟", a: "Aptelle منصة لذكاء المقاسات للملابس عبر الإنترنت وما زالت قبل الإطلاق. يجري تطويرها لترشيح المقاس الأكثر احتمالًا لأن يناسبك في علامة جديدة قبل الشراء." },
      { q: "كيف سيرشّح Aptelle مقاسًا؟", a: "سيجمع Aptelle ملف جسمك والمقاسات التي ترتديها بالفعل وتفضيلاتك للملاءمة ونتائج ملاءمة حقيقية لمتسوقين مشابهين. صُممت كل توصية لتشمل درجة ثقة." },
      { q: "هل يمكنني استخدام Aptelle اليوم؟", a: "ليس بعد. Aptelle قيد التطوير. الانضمام إلى قائمة الانتظار يتيح لنا إبلاغك عند فتح الوصول المبكر. لا يضمن ذلك الوصول أو ميزة محددة." },
    ],
    visionPre: "نحن نبني ",
    visionEm: "طبقة المقاسات",
    visionPost:
      " للأزياء على الإنترنت، ليصبح الشراء عبر الإنترنت مؤكدًا كأنك تجرّب الملابس",
    rights: "جميع الحقوق محفوظة.",
    skip: "تخطَّ إلى المحتوى",
    privacy: "الخصوصية",
    terms: "الشروط",
    projectPre: "مشروع من ",
    projectPost: "",
    joinedTitle: "Aptelle | أنت على القائمة",
    joinedH1: "أنت على القائمة",
    joinedBody: "رسالة واحدة عند فتح الوصول المبكر ولا شيء آخر قبل ذلك. مقاسك الصحيح في أي علامة تجارية في الطريق",
    backHome: "العودة إلى الرئيسية",
    contactNav: "تواصل",
    contactTitle: "Aptelle | تواصل معنا",
    contactH1: "تواصل معنا",
    contactBody: "أسئلة أو ملاحظات أو صحافة. بريد واحد يقرأه المؤسس",
    contactCta: "راسلنا",
    cookieText: "نستخدم ملفات تعريف الارتباط لتشغيل هذا الموقع وتحميل نموذج الاستبيان. اقبل لتفعيل الاستبيان المضمّن.",
    cookieAccept: "قبول",
    cookieReject: "رفض",
    surveyTab: "شارك في تشكيل Aptelle",
  },
};

export function t(lang: Lang): Strings {
  return ui[lang] ?? ui.en;
}
