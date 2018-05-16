/**
 * 定义普通宠物相关的Reducer
 */
const r_amuletInfo = FacadeApp.cr({
    init: false,
    list: {},                       //宠物列表
    stone: 0,
    stoneHero: 0,
},{
    [CommandList.M_DAT_Amulet](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.stone = data.stone;
            state.stoneHero = data.stoneHero;

            if(!state.init){
                state.init = true;
                let list = ConfigStaticManager.getList(ConfigTypeName.Amulet);
                Object.keys(list).map(key => {
                    state.list[key] = new Amulet(list[key]);
                })
            }
            Object.keys(data.items).map(id=>{
                let item = data.items[id];
                state.list[id].Level = item.l;
            });
        }

        return state;
    },
});

