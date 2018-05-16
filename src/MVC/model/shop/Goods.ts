/**
 * 商品
 */
class Goods{
	/**
     * 构造方法
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._description = object["desc"];

        this._iconRes = object["iconRes"];
        this._costTypeRes = object["descres"];
        this._nameRes = object["nameRes"];
        this._buyTimesType = parseInt(object["buyTimesType"]);
        this._buyTimes = parseInt(object["buyTimes"]);
        this._buyType = parseInt(object["buyType"]);
        this._cost = parseInt(object["cost"]);
        this._goodsId = parseInt(object["goodsId"]);
        this._value = parseInt(object["value"]);

        this._listID = parseInt(object["listId"]);
    }

    /**
     * 来自网络的原始数据
     */
    public get ori():any{
        return FacadeApp.read(CommandList.Re_ShopInfo).list[this.ID];
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
     *  图标资源
     */
    public get IconRes(): string{
        return this._iconRes + "_png";
    }

    /**
     *  名称资源
     */
    public get NameRes(): string{
        return this._nameRes + "_png";
    }

    /**
     *  花费类型资源
     */
    public get CostTypeRes(): string{
        return this._costTypeRes + "_png";
    }

    /**
     * 购买次数类型？？
     */
    public get BuyTimesType(): number{
        return this._buyTimesType;
    }

    /**
     * 限购次数
     */
    public get BuyTimes(): number{
        return this._buyTimes;
    }

    /**
     * 购买商店类型
     */
    public get BuyType(): number{
        return this._buyType;
    }

    /**
     * 花费
     */
    public get Cost(): number{
        return this._cost;
    }

    /**
     * 商品ID
     */
    public get GoodsID(): number{
        return this._goodsId;
    }
    
    /**
     * 列表ID
     */
    public get ListID(): number{
        return this._listID;
    }


    // 变量
    private _id: number;                        // ID
    private _name: string;                      // 名字
    private _description: string;               // 描述
    private _iconRes: string;                   // 商品图标资源
    private _costTypeRes: string;               // 花费类型图标资源
    private _nameRes: string;                   // 名字资源

    private _buyTimesType: number;              // 购买次数类型？？
    private _buyTimes: number;                  // 限购次数
    private _buyType: number;                   // 商店类型，花费类型
    private _cost: number;                      // 花费
    private _goodsId: number;                   // 商品id？？？
    private _value: number;                     // 值？？
    private _listID: number;                    // 数据端listId
}