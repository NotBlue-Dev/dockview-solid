import { SplitviewPanel, PanelViewInitParameters, PanelUpdateEvent, SplitviewApi } from 'dockview-core';
import { SolidPart } from '../solid';
import { ISplitviewPanelProps } from './splitview';
import type { Component } from 'solid-js';

/**
 * SolidJS implementation of panel view for Dockview splitview integration.
 */
export class SolidSplitPanelView extends SplitviewPanel {
    constructor(
        public readonly id: string,
        component: string,
        private readonly componentFn: Component<ISplitviewPanelProps>
    ) {
        super(id, component);
    }

    getComponent() {
        return new SolidPart(
            this.element,
            this.componentFn,
            {
                params: this._params?.params ?? {},
                api: this.api,
                containerApi: new SplitviewApi(
                    (this._params as PanelViewInitParameters).accessor
                ),
            }
        );
    }
}