import { FloatingPortal, useDismiss, useFloating, autoUpdate, useFocus, offset, flip, shift, useHover, useInteractions, useRole } from "@floating-ui/react";
import { useState } from "react";
import { animated } from "@react-spring/web";
import useBoop from "../hooks/useBoop";


const MyToolTipButton = ({ children, content, position, onClick, withTooltip, className, withStyle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { style, trigger } = useBoop({ timing: 1000 });

    const { refs, context, floatingStyles } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: position,

        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip({
                fallbackAxisSideDirection: "start"
            }),
            shift()
        ]
    });


    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);

    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role
    ]);


    return (
        <>
            <animated.div onClick={onClick} ref={refs.setReference} {...getReferenceProps()} style={withStyle?style:undefined} onMouseEnter={trigger} onMouseLeave={trigger} className={`flex flex-row items-center text-indigo-400 hover:text-indigo-600 cursor-pointer p-2 rounded-full`}>
                {children}
            </animated.div>
            {withTooltip && (
                <FloatingPortal>
                    {isOpen && (
                        <div
                            className="text-white text-sm bg-indigo-500 p-1 px-2 rounded-md  z-10"
                            style={floatingStyles}
                            ref={refs.setFloating}
                            {...getFloatingProps()}
                        >
                            {content}
                        </div>
                    )}
                </FloatingPortal>
            )}
        </>
    )
}

export default MyToolTipButton;