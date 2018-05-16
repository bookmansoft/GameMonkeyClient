/**
 * 符咒管理
 */
class AmuletManager{
    /**
     * 初始化
     */
    public static Init(){
        AmuletManager._amuletSet = [];

        let data = ConfigStaticManager.getList(ConfigTypeName.Amulet);
        Object.keys(data).map(key => {
            let amulet: Amulet = new Amulet(data[key]);
            AmuletManager._amuletSet[amulet.ID] = amulet;
        })
        
    }

    /**
     * 获得符咒列表
     */
    public static get AmuletSet(): Amulet[]{
        return AmuletManager._amuletSet;
    }

    /**
     * 通过ID获得符咒
     * @param id    符咒ID
     */
    public static GetAmuletByID(id: number): Amulet{
        return this._amuletSet[id];
    }

    /**
     * 来自哪个符咒
     */
    public static fromData(data:any): Amulet{
        let ret:Amulet = AmuletManager.GetAmuletByID(data.ID);
        ret.Level = data.Level;
        return ret;
    }

    // 变量
    private static _amuletSet : Amulet[];
}