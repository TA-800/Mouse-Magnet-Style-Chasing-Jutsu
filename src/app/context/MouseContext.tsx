// import React, { useRef } from "react";

// export const MouseContext = React.createContext({
//     isHovering: false,
//     targetMousePosition: { x: 0, y: 0 },
//     mouseRef: null,
// });

// export const MouseProvider = ({ children }: { children: React.ReactNode }) => {
//     const targetMousePosition = { x: 0, y: 0 };
//     const isHovering = useRef(false);
//     const mouseRef = useRef<HTMLDivElement>(null);

//     return <MouseContext.Provider value={{ isHovering, targetMousePosition, mouseRef }}>{children}</MouseContext.Provider>;
// };
