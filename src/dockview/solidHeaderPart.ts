import { ITabRenderer, TabPartInitParameters, PanelUpdateEvent, IDockviewPanelHeaderProps } from 'dockview-core';
import { SolidPart } from '../solid';

/**
 * SolidJS implementation of ITabRenderer: mounts Solid components into panel headers.
 */
export class SolidPanelHeaderPart implements ITabRenderer {
    public readonly element: HTMLElement;
    private part?: SolidPart<IDockviewPanelHeaderProps>;

    constructor(
        public readonly id: string,
        private readonly component: (props: IDockviewPanelHeaderProps) => any
    ) {
        this.element = document.createElement('div');
        this.element.className = 'dv-solid-part';
        this.element.style.height = '100%';
        this.element.style.width = '100%';
    }

    public init(parameters: TabPartInitParameters): void {
        this.part = new SolidPart(
            this.element,
            this.component,
            {
                params: parameters.params,
                api: parameters.api,
                containerApi: parameters.containerApi,
                tabLocation: parameters.tabLocation,
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