/**
 * 法宝管理
 */
class TalismanManager{
    /**
     * 初始化
     */
    public static Init(){
        TalismanManager._talismanSet = [];

        let data = ConfigStaticManager.getList(ConfigTypeName.Talisman);
        Object.keys(data).map(key => {
            let talisman: Talisman = new Talisman(data[key]);
            TalismanManager._talismanSet[talisman.ID] = talisman;
        })
    }

    /**
     * 获得法宝列表
     */
    public static get TalismanSet(): Talisman[]{
        return TalismanManager._talismanSet;
    }

    /**
     * 通过ID获得法宝
     * @param id    法宝ID
     */
    public static GetTalismanByID(id: number): Talisman{
        return this._talismanSet[id];
    }

    /**
     * 来自哪个法宝
     */
    public static fromData(data:any): Talisman{
        let ret:Talisman = TalismanManager.GetTalismanByID(data.i);
        ret.Level = data.l;
        return ret;
    }

    /**
     * 获得法宝总攻击力
     */
    public static get TalismanTotalGJ(): Digit{
        var total: Digit = new Digit([0]);
        Object.keys(TalismanManager._talismanSet).map(index => {
            let element = TalismanManager._talismanSet[index];
            total = CalculateMgr.Add(total, element.Gongji);
        });
        return total;
    }

    // 变量
    private static _talismanSet : Talisman[];
}