import { Component, onMount, onCleanup, createEffect } from 'solid-js';
import {
    createDockview,
    PROPERTY_KEYS_DOCKVIEW,
    DockviewOptions,
    DockviewFrameworkOptions,
    DockviewApi,
    DockviewGroupPanel,
    DockviewDidDropEvent,
    DockviewWillDropEvent,
    DockviewReadyEvent,
    IDockviewPanelProps,
    IDockviewPanelHeaderProps,
    IDockviewHeaderActionsProps,
    IWatermarkPanelProps,
} from 'dockview-core';
import { SolidHeaderActionsRendererPart } from './solidHeaderActionsRendererPart';
import { SolidPanelContentPart } from './solidContentPart';
import { SolidPanelHeaderPart } from './solidHeaderPart';
import { SolidWatermarkPart } from './solidWatermarkPart';

const DEFAULT_SOLID_TAB = 'props.defaultTabComponent';

function createGroupControlPart(
    component?: Component<IDockviewHeaderActionsProps>
): ((groupPanel: DockviewGroupPanel) => any) | undefined {
    return component
        ? (groupPanel: DockviewGroupPanel) => {
              return new SolidHeaderActionsRendererPart(component, groupPanel);
          }
        : undefined;
}

function extractCoreOptions(props: any): DockviewOptions {
    const coreOptions: any = {};
    PROPERTY_KEYS_DOCKVIEW.forEach((key) => {
        if (key in props) {
            coreOptions[key] = props[key];
        }
    });
    return coreOptions as DockviewOptions;
}

export interface IDockviewSolidProps extends DockviewOptions {
    components: Record<string, Component<IDockviewPanelProps>>;
    tabComponents?: Record<string, Component<IDockviewPanelHeaderProps>>;
    defaultTabComponent?: Component<IDockviewPanelHeaderProps>;
    leftHeaderActionsComponent?: Component<IDockviewHeaderActionsProps>;
    rightHeaderActionsComponent?: Component<IDockviewHeaderActionsProps>;
    prefixHeaderActionsComponent?: Component<IDockviewHeaderActionsProps>;
    watermarkComponent?: Component<IWatermarkPanelProps>;
    onReady: (event: DockviewReadyEvent) => void;
    onDidDrop?: (event: DockviewDidDropEvent) => void;
    onWillDrop?: (event: DockviewWillDropEvent) => void;
}

export const DockviewSolid: Component<IDockviewSolidProps> = (props) => {
    let container: HTMLDivElement | undefined;
    let api: DockviewApi;

    onMount(() => {
        if (!container) return;
        const frameworkTabComponents = props.tabComponents || {};
        if (props.defaultTabComponent) {
            frameworkTabComponents[DEFAULT_SOLID_TAB] = props.defaultTabComponent;
        }

        const frameworkOptions: DockviewFrameworkOptions = {
            createLeftHeaderActionComponent: createGroupControlPart(props.leftHeaderActionsComponent),
            createRightHeaderActionComponent: createGroupControlPart(props.rightHeaderActionsComponent),
            createPrefixHeaderActionComponent: createGroupControlPart(props.prefixHeaderActionsComponent),
            createComponent: (options) =>
                new SolidPanelContentPart(options.id, props.components[options.name]),
            createTabComponent: (options) =>
                new SolidPanelHeaderPart(options.id, frameworkTabComponents[options.name]),
            createWatermarkComponent: props.watermarkComponent
                ? () => new SolidWatermarkPart('watermark', props.watermarkComponent!)
                : undefined,
            defaultTabComponent: props.defaultTabComponent
                ? DEFAULT_SOLID_TAB
                : undefined,
        };

        api = createDockview(container, {
            ...extractCoreOptions(props),
            ...frameworkOptions,
        });
        api.layout(container.clientWidth, container.clientHeight);
        props.onReady({ api });
    });

    onCleanup(() => {
        api.dispose();
    });

    createEffect(() => {
        if (api) {
            const changes: Partial<DockviewOptions> = {};
            PROPERTY_KEYS_DOCKVIEW.forEach((key) => {
                if (key in props) {
                    // cast changes to any to allow dynamic property assignment
                    (changes as any)[key] = (props as any)[key];
                }
            });
            api.updateOptions(changes);
        }
    });

    createEffect(() => {
        if (api && props.onDidDrop) {
            const disp = api.onDidDrop((event) => props.onDidDrop!(event));
            onCleanup(() => disp.dispose());
        }
    });

    createEffect(() => {
        if (api && props.onWillDrop) {
            const disp = api.onWillDrop((event) => props.onWillDrop!(event));
            onCleanup(() => disp.dispose());
        }
    });

    return <div style={{ height: '100%', width: '100%' }} ref={el => (container = el!)} />;
};

export default DockviewSolid;