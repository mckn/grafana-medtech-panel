import { RenderingEngine, init as coreInit, setVolumesForViewports, volumeLoader } from '@cornerstonejs/core';
import { PublicViewportInput } from '@cornerstonejs/core/dist/esm/types';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';

const RENDERING_ENGINE_ID = 'grafana-medtech-panel-engine';
let renderingEngine: RenderingEngine | null = null;
let promise: Promise<RenderingEngine> | null = null;

const init = async (): Promise<RenderingEngine> => {
  if (promise) {
    return promise;
  }

  promise = new Promise(async (resolve) => {
    await coreInit();
    await dicomImageLoaderInit();

    renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
    resolve(renderingEngine);
  });

  return promise;
};

const viewportInputs: Record<string, PublicViewportInput[]> = {};

export const setViewPort = async (
  seriesId: string,
  studyInstanceUID: string,
  imageIds: string[],
  viewportInput: PublicViewportInput
) => {
  const engine = renderingEngine || (await init());
  const volumeId = `${studyInstanceUID}-${seriesId}`;

  if (!viewportInputs[volumeId]) {
    viewportInputs[volumeId] = [];
    const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });
    volume.load();
  }

  viewportInputs[volumeId].push(viewportInput);

  const allInputs = Object.values(viewportInputs).reduce((arr, curr) => {
    return arr.concat(curr);
  }, []);
  const filteredInputIds = viewportInputs[volumeId].map((i) => i.viewportId);

  engine.setViewports(allInputs);

  setVolumesForViewports(engine, [{ volumeId }], filteredInputIds);
  engine.render();
};
