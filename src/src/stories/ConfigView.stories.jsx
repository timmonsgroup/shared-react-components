import React from 'react';
import { ConfigView } from './ConfigView';
import { HashRouter as Router } from 'react-router-dom';
import { parseViewLayout } from '../helpers/viewLayout';
import { VIEW_PRESET, ViewLayoutData, BIG_VIEW_PRESET, BigViewLayoutData} from '../helpers/story-helpers/ViewLayoutPreset';


const meta = {
  component: ConfigView,
};

const render = (args) => {
  const sections = parseViewLayout(args.layout, args.data);
  return <Router>
    <ConfigView sections={sections} dynamicComponents={{}} />
  </Router>;
};

export default meta;

export const BasicView = {
  render,
  args: {
    layout: VIEW_PRESET,
    data: ViewLayoutData
  },
};

export const BigView = {
  render,
  args: {
    layout: BIG_VIEW_PRESET,
    data: BigViewLayoutData
  },
};