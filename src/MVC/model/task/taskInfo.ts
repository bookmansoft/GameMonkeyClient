/**
 * 定义任务相关的Reducer
 */
const r_taskInfo = FacadeApp.cr({
    list: [],    //任务列表
    TASK_FINISHED_NUM:0,//已完成任务数量
},{
    [CommandList.TASK_GET_LIST](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list = data;
        } 
        return state;
    },
    [CommandList.TASK_FINISHED_NUM](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.TASK_FINISHED_NUM = data;
        } 
        return state;
    },
});

