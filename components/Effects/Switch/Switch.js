// Effects/Switch/Switch.js

import { forwardRef } from "react";

export const Root = forwardRef(
  ({ children, checked, onCheckedChange, ...props }, ref) => (
    <div className="flex items-center justify-center" {...props}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
        id="dark-mode-toggle"
        ref={ref}
      />
      <label htmlFor="dark-mode-toggle" className="cursor-pointer">
        {children}
      </label>
    </div>
  )
);
Root.displayName = "Root";

export const Thumb = forwardRef(({ children }, ref) => (
  <div
    ref={ref}
    className="lg:mt-0 mt-3 mr-8 flex items-center transition-colors duration-300 relative"
  >
    <div className=" transform transition-transform duration-300 absolute left-0">
      {children}
    </div>
  </div>
));
Thumb.displayName = "Thumb";
