/**
 * 联合所有已声明的Reducer
 */
const reducers = redux.combineReducers({
    r_amuletInfo, 
    r_taskInfo, 
    r_shopInfo, 
    r_status, 
    r_rankInfo,
    r_petInfo,
    r_talismanInfo,
    r_cardInfo,
    r_fightInfo,
    r_mailInfo,
    r_activityInfo,
});

/**
 * 定义所有的Action,注意要放在Reducer定义之后，因为构造FacadeApp实例时会首先引用Reducer.
 */

/**
 * 定义和r_fightInfo相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_AT_SyncCheckpoint, FacadeApp.ca(CommandList.M_AT_SyncCheckpoint, 'data'));
FacadeApp.inst.registerAction(CommandList.SetTollgateProgress, FacadeApp.ca(CommandList.SetTollgateProgress, 'data'));
FacadeApp.inst.registerAction(CommandList.BossLifeProgress, FacadeApp.ca(CommandList.BossLifeProgress, 'data'));
FacadeApp.inst.registerAction(CommandList.BOSSTIME, FacadeApp.ca(CommandList.BOSSTIME, 'data'));
FacadeApp.inst.registerAction(CommandList.M_CMD_FIGHT_GiveUpOrFight, FacadeApp.ca(CommandList.M_CMD_FIGHT_GiveUpOrFight, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_BattleWithFlyBoss, FacadeApp.ca(CommandList.M_AT_BattleWithFlyBoss, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_ReturnTollgate, FacadeApp.ca(CommandList.M_AT_ReturnTollgate, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_EventHandleResult, FacadeApp.ca(CommandList.M_AT_EventHandleResult, 'data'));

FacadeApp.inst.registerAction(CommandList.M_CMD_HangUp, FacadeApp.ca(CommandList.M_CMD_HangUp, 'data'));

/**
 * 定义邮箱
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_MailList, FacadeApp.ca(CommandList.M_DAT_MailList, 'data'));

/**
 * 定义活动
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_ActivityInfo, FacadeApp.ca(CommandList.M_DAT_ActivityInfo, 'data'));

/**
 * 定义和r_taskInfo相关的Action
 */
FacadeApp.inst.registerAction(CommandList.TASK_FINISHED_NUM, FacadeApp.ca(CommandList.TASK_FINISHED_NUM, 'data')); 
FacadeApp.inst.registerAction(CommandList.TASK_GET_LIST, FacadeApp.ca(CommandList.TASK_GET_LIST, 'data'));

/**
 * 定义和r_shopInfo相关的Action 
 */ 
FacadeApp.inst.registerAction(CommandList.SHOP_GET_LIST, FacadeApp.ca(CommandList.SHOP_GET_LIST, 'data'));

/**
 * 定义和宠物相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_PetList, FacadeApp.ca(CommandList.M_DAT_PetList, 'data'));

/**
 * 定义和法宝相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_TalismanList, FacadeApp.ca(CommandList.M_DAT_TalismanList, 'data'));

/**
 * 定义状态查询相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_AT_STATUSLIST, FacadeApp.ca(CommandList.M_AT_STATUSLIST, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_STATUS_Power, FacadeApp.ca(CommandList.M_AT_STATUS_Power, 'data'));
FacadeApp.inst.registerAction(CommandList.M_DAT_Status_PowerClick, FacadeApp.ca(CommandList.M_DAT_Status_PowerClick, 'data'));
FacadeApp.inst.registerAction(CommandList.M_DAT_Change_Money, FacadeApp.ca(CommandList.M_DAT_Change_Money, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_CHANGE_OFFLINE, FacadeApp.ca(CommandList.M_AT_CHANGE_OFFLINE, 'data'));
FacadeApp.inst.registerAction(CommandList.M_AT_GUIDE, FacadeApp.ca(CommandList.M_AT_GUIDE, 'data'));
/**
 * 定义卡牌操作相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_CardList, FacadeApp.ca(CommandList.M_DAT_CardList, 'data'));
/**
 * 定义编组操作相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_MarshallingList, FacadeApp.ca(CommandList.M_DAT_MarshallingList, 'data'));

/**
 * 定义和符咒相关的Action
 */
FacadeApp.inst.registerAction(CommandList.M_DAT_Amulet, FacadeApp.ca(CommandList.M_DAT_Amulet, 'data'));

/**
 * 定义和排行相关的Action
 */
FacadeApp.inst.registerAction(CommandList.RANK_GET_LIST1, FacadeApp.ca(CommandList.RANK_GET_LIST1, 'data'));
FacadeApp.inst.registerAction(CommandList.RANK_GET_LIST2, FacadeApp.ca(CommandList.RANK_GET_LIST2, 'data'));
FacadeApp.inst.registerAction(CommandList.RANK_GET_LIST3, FacadeApp.ca(CommandList.RANK_GET_LIST3, 'data'));

/**
 * 修改当前的效果列表
 */
FacadeApp.inst.registerAction(CommandList.M_AT_EFFECTS, FacadeApp.ca(CommandList.M_AT_EFFECTS, 'data'));

/**
 * 定义用户受限行为列表
 */
FacadeApp.inst.registerAction(CommandList.M_AT_ACTIONEXECUTE, FacadeApp.ca(CommandList.M_AT_ACTIONEXECUTE, 'data'));
