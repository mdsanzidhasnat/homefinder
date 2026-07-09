import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BD Home Finder - Find Your Perfect Home in Bangladesh",
  description:
    "Search thousands of properties for sale and rent across all divisions of Bangladesh. Your trusted real estate platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
