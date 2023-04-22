"use client";

import { useCallback, useEffect, useRef, useContext, useState, forwardRef, useImperativeHandle } from "react";
import { MouseContext, MouseContextType, MouseProvider } from "./context/MouseContext";

// Create type for ref that will be used to pull out mouseLerp function
interface MouseFollowerRefType {
    mouseLerp: (e: MouseEvent) => void;
}

// reference: https://frontendmasters.com/courses/css-animations/lerp-technique/
export default function Home() {
    // Get context in parent component to share consistent values between components (even dynamically rendered ones)
    const context = useContext(MouseContext);
    const mouseRefMethod = useRef<MouseFollowerRefType>(null);
    const [render, setRender] = useState(false);

    return (
        <MouseProvider value={context}>
            <main className="flex flex-col gap-10 justify-center items-center mt-20">
                <MouseFollower speed={0.1} ref={mouseRefMethod} />
                <MagneticButton
                    offset={20}
                    scale="1.2"
                    speed={0.1}
                    onClick={() => {
                        setRender(!render);
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
                </MagneticButton>
                {render && (
                    <MagneticButton
                        onClick={(e) => {
                            forceResetMouse(context, mouseRefMethod, { x: e.clientX, y: e.clientY });
                            setRender(!render);
                        }}>
                        RECTANGLE
                    </MagneticButton>
                )}
            </main>
        </MouseProvider>
    );
}

const MouseFollower = forwardRef((props: { speed: number }, ref: React.Ref<MouseFollowerRefType>) => {
    const { speed } = props;
    const { isHovering, targetMousePosition, mouseRef } = useContext(MouseContext); // consume context from provider that's wrapping the parent component
    const currentMousePosition = { x: targetMousePosition.x, y: targetMousePosition.y };
    let mouseAnimationID: number | null = null; // if animationID is null, then the animation loop is not running

    // return mouseLerp through useImperativeHandle so that it can be called from other components
    useImperativeHandle(ref, () => ({
        mouseLerp,
    }));

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

        currentMousePosition.x += dx * speed;
        currentMousePosition.y += dy * speed;

        // set CMP to 0 if NaN (bug that happens when mouse moving before page loads)
        currentMousePosition.x = isNaN(currentMousePosition.x) ? 0 : currentMousePosition.x;
        currentMousePosition.y = isNaN(currentMousePosition.y) ? 0 : currentMousePosition.y;

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
        const middleX = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--mouseWidth")) / 2;
        const middleY = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--mouseHeight")) / 2;
        // get width and height from CSS variables because transition affects offsetWidth and offsetHeight (CSS variables will instantly update values between transitions)

        // get target position (no need to normalize)
        if (!isHovering.current) {
            // only update targetMousePosition if the mouse is not hovering over a magnetic button
            targetMousePosition.x = x - middleX;
            targetMousePosition.y = y - middleY;
        } // else the targetMousePosition will be updated by the magnetic button

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
            ref={mouseRef}
            className={`absolute -z-50 h-[var(--mouseHeight)] w-[var(--mouseWidth)] rounded-full bg-white top-0 left-0 translate-x-[var(--mouseX)] translate-y-[var(--mouseY)]
                        `}
            style={{
                // add transition to only height and width
                transition: "height 0.25s, width 0.25s",
            }}
        />
    );
});
/*
    Call this function to force the mouse follower to reset to ordinary mouse-following behavior.
    TODO: mouseLerp needs to be called when the mouse position is reset.
*/
function forceResetMouse(
    context: MouseContextType,
    mouseRefMethod: React.Ref<MouseFollowerRefType>,
    newPosition?: { x: number; y: number }
) {
    // reset mouse follower to normal size
    context.mouseRef.current!.style.setProperty("--mouseHeight", "12px");
    context.mouseRef.current!.style.setProperty("--mouseWidth", "12px");

    // if newPosition is defined, then set the targetMousePosition to the new position
    if (newPosition) {
        context.targetMousePosition.x = newPosition.x;
        context.targetMousePosition.y = newPosition.y;
    }

    // set isHovering to false
    context.isHovering.current = false;

    // @ts-ignore
    mouseRefMethod!.current.mouseLerp();
    // call mouseLerp to reset the mouse position
}

export function MagneticButton({
    offset = 10,
    scale = "1.15",
    mouse_scale = 1.1,
    speed = 0.1,
    onClick,
    children,
}: {
    offset?: number;
    scale?: string;
    mouse_scale?: number;
    speed?: number;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children: React.ReactNode;
}) {
    const { isHovering, targetMousePosition, mouseRef } = useContext(MouseContext); // consume context from provider that's wrapping the parent component
    const currentPoint = { x: 0, y: 0 };
    const targetPoint = { x: 0, y: 0 };
    let animationID: number | null = null; // if animationID is null, then the animation loop is not running
    const childRef = useRef<HTMLDivElement>(null);

    // useCallback to prevent unnecessary redefinition of lerp function (prevents glitchy animation on state change)
    // applying new targetPoint to currentPoint
    const lerp = useCallback(() => {
        // console.log("%cRunning button lerp", "color: green; font-weight: bold;");

        const dx = targetPoint.x - currentPoint.x;
        const dy = targetPoint.y - currentPoint.y;

        // If animation is running and distance is less than 0.05, stop the animation
        if (animationID && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            cancelAnimationFrame(animationID);
            animationID = null;
            return;
        }

        currentPoint.x += dx * speed;
        currentPoint.y += dy * speed;

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
            targetPoint.x = normalizedX * offset; // multiply by offset to make movement significant
            targetPoint.y = normalizedY * offset;

            // scale up the child element for hover effect
            if (childRef.current) childRef.current.style.scale = scale;

            // get width and height of mouse follower from the CSS variables --mouseHeight and --mouseWidth (they're in pixels)
            const newMouseHeight = parseFloat(getComputedStyle(mouseRef.current!).getPropertyValue("--mouseHeight"));
            const newMouseWidth = parseFloat(getComputedStyle(mouseRef.current!).getPropertyValue("--mouseWidth"));
            // get from CSS variables instead of offsetWidth and height because transition affects them

            // set targetMousePosition to follow the element
            targetMousePosition.x = targetPoint.x + middleX - newMouseWidth / 2;
            targetMousePosition.y = targetPoint.y + middleY - newMouseHeight / 2;

            // start animation loop if it is not running
            // similar to Unity's Update() function
            if (!animationID) requestAnimationFrame(lerp);
        },
        [lerp]
    );

    const handleMouseLeave = useCallback(() => {
        // set targetPoint to 0 when mouse leaves the element
        targetPoint.x = 0;
        targetPoint.y = 0;

        // scale down the child element
        if (childRef.current) {
            childRef.current.style.scale = "1";
            childRef.current.style.background = "rgba(0, 0, 0, 0)";
        }

        // reset height and width of mouse follower to 0.75rem
        mouseRef.current!.style.setProperty("--mouseHeight", "12px");
        mouseRef.current!.style.setProperty("--mouseWidth", "12px");

        isHovering.current = false;
    }, []);

    return (
        <button
            className="p-12 border-2 border-red-500/50 rounded-full"
            // make the icon move with the mouse (fancy magnet effect)
            onMouseEnter={() => {
                isHovering.current = true;
                childRef.current!.style.background = "rgba(0, 0, 0, 1)";
                // change height and width of mouse follower to match the icon
                mouseRef.current!.style.setProperty(
                    "--mouseHeight",
                    `${childRef.current!.offsetHeight * parseFloat(scale) * mouse_scale}px`
                );
                mouseRef.current!.style.setProperty(
                    "--mouseWidth",
                    `${childRef.current!.offsetWidth * parseFloat(scale) * mouse_scale}px`
                );
            }}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => onClick(e)}>
            <div
                ref={childRef}
                className="p-3 rounded-full"
                style={{
                    // apply transition only to scale and background properties
                    transitionProperty: "scale, background",
                    transitionDuration: "0.25s",
                    transitionTimingFunction: "ease-out",
                }}>
                {children}
            </div>
        </button>
    );
}
