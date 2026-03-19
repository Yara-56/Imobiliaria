"use client";

import * as React from "react";
import {
  DialogRoot,
  DialogContent as ChakraDialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogActionTrigger,
  DialogCloseTrigger as ChakraDialogCloseTrigger,
  DialogPositioner,
  Portal,
  type DialogContentProps,
  type DialogCloseTriggerProps,
} from "@chakra-ui/react";

// ===============================
// REEXPORTS
// ===============================
export {
  DialogRoot,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogActionTrigger,
};

// ===============================
// CONTENT CUSTOM
// ===============================
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(props, ref) {
  const { children, ...rest } = props;

  return (
    <Portal>
      <DialogBackdrop />
      <DialogPositioner>
        <ChakraDialogContent ref={ref} {...rest}>
          {children}
        </ChakraDialogContent>
      </DialogPositioner>
    </Portal>
  );
});

// ===============================
// CLOSE BUTTON
// ===============================
export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogCloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialogCloseTrigger
      ref={ref}
      {...props}
      position="absolute"
      top="2"
      right="2"
    />
  );
});