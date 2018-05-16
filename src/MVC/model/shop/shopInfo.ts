/**
 * 定义商店相关的Reducer
 */
const r_shopInfo = FacadeApp.cr({
    list: [],    //任务列表
    },{
    [CommandList.SHOP_GET_LIST](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list = data;
        } 
        return state;
    },
});

