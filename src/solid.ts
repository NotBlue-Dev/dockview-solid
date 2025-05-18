import { render } from 'solid-js/web';
import { createStore, SetStoreFunction } from 'solid-js/store';
import { createComponent } from 'solid-js';
import { IFrameworkPart } from 'dockview-core';

/**
 * SolidJS replacement for ReactPart: mounts a Solid component into a DOM node and allows imperative prop updates.
 */
export class SolidPart<P extends object> implements IFrameworkPart {
    private disposed = false;
    private setState!: (props: Partial<P>) => void;
    private disposeRoot!: () => void;

    constructor(
        private readonly parent: HTMLElement,
        private readonly component: (props: P) => any,
        private readonly parameters: P
    ) {
        this.createPortal();
    }

    private createPortal() {
        const initialProps = { ...this.parameters };
        let setStateLocal!: SetStoreFunction<P>;
        // Mount Solid component into parent element
        this.disposeRoot = render(() => {
            const [state, setState] = createStore<P>(initialProps);
            setStateLocal = setState;
            return createComponent(this.component, state);
        }, this.parent);
        this.setState = (props: Partial<P>) => {
            setStateLocal((prev) => Object.assign({}, prev, props));
        };
    }

    public update(props: Partial<P>) {
        if (this.disposed) {
            throw new Error('invalid operation: resource is already disposed');
        }
        this.setState(props);
    }

    public dispose() {
        this.disposeRoot();
        this.disposed = true;
    }
}