"use client";

const ICON_OFFSET = 50;

// reference: https://frontendmasters.com/courses/css-animations/lerp-technique/
export default function Home() {
    return (
        <main className="flex flex-row gap-10 justify-center items-center mt-20">
            <MagneticButton />
        </main>
    );
}

function MagneticButton() {
    const currentPoint = { x: 0, y: 0 };
    const targetPoint = { x: 0, y: 0 };
    // if animationID is null, then the animation loop is not running
    let animationID: number | null = null;

    function lerp() {
        const dx = targetPoint.x - currentPoint.x;
        const dy = targetPoint.y - currentPoint.y;

        // If animation is running and distance is less than 0.05, stop the animation
        if (animationID && Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
            cancelAnimationFrame(animationID);
            animationID = null;
            return;
        }

        currentPoint.x += dx * 0.05;
        currentPoint.y += dy * 0.05;

        console.log(`cp.x: ${currentPoint.x}, dx: ${dx} tp.x: ${targetPoint.x}`);

        // set translateX and translateY CSS variables to the normalized values
        const child = document.querySelector("button")?.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        if (child) child.style.setProperty("transform", `translate(${currentPoint.x}px, ${currentPoint.y}px)`);

        animationID = requestAnimationFrame(lerp);
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        const child = e.currentTarget.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        child.style.scale = "1.15";

        // start animation loop if it is not running
        if (!animationID) requestAnimationFrame(lerp);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // set targetPoint to 0 when mouse leaves the element
        targetPoint.x = 0;
        targetPoint.y = 0;

        // scale down the child element
        const child = e.currentTarget.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        child.style.scale = "1";
    };

    // start animation loop
    // similar to Unity's Update() function
    requestAnimationFrame(lerp);

    return (
        <button
            className="p-12 border-2 border-red-500/50 rounded-full"
            // make the icon move with the mouse (fancy magnet effect)
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}>
            <div
                className="p-3 rounded-full bg-black"
                style={{
                    // apply transition only to scale property
                    transition: "scale 0.25s ease-out",
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
