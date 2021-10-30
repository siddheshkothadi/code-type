import React from "react";

function useClickOutside(ref, handler) {
  React.useEffect(() => {
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [ref]);
}

export default useClickOutside;
