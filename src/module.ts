import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { MedTechPanel } from './components/MedtechPanel';

export const plugin = new PanelPlugin<SimpleOptions>(MedTechPanel)
.setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'seriesId',
      name: 'Series ID',
      description: 'The ID of the series to display',
    })
    .addTextInput({
      path: 'studyInstanceUID',
      name: 'Study ID',
      description: 'The ID of the study to display',
    })
    .addTextInput({
      path: 'wadoRsRoot',
      name: 'WADO-RS Root',
      description: 'The root URL of the WADO-RS server',
    });
});
