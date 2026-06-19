import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";

// Set with: firebase functions:secrets:set RESEND_API_KEY
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

// Acknowledgement copy per language, falling back to English.
const COPY = {
  en: {
    subject: "You are on the Aptelle waitlist",
    heading: "Thanks for joining.",
    body: "You are on the Aptelle waitlist. We are building a way to find your right size in any brand before you buy. We will email you the moment early access opens.",
    signoff: "See you soon, the Aptelle team",
  },
  fr: {
    subject: "Vous êtes sur la liste d'attente Aptelle",
    heading: "Merci de votre inscription.",
    body: "Vous êtes sur la liste d'attente d'Aptelle. Nous construisons un moyen de trouver votre bonne taille dans chaque marque avant d'acheter. Nous vous écrirons dès l'ouverture de l'accès anticipé.",
    signoff: "À bientôt, l'équipe Aptelle",
  },
  de: {
    subject: "Du bist auf der Aptelle-Warteliste",
    heading: "Danke für deine Anmeldung.",
    body: "Du bist auf der Aptelle-Warteliste. Wir bauen einen Weg, in jeder Marke deine richtige Größe zu finden, bevor du kaufst. Wir melden uns, sobald der frühe Zugang startet.",
    signoff: "Bis bald, dein Aptelle-Team",
  },
  ar: {
    subject: "أنت على قائمة انتظار Aptelle",
    heading: "شكرًا لانضمامك.",
    body: "أنت الآن على قائمة انتظار Aptelle. نحن نبني طريقة لمعرفة مقاسك الصحيح في أي علامة تجارية قبل الشراء. سنراسلك فور فتح الوصول المبكر.",
    signoff: "نراك قريبًا، فريق Aptelle",
  },
};

export const sendWaitlistAck = onDocumentCreated(
  { document: "waitlist/{id}", region: "us-central1", secrets: [RESEND_API_KEY] },
  async (event) => {
    const data = event.data?.data();
    const email = data?.email;
    if (!email) return;

    const lang = COPY[data?.lang] ? data.lang : "en";
    const c = COPY[lang];
    const rtl = lang === "ar";

    const resend = new Resend(RESEND_API_KEY.value());
    await resend.emails.send({
      from: "Aptelle <hello@aptelle.com>",
      to: email,
      subject: c.subject,
      text: `${c.heading}\n\n${c.body}\n\n${c.signoff}\nhttps://aptelle.com`,
      html: `<div dir="${rtl ? "rtl" : "ltr"}" style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#17130E">
        <p style="font-size:20px;font-weight:600;margin:0 0 12px">${c.heading}</p>
        <p style="font-size:15px;line-height:1.6;color:#4a463f;margin:0 0 18px">${c.body}</p>
        <p style="font-size:14px;color:#6E665B;margin:0">${c.signoff}<br><a href="https://aptelle.com" style="color:#C0492B">aptelle.com</a></p>
      </div>`,
    });
  }
);
