/**
 * 定义战宠相关的Reducer
 * .chip     | int      | 万能强化碎片
 * .adChip   | int      | 万能进阶碎片
 * .items    | array    | 宠物列表
 * ..i       | int      | 编号
 * ..l       | int      | 当前等级
 * ..en      | int      | 当前强化等级
 * ..ad      | int      | 当前进阶等级
 * ..p       | int      | 当前拥有的专属碎片数量 point
 * ..b       | int      | 当前战力 power
 */
const r_cardInfo  = FacadeApp.cr({
    init:false,     //  初始化标记
    list: [],       //  卡牌列表
    canMarshList: [],    // 可上阵卡牌
    adChip: 0,      //  万能进阶碎片
    chip: 0,        //  万能升级碎片
    FightingCard: null,           // 当前激活战宠
    _cardPrototypeSet: [],        // 神魔原型
    maxId:0,        // 已配置神魔的最大ID，由配置表读取
    marshallingList:[],        // 分组数据
    power: null,
    /**
     * 获得物品总攻击力
     */
    CardTotalGJ: function(): Digit{
        var total: Digit = new Digit([0]);
        Object.keys(this.list).map(id=>{
            total = CalculateMgr.Add(total, Digit.fromObject(this.list[id].b));
        });
        return total;
    },
    /**
     * 通过ID获取神魔原型
     */
    // GetCardProByID: function(id: number): CardPrototype {
    //     return this._cardPrototypeSet[id];
    // }
},{
    /**
     * @note : Reducer的标准用法，是接收参数、构造并返回一个新的state，原有state保持不变。目前的做法中，有不少地方直接修改了state数值，然后返回这个修改过的state，副作用待观察
     */
    [CommandList.M_DAT_CardList](state, {data}){
        if (typeof data != 'undefined' && data != null) {

            // let listSet = new Object;
            Object.keys(data.items).map(id=>{
                state.list[id] = data.items[id];
            });

            // state.list = listSet;
            state.adChip = data.adChip;
            state.chip = data.chip;
            state.FightingCard = null;
        } 
        return state;
    },
    /**
     * @note : Reducer的标准用法，是接收参数、构造并返回一个新的state，原有state保持不变。目前的做法中，有不少地方直接修改了state数值，然后返回这个修改过的state，副作用待观察
     */
    [CommandList.M_DAT_MarshallingList](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            // let listSet = [];
            // Object.keys(data.items).map(id=>{
            //     listSet.push(data.items[id]);
            //     // if(parseInt(id) < 17) listSet[id] = data.items[id];
            // });

            // state.canMarshList = listSet;
            state.adChip = data.adChip;
            state.chip = data.chip;
            state.FightingCard = null;
            state.power = data.power;
            Object.keys(data.loc).map(id=>{
                state.marshallingList[id] = data.loc[id];
            });
            // state.marshallingList = data.loc;
        } 
        return state;
    },
});
