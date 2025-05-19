import { IWatermarkRenderer, WatermarkRendererInitParameters, PanelUpdateEvent, IWatermarkPanelProps } from 'dockview-core';
import { SolidPart } from '../solid';

/**
 * SolidJS implementation of IWatermarkRenderer: mounts Solid components as watermark overlay.
 */
export class SolidWatermarkPart implements IWatermarkRenderer {
    public readonly element: HTMLElement;
    private part?: SolidPart<IWatermarkPanelProps>;
    private params?: object;

    constructor(
        public readonly id: string,
        private readonly component: (props: IWatermarkPanelProps) => any
    ) {
        this.element = document.createElement('div');
        this.element.className = 'dv-solid-part';
        this.element.style.height = '100%';
        this.element.style.width = '100%';
    }

    public init(parameters: WatermarkRendererInitParameters): void {
        this.part = new SolidPart<IWatermarkPanelProps>(
            this.element,
            this.component,
            {
                group: parameters.group,
                containerApi: parameters.containerApi,
            } as IWatermarkPanelProps
        );
    }

    public update(event: PanelUpdateEvent): void {
        // update watermark params if needed
        this.part?.update({ ...(this.params as object) });
    }

    public layout(_width: number, _height: number): void {
        // no-op
    }

    public dispose(): void {
        this.part?.dispose();
    }
}