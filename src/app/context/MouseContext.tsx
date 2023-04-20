import { useRef, createContext } from "react";

export interface MouseContextType {
    isHovering: React.MutableRefObject<boolean>;
    targetMousePosition: { x: number; y: number };
    mouseRef: React.MutableRefObject<HTMLDivElement | null>;
}

// default value for context (if no provider is used)
export const MouseContext = createContext<MouseContextType>({
    isHovering: { current: false },
    targetMousePosition: { x: 0, y: 0 },
    mouseRef: { current: null },
});

// provider component (that wraps children and will provide context with updated values)
export const MouseProvider = ({ children, value }: { children: React.ReactNode; value: MouseContextType }) => {
    const context = {
        isHovering: value.isHovering || { current: false },
        targetMousePosition: value.targetMousePosition || { x: 0, y: 0 },
        mouseRef: value.mouseRef || { current: null },
    };

    return <MouseContext.Provider value={context}>{children}</MouseContext.Provider>;
};
