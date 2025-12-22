"use client";

import * as React from "react";
import { CustomButton } from "../primitives/custom-button";
import { cn } from "@/lib/utils";

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  badge?: string;
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      title,
      subtitle,
      ctaText,
      ctaHref = "#",
      secondaryCtaText,
      secondaryCtaHref = "#",
      badge,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:py-32 lg:px-8",
          className,
        )}
        {...props}
      >
        {/* Abstract Background Decoration */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl">
          {badge && (
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-border/80 transition-all">
                {badge}{" "}
                <a href={ctaHref} className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text">
            {title}
          </h1>
          {subtitle && <p className="mt-6 text-lg leading-8 text-muted-foreground">{subtitle}</p>}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {ctaText && (
              <a href={ctaHref}>
                <CustomButton size="lg" effect="expandIcon">
                  {ctaText}
                </CustomButton>
              </a>
            )}
            {secondaryCtaText && (
              <a href={secondaryCtaHref}>
                <CustomButton variant="ghost" size="lg">
                  {secondaryCtaText} <span aria-hidden="true">→</span>
                </CustomButton>
              </a>
            )}
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </section>
    );
  },
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
