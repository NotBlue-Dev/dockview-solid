import { GridviewPanel, GridviewInitParameters, IFrameworkPart, GridviewApi, GridviewPanelApi } from 'dockview-core';
import { SolidPart } from '../solid';
import { IGridviewPanelProps } from './gridview';
import type { Component } from 'solid-js';

/**
 * SolidJS implementation of a grid panel view for Dockview gridview integration.
 */
export class SolidGridPanelView extends GridviewPanel {
    constructor(
        id: string,
        component: string,
        private readonly componentFn: Component<IGridviewPanelProps>
    ) {
        super(id, component);
    }

    getComponent(): IFrameworkPart {
        return new SolidPart(
            this.element,
            this.componentFn,
            {
                params: this._params?.params ?? {},
                api: this.api,
                // casting accessor to any to satisfy IGridviewComponent interface
                containerApi: new GridviewApi(
                    (this._params as GridviewInitParameters).accessor as any
                ),
            }
        );
    }
}