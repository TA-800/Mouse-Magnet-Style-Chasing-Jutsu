"use client";

import { useContext, useState } from "react";
import { MagneticButton, forceResetMouse } from "./utils/Magnetic/MagneticUtils";
import { MouseContext } from "./context/MouseContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [hide, setHide] = useState(false);
    const mouseContext = useContext(MouseContext);

    return (
        <div className="flex flex-col gap-10">
            <BlogPost title="How to Build a Magnetic Button Component in React" author="TheWeakNinja" date="January 1, 2021">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nulla eu velit accumsan bibendum sed eu
                    sapien. Fusce commodo ipsum eu lacus consequat, ac rutrum magna tincidunt. Sed in bibendum nisl. Sed commodo,
                    sapien quis vestibulum interdum, enim sapien ultrices massa, id imperdiet ipsum metus vel lorem. Donec rhoncus
                    nisi ac risus congue commodo. Maecenas ac bibendum orci.
                </p>
                <br />
                <p>
                    Sed eu odio vitae risus fringilla viverra. Donec quis ultrices nunc. Morbi dictum convallis sem, vitae
                    hendrerit mi consectetur sit amet. Vestibulum feugiat orci ac magna lacinia, a dictum nunc gravida.
                    Suspendisse potenti. Nam id sem euismod, volutpat risus at, bibendum quam. Nunc nec aliquam neque. Vivamus
                    dictum dui vel sem porttitor, in auctor lacus malesuada. Maecenas vel sapien ultrices, consequat justo sed,
                    placerat mauris.
                </p>
            </BlogPost>

            <BlogPost title="Works even on dynamic buttons" author="TheWeakNinja" date="January 1, 2021">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nulla eu velit accumsan bibendum sed eu
                    sapien. Fusce commodo ipsum eu lacus consequat, ac rutrum magna tincidunt. Sed in bibendum nisl. Sed commodo,
                    sapien quis vestibulum interdum, enim sapien ultrices massa, id imperdiet ipsum metus vel lorem. Donec
                    rhoncus. Infinity War isn&apos;t a movie, it&apos;s a documentary. Why else would Thanos look so real?
                </p>
                <br />
                <div className="flex flex-row items-center gap-4">
                    Reset:
                    <MagneticButton
                        id="reset"
                        offset={36 * 4}
                        innerPadding={12}
                        outerPadding={36 * 4}
                        onClickFn={() => {
                            setHide(false);
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
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                    </MagneticButton>
                </div>
                <AnimatePresence>
                    {!hide && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-8 bg-black/25 p-2 rounded-lg flex flex-row gap-2 items-center justify-center">
                            <span className="opacity-50 text-sm">CLICK TO HIDE</span>

                            <MagneticButton
                                id="hide"
                                offset={6}
                                innerPadding={6}
                                outerPadding={12}
                                onClickFn={(e) => {
                                    forceResetMouse(mouseContext, e);
                                    setHide(true);
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
                                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            </MagneticButton>
                        </motion.div>
                    )}
                </AnimatePresence>

                <br />
                <p>
                    Sed eu odio vitae risus fringilla viverra. Donec quis ultrices nunc. Morbi dictum convallis sem, vitae
                    hendrerit mi consectetur sit amet. Vestibulum feugiat orci ac magna lacinia, a dictum nunc gravida.
                    Suspendisse potenti. Nam id sem euismod, volutpat risus at, bibendum quam. Nunc nec aliquam neque. Vivamus
                    dictum dui vel sem porttitor, in auctor lacus malesuada. Maecenas vel sapien ultrices, consequat justo sed,
                    placerat mauris. It does not break (yet) when you use it with Framer Motion&apos;s AnimatePresence.
                </p>
            </BlogPost>
        </div>
    );
}

export function BlogPost({
    title,
    author,
    date,
    children,
}: {
    title: string;
    author: string;
    date: string;
    children: React.ReactNode;
}) {
    const [show, setShow] = useState(true);

    return (
        <article className="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg shadow-lg">
            {/* Title + close button */}
            <div className="flex flex-row justify-center items-center">
                <div className="flex flex-col gap-1 mr-auto">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="opacity-50 text-sm mb-2">
                        By {author} on {date}
                    </p>
                </div>
                <MagneticButton
                    id="close"
                    offset={6}
                    innerPadding={6}
                    outerPadding={12}
                    onClickFn={(e) => {
                        setShow(!show);
                    }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </MagneticButton>
            </div>

            {show && <div>{children}</div>}
        </article>
    );
}
