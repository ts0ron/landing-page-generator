import React from "react";
import MainLayout from "../main/MainLayout";

interface LandLayoutProps {
  children: React.ReactNode;
}

const LandLayout: React.FC<LandLayoutProps> = ({ children }) => {
  return (
    <MainLayout title="Landing Menia - Landing Pages">{children}</MainLayout>
  );
};

export default LandLayout;
