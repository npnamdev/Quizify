"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="flex h-dvh items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="flex flex-col items-center text-center">
                    <AlertTriangle className="mb-2 h-12 w-12 text-yellow-500" />
                    <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Sorry, the page you are looking for doesn't exist.
                    </p>
                </CardHeader>
                <CardContent className="mt-4 flex flex-col gap-4">
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>
                    <Button onClick={() => router.push("/")}>Go to Homepage</Button>
                </CardContent>
            </Card>
        </div>
    );
}
