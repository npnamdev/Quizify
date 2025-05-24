"use client"

import { UsersRound, BookOpen, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const stats = [
  {
    title: "Người dùng",
    value: 1582,
    icon: <UsersRound className="w-5 h-5 text-blue-600" />,
    color: "bg-blue-100",
  },
  {
    title: "Khóa học",
    value: 124,
    icon: <BookOpen className="w-5 h-5 text-green-600" />,
    color: "bg-green-100",
  },
  {
    title: "Đơn hàng",
    value: 412,
    icon: <ShoppingCart className="w-5 h-5 text-yellow-600" />,
    color: "bg-yellow-100",
  },
  {
    title: "Doanh thu",
    value: 950,
    icon: <DollarSign className="w-5 h-5 text-rose-600" />,
    color: "bg-red-100",
  },
];



import { PolarGrid, RadialBar, RadialBarChart } from "recharts"
import { useState } from "react";
const chartData2 = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]
const chartConfig2 = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function Overview() {
  const [hasStarted, setHasStarted] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 py-6 flex items-center justify-between">
            <CardHeader className="p-0">
              <h4 className="text-gray-500 text-sm">{stat.title}</h4>
              <CountUp end={stat.value} duration={1}>
                {({ countUpRef, start }) => (
                  <VisibilitySensor
                    onChange={(isVisible: boolean) => {
                      if (isVisible && !hasStarted) {
                        start();
                        setHasStarted(true);
                      }
                    }}
                    delayedCall
                    partialVisibility
                  >
                    <span className="text-[18px] font-bold mt-2" ref={countUpRef} />
                  </VisibilitySensor>
                )}
              </CountUp>
            </CardHeader>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Active</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="browser"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="visitors"
                  strokeWidth={2}
                  radius={8}
                  activeIndex={2}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke={props.payload.fill}
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    )
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Radial Chart - Grid</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig2}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart data={chartData2} innerRadius={30} outerRadius={100}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="browser" />}
                />
                <PolarGrid gridType="circle" />
                <RadialBar dataKey="visitors" />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
