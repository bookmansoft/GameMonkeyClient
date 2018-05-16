/**
 * 符咒
 */
class Amulet{
    /**
     * 构造方法
     * @param strSet    字段集合
     */
    public constructor(strSet: Object){
        this._id = strSet["id"];
        this._icon = strSet["iconRes"];
        this._nameIma = strSet["nameRes"];
        this._level = 0;

        if (parseInt(strSet["maxLevel"])==0) 
            this._maxlevel="无限";
        else this._maxlevel= strSet["maxLevel"];

        this._description = strSet["desc"];
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
    public get NameIma(): string{
        return this._nameIma;
    }

    /**
     * 图标
     */
    public get Icon(): string{
        return this._icon;
    }

    /**
     * 描述
     */
    public get Description(): string{
        return this._description;
    }

    /**
     * 等级
     */
    public set Level(val: number){
        this._level = val;
    }

    /**
     * 等级
     */
    public get Level(): number{
        return this._level;
    }

    /**
     * 神魔1
     */
    public set GhostId1(val: number){
        this._level = val;
    }

    /**
     * 神魔1等级
     */
    public get GhostIdLevel1(): number{
        return this._level;
    }

    /**
     * 神魔2
     */
    public set GhostId2(val: number){
        this._level = val;
    }

    /**
     * 神魔2等级
     */
    public get GhostIdLevel2(): number{
        return this._level;
    }
    /**
     * 等级上限
     */
    public set MaxLevel(val: string){
        this._maxlevel = val;
    }

    /**
     * 等级上限
     */
    public get MaxLevel(): string{
        return this._maxlevel;
    }

    /**
     * 法宝是否获得
     */
    public get HasGet(): boolean{
        return this._level > 0;
    }

    /**
     * 升级消耗内丹计算
     */
    public get UpLVInternaldan(): Digit{
        var result: Digit = new Digit([100]); 
        return result;
    }

    // 变量
    private _id : number;               // ID
    private _nameIma : string;          // 名字
    private _level: number;             // 等级
    private _maxlevel: string;          // 等级上限
    private _icon : string;             // 图标
    private _description: string;       // 描述

    private _ghostId1: number;          // 神魔1
    private _ghostlevel1: number;       // 神魔1等级
    private _ghostId2: number;          // 神魔2
    private _ghostlevel2: number;       // 神魔2等级

    private _baseGJ : Digit;            // 基础攻击
    private _iniBonus : Digit;          // 初始加成
    private _iniConsume: Digit;         // 初始消耗
    private _skillIDSet: number[];      // 技能ID集合
    private _skillLevelSet: number[];   // 技能等级集合
}