import { Mail } from "lucide-react";

export function ContactUs() {
  return (
    <section id="contact" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
            We&apos;d love to hear from you. For any questions or enquiries, contact us at:
          </p>
          <a
            href="mailto:agrisaathi@gmail.com"
            className="mt-6 inline-block break-all text-lg font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline sm:text-xl"
          >
            agrisaathi@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
