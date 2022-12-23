import {useState, useRef, useEffect} from 'react';

const TOGGLE_STATES = {
  EXPANDED: '',
  EXPANDING: 'expanding',
  COLLAPSED: 'collapsed',
  COLLAPSING: 'collapsing',
};

/**
 * @typedef {Object} useToggleObject
 * @property {boolean} expanded - The expanded state of the toggle.
 * @property {setExpanded} function - The setter for the expanded state of the toggle.
 * @property {string} toggleCss - The current css of the toggle.
 * @property {setToggleCss} function - The setter for the css of the toggle.
 * @property {function} forceOpen - Force the toggle to be open.
 * @property {function} toggleComplete - Callback when the toggle animation is complete.
 */

/**
 * Hook to toggle a state between expanded and collapsed.
 * Determines the transitioning name of the css class.
 * @param {string} isOpen - The initial state of the toggle
 * @returns {useToggleObject} -
 *
 * Example usage:
 * const {handleToggle, toggleComplete, toggleCss} = useToggle(true);
 * <Box className="toggler" onClick={handleToggle}>
 * <Box className={`sidebar ${toggleCss}`} onAnimationEnd={toggleComplete}>
 */
export const useToggle = (isOpen) => {
  // isFirst is a flag to determine if the toggle is being initialized and prevent the toggle from transitioning
  const isFirst = useRef(true);
  const [expanded, setExpanded] = useState(isOpen === undefined ? true : isOpen);
  const [toggleCss, setToggleCss] = useState(expanded ? TOGGLE_STATES.EXPANDED : TOGGLE_STATES.COLLAPSED);

  const handleToggle = () => {
    setExpanded(!expanded);
  }

  // If not expanded force expanded state
  const forceOpen = () => {
    if (!expanded) {
      setExpanded(true);
    }
  }

  // Observe the toggle state and update the css class to a transitioning state
  // Skip the first render to prevent the toggle from transitioning
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (expanded) {
      setToggleCss(TOGGLE_STATES.EXPANDING);
    } else {
      setToggleCss(TOGGLE_STATES.COLLAPSING);
    }
  } , [expanded]);


  // Method to be used as the "onAnimationEnd" callback for the transitioning css class
  const toggleComplete = () => {
    setToggleCss(expanded ? TOGGLE_STATES.EXPANDED : TOGGLE_STATES.COLLAPSED);
  }

  return {expanded, setExpanded, handleToggle, forceOpen, toggleComplete, toggleCss};
}