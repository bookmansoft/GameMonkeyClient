/**
 * 定义排行相关的Reducer
 */
const r_mailInfo = FacadeApp.cr({
    list: [],				// 所有邮件列表
    noReadList:[]           // 未读取的邮件列表
},{
    [CommandList.M_DAT_MailList](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list = data['list'];
            state.noReadList = [];
            // 未读取的邮件
            for(let i=0; i<state.list.length; i++){
                if(state.list["state"] == 0){
                    state.noReadList.push(state.list["id"]);
                }
            }
        } 
        return state;
    },
});

