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

  // const volumeId = `volume-${orientation}-${seriesId}-${panelId}`;

  // // Define a volume in memory
  // const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });

  const viewportId = `viewport-${orientation}-${seriesId}-${panelId}`;
  const viewportInput = {
    viewportId,
    element: element,
    type: Enums.ViewportType.ORTHOGRAPHIC,
    defaultOptions: {
      orientation: orientation as Enums.OrientationAxis,
    },
  };

  setViewPort(seriesId, studyInstanceUID, imageIds, viewportInput);

  // engine.setViewports(viewportInput);
  // volume.load();

  // setVolumesForViewports(engine, [{ volumeId }], [viewportId]);

  // engine.render();

  // const viewportId = `CT_AXIAL_STACK-${seriesId}-${panelId}`;

  // const viewportInput = {
  //   viewportId,
  //   element,
  //   type: Enums.ViewportType.STACK,
  // };

  // const viewport = await addViewPort<StackViewport>(viewportId, viewportInput);

  // await viewport.setStack(imageIds);

  // viewport.render();
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
