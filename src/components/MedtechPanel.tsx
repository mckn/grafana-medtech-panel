import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { Enums } from '@cornerstonejs/core';
import createImageIdsAndCacheMetaData from '../helpers/createImageIdsAndCacheMetaData';
import { SimpleOptions } from 'types';
import { setViewPort } from 'shared';

/**
 * Runs the demo
 */
async function run(element: HTMLDivElement, options: SimpleOptions, panelId: number) {
  const { seriesId, studyInstanceUID, wadoRsRoot, orientation } = options;

  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID: studyInstanceUID,
    SeriesInstanceUID: seriesId,
    wadoRsRoot: wadoRsRoot,
  });

  const viewportId = `viewport-${orientation}-${seriesId}-${panelId}`;
  const viewportInput = {
    viewportId,
    element: element,
    type: Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: orientation as Enums.OrientationAxis,
    },
  };

  await setViewPort(seriesId, studyInstanceUID, imageIds, viewportInput);
}

export const MedTechPanel: React.FC<PanelProps<SimpleOptions>> = (props) => {
  const element = useRef<HTMLDivElement>(null);
  const { height, options, width, id: panelId } = props;

  useEffect(() => {
    if (element.current) {
      run(element.current, options, panelId);
    }
  }, [options, panelId]);

  return (
    <>
      <div ref={element} style={{ height, width }} />
    </>
  );
};
