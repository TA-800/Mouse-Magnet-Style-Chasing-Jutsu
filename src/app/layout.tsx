"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { MouseContext, MouseProvider } from "./context/MouseContext";
import MouseFollower, { MagneticButton } from "./utils/Magnetic/MagneticUtils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const context = useContext(MouseContext);

    const router = useRouter();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Magnet Style: Chasing Jutsu" />
                <title>Magnet</title>
            </head>
            <MouseProvider value={context}>
                <body className={inter.className + " bg-gray-900 text-white mx-6"}>
                    <Navbar>
                        <MouseFollower speed={0.1} />
                        <MagneticButton
                            innerPadding={12}
                            outerPadding={48}
                            offset={25}
                            onClickFn={() => {
                                router.push("/");
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                        </MagneticButton>
                        <MagneticButton
                            innerPadding={12}
                            outerPadding={48}
                            offset={25}
                            onClickFn={() => {
                                router.push("/about");
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        </MagneticButton>
                        <MagneticButton
                            innerPadding={12}
                            outerPadding={48}
                            offset={25}
                            onClickFn={() => {
                                router.push("/contact");
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            </svg>
                        </MagneticButton>
                    </Navbar>
                    <main>{children}</main>
                </body>
            </MouseProvider>
        </html>
    );
}

function Navbar({ children }: { children: React.ReactNode }) {
    return (
        <header className="flex justify-center items-center">
            <h1 className="text-3xl font-bold mr-auto">Magnet</h1>
            <nav>{children}</nav>
        </header>
    );
}
