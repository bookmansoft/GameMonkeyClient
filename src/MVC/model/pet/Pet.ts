/**
 * 宠物
 */
class Pet{
    /**
     * 构造方法
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._dragonRes = object["draRes"];
        this._nameRes = object["nameRes"];
        this._description = object["desc"];

        this._genius = (<string>(object["genius"])).split(";");
        this._autoTimes = parseInt(object["autoTimes"]);

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

        this._level = 0;
    }

    /**
     * 来自网络的原始数据
     */
    public get ori():any{
        return FacadeApp.read(CommandList.Re_PetInfo).list[this.ID];
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
     * 描述
     */
    public get Description(): string{
        return this._description;
    }

    /**
     * 资源
     */
    public get DragonRes(): string{
        return this._dragonRes;
    }

    /**
     * 天赋
     */
    public get Genius(): string[]{
        return this._genius;
    }

    /**
     * 发射光效
     */
    public get FSRes(): string{
        return this._dragonRes + "fs_png";
    }

    /**
     * 打击光效
     */
    public get DJRes(): string{
        return this._dragonRes + "dj_png";
    }

    /**
     * 受击1光效
     */
    public get SJ1Res(): string{
        return this._dragonRes + "sj_1_png";
    }

    /**
     * 受击2光效
     */
    public get SJ2Res(): string{
        return this._dragonRes + "sj_2_png";
    }

    /**
     * 全身图片
     */
    public get QSRes(): string{
        return this._dragonRes + "_qs_png";
    }

    /**
     * 头像图片
     */
    public get HeadRes(): string{
        return this._dragonRes + "_qs_png";
    }

    /**
     * 名称图片
     */
    public get NameRes(): string{
        return this._nameRes + "_png";
    }

    /**
     * 初始加成
     */
    // public get IniBonus(): number{
    //     return this._iniBonus;
    // }

    /**
     * 下一等级攻击
     */
    // public get NextLVGJ(): number{
    //     var level : number = FacadeApp.read(CommandList.Re_PetInfo).PetLevel;
    //     var result: number = (this._baseGJ + this._iniBonus * level) * this._GetMultipleTotal(level + 1);
    //     return Math.floor(result);
    // }

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
    // public get UpLVMoney(): number{
    //     var level : number = FacadeApp.read(CommandList.Re_PetInfo).PetLevel;
    //     var result: number = 2 * (Math.pow(1.06, (level - 1)));
    //     return Math.ceil(result);
    // }

    /**
     * 升级消耗金币
     */
    public UpLVMoney(added: number): Digit{
        if(this._level >= 1){
            let result: Digit = this._iniConsume.clone.Mul(CalculateMgr.Pow(1.06, added + this._level - 1));
                // .Sub(this._iniConsume.clone.Mul(CalculateMgr.Pow(1.06, this._level - 1))); 
            return result;
        }
        else{
            return this._iniConsume.clone;
        }
    }

    /**
     * 获得等级倍数总和
     */
    // private _GetMultipleTotal(level: number): number {
    //     var multiple: number = 1;
    //     while (level > 0) {
    //         multiple *= this._GetMultiple(level);
    //         level -= 1;
    //     }
    //     return multiple;
    // }

    /**
     * 获得涨幅
     */
    // private _GetZF(level: number): number {
    //     if (level == 1) {
    //         return this._iniBonus;
    //     }
    //     var zf: number = this._GetZF(level - 1) * this._GetMultiple(level - 1);
    //     return zf;
    // }

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

    /**
     * 获得等级倍数
     */
    // private _GetMultiple(level: number): number {
    //     // TODO 需要读取宠物的技能配置
    //     if (level <= 0) level = 1;
    //     var mul: number = 1;
    //     if (level == 10 || level == 25 || level == 50) {
    //         mul = 2;
    //     }
    //     else if (level == 75) {
    //         mul = 2.5;
    //     }
    //     else if (level == 125 || level == 150) {
    //         mul = 3;
    //     }
    //     else if (level == 175) {
    //         mul = 3.5;
    //     }
    //     else if (level >= 200) {
    //         if ((level % 1000) == 0) {
    //             mul = 10;
    //         }
    //         else if ((level % 25) == 0) {
    //             mul = 4;
    //         }
    //     }
    //     return mul;
    // }

    /**
     * 是否战斗
     */
    public set IsFighting(bool: boolean){
        if (bool == this._isFighting) return;
        this._isFighting = bool;
    }

    /**
     * 是否战斗
     */
    public get IsFighting(): boolean{
        return this._isFighting;
    }

    /**
     * 是否获得
     */
    public set IsGet(val: boolean){
        this._isGet = val;
    }

    /**
     * 是否获得
     */
    public get IsGet(): boolean{
        return this._isGet;
    }

    /**
     * 自动攻击次数
     */
    public get AutoTimes():number {
        return this._autoTimes;
    }

    /**
     * 攻击音效
     */
    public get Music(): string{
        if (this._id < 3) return SoundManager.PetAttack1_Music;
        else if (this._id < 5) return SoundManager.PetAttack2_Music;
        return SoundManager.PetAttack3_Music;
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


    // 变量
    private _id: number;                        // ID
    private _name: string;                      // 名字
    private _description: string;               // 描述
    private _dragonRes: string;                 // 资源
    private _nameRes: string;                   // 名称图片
    private _genius: string[] = [];             // 天赋

    private _level: number;                     // 等级   

    private _baseGJ : Digit;                    // 基础攻击
    private _iniBonus : Digit;                  // 初始加成
    private _iniConsume: Digit;                 // 初始消耗

    private _isFighting: boolean = false;       // 是否战斗
    private _isGet: boolean = false;            // 是否获得
    private _autoTimes: number = 0;             // 自动攻击次数

    public _skillIDSet: number[];      // 技能ID集合
    public _skillLevelSet: number[];   // 技能等级集合
}