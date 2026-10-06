import React from 'react';

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const LoginButton = ({ children, ...props }: LoginButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full bg-primary text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:bg-primary-hover hover:shadow-lg transition-all active:scale-[0.98] ${props.className || ''}`}
    >
      {children}
    </button>
  );
};

export default LoginButton;
