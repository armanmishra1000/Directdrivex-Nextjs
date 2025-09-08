import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    name: "Team Members",
    pro: true,
    enterprise: true,
  },
  {
    name: "Product Integrations",
    pro: true,
    enterprise: true,
  },
  {
    name: "Analytics Dashboard",
    pro: true,
    enterprise: true,
  },
  {
    name: "Task Management",
    pro: false,
    enterprise: true,
  },
  {
    name: "Custom Branding",
    pro: false,
    enterprise: true,
  },
  {
    name: "API Access",
    pro: false,
    enterprise: true,
  },
];

export default function ComparisonSection() {
  return (
    <section className="container mx-auto my-12">
      <div className="grid grid-cols-3 gap-6">
        {/* Feature list */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Feature Comparison</h2>
          <p className="text-lg text-muted-foreground">
            Discover which plan is the perfect fit for your needs.
          </p>
          {/* Rows */}
          <div className="space-y-3 text-base text-foreground">
            {features.map(f => <div key={f.name} className="py-4">{f.name}</div>)}
          </div>
        </div>

        {/* Pro Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For growing teams and businesses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-center">
            {features.map(f => (
              <div key={f.name} className="py-4">
                {f.pro ? <Check className="mx-auto" /> : <X className="mx-auto" />}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Pro</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Plan</CardTitle>
            <CardDescription>For large organizations with advanced needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-center">
            {features.map(f => (
              <div key={f.name} className="py-4">
                {f.enterprise ? <Check className="mx-auto" /> : <X className="mx-auto" />}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Enterprise</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}