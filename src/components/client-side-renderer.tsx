/* eslint-disable react/prop-types */
import React, { memo, useState, useEffect } from 'react';

const ClientSideOnlyRenderer = memo(function ClientSideOnlyRenderer({
  // @ts-ignore
  initialSsrDone = false,
  // @ts-ignore
  renderDone,
  // @ts-ignore
  renderLoading,
}) {
  const [ssrDone, setSsrDone] = useState(initialSsrDone);

  useEffect(
    function afterMount() {
      setSsrDone(true);
    },
    [],
  );

  if (!ssrDone) {
    return renderLoading();
  }

  return renderDone();
});
