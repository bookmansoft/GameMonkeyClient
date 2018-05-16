/**
 * 宠物管理
 */
class PetManager {
	/**
     * 初始化
     */
    public static Init(){
        PetManager._petSet = [];

        var data = ConfigStaticManager.getList(ConfigTypeName.Pet);
        if (data == null) return null;

        Object.keys(data).map(key=>{
            var pet: Pet = new Pet(data[key]);
            PetManager._petSet[pet.ID] = pet;
        })
    }

    /**
     * 获得宠物列表
     */
    public static get PetSet(): Pet[]{
        return PetManager._petSet;
    }

    /**
     * 通过ID获得宠物
     * @param id    物品ID
     */
    public static GetPetByID(id: number): Pet{
        return this._petSet[id];
    }

    /**
     * 来自哪个宠物
     */
    public static fromData(data:Object): Pet{
        let ret:Pet = PetManager.GetPetByID(data["i"]);
        ret.Level = data["l"];
        return ret;
    }

    /**
     * 获得物品总攻击力
     */
    public static get PetTotalGJ(): Digit{
        var total: Digit = new Digit([0]);
        Object.keys(PetManager._petSet).map(index => {
            let element = PetManager._petSet[index];
            total = CalculateMgr.Add(total, element.Gongji);
        });
        return total;
    }

    // 变量
    private static _petSet : Pet[];
}