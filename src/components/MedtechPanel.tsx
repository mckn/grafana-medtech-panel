import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { Enums, StackViewport } from '@cornerstonejs/core';
import createImageIdsAndCacheMetaData from '../helpers/createImageIdsAndCacheMetaData';
import { SimpleOptions } from 'types';
import { addViewPort } from 'shared';

/**
 * Runs the demo
 */
async function run(element: HTMLDivElement, options: SimpleOptions) {
  const { seriesId, studyInstanceUID, wadoRsRoot } = options;

  // Get Cornerstone imageIds and fetch metadata into RAM
  // const imageIds = await createImageIdsAndCacheMetaData({
  //   StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  //   SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  //   wadoRsRoot: 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb',
  // });

  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID: studyInstanceUID,
    SeriesInstanceUID: seriesId,
    wadoRsRoot: wadoRsRoot,
  });

  const viewportId = 'CT_AXIAL_STACK_' + seriesId;

  const viewportInput = {
    viewportId,
    element,
    type: Enums.ViewportType.STACK,
  };

  const viewport = await addViewPort<StackViewport>(viewportId, viewportInput);

  await viewport.setStack(imageIds);

  viewport.render();
}

export const MedTechPanel: React.FC<PanelProps<SimpleOptions>> = ({ height, width, options }) => {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (element.current) {
      run(element.current, options);
    }
  }, [options]);

  return (
    <>
      <div ref={element} style={{ height, width }} />
    </>
  );
};
