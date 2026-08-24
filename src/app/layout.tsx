import type { Metadata } from "next";
import { Inter, } from "next/font/google";
import { Toaster } from 'sonner';
import "@/styles/globals.css";
import { Header } from "@/components/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ['400', '500', '700']
});

const interTight = Inter({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ['700']
});

export const metadata: Metadata = {
  title: "Mundo PET",
  description: "Aqui você pode ver todos os clientes e servições agendados para hoje!",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='4' r='2'/%3E%3Ccircle cx='18' cy='8' r='2'/%3E%3Ccircle cx='20' cy='16' r='2'/%3E%3Cpath d='M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.44 4.46 16.94A3.5 3.5 0 0 1 5.5 10Z'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${interTight.variable} antialiased`}>
        <Header />

        <div className="">
          <main className="flex-1 flex flex-col mt-12">
            {children}
            <Toaster position="top-right" />
          </main>
        </div>

      </body>
    </html >
  );
}
