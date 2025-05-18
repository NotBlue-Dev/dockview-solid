import { Component, onMount, onCleanup, createEffect } from 'solid-js';
import {
    createSplitview,
    PROPERTY_KEYS_SPLITVIEW,
    SplitviewOptions,
    SplitviewFrameworkOptions,
    SplitviewApi,
    SplitviewPanelApi,
} from 'dockview-core';
import { SolidSplitPanelView } from './view';

export interface SplitviewReadyEvent { api: SplitviewApi; }

export interface ISplitviewPanelProps<T = any> {
    params: T;
    api: SplitviewPanelApi;
    containerApi: SplitviewApi;
}

export interface ISplitviewSolidProps extends SplitviewOptions {
    onReady: (event: SplitviewReadyEvent) => void;
    components: Record<string, Component<ISplitviewPanelProps>>;
}

export const SplitviewSolid: Component<ISplitviewSolidProps> = (props) => {
    let container: HTMLDivElement;
    let api: SplitviewApi;

    onMount(() => {
        const frameworkOptions: SplitviewFrameworkOptions = {
            createComponent: (options) =>
                new SolidSplitPanelView(
                    options.id,
                    options.name,
                    props.components[options.name]
                ),
        };

        const coreOptions: Partial<SplitviewOptions> = {};
        PROPERTY_KEYS_SPLITVIEW.forEach((key) => {
            if (key in props) {
                (coreOptions as any)[key] = (props as any)[key];
            }
        });

        api = createSplitview(container, {
            ...(coreOptions as SplitviewOptions),
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
            const changes: Partial<SplitviewOptions> = {};
            PROPERTY_KEYS_SPLITVIEW.forEach((key) => {
                if (key in props) {
                    (changes as any)[key] = (props as any)[key];
                }
            });
            api.updateOptions(changes);
        }
    });

    return <div style={{ height: '100%', width: '100%' }} ref={(el) => (container = el!)} />;
};