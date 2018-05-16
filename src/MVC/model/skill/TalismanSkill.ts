/**
 * 物品技能
 */
class TalismanSkill{
    /**
     * 构造方法
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._icon = object["iconRes"];
        var effcet: string[] = (<string>(object["effectId"])).split(":");
        this._skillEffectID = parseInt(effcet[0]);
        if (effcet.length > 1){
            this._effectNum = parseFloat(effcet[1]);
        }
        this._description = object["desc"];
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._name;
    }

    /**
     * 图标
     */
    public get Icon(): string{
        return this._icon;
    }

    /**
     * 描述ID
     */
    public get Description(): string{
        return this._description;
    }

    // 变量
    private _id: number;                        // ID
    private _name: string;                      // 名字
    private _icon: string;                      // 图片
    private _skillEffectID: number;             // 技能效果
    private _effectNum: number;                 // 效果数据
    private _description: string;               // 描述
}