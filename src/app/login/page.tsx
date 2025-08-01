
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LoginClientPage } from "./login-client-page";

function LoginPageFallback() {
    return (
        <div className="flex justify-center items-center py-4 h-[280px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] bg-secondary/20">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Login</CardTitle>
            <CardDescription>
                Access your HairBuySell dashboard.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<LoginPageFallback />}>
                <LoginClientPage />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
