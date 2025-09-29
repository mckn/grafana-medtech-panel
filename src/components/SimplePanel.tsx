import React, { useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import dicomts, { Renderer } from 'dicom.ts';
import FileInput from './FileInput';
import DICOMCanvas from './DICOMCanvas';

interface Props extends PanelProps<SimpleOptions> {}

let renderer: Renderer;

export const SimplePanel: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileSelected = (buff: ArrayBuffer, name: string) => {
    console.time(`parse ${name}`);
    console.time(`render ${name}`);
    const image = dicomts.parseImage(new DataView(buff));
    console.timeEnd(`parse ${name}`);
    if (!renderer || renderer.canvas !== canvasRef.current) {
        renderer = new Renderer(canvasRef.current);
    }
    renderer.render(image!, 0).then(() => {
      console.timeEnd(`render ${name}`)
    });
  };

  return (
    <div>
    <header>
      Select file:
      <FileInput onFileSelected={fileSelected} />
      <div style={{ height: "50px" }} />
      <DICOMCanvas id="dicom-canvas" canvasRef={canvasRef} width={512} height={512} />
    </header>
  </div>
  );
};
