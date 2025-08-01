
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categories, getProductById, getSellerById, getBuyerById, addQuoteRequest } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Product, Seller } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  hairType: z.string().min(1, "Please select a hair type."),
  length: z.string().min(1, "Please specify a length."),
  color: z.string().min(1, "Please specify a color."),
  texture: z.string().min(1, "Please select a texture."),
  quantity: z.string().min(1, "Please enter a quantity."),
  details: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const defaultValues: Partial<QuoteFormValues> = {
  name: "",
  email: "",
  hairType: "",
  length: "",
  color: "",
  texture: "",
  quantity: "",
  details: "",
};

export function QuoteForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const productId = searchParams.get("productId");

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // User is logged in, let's fetch their data to pre-fill the form
        // A user could be a seller or a buyer. Let's try to get their name.
        const userProfile = await getSellerById(currentUser.uid) || await getBuyerById(currentUser.uid);
        if (userProfile) {
          form.setValue('name', userProfile.name);
        }
        if (currentUser.email) {
            form.setValue('email', currentUser.email);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [form]);


  useEffect(() => {
    async function fetchProduct() {
      if (productId) {
        setIsLoadingProduct(true);
        const foundProduct = await getProductById(productId);
        if (foundProduct) {
          setProduct(foundProduct);
          
          const currentName = form.getValues('name');
          const currentEmail = form.getValues('email');

          form.reset({
            name: currentName || "",
            email: currentEmail || "",
            hairType: foundProduct.category,
            length: foundProduct.specs.length.replace(' inches', ''),
            color: foundProduct.specs.color,
            texture: foundProduct.specs.texture.toLowerCase().replace(/ /g, '-'),
            quantity: "",
            details: "",
          });
        }
        setIsLoadingProduct(false);
      } else {
        setIsLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [productId, form]);

  async function onSubmit(data: QuoteFormValues) {
    setIsSubmitting(true);
    let toastDescription = "";
    
    // Ensure we have the buyer's ID if they are logged in.
    if (!user && !data.email) {
       toast({ title: "Email required", description: "Please enter your email to submit a quote.", variant: "destructive" });
       setIsSubmitting(false);
       return;
    }
    const buyerId = user ? user.uid : 'anonymous';

    try {
      if (product) {
        const seller = await getSellerById(product.sellerId);
        toastDescription = `Your request for "${product.name}" has been sent to ${seller?.companyName || 'the vendor'}. They will contact you shortly.`;
        
        await addQuoteRequest({
          buyerId: buyerId,
          buyerName: data.name,
          buyerEmail: data.email,
          productId: product.id,
          productName: product.name,
          sellerId: product.sellerId,
          quantity: data.quantity,
          details: data.details,
        });

      } else {
        toastDescription = "Your general inquiry has been sent to our team. A vendor will contact you shortly.";
        await addQuoteRequest({
          buyerId: buyerId,
          buyerName: data.name,
          buyerEmail: data.email,
          productId: 'N/A', 
          sellerId: 'N/A', // This could be routed to an admin or a general pool
          productName: `General Inquiry: ${data.hairType}`,
          quantity: data.quantity,
          details: `Category: ${data.hairType}\nLength: ${data.length} inches\nColor: ${data.color}\nTexture: ${data.texture}\n\nAdditional Details: ${data.details || 'None'}`,
        });
      }

      toast({
        title: "Quote Request Sent!",
        description: toastDescription,
      });
      // Don't reset name/email if user is logged in
      form.reset({
        ...defaultValues,
        name: user ? form.getValues('name') : "",
        email: user ? form.getValues('email') : "",
      });
    } catch (error) {
       console.error("Failed to submit quote request:", error);
       toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
       });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div>
        {isLoadingProduct ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : product && (
            <p className="text-center text-muted-foreground mb-4 -mt-2">
                Submitting a quote for: <span className="font-semibold text-primary">{product.name}</span>
            </p>
        )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
              control={form.control}
              name="hairType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Type / Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!product}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Length (inches)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 18" {...field} disabled={!!product}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Natural Black or #613" {...field} disabled={!!product}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="texture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texture</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!product}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a texture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="wavy">Wavy</SelectItem>
                      <SelectItem value="curly">Curly</SelectItem>
                      <SelectItem value="kinky-curly">Kinky Curly</SelectItem>
                      <SelectItem value="body-wave">Body Wave</SelectItem>
                      <SelectItem value="deep-wave">Deep Wave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., 3 bundles or 1 wig" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your needs, e.g., 'double drawn', 'HD lace', etc."
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
