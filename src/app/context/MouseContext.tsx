import { createContext } from "react";
import { MouseMethodRefType } from "../utils/Magnetic/MagneticUtils";

/**
 * Type for mouse context
 */
export type MouseContextType = {
    targetMagnElement: React.MutableRefObject<HTMLElement | null>;
    targetMousePosition: { x: number; y: number };
    mouseRef: React.MutableRefObject<HTMLDivElement | null>;
    mouseMethodRef: React.MutableRefObject<MouseMethodRefType | null>;
};

/**
 * Mouse context that will provide all information needed by magnetic components & mouse follower.
 *
 * targetMagnElement keeps track of what magnetic component the mouse follower is hovering over.
 * If it is null, then the mouse follower is not hovering over any magnetic component and should follow the mouse.
 * If it is not null, then the mouse follower should follow the magnetic component's position.
 *
 * targetMousePosition is used to give the mouse follower the target position to move to.
 * This is updated by either the mouse follower component or magnetic components (if it is hovering over one).
 *
 * mouseRef is used to get the mouse follower component's ref, so that its transform (position) can be updated.
 *
 * mouseMethodRef is used to expose the mouse follower's position-updater method, so it can be called upon to forcefully update the mouse follower's position. This is needed when mouse position (or behavior) is changed by something other than the mouse follower (e.g. scroll or magnetic button being unmounted on click).
 */
export const MouseContext = createContext<MouseContextType>({
    targetMagnElement: { current: null },
    targetMousePosition: { x: 0, y: 0 },
    mouseRef: { current: null },
    mouseMethodRef: { current: null },
});

/**
 * Provider component (that will wrap magnetic components & mouse follower, and will consistently provide context with updated values)
 */
export const MouseProvider = ({ children, value }: { children: React.ReactNode; value: MouseContextType }) => {
    const context = {
        targetMagnElement: value.targetMagnElement || { current: null },
        targetMousePosition: value.targetMousePosition || { x: 0, y: 0 },
        mouseRef: value.mouseRef || { current: null },
        mouseMethodRef: value.mouseMethodRef || { current: null },
    };

    return <MouseContext.Provider value={context}>{children}</MouseContext.Provider>;
};
