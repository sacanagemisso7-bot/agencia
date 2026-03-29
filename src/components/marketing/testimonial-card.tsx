import type { TestimonialRecord } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: TestimonialRecord }) {
  return (
    <article className="premium-outline premium-panel flex h-full flex-col justify-between rounded-[32px] p-7">
      <p className="bg-[linear-gradient(135deg,#9AD8FF,#30E2BC)] bg-clip-text font-editorial text-[2.2rem] italic leading-none text-transparent">&ldquo;</p>
      <p className="mt-3 text-xl leading-9 text-white/82">{testimonial.quote}</p>
      <div className="mt-8 border-t border-mist-100/10 pt-5">
        <p className="font-semibold text-white">{testimonial.authorName}</p>
        <p className="mt-1 text-sm text-mist-100/52">
          {testimonial.role} | {testimonial.company}
        </p>
      </div>
    </article>
  );
}
