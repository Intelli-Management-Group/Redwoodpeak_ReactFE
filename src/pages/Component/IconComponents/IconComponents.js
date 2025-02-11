import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconComponent = ({ icon, className, onClick }) => {
  return (
    <FontAwesomeIcon 
      icon={icon} 
      className={className} 
      onClick={onClick}
    />
  );
};

export default IconComponent;
