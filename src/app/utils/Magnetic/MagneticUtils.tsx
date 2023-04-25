import { useCallback, useEffect, useRef, useContext, useImperativeHandle, useState } from "react";
import { MouseContext, MouseContextType } from "../../context/MouseContext";

/** Type for the mouseMethodRef that will be used to extract the position-updater method for the mouse-follower */
export type MouseMethodRefType = {
    handleMouseMove: (e: MouseEvent) => void;
};

/**
 * Mouse follower component that follows the mouse around the page.
 * Reference: https://frontendmasters.com/courses/css-animations/lerp-technique/
 */
const MouseFollower = ({ speed = 0.1 }: { speed?: number }) => {
    const { targetMagnElement, targetMousePosition, mouseRef, mouseMethodRef } = useContext<MouseContextType>(MouseContext); // consume context from provider that's wrapping the parent component
    const currentMousePosition = { x: targetMousePosition.x, y: targetMousePosition.y };
    let mouseAnimationID: number | null = null; // if animationID is null, then the animation loop is not running

    // Applying new targetMousePosition to currentMousePosition
    const mouseLerp = useCallback(() => {
        // console.log("Running mouseLerp");
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

        // Set CMP to 0 if NaN (bug that happens when mouse moving before page loads)
        currentMousePosition.x = isNaN(currentMousePosition.x) ? 0 : currentMousePosition.x;
        currentMousePosition.y = isNaN(currentMousePosition.y) ? 0 : currentMousePosition.y;

        // Set translateX and translateY CSS variables to the normalized values
        if (mouseRef.current) {
            mouseRef.current.style.setProperty("--mouseX", currentMousePosition.x + "px");
            mouseRef.current.style.setProperty("--mouseY", currentMousePosition.y + "px");
        }

        // keep the animation loop running
        mouseAnimationID = requestAnimationFrame(mouseLerp);
    }, []);

    // Updating targetMousePosition and then calling mouseLerp
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // only calculate all this if the mouse is not hovering over a magnetic button
        if (targetMagnElement.current === null) {
            // Get the x and y coordinates of the mouse
            const x = e.clientX;
            const y = e.clientY;

            // Get height / 2 and width / 2 of the mouse follower circle
            const middleX = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--mouseWidth")) / 2;
            const middleY = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--mouseHeight")) / 2;
            // Get width and height from CSS variables because transition affects offsetWidth and offsetHeight (CSS variables will instantly update values between transitions)

            targetMousePosition.x = x - middleX;
            targetMousePosition.y = y - middleY;
        } // Else the targetMousePosition will be updated by the magnetic button

        // Start animation loop if it is not running
        if (!mouseAnimationID) mouseLerp();
    }, []);

    // Attach event listener to mousemove
    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Return mouseLerp through useImperativeHandle so that it can be called from other components
    useImperativeHandle(mouseMethodRef, () => ({
        handleMouseMove,
    }));

    return (
        <div
            ref={mouseRef}
            className={`fixed -z-0 pointer-events-none h-[var(--mouseHeight)] w-[var(--mouseWidth)] rounded-full bg-white border-[1px] border-black/50 top-0 left-0 translate-x-[var(--mouseX)] translate-y-[var(--mouseY)]
                        `}
            style={{
                // Add transition to only height and width
                transition: "height 0.25s, width 0.25s",
            }}
        />
    );
};

/**
 * Force the mouse follower to reset to ordinary mouse-following behavior.
 * Useful for when the mouse is hovering over a magnetic component that is about to be unmounted.
 */
export function forceResetMouse(context: MouseContextType, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // Reset mouse follower to normal size
    context.mouseRef.current!.style.setProperty("--mouseHeight", "12px");
    context.mouseRef.current!.style.setProperty("--mouseWidth", "12px");

    // Set isHovering to false
    context.targetMagnElement.current = null;

    // call mouseLerp to reset the mouse position
    context.mouseMethodRef.current!.handleMouseMove(e as unknown as MouseEvent);
}
/**
 * Wrapper function for a Magnetic component. This will decorate the child(ren) with mouse following behavior.
 */
export function MagneticButton({
    id,
    outerPadding = 48,
    innerPadding = 12,
    offset = 10,
    mouseScale = 1.2,
    speed = 0.1,
    clickScaleDown = "0.95",
    onClickFn,
    children,
}: {
    id: string;
    outerPadding?: number;
    innerPadding?: number;
    offset?: number;
    mouseScale?: number;
    speed?: number;
    clickScaleDown?: string;
    onClickFn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children: React.ReactNode;
}) {
    const { targetMagnElement, targetMousePosition, mouseRef, mouseMethodRef } = useContext<MouseContextType>(MouseContext); // consume context from provider that's wrapping the parent component
    const currentPoint = { x: 0, y: 0 };
    const targetPoint = { x: 0, y: 0 };
    let animationID: number | null = null; // if animationID is null, then the animation loop is not running
    const childRef = useRef<HTMLDivElement>(null);
    let scrollPosition = { x: 0, y: 0 };

    // UseCallback to prevent unnecessary redefinition of lerp function (prevents glitchy animation on state change)
    // Applying new targetPoint to currentPoint
    const lerp = useCallback(() => {
        const dx = targetPoint.x - currentPoint.x;
        const dy = targetPoint.y - currentPoint.y;

        // If animation is running and distance is less than 0.01, stop the animation
        if (animationID && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            cancelAnimationFrame(animationID);
            animationID = null;
            // Store current mouse position in scrollPosition when animation stops
            scrollPosition = { x: currentPoint.x, y: currentPoint.y };
            return;
        }

        currentPoint.x += dx * speed;
        currentPoint.y += dy * speed;

        // Set translateX and translateY CSS variables to the normalized values
        if (childRef.current)
            childRef.current.style.setProperty("transform", `translate(${currentPoint.x}px, ${currentPoint.y}px)`);

        // keep the animation loop running
        animationID = requestAnimationFrame(lerp);
    }, []);

    // Updating targetPoint and then calling lerp
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            // Get the x and y coordinates of the mouse
            const x = e.clientX;
            const y = e.clientY;

            // Get middle of element where the mouse is hovering
            const rect = e.currentTarget.getBoundingClientRect();
            const middleX = rect.left + rect.width / 2;
            const middleY = rect.top + rect.height / 2;

            // Get the distance between the mouse and the middle of the element
            const distanceX = x - middleX;
            const distanceY = y - middleY;

            // Get largest possible distance
            const maxDistanceX = e.currentTarget.offsetWidth / 2;
            const maxDistanceY = e.currentTarget.offsetHeight / 2;
            // Note: e.currentTarget and childRef.current.parentElement are the same.

            // normalize between -1 and 1 using the following formula: [2 * (distance - min) / (max - min)] - 1
            const normalizedX = (2 * (distanceX - -maxDistanceX)) / (maxDistanceX - -maxDistanceX) - 1;
            const normalizedY = (2 * (distanceY - -maxDistanceY)) / (maxDistanceY - -maxDistanceY) - 1;

            // Set targetPoint to the normalized values
            targetPoint.x = normalizedX * offset; // Multiply by offset to make movement significant
            targetPoint.y = normalizedY * offset;

            // Get width and height of mouse follower from the CSS variables --mouseHeight and --mouseWidth (they're in pixels)
            // Get from CSS variables instead of using mouseRef because transition makes it difficult to get the final dimensions until it ends.
            const newMouseHeight = parseFloat(getComputedStyle(mouseRef.current!).getPropertyValue("--mouseHeight"));
            const newMouseWidth = parseFloat(getComputedStyle(mouseRef.current!).getPropertyValue("--mouseWidth"));

            // Set targetMousePosition to follow the element
            targetMousePosition.x = targetPoint.x + middleX - newMouseWidth / 2;
            targetMousePosition.y = targetPoint.y + middleY - newMouseHeight / 2;

            // Start the animation loop if it's not already running.
            if (!animationID) lerp();
        },
        [lerp]
    );

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        targetMagnElement.current = null;

        // Set targetPoint to 0 when mouse leaves the element
        targetPoint.x = 0;
        targetPoint.y = 0;

        // Scale down the child element
        if (childRef.current) {
            childRef.current.style.scale = "1";
            childRef.current.style.background = "rgba(0, 0, 0, 0)";
            // Also invalidate all CSS properties applied by vfxMouseDown (because mouse can be dragged away from button so vfxMouseUp won't activate)
            childRef.current.style.color = "rgba(255, 255, 255, 1)";
            childRef.current.style.transitionDuration = "0.2s";
        }

        // Reset height and width of mouse follower to 0.75rem
        mouseRef.current!.style.setProperty("--mouseHeight", "12px");
        mouseRef.current!.style.setProperty("--mouseWidth", "12px");

        // Run animation loops if not running (could happen if button was scrolled away from instead of hovered)
        mouseMethodRef.current!.handleMouseMove(e as unknown as MouseEvent);
        if (!animationID) requestAnimationFrame(lerp);
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        targetMagnElement.current = e.currentTarget;
        childRef.current!.style.background = "rgba(0, 0, 0, 1)";

        // change height and width of mouse follower to match the icon
        mouseRef.current!.style.setProperty("--mouseHeight", `${childRef.current!.offsetHeight * mouseScale}px`);
        mouseRef.current!.style.setProperty("--mouseWidth", `${childRef.current!.offsetWidth * mouseScale}px`);

        // Run animation loop if not running (could happen if button was scrolled to instead of hovered)
        mouseMethodRef.current!.handleMouseMove(e as unknown as MouseEvent);
        if (!animationID) handleMouseMove(e);
    }, []);

    const vfxMouseDown = useCallback(() => {
        // Scale down the child element for click effect
        if (childRef.current) {
            // temporarily speed up the transition
            childRef.current.style.transitionDuration = "0s";
            childRef.current.style.scale = clickScaleDown;
            childRef.current.style.backgroundColor = "rgba(255, 255, 255, 1)";
            childRef.current.style.color = "rgba(0, 0, 0, 1)";
        }
    }, []);

    const vfxMouseUp = useCallback(() => {
        // Scale up the child element for click effect
        if (childRef.current) {
            // Reset transition duration
            childRef.current.style.transitionDuration = "0.2s";
            childRef.current.style.scale = "1";
            childRef.current.style.backgroundColor = "rgba(0, 0, 0, 1)";
            childRef.current.style.color = "rgba(255, 255, 255, 1)";
        }
    }, []);

    return (
        <button
            id={id}
            className="border-2 border-red-500/50"
            style={{
                padding: `${outerPadding}px`,
                borderRadius: "9999px",
                zIndex: 50,
            }}
            // Make the icon move with the mouse (fancy magnet effect)
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={vfxMouseDown}
            onMouseUp={vfxMouseUp}
            onClick={onClickFn}>
            <div
                ref={childRef}
                style={{
                    padding: `${innerPadding}px`,
                    borderRadius: "9999px",
                    // Apply transition only to scale and background properties
                    transitionProperty: "scale, background",
                    transitionDuration: "0.2s",
                    transitionTimingFunction: "ease-out",
                    zIndex: 51,
                }}>
                {children}
            </div>
        </button>
    );
}

export default MouseFollower;
