import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Package, Receipt, Printer, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "₹499",
      description: "Perfect for single stores just starting out.",
      features: [
        "Single store",
        "1 cashier",
        "Up to 500 products",
        "GST invoicing",
        "Email support",
      ],
      cta: "Choose Starter",
      popular: false,
    },
    {
      name: "Professional",
      price: "₹1,299",
      description: "Optimized for growing businesses with multiple needs.",
      features: [
        "Up to 3 stores",
        "Unlimited products",
        "GST + e-invoicing",
        "Multi-location inventory",
        "Priority support",
        "WhatsApp bill sharing",
      ],
      cta: "Choose Professional",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹3,499",
      description: "Advanced tools for large retail chains.",
      features: [
        "Unlimited stores",
        "Multi-outlet dashboard",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      cta: "Choose Enterprise",
      popular: false,
    }
  ];

  const features = [
    {
      title: "Inventory Management",
      description: "Real-time stock tracking with low-stock alerts and SKU management.",
      icon: <Package className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "GST Invoices",
      description: "Create GST-compliant tax invoices with CGST/SGST/IGST breakdown.",
      icon: <Receipt className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Direct Printing",
      description: "Print beautiful, professional bills directly to any standard or thermal printer.",
      icon: <Printer className="h-6 w-6 text-blue-600" />,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Receipt className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">QuickBill</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Trusted by 5,000+ Indian businesses</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Smart Billing for Indian Businesses
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage inventory, create GST-compliant invoices, and grow your retail business with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup?plan=Professional">Start 14-Day Free Trial</Link>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">No credit card required</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-3 bg-blue-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing for Every Business</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl">Choose the plan that fits your growth.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {tiers.map((tier) => (
                <Card key={tier.name} className={cn("flex flex-col h-full relative", tier.popular && "border-blue-600 shadow-lg scale-105 z-10")}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-3 text-sm">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className={cn("w-full", tier.popular ? "bg-blue-600 hover:bg-blue-700" : "variant-outline")}>
                      <Link href={`/signup?plan=${tier.name}`}>{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-xs text-gray-500">© 2024 QuickBill POS. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
