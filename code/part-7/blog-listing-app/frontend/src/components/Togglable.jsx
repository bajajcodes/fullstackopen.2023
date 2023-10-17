import { Box, Button } from "@chakra-ui/react";
import { useState, forwardRef, useImperativeHandle } from "react";

function Togglable(props, refs) {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <Box>
      <Box style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </Box>
      <Box style={showWhenVisible} className="togglableContent">
        {props.children}
        <Box p={4}>
          <Button onClick={toggleVisibility} width="100%">
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const TogglableWithRefs = forwardRef(Togglable);
export default TogglableWithRefs;
