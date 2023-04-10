import React, {createContext, useEffect, useState} from 'react';

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const windowSizeContext = createContext(size);

interface PropsType {
  children: JSX.Element[];
}

export const WindowSizeProvider: React.FC<PropsType> = ({children}) => {
  const [Size, setSize] = useState<typeof size>(size);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    const {innerHeight, innerWidth} = window;

    setSize({width: innerWidth, height: innerHeight});
  };

  return (
    <windowSizeContext.Provider value={Size}>
      {children}
    </windowSizeContext.Provider>
  );
};
