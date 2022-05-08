import React from "react";

interface ConditionalWrapperProps {
  wrapper: (children: React.ReactNode) => React.ReactNode;
  condition: boolean;
}

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => <>{condition ? wrapper(children) : children}</>;
