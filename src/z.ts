/**
 * 为了适应白鹭引擎的模块加载顺序特性，部分需要在最后执行的历程书写于此，以避免出现module name not find的错误。
 */

//统一登记Mixin的使用 - 示范Mixin的用法。在ES2015里，可以考虑使用Proxy实现
Mixin.applyMixins(Main, [Mixin.asSettable]); 
