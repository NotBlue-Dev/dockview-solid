import { Component, onMount, onCleanup, createEffect } from 'solid-js';
import {
    createGridview,
    PROPERTY_KEYS_GRIDVIEW,
    GridviewOptions,
    GridviewFrameworkOptions,
    GridviewApi,
    GridviewPanelApi,
} from 'dockview-core';
import { SolidGridPanelView } from './view';

export interface GridviewReadyEvent { api: GridviewApi; }

export interface IGridviewPanelProps<T = any> {
    params: T;
    api: GridviewPanelApi;
    containerApi: GridviewApi;
}

export interface IGridviewSolidProps extends GridviewOptions {
    onReady: (event: GridviewReadyEvent) => void;
    components: Record<string, Component<IGridviewPanelProps>>;
}

export const GridviewSolid: Component<IGridviewSolidProps> = (props) => {
    let container: HTMLDivElement;
    let api: GridviewApi;

    onMount(() => {
        const frameworkOptions: GridviewFrameworkOptions = {
            createComponent: (options) =>
                new SolidGridPanelView(options.id, options.name, props.components[options.name]),
        };

        const coreOptions: Partial<GridviewOptions> = {};
        PROPERTY_KEYS_GRIDVIEW.forEach((key) => {
            if (key in props) {
                (coreOptions as any)[key] = (props as any)[key];
            }
        });

        api = createGridview(container, {
            ...(coreOptions as GridviewOptions),
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
            const changes: Partial<GridviewOptions> = {};
            PROPERTY_KEYS_GRIDVIEW.forEach((key) => {
                if (key in props) {
                    (changes as any)[key] = (props as any)[key];
                }
            });
            api.updateOptions(changes);
        }
    });

    return <div style={{ height: '100%', width: '100%' }} ref={(el) => (container = el!)} />;
};