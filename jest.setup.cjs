require('@testing-library/jest-dom');

jest.mock('motion/react', () => {
  const React = require('react');
  
  const motionProxy = new Proxy({}, {
    get: (target, prop) => {
      return React.forwardRef(({ children, ...props }, ref) => {
        const cleanProps = { ...props };
        const motionProps = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'layout'];
        motionProps.forEach(key => delete cleanProps[key]);
        return React.createElement(prop, { ref, ...cleanProps }, children);
      });
    }
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }) => children
  };
});
