"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
    const router = useRouter();

    return (
        <div className="flex h-dvh items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="flex flex-col items-center text-center">
                    <ShieldAlert className="mb-2 h-12 w-12 text-destructive" />
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        You don&apos;t have permission to view this page.
                    </p>
                </CardHeader>
                <CardContent className="mt-4 flex flex-col gap-4">
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>
                    <Button onClick={() => router.push("/login")}>Login with another account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
