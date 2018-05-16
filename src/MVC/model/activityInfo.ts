/**
 * 定义排行相关的Reducer
 */
const r_activityInfo = FacadeApp.cr({
    act:[],
    starttime:"",
    endtime:"",
    id:null,
    rank:null,
    score:null,
    type:null,
    state:"",
},{
    [CommandList.M_DAT_ActivityInfo](state, {data}){
        state.act = data.act;
        state.starttime = data.starttime;
        state.endtime = data.endtime;
        state.id = data.id;
        state.rank = data.rank;
        state.score = data.score;
        state.type = data.type;
        return state;
    },
});

