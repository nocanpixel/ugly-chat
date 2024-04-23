import {
  FloatingPortal,
  useDismiss,
  useFloating,
  autoUpdate,
  useFocus,
  offset,
  flip,
  shift,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";
import { animated } from "@react-spring/web";

const MyToolTip = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: props.position,

    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <animated.div {...props} ref={refs.setReference} {...getReferenceProps()}>
        {props.children}
      </animated.div>
      <FloatingPortal>
        {isOpen && (
          <div
            className="text-white text-sm bg-indigo-500 p-1 px-2 rounded-md  z-10"
            style={floatingStyles}
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            {props.content}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default MyToolTip;
