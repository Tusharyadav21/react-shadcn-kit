"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SocialProofProps extends React.HTMLAttributes<HTMLElement> {
  logos: { name: string; src: string }[];
  title?: string;
}

const SocialProof = React.forwardRef<HTMLElement, SocialProofProps>(
  ({ logos, title = "Trusted by the world's most innovative teams", className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("py-24 sm:py-32 bg-secondary/30", className)} {...props}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-muted-foreground">
            {title}
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <span className="text-xl font-bold italic text-muted-foreground">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

SocialProof.displayName = "SocialProof";

export { SocialProof };
