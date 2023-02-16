import babel from "rollup-plugin-babel";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from "rollup-plugin-replace";
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
// rollup.config.js
export default {
    input: "./new.js",
    output: [
        {
            file: "dist/banner.esm.js",
            format: "es",
            name: 'xinghuobanner'
        },
        {
            file: "dist/banner.umd.js",
            format: "umd",
            name: 'xinghuobanner'
        },
        {
            file: "dist/banner.js",
            format: "commonjs",
            name: 'xinghuobanner'
        },
    ],
    plugins: [
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        terser(),
        cleanup(),
        babel({
            exclude: 'node_modules/**',
        }),
    ],
};