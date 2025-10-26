import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap
          ${positionClasses[position]}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1' : ''}
            ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1' : ''}
            ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1' : ''}
            ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1' : ''}
          `} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
