import { FC } from "react";

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = ({ className }) => {
  return (
    <header className={className || "text-white bg-black p-4"}>
      <p>Header</p>
    </header>
  );
};

export default Header;
