/**
 * Mixin方法
 */
module Mixin{
    /**
     * 类组合函数（Mixin），参照了微软TypeScript官方文档
     */
    export function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            })
        }); 
    };
}
