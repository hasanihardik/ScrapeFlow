import Logo from "../../components/logo";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Logo />
      {children}
    </div>
  );
};

export default layout;
