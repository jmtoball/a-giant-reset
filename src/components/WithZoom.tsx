'use client';

import { JSX, cloneElement, useEffect, useRef, useState } from 'react';

type Props = {
  children: JSX.Element;
};

export default function WithZoom({ children }: Props) {
  const elementRef = useRef<HTMLElement>(null);
  const [zoomed, setZoomed] = useState(false);

  const handleClick = () => {
    if (elementRef.current && !zoomed) {
      elementRef.current.requestFullscreen();
      setZoomed(true);
    } else if (zoomed) {
      document.exitFullscreen();
      setZoomed(false);
    }
  };

  useEffect(() => {
    const onChange = () => setZoomed(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
    };
  }, []);

  return cloneElement(children, {
    ref: elementRef,
    style: {
      ...children.props.style,
      cursor: zoomed ? 'zoom-out' : 'zoom-in',
    },
    'data-zoomed': zoomed,
    onClick: handleClick,
  });
}
