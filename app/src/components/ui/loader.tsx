import React from "react";

const SpinningLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-lvh">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default SpinningLoader;
