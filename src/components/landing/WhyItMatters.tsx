import { motion } from "framer-motion";

const WhyItMatters = () => (
  <section className="py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-5">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Your rights. Your rules.
            <br />
            Finally in your language.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hundreds of laws pass every year. Most people never see them coming.
            We think that should change.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Clarity for citizens. Confidence for businesses.
            One platform that turns complexity into action.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhyItMatters;
