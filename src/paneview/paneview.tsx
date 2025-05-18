import { Component, onMount, onCleanup, createEffect } from 'solid-js';
import {
    createPaneview,
    PROPERTY_KEYS_PANEVIEW,
    PaneviewOptions,
    PaneviewFrameworkOptions,
    PaneviewApi,
    PaneviewPanelApi,
    PaneviewDropEvent,
} from 'dockview-core';
import { SolidPanePanelSection } from './view';

export interface PaneviewReadyEvent { api: PaneviewApi; }

export interface IPaneviewPanelProps<T = any> {
    params: T;
    api: PaneviewPanelApi;
    containerApi: PaneviewApi;
    title: string;
}

export interface IPaneviewSolidProps extends PaneviewOptions {
    onReady: (event: PaneviewReadyEvent) => void;
    components: Record<string, Component<IPaneviewPanelProps>>;
    headerComponents?: Record<string, Component<IPaneviewPanelProps>>;
    onDidDrop?: (event: PaneviewDropEvent) => void;
}

export const PaneviewSolid: Component<IPaneviewSolidProps> = (props) => {
    let container: HTMLDivElement;
    let api: PaneviewApi;

    onMount(() => {
        const headerComponents = props.headerComponents || {};
        const frameworkOptions: PaneviewFrameworkOptions = {
            createComponent: (options) =>
                new SolidPanePanelSection(
                    options.id,
                    props.components[options.name]
                ),
            createHeaderComponent: (options) =>
                new SolidPanePanelSection(
                    options.id,
                    headerComponents[options.name]
                ),
        };

        const coreOptions: Partial<PaneviewOptions> = {};
        PROPERTY_KEYS_PANEVIEW.forEach((key) => {
            if (key in props) {
                (coreOptions as any)[key] = (props as any)[key];
            }
        });

        api = createPaneview(container, {
            ...(coreOptions as PaneviewOptions),
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
            const changes: Partial<PaneviewOptions> = {};
            PROPERTY_KEYS_PANEVIEW.forEach((key) => {
                if (key in props) {
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

    return <div style={{ height: '100%', width: '100%' }} ref={(el) => (container = el!)} />;
};