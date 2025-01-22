import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const IconComponent = ({ icon, className}) => {
    return <FontAwesomeIcon icon={icon} className={className}/>;
  };
  
  export default IconComponent;