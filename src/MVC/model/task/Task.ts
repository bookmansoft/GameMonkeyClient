/**
 * 任务，成就
 */
class Task{
    /**
     * 构造方法
     * @param strSet    字段集合
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._description = object["desc"];
        this._iconRes = object["iconRes"];
        this._bonus = object["bonus"];
    }

    /**
     * 来自网络的原始数据
     */
    public get ori():any{
        return FacadeApp.read(CommandList.Re_TaskInfo).list[this.ID];
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
     * 图标
     */
    public get IconRes(): string{
        return this._iconRes;
    }
    public get Bonus():string{
        return this._bonus;
    }
    // 变量
    private _id : number;               // ID
    private _name : string;             // 名字
    // private _level: number;             // 等级
    private _iconRes : string;             // 图标
    private _description: string;       // 描述
    private _bonus: string;
	
}