"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors
      position="top-right"
      toastOptions={{
        className: "rounded-xl",
      }}
      {...props}
    />
  );
}

export default Toaster;
