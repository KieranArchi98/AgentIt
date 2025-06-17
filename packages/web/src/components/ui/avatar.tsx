import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    src?: string;
    alt?: string;
  }
>(({ className, src, alt, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      className="aspect-square h-full w-full"
    />
    <AvatarPrimitive.Fallback
      className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600"
    >
      {alt?.charAt(0).toUpperCase() || "U"}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = "Avatar";

export { Avatar }; 