/**
 * 商品管理
 */
class GoodsManager{
    /**
     * 初始化
     */
    public static Init(){
        GoodsManager._goodsSet = [];

        let data = ConfigStaticManager.getList(ConfigTypeName.Shop);
        Object.keys(data).map(key => {
            let goods: Goods = new Goods(data[key]);
            GoodsManager._goodsSet[goods.ID] = goods;
        })
        
    }

    /**
     * 获得商品列表
     */
    public static get GoodsSet(): Goods[]{
        return GoodsManager._goodsSet;
    }

    /**
     * 通过ID获得商品
     * @param id    商品ID
     */
    public static GetGoodsByID(id: number): Goods{
        return this._goodsSet[id];
    }

    /**
     * 来自哪个商品
     */
    public static fromData(data:any): Goods{
        let ret:Goods = GoodsManager.GetGoodsByID(data.id);
        return ret;
    }

    // 变量
    private static _goodsSet : Goods[];
}