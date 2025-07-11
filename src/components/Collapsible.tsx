import React from 'react';

import { motion, AnimatePresence } from 'motion/react';

interface CollapsibleProps extends React.PropsWithChildren {
  isExpanded?: boolean;
  animateWidth?: boolean;
}

const Collapsible = ({ children, isExpanded = false, animateWidth = false }: CollapsibleProps) => {
  return (
    <AnimatePresence mode="sync" initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, width: animateWidth ? 0 : undefined, opacity: 0 }}
          animate={{ height: 'fit-content', width: animateWidth ? 'fit-content' : undefined, opacity: 1 }}
          exit={{ height: 0, width: animateWidth ? 0 : undefined, opacity: 0, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 400, damping: 40 }}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'clip',
            alignContent: 'center',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapsible;