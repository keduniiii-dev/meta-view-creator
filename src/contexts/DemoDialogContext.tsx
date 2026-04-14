import { createContext, useContext, useState, type ReactNode } from "react";

const DemoDialogContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export const useDemoDialog = () => useContext(DemoDialogContext);

export const DemoDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <DemoDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DemoDialogContext.Provider>
  );
};
