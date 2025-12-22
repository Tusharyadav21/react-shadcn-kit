"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface Feature {
  name: string;
  description: string;
  icon?: React.ElementType;
}

interface ValuePropsProps extends React.HTMLAttributes<HTMLElement> {
  features: Feature[];
  title: string;
  subtitle?: string;
  badge?: string;
}

const ValueProps = React.forwardRef<HTMLElement, ValuePropsProps>(
  ({ features, title, subtitle, badge, className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("py-24 sm:py-32", className)} {...props}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            {badge && <h2 className="text-base font-semibold leading-7 text-primary">{badge}</h2>}
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </p>
            {subtitle && <p className="mt-6 text-lg leading-8 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    {feature.icon ? (
                      <feature.icon className="size-5 flex-none text-primary" aria-hidden="true" />
                    ) : (
                      <CheckIcon className="size-5 flex-none text-primary" aria-hidden="true" />
                    )}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    );
  },
);

ValueProps.displayName = "ValueProps";

export { ValueProps };
