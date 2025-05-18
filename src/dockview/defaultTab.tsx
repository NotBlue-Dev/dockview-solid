import { Component, createSignal, onCleanup } from 'solid-js';
import { CloseButton } from '../svg';
import { DockviewPanelApi, IDockviewPanelHeaderProps } from 'dockview-core';

function useTitle(api: DockviewPanelApi) {
    const [title, setTitle] = createSignal<string | undefined>(api.title);
    const disp = api.onDidTitleChange((event) => setTitle(event.title));
    onCleanup(() => disp.dispose());
    return title;
}

import type { JSX } from 'solid-js';
export type IDockviewDefaultTabProps = IDockviewPanelHeaderProps &
    JSX.HTMLAttributes<HTMLDivElement> & {
        hideClose?: boolean;
        closeActionOverride?: () => void;
    };

export const DockviewDefaultTab: Component<IDockviewDefaultTabProps> = (props) => {
    const title = useTitle(props.api);
    let isMiddleMouse = false;

    const onClose = (e: MouseEvent) => {
        e.preventDefault();
        if (props.closeActionOverride) {
            props.closeActionOverride();
        } else {
            props.api.close();
        }
    };

    const onBtnPointerDown = (e: PointerEvent) => e.preventDefault();

    const onPointerDown = (e: PointerEvent) => {
        isMiddleMouse = e.button === 1;
        if (typeof props.onPointerDown === 'function') {
            props.onPointerDown(e as PointerEvent & { currentTarget: HTMLDivElement; target: Element });
        }
        if (isMiddleMouse && e.button === 1 && !props.hideClose) {
            isMiddleMouse = false;
            onClose(e as any);
        }
        if (typeof props.onPointerUp === 'function') {
            props.onPointerUp?.(e as any);
        }
    };

    const onPointerLeave = (e: PointerEvent) => {
        isMiddleMouse = false;
        if (typeof props.onPointerLeave === 'function') {
            props.onPointerLeave?.(e as any);
        }
    };

    return (
        <div
            data-testid="dockview-dv-default-tab"
            class="dv-default-tab"
            onPointerDown={onPointerDown}
            onPointerUp={onpointerup}
            onPointerLeave={onPointerLeave}
        >
            <span class="dv-default-tab-content">{title()}</span>
            {!props.hideClose && props.tabLocation !== 'headerOverflow' && (
                <div
                    class="dv-default-tab-action"
                    onPointerDown={onBtnPointerDown}
                    onClick={onClose}
                >
                    <CloseButton />
                </div>
            )}
        </div>
    );
};