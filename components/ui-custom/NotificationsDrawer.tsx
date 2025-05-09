"use client"

import * as React from "react"
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"

const notifications = [
    { id: 1, title: "New Message", description: "You have received a new message from John.", time: "2 minutes ago" },
    { id: 2, title: "System Alert", description: "System maintenance scheduled at 11:00 PM.", time: "1 hour ago" },
    { id: 3, title: "New Comment", description: "Anna commented on your post.", time: "3 hours ago" },
]

export function NotificationsDrawer() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-9 h-9" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Notifications</DrawerTitle>
                        <DrawerDescription>{notifications.length} new notifications</DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-4 p-4">
                        {notifications.map((note) => (
                            <div key={note.id} className="rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow">
                                <div className="font-medium text-lg text-gray-900 p-3">{note.title}</div>
                                <div className="text-sm text-gray-700 p-3">{note.description}</div>
                                <div className="text-xs text-gray-500 p-3">{note.time}</div>
                            </div>
                        ))}
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
