
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

const sellerFeatures = [
  { feature: "Product Listings", starter: "5", growth: "50", scale: "Unlimited" },
  { feature: "Featured Product Slots", starter: false, growth: "3", scale: "10" },
  { feature: "Marketplace Access", starter: true, growth: true, scale: true },
  { feature: "Advanced Profile", starter: false, growth: true, scale: true },
  { feature: "View Buyer Contact Info", starter: false, growth: true, scale: true },
  { feature: "Analytics Dashboard", starter: false, growth: false, scale: true },
  { feature: "Priority Support", starter: false, growth: false, scale: true },
];

const buyerFeatures = [
  { feature: "Browse & Request Quotes", starter: true, growth: true, scale: true },
  { feature: "View Vendor Contact Info", starter: false, growth: true, scale: true },
  { feature: "Submit Open Quotes", starter: false, growth: true, scale: true },
  { feature: "Save Favorite Vendors", starter: false, growth: true, scale: true },
  { feature: "Priority Sourcing", starter: false, growth: false, scale: true },
];

const FeatureRow = ({ value }: { value: string | boolean }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground" />
    );
  }
  return <span className="font-semibold">{value}</span>;
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline text-primary">
          Our Pricing Plans
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
          Choose the perfect plan for your business. Whether you're buying or selling, we have a tier that fits your needs.
        </p>
      </header>
      
      <Tabs defaultValue="sellers" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="sellers">For Sellers</TabsTrigger>
          <TabsTrigger value="buyers">For Buyers</TabsTrigger>
        </TabsList>
        <TabsContent value="sellers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 items-stretch">
            {/* Seller - Starter Plan */}
            <Card className="flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Starter</CardTitle>
                <CardDescription>Perfect for getting started and exploring the marketplace.</CardDescription>
                <p className="text-4xl font-bold mt-4">Free</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {sellerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.starter} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Choose Plan</Button>
              </CardFooter>
            </Card>

            {/* Seller - Growth Plan */}
            <Card className="border-primary shadow-xl flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Growth</CardTitle>
                <CardDescription>Ideal for established businesses looking to expand their reach.</CardDescription>
                <p className="text-4xl font-bold mt-4">$49<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {sellerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.growth} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>

            {/* Seller - Scale Plan */}
            <Card className="flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Scale</CardTitle>
                <CardDescription>For large-scale operations that require advanced tools.</CardDescription>
                <p className="text-4xl font-bold mt-4">$199<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {sellerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.scale} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Choose Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="buyers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 items-stretch">
            {/* Buyer - Starter Plan */}
            <Card className="flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Starter</CardTitle>
                <CardDescription>Browse and source from our global network of vendors for free.</CardDescription>
                <p className="text-4xl font-bold mt-4">Free</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {buyerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.starter} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Choose Plan</Button>
              </CardFooter>
            </Card>

            {/* Buyer - Growth Plan */}
            <Card className="border-primary shadow-xl flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Growth</CardTitle>
                <CardDescription>Unlock direct contact with vendors and more sourcing tools.</CardDescription>
                <p className="text-4xl font-bold mt-4">$29<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {buyerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.growth} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>

            {/* Buyer - Scale Plan */}
            <Card className="flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Scale</CardTitle>
                <CardDescription>For serious buyers who need priority access and support.</CardDescription>
                <p className="text-4xl font-bold mt-4">$99<span className="text-lg font-medium text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {buyerFeatures.map((item) => (
                    <li key={item.feature} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <FeatureRow value={item.scale} />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Choose Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
