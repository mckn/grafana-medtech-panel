import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { MedTechPanel } from './components/MedtechPanel';

export const plugin = new PanelPlugin<SimpleOptions>(MedTechPanel);
