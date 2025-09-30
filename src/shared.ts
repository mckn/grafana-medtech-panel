import { RenderingEngine, Viewport, init as coreInit } from '@cornerstonejs/core';
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

export const addViewPort = async <T extends Viewport>(
  viewportId: string,
  viewportInput: PublicViewportInput
): Promise<T> => {
  const engine = renderingEngine || (await init());
  engine.enableElement(viewportInput);
  return engine.getViewport(viewportId) as T;
};
