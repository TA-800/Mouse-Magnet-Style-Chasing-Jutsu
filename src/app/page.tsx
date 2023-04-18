"use client";

// delay in transition for icon move effect
const MOUSE_TRANSITION_DELAY = 50;
const MOUSE_TRANSITION = `all 0.5s ease-in-out`;

export default function Home() {
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // disable transition on mouse enter
        const child = e.currentTarget.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        child.style.transition = "scale 0.25s ease-out";
    };

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

        // set translateX and translateY CSS variables to the normalized values
        const child = e.currentTarget.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        child.style.transform = `translateX(${normalizedX * 25}px) translateY(${normalizedY * 25}px)`;
        child.style.scale = "1.5";
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // re-enable transition on mouse leave
        const child = e.currentTarget.children[0] as HTMLDivElement; // typecast to HTMLDivElement to access style property
        child.style.transition = MOUSE_TRANSITION;
        child.style.scale = "1";

        // reset position of icon after MOUSE_TRANSITION_DELAY to add smooth transition back to original position
        setTimeout(() => {
            child.style.transform = `translateX(0px) translateY(0px)`;
        }, MOUSE_TRANSITION_DELAY);
    };

    return (
        <main className="flex flex-row gap-10 justify-center items-center mt-20">
            <button
                className="p-12 border-0 border-red-500/50 rounded-full"
                // make the icon move with the mouse (fancy magnet effect)
                onMouseEnter={(e) => handleMouseEnter(e)}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseLeave={(e) => handleMouseLeave(e)}>
                <div
                    className="p-3 rounded-full bg-black"
                    style={{
                        transition: MOUSE_TRANSITION,
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
        </main>
    );
}
