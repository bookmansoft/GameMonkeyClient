/**
 * 玩家
 */
class Player{
    /**
     * 构造方法
     * @param id                ID
     * @param name              名字
     */
    public constructor(id: number, name: string){
        this._id = id;
        this._name = name;
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
    public set Name(name: string){
        this._name = name;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._name;
    }

    // 变量
    private _id: number;            // ID
    private _name: string;          // 名字
}