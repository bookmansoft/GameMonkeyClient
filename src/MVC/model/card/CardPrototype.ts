/**
 * 卡牌原型
 */
class CardPrototype {
	/**
     * 构造方法
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._nameRes = object["nameRes"];
        this._qsIcon = object["QSRes"];
        this._headIcon = object["headRes"];
        this._description = object["desc"];


        this._allskillSet.push(<string>object["action1"]);
        this._allskillSet.push(<string>object["action2"]);
        this._allskillSet.push(<string>object["action3"]);
        this._allskillSet.push(<string>object["action4"]);
        this._allskillSet.push(<string>object["action5"]);

        this._profession = parseInt(object["profession"]);
        this._nature = parseInt(object["nature"]);

        // this._skillSet = (<string>(object["action1"])).split(";");
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
     * 名字图片资源
     */
    public get NameIcon(): string{
        if(this._nameRes == ""){
            return "fabao_wz_ryjgb_png";
        }
        return this._nameRes;
    }

    /**
     * 全身图片
     */
    public get QSRes(): string{
        if(this._qsIcon == ""){
            return "jingubang_png";
        }
        return this._qsIcon;
    }

    /**
     * 头像图片
     */
    public get HeadRes(): string{
        if(this._headIcon == ""){
            return "jingubang_png";
        }
        return this._headIcon;
    }

    /**
     * 描述
     */
    public get Description(): string{
        return this._description;
    }

    /**
     * 品质
     */
    public get Pinzhi(): number{
        return this._pinzhi;
    }


    /**
     * 碎片数量
     */
    public get Suipian(): number{
        return this._suipian;
    }

    /**
     * 攻击
     */
    public get Gongji(): Digit{
        return new Digit([100]);
    }

    /**
     * 防御
     */
    public get Fangyu(): number{
        return this._fangyu;
    }

    /**
     * 敏捷
     */
    public get Minjie(): number{
        return this._minjie;
    }

    /**
     * 暴击
     */
    public get Baoji(): number{
        return this._baoji;
    }

    /**
     * 战力
     */
    public get Zhanli(): number{
        return this._zhanli;
    }

    /**
     * 生命
     */
    public get Shengming(): number{
        return this._shengming;
    }

    /**
     * 当前解锁技能
     */
    public get Skill(){
        return this._allskillSet[0].split(";");
    }

    /**
     * 五行属性
     */
    public get Nature(): number{
        return this._nature;
    }

    /**
     * 职业
     */
    public get Profession(): number{
        return this._profession;
    }

    // 变量
    private _id: number;                            // ID
    private _name: string;                          // 名字
    // private _icon: string;                          // 图标
    private _nameRes: string;                       // 名称图片
    private _qsIcon: string;                        // 全身图片
    private _headIcon: string;                      // 头部图片
    private _description: string;                   // 描述
    private _techang:string;                        // 特长

    private _suipian:number;                        // 碎片数量
    private _level:number;                          // 等级 min 1 绿色 4 蓝色 7 紫色 11 黄色 16 max 21
    private _pinzhi:number;                         // 品质 散仙、地仙、天仙、真仙、金仙

    private _gongji:number;                         // 攻击
    private _fangyu:number;                         // 防御
    private _shengming:number;                      // 生命
    private _minjie:number;                         // 敏捷
    private _baoji:number;                          // 暴击
    private _zhanli:number;                         // 战力

    private _baseGJ : Digit;                        // 基础攻击
    private _iniBonus : Digit;                      // 初始加成

    private _allskillSet: string[] = [];            // 技能

    private _profession: number;                    // 职业
    private _nature: number;                        // 五行属性
}