/**
 * 定义法宝相关的Reducer
 */
const r_talismanInfo = FacadeApp.cr({
    list: {}, 
    /**
     * 比较奇怪的是，此处使用lambda表达式会造成意外的报错，例如this.list访问违例，而使用function则执行正常
     */
    talismansNumOfActive: function(): Number {
        let _num = 0;
        Object.keys(this.list).map(key=>{
            if(this.list[key].l > 0){
                _num++;
            }
        });
        return _num;
    },
    talismansTotalLevel: function(): Number {
        let _num = 0;
        Object.keys(this.list).map(key=>{
            _num += this.list[key].l;
        });
        return _num;
    },   
},{
    [CommandList.M_DAT_TalismanList](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.list = data['items'];
        } 
        return state;
    },
});
