import React, { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';

const Scroll = (props) => {
  const scrollableContentRef = useRef(null);

  useEffect(() => {
    const ps = new PerfectScrollbar(scrollableContentRef.current);

    return () => {
      ps.destroy();
    };
  }, []);

  return (
    <div ref={scrollableContentRef} style={{ height: '400px', overflow: 'hidden' }}>
      {props.children}
    </div>
  );
};

export default Scroll;