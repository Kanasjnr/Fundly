import React from 'react';
import { Button } from '@chakra-ui/react';

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <Button
      type={btnType}
      fontSize="16px"
      fontWeight="semibold"
      lineHeight="26px"
      color="white"
      minH="52px"
      px="4"
      rounded="10px"
      _hover={{ bg: '#3db97e' }}
      onClick={handleClick}
      {...(styles || {})}  
    >
      {title}
    </Button>
  );
};

export default CustomButton;