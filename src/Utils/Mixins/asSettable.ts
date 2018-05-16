/**
 * 所有的Mixin类，都要包装到MixinFunc模块中
 */
module Mixin{
    /**
     * 实现属性设置功能
     * @note: 可与其它类组合（Mixin）
     */
    export class asSettable {
        getx(key:string) { 
            return this[key];
        }
        setx(key:string, value) {
            this[key] = value;
            return this;
        }
    }
}
