const Footer = () => (
  <footer className="border-t border-border bg-background py-10">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 sm:flex-row sm:justify-between">
      <span className="font-serif text-sm font-bold text-foreground">Law&nbsp;Buddy</span>
      <div className="flex gap-6">
        {["Product", "How it works", "Newsletter", "FAQ"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase().replace(/ /g, "-")}`}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {l}
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Law Buddy. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
