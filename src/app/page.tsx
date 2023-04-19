"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

// reference: https://frontendmasters.com/courses/css-animations/lerp-technique/
export default function Home() {
    const targetMousePosition = { x: 0, y: 0 };
    const isHovering = useRef(false);
    const mouseRef = useRef<HTMLDivElement>(null);

    return (
        <main className="flex flex-row gap-10 justify-center items-center mt-20">
            <MouseFollower isHovering={isHovering} targetMousePosition={targetMousePosition} mouseRef={mouseRef} />
            <MagneticButton isHovering={isHovering} targetMousePosition={targetMousePosition} mouseRef={mouseRef} />
        </main>
    );
}

const MouseFollower = forwardRef(
    ({
        isHovering,
        targetMousePosition,
        mouseRef,
    }: {
        isHovering: React.MutableRefObject<boolean>;
        targetMousePosition: { x: number; y: number };
        mouseRef: React.MutableRefObject<HTMLDivElement | null>;
    }) => {
        const MOUSE_SPEED = 0.1; // how fast the circle follows the mouse
        const currentMousePosition = { x: targetMousePosition.x, y: targetMousePosition.y }; // {x: 0, y: 0};
        const [isHoveringState, setIsHoveringState] = useState(isHovering.current);
        // if animationID is null, then the animation loop is not running
        let mouseAnimationID: number | null = null;

        // applying new targetMousePosition to currentMousePosition
        const mouseLerp = useCallback(() => {
            const dx = targetMousePosition.x - currentMousePosition.x;
            const dy = targetMousePosition.y - currentMousePosition.y;

            // If animation is running and distance is less than 0.01, stop the animation
            if (mouseAnimationID && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
                cancelAnimationFrame(mouseAnimationID);
                mouseAnimationID = null;
                return;
            }

            currentMousePosition.x += dx * MOUSE_SPEED;
            currentMousePosition.y += dy * MOUSE_SPEED;

            // set translateX and translateY CSS variables to the normalized values
            if (mouseRef.current) {
                mouseRef.current.style.setProperty("--mouseX", currentMousePosition.x + "px");
                mouseRef.current.style.setProperty("--mouseY", currentMousePosition.y + "px");
            }

            // keep the animation loop running
            mouseAnimationID = requestAnimationFrame(mouseLerp);
        }, []);

        // updating targetMousePosition and then calling mouseLerp
        const handleMouseMove = useCallback((e: MouseEvent) => {
            // get the x and y coordinates of the mouse
            const x = e.clientX;
            const y = e.clientY;

            // get height / 2 and width / 2 of the mouse follower circle
            const middleX = mouseRef.current!.offsetWidth / 2 || 0;
            const middleY = mouseRef.current!.offsetHeight / 2 || 0;

            // get target position (no need to normalize)
            if (!isHovering.current) {
                // only update targetMousePosition if the mouse is not hovering over a magnetic button
                targetMousePosition.x = x - middleX;
                targetMousePosition.y = y - middleY;
                setIsHoveringState(false); // React will not re-render if the state is the same
            } else {
                setIsHoveringState(true);
            }

            // start animation loop if it is not running
            if (!mouseAnimationID) requestAnimationFrame(mouseLerp);
        }, []);

        useEffect(() => {
            document.addEventListener("mousemove", handleMouseMove);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
            };
        }, []);

        return (
            <div
                id="mouse-follower"
                ref={mouseRef}
                className={`absolute -z-50 h-3 w-3 rounded-full bg-white top-0 left-0 translate-x-[var(--mouseX)] translate-y-[var(--mouseY)]
                        ${isHoveringState ? `scale-[5]` : "scale-[1]"}
            `}
                style={{
                    transition: "scale 1s ease-in-out",
                }}
            />
        );
    }
);

function MagneticButton({
    isHovering,
    targetMousePosition,
    mouseRef,
}: {
    isHovering: React.MutableRefObject<boolean>;
    targetMousePosition: { x: number; y: number };
    mouseRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
    const ICON_OFFSET = 20; // how much the icon moves when the mouse is hovering over it
    const ICON_SCALE = "1.15"; // how much the icon scales when the mouse is hovering over it
    const ICON_SPEED = 0.1; // how fast the icon moves
    const currentPoint = { x: 0, y: 0 };
    const targetPoint = { x: 0, y: 0 };
    // if animationID is null, then the animation loop is not running
    let animationID: number | null = null;
    const childRef = useRef<HTMLDivElement>(null);

    // useCallback to prevent unnecessary redefinition of lerp function (prevents glitchy animation on state change)
    // applying new targetPoint to currentPoint
    const lerp = useCallback(() => {
        const dx = targetPoint.x - currentPoint.x;
        const dy = targetPoint.y - currentPoint.y;

        // If animation is running and distance is less than 0.05, stop the animation
        if (animationID && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            cancelAnimationFrame(animationID);
            animationID = null;
            return;
        }

        currentPoint.x += dx * ICON_SPEED;
        currentPoint.y += dy * ICON_SPEED;

        // set translateX and translateY CSS variables to the normalized values
        if (childRef.current) {
            childRef.current.style.setProperty("transform", `translate(${currentPoint.x}px, ${currentPoint.y}px)`);
        }

        // keep the animation loop running
        animationID = requestAnimationFrame(lerp);
    }, []);

    // updating targetPoint and then calling lerp
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            // get the x and y coordinates of the mouse
            const x = e.clientX;
            const y = e.clientY;

            // get middle of element where the mouse is hovering
            const middleX = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2;
            const middleY = e.currentTarget.offsetTop + e.currentTarget.offsetHeight / 2;

            // get the distance between the mouse and the middle of the element
            const distanceX = x - middleX;
            const distanceY = y - middleY;

            // get largest and smallest possible distance
            const maxDistanceX = e.currentTarget.offsetWidth / 2;
            const maxDistanceY = e.currentTarget.offsetHeight / 2;

            // normalize between -1 and 1 using the following formula: [2 * (distance - min) / (max - min)] - 1
            const normalizedX = (2 * (distanceX - -maxDistanceX)) / (maxDistanceX - -maxDistanceX) - 1;
            const normalizedY = (2 * (distanceY - -maxDistanceY)) / (maxDistanceY - -maxDistanceY) - 1;

            // set targetPoint to the normalized values
            targetPoint.x = normalizedX * ICON_OFFSET; // multiply by ICON_OFFSET to make movement significant
            targetPoint.y = normalizedY * ICON_OFFSET;

            // scale up the child element for hover effect
            if (childRef.current) childRef.current.style.scale = ICON_SCALE;

            // set targetMousePosition to follow the element
            targetMousePosition.x = targetPoint.x + middleX - (mouseRef.current!.offsetWidth / 2 || 0);
            targetMousePosition.y = targetPoint.y + middleY - (mouseRef.current!.offsetHeight / 2 || 0);

            // start animation loop if it is not running
            if (!animationID) requestAnimationFrame(lerp);
        },
        [lerp]
    );

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // set targetPoint to 0 when mouse leaves the element
        targetPoint.x = 0;
        targetPoint.y = 0;

        // scale down the child element
        if (childRef.current) {
            childRef.current.style.scale = "1";
            childRef.current.style.background = "rgba(0, 0, 0, 0)";
        }

        isHovering.current = false;
    }, []);

    /*
        Start animation loop (similar to Unity's Update() function).
        Called every frame to update the position of the icon, non-blocking.
    */
    lerp();

    return (
        <button
            className="p-12 border-0 border-red-500/50 rounded-full"
            // make the icon move with the mouse (fancy magnet effect)
            onMouseEnter={() => {
                isHovering.current = true;
                childRef.current!.style.background = "rgba(0, 0, 0, 1)";
            }}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}>
            <div
                ref={childRef}
                className="p-3 rounded-full"
                style={{
                    // apply transition only to scale and background properties
                    transitionProperty: "scale, background",
                    transitionDuration: "0.25s",
                    transitionTimingFunction: "ease-out",
                }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
        </button>
    );
}
