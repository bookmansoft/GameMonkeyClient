/**
 * 法宝
 */
class Talisman{
    public constructor(object: Object){
        this._id = object['id'];
        this._name = object['name'];
        this._icon = object['iconRes'];
        this._description = object['desc'];
        this._nameIma = object['nameRes'];

        this._baseGJ = new Digit([parseInt(object['baseDamage'])]);
        this._iniBonus = new Digit([parseInt(object['baseUpdate'])]);
        this._iniConsume = new Digit([parseInt(object['baseCost'])]);
        this._skillIDSet = [
            parseInt(object['level10SkillId']), 
            parseInt(object['level25SkillId']), 
            parseInt(object['level50SkillId']), 
            parseInt(object['level75SkillId']), 
            parseInt(object['level100SkillId']), 
            parseInt(object['level125SkillId']),
            parseInt(object['level150SkillId']), 
            parseInt(object['level175SkillId']), 
            parseInt(object['level200SkillId']),
            parseInt(object['level1000SkillId'])];
            
        this._skillLevelSet = [10, 25, 50, 75, 100, 125, 150, 175, 200, 1000];

        
    }
    
    /**
     * 来自网络的原始数据
     */
    public get ori():any{
        return FacadeApp.read(CommandList.Re_TalismanInfo).list[this.ID];
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
     * 图标
     */
    public get NameRes(): string{
        return this._nameIma;
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
     * 法宝是否获得
     */
    public get HasGet(): boolean{
        return this._level > 0;
    }

    /**
     * 攻击
     */
    public get Gongji(): Digit{
        if (this._level == 0) return new Digit([0]);
        var result: Digit = CalculateMgr.Add(this._baseGJ, CalculateMgr.Mul(this._iniBonus, new Digit([this._level - 1])));
        result = CalculateMgr.Mul(result, this._GetMultipleTotal(this._level));
        return result;
    }

    /**
     * 下一等级攻击
     */
    public get NextLVGJ(): Digit{
        var result: Digit = CalculateMgr.Add(this._baseGJ, CalculateMgr.Mul(this._iniBonus, new Digit([this._level])));
        result = CalculateMgr.Mul(result, this._GetMultipleTotal(this._level + 1));
        return result;
    }

    /**
     * 升级消耗金币
     */
    public UpLVMoney(added: number): Digit{
        if(this._level >= 1){
            let result: Digit = this._iniConsume.clone.Mul(CalculateMgr.Pow(1.06, added + this._level)).Sub(this._iniConsume.clone.Mul(CalculateMgr.Pow(1.06, this._level)));
            return result;
        }
        else{
            return this._iniConsume.clone;
        }
    }

    /**
     * 获得等级倍数总和
     */
    private _GetMultipleTotal(level: number): Digit {
        var multiple: Digit = new Digit([1]);
        while (level > 0) {
            multiple = CalculateMgr.Mul(multiple, this._GetMultiple(level));
            level -= 1;
        }
        return multiple;
    }

    /**
     * 获得涨幅
     */
    private _GetZF(level: number): Digit {
        if (level == 1) {
            return this._iniBonus;
        }
        var zf: Digit = CalculateMgr.Mul(this._GetZF(level - 1), this._GetMultiple(level - 1));
        return zf;
    }

    /**
     * 获得等级倍数
     */
    private _GetMultiple(level: number): Digit {
        // TODO 需要去获取配置中的效果配置
        if (level <= 0) level = 1;
        var mul: number = 1;
        if (level == 10 || level == 25 || level == 50) {
            mul = 2;
        }
        else if (level == 75) {
            mul = 2.5;
        }
        else if (level == 125 || level == 150) {
            mul = 3;
        }
        else if (level == 175) {
            mul = 3.5;
        }
        else if (level >= 200) {
            if ((level % 1000) == 0) {
                mul = 10;
            }
            else if ((level % 25) == 0) {
                mul = 4;
            }
        }
        return new Digit([mul]);
    }

    // 变量
    private _id : number;               // ID
    private _name : string;             // 名字
    private _nameIma : string;             // 名字
    private _level: number = 0;             // 等级
    private _icon : string;             // 图标
    private _description: string;       // 描述

    private _baseGJ : Digit;            // 基础攻击
    private _iniBonus : Digit;          // 初始加成
    private _iniConsume: Digit;         // 初始消耗
    
    public _skillIDSet: number[];      // 技能ID集合
    public _skillLevelSet: number[];   // 技能等级集合
}