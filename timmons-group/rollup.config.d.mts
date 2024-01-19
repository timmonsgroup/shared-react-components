declare namespace _default {
    let input: {
        'shared-auth-config': string;
        'shared-react-auth': string;
    };
    namespace output {
        let dir: string;
        let format: string;
        let entryFileNames: string;
        let chunkFileNames: string;
        let sourcemap: boolean;
    }
    let plugins: (import("rollup").Plugin<any> | import("rollup").Plugin<any>)[];
    let external: string[];
}
export default _default;
