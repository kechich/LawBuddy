import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is Law Buddy a substitute for legal advice?",
    a: "No. Law Buddy provides AI-generated plain-language summaries of publicly available laws and regulations. It is an educational and informational tool — not a law firm. For binding legal advice, always consult a qualified attorney.",
  },
  {
    q: "Where does Law Buddy get its information?",
    a: "We source directly from official government gazettes, parliamentary databases, and publicly published legal texts. Our AI processes these primary sources to generate easy-to-understand summaries.",
  },
  {
    q: "How accurate are the summaries?",
    a: "Our AI models are trained to faithfully represent the intent of legal texts, and every summary links back to the original source. However, nuances can be lost in simplification — we always recommend checking the original text for critical decisions.",
  },
  {
    q: "Is it legal to use Law Buddy?",
    a: "Absolutely. Accessing and reading publicly available laws is a fundamental right. Law Buddy simply makes that process easier and more accessible for everyone.",
  },
  {
    q: "What's the difference between the free and business plans?",
    a: "The free plan is designed for individual citizens who want to stay informed about laws that affect their daily lives. The business plan adds compliance monitoring, industry-specific tracking, team accounts, and priority digests tailored for organisations.",
  },
  {
    q: "How does the personalization work?",
    a: "During onboarding you tell us about your situation — your role, city, concerns, and interests. Law Buddy uses this context to filter and prioritise the laws most relevant to you, so you're never overwhelmed by irrelevant information.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your profile data is stored securely and is only used to personalise your experience. We never sell your data to third parties. All communication is encrypted in transit and at rest.",
  },
  {
    q: "Can I use Law Buddy for my business compliance needs?",
    a: "Yes — our Business plan is built exactly for that. It includes regulatory change monitoring, industry-specific filters, team workspaces, and structured digests to keep your compliance team ahead of new regulations.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-20 md:py-28 bg-muted/30">
    <div className="mx-auto max-w-3xl px-5">
      <h2 className="font-serif text-3xl font-bold tracking-tight text-center md:text-4xl mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
        Everything you need to know about Law Buddy — from credibility and legality to how it works for you.
      </p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-medium text-base">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
