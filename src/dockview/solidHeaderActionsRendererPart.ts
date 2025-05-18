import { IHeaderActionsRenderer, IDockviewHeaderActionsProps, DockviewCompositeDisposable, DockviewMutableDisposable, DockviewApi, DockviewGroupPanel, DockviewGroupPanelApi, PanelUpdateEvent } from 'dockview-core';
import { SolidPart } from '../solid';

/**
 * SolidJS implementation of IHeaderActionsRenderer: mounts Solid components into group header actions.
 */
export class SolidHeaderActionsRendererPart implements IHeaderActionsRenderer {
    private readonly mutableDisposable = new DockviewMutableDisposable();
    public readonly element: HTMLElement;
    private part?: SolidPart<IDockviewHeaderActionsProps>;

    constructor(
        private readonly component: (props: IDockviewHeaderActionsProps) => any,
        private readonly _group: DockviewGroupPanel
    ) {
        this.element = document.createElement('div');
        this.element.className = 'dv-solid-part';
        this.element.style.height = '100%';
        this.element.style.width = '100%';
    }

    public init(parameters: { containerApi: DockviewApi; api: DockviewGroupPanelApi }): void {
        this.mutableDisposable.value = new DockviewCompositeDisposable(
            this._group.model.onDidAddPanel(() => this.updatePanels()),
            this._group.model.onDidRemovePanel(() => this.updatePanels()),
            this._group.model.onDidActivePanelChange(() => this.updateActivePanel()),
            parameters.api.onDidActiveChange(() => this.updateGroupActive())
        );
        this.part = new SolidPart(
            this.element,
            this.component,
            {
                api: parameters.api,
                containerApi: parameters.containerApi,
                panels: this._group.model.panels,
                activePanel: this._group.model.activePanel,
                isGroupActive: this._group.api.isActive,
                group: this._group,
            }
        );
    }

    public update(event: PanelUpdateEvent): void {
        this.part?.update(event.params);
    }

    public dispose(): void {
        this.mutableDisposable.dispose();
        this.part?.dispose();
    }

    private updatePanels(): void {
        this.update({ params: { panels: this._group.model.panels } });
    }

    private updateActivePanel(): void {
        this.update({ params: { activePanel: this._group.model.activePanel } });
    }

    private updateGroupActive(): void {
        this.update({ params: { isGroupActive: this._group.api.isActive } });
    }
}