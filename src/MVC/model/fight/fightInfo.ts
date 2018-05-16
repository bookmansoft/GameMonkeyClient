/**
 * 关卡状态枚举
 */
enum CheckPointStatusType {
    Normal = 0,             // 正常过关状态
    Unlimited = 1,          // 无限模式
}

/**
 * 定义战斗相关的Reducer
 */
const r_fightInfo = FacadeApp.cr({
    LEVEL: 1,                                       //  当前关卡
    his: 1,                                         //  历史最高关卡
    _monsterCount: 0,                               //  当前已消灭怪物，也就是通关进度
    checkPointStatus: CheckPointStatusType.Normal,  //  进入当前关卡的状态
    TOTALMONSTER: 30,   //  过关怪物数量
    BOSSTIME:0,         //  打BOSS倒计时
    BOSSLIFEPROGRESS:0, //  boss血量进度值
    events: [],         //  随机副本事件 {expiredTime: 0, type: 3, numOfMax: 10, numOfCur: 1}
    rl: 0,              //  重生剩余次数
    rt: 0,              //  重生累计次数
    aStone: 0,          //  本次新增英魂
    BOSSID: null,       // 当前bossId
    eid: 0,             // 宝箱随机事件id
    HangUpLeftTime: 0,          //  挂机剩余时间
    UnlimitedMode: function():boolean {             //无尽模式
        return this.LEVEL > 0 && this.checkPointStatus == CheckPointStatusType.Unlimited && this.eid == 0;
    },
    TollgateProgressLeft: function():number {       //剩余怪物
        return Math.max(0,this.TOTALMONSTER - this._monsterCount); 
    },
    historyData: {'eid': 0, '_monsterCount': 0, 'TOTALMONSTER': 0},  //历史战斗数据
}, {
    [CommandList.SetTollgateProgress](state, {data}){
        state._monsterCount = data;
        return state;
    },
    [CommandList.M_AT_BattleWithFlyBoss](state, {data}){
        state.eid = data.eid;
        state.events = [];

        //进入分支战斗，保存历史数据
        state.historyData._monsterCount = state._monsterCount;
        state.historyData.TOTALMONSTER = state.TOTALMONSTER;
        
        state._monsterCount = 0;
        state.TOTALMONSTER = 1;
        
        return state;
    },
    [CommandList.M_AT_EventHandleResult](state, {data}){
        state.events = data['events'];
        return state;
    },
    [CommandList.M_AT_ReturnTollgate](state, {data}){
        //离开分支战斗
        state.eid = 0;

        //恢复历史数据
        state._monsterCount = state.historyData._monsterCount;
        state.TOTALMONSTER = state.historyData.TOTALMONSTER;

        return state;
    },
    [CommandList.M_AT_SyncCheckpoint](state, {data}){
        state.historyData._monsterCount = 0;
        state.historyData.TOTALMONSTER = 0;
        state.historyData.eid = 0;
        state.LEVEL = data["gateNo"];//关卡号
        state.his = data["his"];
        state._monsterCount = data["monsterNum"];
        state.TOTALMONSTER = data["totalMonster"];
        state.events = data['events'];
        state.rl = data['rl'];
        state.rt = data['rt'];
        state.aStone = data['aStone'];
        state.BOSSID = data["bossId"];
        state.BOSSLIFEPROGRESS = null;
        if(data['status'] == `goBack`){
            state.checkPointStatus = 1;
        }
        else{
            state.checkPointStatus = 0;
        }
        if(state.LEVEL % 5 != 0) state.BOSSLIFEPROGRESS = 0;
        return state;
    },
    [CommandList.BossLifeProgress](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.BOSSLIFEPROGRESS = data;
        } 
        return state;
    },
    [CommandList.BOSSTIME](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.BOSSTIME = data;
        } 
        return state;
    },
    [CommandList.M_CMD_FIGHT_GiveUpOrFight](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.GIVEUPORFIGHT = data;
        } 
        return state;
    },
    [CommandList.M_CMD_Login](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.LEVEL = data["gateNo"];//关卡号
            state.his = data["his"];
            state.HangUpLeftTime = data["leftTime"];
        } 
        return state;
    },
});