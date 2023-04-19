import { useRef, createContext } from "react";

export interface MouseContextType {
    isHovering: React.MutableRefObject<boolean>;
    targetMousePosition: { x: number; y: number };
    mouseRef: React.MutableRefObject<HTMLDivElement | null>;
}

// default value for context
export const MouseContext = createContext<MouseContextType>({
    isHovering: { current: false },
    targetMousePosition: { x: 0, y: 0 },
    mouseRef: { current: null },
});

export const MouseProvider = ({ children }: { children: React.ReactNode }) => {
    const targetMousePosition = { x: 0, y: 0 };
    const isHovering = useRef(false);
    const mouseRef = useRef<HTMLDivElement>(null);

    const context = {
        isHovering,
        targetMousePosition,
        mouseRef,
    };

    return <MouseContext.Provider value={context}>{children}</MouseContext.Provider>;
};
