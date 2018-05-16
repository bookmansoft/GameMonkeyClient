/**
 * 定义排行相关的Reducer
 */
const r_rankInfo = FacadeApp.cr({
    list1: [],
    list2: [],
    list3: [],
    rank1: 1,
    rank2: 1,
    rank3: 1,
},{
    [CommandList.RANK_GET_LIST1](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list1 = data['list'];
            state.rank1 = data['rank'];
        } 
        return state;
    },
    [CommandList.RANK_GET_LIST2](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list2 = data['list'];
            state.rank2 = data['rank'];
        } 
        return state;
    },
    [CommandList.RANK_GET_LIST3](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list3 = data['list'];
            state.rank3 = data['rank'];
        } 
        return state;
    },
});

