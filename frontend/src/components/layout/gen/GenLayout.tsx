import React from "react";
import MainLayout from "../main/MainLayout";

interface GenLayoutProps {
  children: React.ReactNode;
}

const GenLayout: React.FC<GenLayoutProps> = ({ children }) => {
  return <MainLayout title="Landing Menia - Generator">{children}</MainLayout>;
};

export default GenLayout;
