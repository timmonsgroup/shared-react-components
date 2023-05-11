/** @module RenderExpandableCell */
import React from 'react';
import { Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const getWidth = (refItem) => {
  return refItem?.current?.getBoundingClientRect().width;
};

const setOverflow = (refItem, overflow) => {
  if (refItem?.current?.style) {
    refItem.current.style.overflow = overflow;
  }
};

const RenderExpandableCell = ({formattedValue,  ...props}) => {
  const [isOverflowed, setIsOverflow] = useState(false);

  const textElementRef = useRef(null);

  const checkOverflow = () => {
    // Using getBoundingClientRect, instead of scrollWidth and clientWidth, to get width with fractional accuracy
    if (!textElementRef.current) return;

    // Get the width of the element with overflow hidden
    const clientWidth = getWidth(textElementRef);

    // Set overflow to visible to get the actual width of the element
    setOverflow(textElementRef, 'visible');
    const contentWidth = getWidth(textElementRef);

    // Set overflow back to hidden to truncate the text
    setOverflow(textElementRef, 'hidden');
    setIsOverflow(contentWidth > clientWidth);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  return (
    <Tooltip title={formattedValue} disableHoverListener={!isOverflowed}>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {formattedValue}
      </span>
    </Tooltip>
  );
};

export default RenderExpandableCell;
