import { IContentRenderer, GroupPanelPartInitParameters, PanelUpdateEvent, IDockviewPanelProps } from 'dockview-core';
import { SolidPart } from '../solid';

/**
 * SolidJS implementation of IContentRenderer: mounts Solid components into panels.
 */
export class SolidPanelContentPart implements IContentRenderer {
    public readonly element: HTMLElement;
    private part?: SolidPart<IDockviewPanelProps>;

    constructor(
        public readonly id: string,
        private readonly component: (props: IDockviewPanelProps) => any
    ) {
        this.element = document.createElement('div');
        this.element.className = 'dv-solid-part';
        this.element.style.height = '100%';
        this.element.style.width = '100%';
    }

    public init(parameters: GroupPanelPartInitParameters): void {
        this.part = new SolidPart(
            this.element,
            this.component,
            {
                params: parameters.params,
                api: parameters.api,
                containerApi: parameters.containerApi,
            }
        );
    }

    public update(event: PanelUpdateEvent): void {
        this.part?.update({ params: event.params });
    }

    public layout(_width: number, _height: number): void {
        // no-op
    }

    public dispose(): void {
        this.part?.dispose();
    }
}