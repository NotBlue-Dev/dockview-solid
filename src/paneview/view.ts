import { IPanePart, PanePanelComponentInitParameter, PanelUpdateEvent } from 'dockview-core';
import { SolidPart } from '../solid';
import { IPaneviewPanelProps } from './paneview';
import type { Component } from 'solid-js';

/**
 * SolidJS implementation of pane panel section for Dockview paneview integration.
 */
export class SolidPanePanelSection implements IPanePart {
    public readonly element: HTMLElement;
    private part?: SolidPart<IPaneviewPanelProps>;

    constructor(
        public readonly id: string,
        private readonly componentFn: Component<IPaneviewPanelProps>
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '100%';
        this.element.style.width = '100%';
    }

    init(parameters: PanePanelComponentInitParameter): void {
        this.part = new SolidPart(
            this.element,
            this.componentFn,
            {
                params: parameters.params,
                api: parameters.api,
                title: parameters.title,
                containerApi: parameters.containerApi,
            }
        );
    }

    toJSON() {
        return { id: this.id };
    }

    update(event: PanelUpdateEvent): void {
        this.part?.update(event.params);
    }

    dispose(): void {
        this.part?.dispose();
    }
}