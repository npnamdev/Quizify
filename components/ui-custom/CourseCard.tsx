import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface CourseCardProps {
    image: string;
    title: string;
    description: string;
    price: string;
}

export function CourseCard({ image, title, description, price }: CourseCardProps) {
    return (
        <Card className="flex flex-col sm:flex-row overflow-hidden">
            <div className="sm:w-40 w-full h-40 sm:h-auto flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col justify-between p-4 space-y-2 flex-1">
                <CardHeader className="p-0">
                    <h3 className="text-lg font-semibold">{title}</h3>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                    <div className="mt-4 font-bold text-primary text-base">{price}</div>
                </CardContent>
            </div>
        </Card>
    );
}
