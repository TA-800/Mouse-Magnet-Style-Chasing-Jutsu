"use client";

import { useContext, useState } from "react";
import { MagneticButton, forceResetMouse } from "./utils/Magnetic/MagneticUtils";
import { MouseContext } from "./context/MouseContext";

// reference: https://frontendmasters.com/courses/css-animations/lerp-technique/
export default function Home() {
    const [hide, setHide] = useState(false);
    const mC = useContext(MouseContext);
    return (
        <div className="flex flex-col gap-2">
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
                    rhoncus.
                </p>
                <br />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nulla eu velit accumsan bibendum sed eu
                    sapien. Fusce commodo ipsum eu lacus consequat, ac rutrum magna tincidunt. Sed in bibendum nisl. Sed commodo,
                    sapien quis vestibulum interdum, enim sapien ultrices massa, id imperdiet ipsum metus vel lorem. Donec
                    rhoncus.
                </p>
                <br />
                <p>
                    Sed eu odio vitae risus fringilla viverra. Donec quis ultrices nunc. Morbi dictum convallis sem, vitae
                    hendrerit mi consectetur sit amet. Vestibulum feugiat orci ac magna lacinia, a dictum nunc gravida.
                    Suspendisse potenti. Nam id sem euismod, volutpat risus at, bibendum quam. Nunc nec aliquam neque. Vivamus
                    dictum dui vel sem porttitor, in auctor lacus malesuada. Maecenas vel sapien ultrices, consequat justo sed,
                    placerat mauris.
                </p>
                {!hide && (
                    <MagneticButton
                        offset={6}
                        innerPadding={6}
                        outerPadding={12}
                        onClickFn={(e) => {
                            forceResetMouse(mC, e);
                            setHide(true);
                        }}>
                        HIDEME
                    </MagneticButton>
                )}
            </BlogPost>
        </div>
    );
}

const BlogPost = ({
    title,
    author,
    date,
    children,
}: {
    title: string;
    author: string;
    date: string;
    children: React.ReactNode;
}) => {
    const [show, setShow] = useState(true);

    return (
        <article className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <div className="flex flex-row justify-center items-center">
                <h2 className="text-2xl font-bold mr-auto">{title}</h2>
                <MagneticButton
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
            <p className="opacity-50 text-sm mb-2">
                By {author} on {date}
            </p>
            {show && <div>{children}</div>}
        </article>
    );
};
