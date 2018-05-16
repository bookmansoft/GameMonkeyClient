/**
 * 卡牌
 */
class Card {
	/**
     * 构造方法
     */
    public constructor(card: any){
        this._prototype = new CardPrototype(card);// FacadeApp.read(CommandList.Re_CardtInfo).GetCardProByID(card.i);
        // this.ori = card;
    }

	/**
     * 来自网络的原始数据
     */
    public get ori():any{
        return FacadeApp.read(CommandList.Re_CardtInfo).list[this.ID];
    } 

    /**
     * 获取万能强化碎片
     */
    public get Chip():any{
        return FacadeApp.read(CommandList.Re_CardtInfo).chip;
    } 

    /**
     * 获取万能进阶碎片
     */
    public get AdChip():any{
        return FacadeApp.read(CommandList.Re_CardtInfo).adChip;
    } 

	/**
     * ID
     */
    public get ID(): number{
        return this._prototype.ID;
    }

    /**
     * 获取原型
     */
    public get Prototype(): CardPrototype{
        return this._prototype;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._prototype.Name;
    }

    /**
     * 图标
     */
    // public get Icon(): string{
    //     return this._prototype.Icon;
    // }

    /**
     * 描述
     */
    public get Description(): string{
        return this._prototype.Description;
    }

    /**
     * 星级
     */
    public get En(): number{
        return this.ori.en;
    }

    /**
     * 阶级
     */
    public get Ad(): number{
        return this.ori.ad;
    }

    /**
     * 等级
     */
    public get Lv(): number{
        return this.ori.l;
    }
 
     /**
     * 当前最大级数
     * 最大升级级数99级，且不能大于当前星级*20
     */
    public get Maxlv(): number{
        return this.ori.en * 20 > 99 ? 99 : this.ori.en * 20;
    }

    /**
     * 碎片数量
     */
    public get Suipian(): number{
        return  this.ori.p;
    }

    /**
     * 状态
     */
    public get State(): number{
        return this._state;
    }

    /**
     * 升星所需碎片
     */
    public get Chip_en(): number {
        return parseInt(this.ori.c_en.split(",")[0]);
    }

    /**
     * 升阶所需碎片
     */
    public get Chip_adv(): number {
        return parseInt(this.ori.c_adv);
    }

    /**
     * 升级所需碎片
     */
    public get Chip_up(): number {
        return parseInt(this.ori.c_up);
    }

    /**
     * 攻击
     */
    public get Attack(): number{
        return this.ori.Attack;
    }

    /**
     * 防御
     */
    public get Defense(): number{
        return this.ori.Defense;
    }

    /**
     * 英勇 力量
     */
    public get Valor(): number{
        return this.ori.bp.Valor;
    }

    /**
     * 牺牲 护甲
     */
    public get Sacrifice(): number{
        return this.ori.bp.Sacrifice;
    }

    
    /**
     * 精神 暴击
     */
    public get Spirituality(): number{
        return this.ori.bp.Spirituality;
    }

    
    /**
     * 诚实 韧性
     */
    public get Honesty(): number{
        return this.ori.bp.Honesty;
    }

    /**
     * 公正 命中
     */
    public get Justice(): number{
        return this.ori.bp.Justice;
    }
    
    /**
     * 谦卑 闪避
     */
    public get Hamility(): number{
        return this.ori.bp.Hamility;
    }

    /**
     * 荣誉 精准
     */
    public get Honor(): number{
        return this.ori.bp.Honor;
    }
    
    /**
     * 怜悯 格挡
     */
    public get Compassion(): number{
        return this.ori.bp.Compassion;
    }

    /**
     * 是否可进行升级、强化、进阶操作
     *  0 无 1 升级 2 强化 3 进阶 4 激活
     */
    public get ChooseButton():number{
        let val = 0;
        if(this.Lv == 0)                        val = 4;    // 未获取，显示激活
        else {
            if(this.Lv != this.Maxlv)           val = 1;    // 未到达满级，显示升级
            else {
                if(this.En == this.Ad)          val = 3;    // 达到满级满星，显示进阶
                else                            val = 2;    // 达到满级未满星，显示强化
            }
        }    
        return val;
    }

    /**
     * 资源
     */
    // public get Res(): string{
    //     //return this._res;
    //     let list = [
    //         'zijinbo',
    //         'xianshi',
    //         'shaseng',
    //         'zhubajie',
    //         'bailongma',
    //         'tangseng',
    //         'zixiaxianzi'
    //     ];
    //     return list[Math.floor(Math.random()*list.length)];
    // }

    // private _res: string;                       // 资源
    // 变量
    private _prototype: CardPrototype;             // 神魔原型
    private _id: number;                            // 神魔ID

    private _state:number;                          // 状态 出战 休息
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
}