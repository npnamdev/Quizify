"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

export function NotificationsDrawerDemo() {

    return (
        <Drawer direction="right">
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent className="h-dvh  right-0 w-auto">
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
