/**
 * 1、操作命令字：所有一次元（用户操作引发）、二次元指令的宏定义。M_CMD
 * 2、网络报文命令字：所有和网络交互的API指令的宏定义。M_NET_
 * 3、数据仓库操控命令字：引发明确的数据子集更新的指令字。M_DAT_
 */
const CommandList = {
    /**
     * 闯关信息100000
     */
    M_NET_CheckpointNum: 100000,
    /**
     * 处理随机事件
     */
    M_NET_CheckEvent: 100001,
    /**
     * 法宝编号500001
     */
    M_NET_TalismanNum: 500001,
    /**
     * 技能编号503001
     */
    M_NET_SkillNum: 503001,
    /**
     * 宠物编号504001
     */
    M_NET_PetNum: 504001,
    /**
     * 排行榜查询700000
     */
    M_NET_RankNum: 601001,
    /**
     * 抽取符咒
     * todo: 网络协议号待定
     */
    M_NET_Amulet: 501001,
    /**
     * 状态查询
     */
    M_NET_STATUS: 999002,
    /**
     * 任务
     */
    M_NET_TASK: 101000,
    /**
     * 卡牌列表
     */
    M_NET_Card: 502001,
    /**
     * 商城购物
     */
    M_NET_SHOP: 999003,
    /**
     * 领取任务奖励
     */
    M_NET_TASK_GET:101001,
    /**
     * 邮箱600001
     */
    M_NET_Mail: 600001,
    /**
     * 活动103001
     */
    M_NET_Activity: 103001,
    
    //以上为所有的网络报文

    /**
     * 技能编号503001
     */
    GuideInfo: "checkGuide",
    GuideFinish: "guide.finish",
    Guide: "5001",
    GuideBonus: "5002",
    

    /**
     * 振屏操作
     */
    M_CMD_ZhenPing: "zhenping",
    
    /**
     * 切换场景
     */
    M_CMD_CHANGE: "scene_change",
    /**
     * 变换编组
     */
    M_CMD_Change_Marshalling: 'M_CMD_Change_Marshalling',
    /**
     * 切换宠物
     */
    M_CMD_Change_Pet: 'M_CMD_CHANGE_PET',
    /**
     * 切换主角
     */
    M_CMD_CHANGE_ROLE: 'M_CMD_CHANGE_ROLE',
    
    /**
     * 任务界面打开
     */
    M_CMD_UiOpened_Task: 'M_CMD_UIOPENED_TASK',
    /**
     * 商城界面打开
     */
    M_CMD_UiOpened_Shop: 'M_CMD_UIOPENED_SHOP',
    M_CMD_UiOpened_Pet: 'M_CMD_UIOPENED_PET',
    M_CMD_UiOpened_Talisman: 'M_CMD_UIOPENED_ITEM',
    M_CMD_UiOpened_Buddha: 'M_CMD_UIOPENED_BUDDHA',
    M_CMD_UiOpened_BuddhaMgr: 'M_CMD_UIOPENED_BUDDHAMGR',
    M_CMD_UiOpened_Achievement: 'M_CMD_UIOPENED_ACHIEVEMENT',
    M_CMD_UiOpened_Card: 'M_CMD_UiOpened_Card',
    M_CMD_UiOpened_Marshalling: 'M_CMD_UiOpened_Marshalling',
    M_CMD_UiOpened_ActivityRule: 'M_CMD_UiOpened_ActivityRule',
    // M_CMD_UiOpened_CahangeMarshalling: 'M_CMD_UiOpened_Marshalling',
    M_CMD_UiOpened_Amulet: 'M_CMD_UIOPENED_AMULET',
    M_CMD_UiOpened_AmuletPokedex: 'M_CMD_UiOpened_AmuletPokedex',
    M_CMD_UIOPENED_RANK_Tab1: 'M_CMD_UIOPENED_RANK_Tab1',
    M_CMD_UIOPENED_RANK_Tab2: 'M_CMD_UIOPENED_RANK_Tab2',
    M_CMD_UIOPENED_RANK_Tab3: 'M_CMD_UIOPENED_RANK_Tab3',
    M_CMD_UiOpened_HangUpTip: 'M_CMD_UiOpened_HangUpTip',
    M_CMD_UiOpened_HangUp: 'M_CMD_UiOpened_HangUp',
    M_CMD_UiOpened_SeniorRevive: 'M_CMD_UiOpened_SeniorRevive',     // 选择转生页面
    M_CMD_UiOpened_ZS: 'M_CMD_UiOpened_ZS',     // 普通转生
    M_CMD_UiOpened_Online: 'M_CMD_UiOpened_Online', // 离线奖励页面
    M_CMD_UiOpened_Mail: 'M_CMD_UiOpened_Mail',     // 邮箱
    M_CMD_UiOpened_Integral: 'M_CMD_UiOpened_Integral',
    M_CMD_ShowAmuletPokedex: 'M_CMD_ShowAmuletPokedex',
    M_CMD_ShowAmuletDetail: 'M_CMD_ShowAmuletDetail',
    M_CMD_ShowCard: 'M_CMD_ShowCard',
    M_CMD_ShowTalisman: 'M_CMD_ShowItem',
    M_CMD_ShowPVPMarshalling: 'M_CMD_ShowPVPChange',
    M_CMD_ShowPVPFightWindow: 'M_CMD_ShowPVPFightWindow',
    M_CMD_ShowPVPVS: 'M_CMD_ShowPVPVS',

    /**
     * 技能状态发生变化
     */
    M_CMD_SkillStatus:'M_CMD_SKILLSTATUS',

    M_CMD_Login: 'M_CMD_Login',

    /**
     * 放弃还是战斗
     */
    M_CMD_FIGHT_GiveUpOrFight: "GIVEUPORFIGHT",
    //暂停战斗
    M_CMD_Fight_Suspend: 'M_CMD_FIGHT_SUSPEND',
    //继续战斗
    M_CMD_FIGHT_CONTINUE: 'M_CMD_FIGHT_CONTINUE',
    M_CMD_FIGHT_MonsterKilled: 'M_CMD_FIGHT_MonsterKilled',
    M_CMD_FIGHT_MonsterHitted: 'M_CMD_FIGHT_MonsterHitted',
    //我方宠物击中敌方或怪物
    M_CMD_FIGHT_HIT_ENEMY: 'M_CMD_FIGHT_HIT_ENEMY',
    //敌方宠物击中我方
    M_CMD_FIGHT_HIT_MINE: 'M_CMD_FIGHT_HIT_MINE',
    //我方英雄攻击敌方怪物
    M_CMD_RoleAttack: 'M_CMD_RoleAttack',
    //宠物攻击
    M_CMD_PetAttack: 'M_CMD_PetAttack',
    //战斗单元血量发生变化
    M_CMD_SoldierLifeChanged: 'M_CMD_SoldierLifeChanged',
    //战队被消灭
    M_CMD_ArmyDestory : 'M_CMD_ArmyDestory',
    // 挂机
    M_CMD_HangUp : 'M_CMD_HangUp',

    // 开始PVP
    PVP_SRART : 'PVP_SRART',
    // 开始PVP进场
    PVP_StartComeIn : 'PVP_StartComeIn',
    // PVP击中英雄
    PVP_HIT_ROLE : 'PVP_HIT_ROLE',
    // PVP结束战斗
    PVP_EndAttack : 'PVP_EndAttack',
    // PVP结束战斗移除战场
    PVP_RemoveFightWindow : 'PVP_RemoveFightWindow',
    // PVP开始检测下一步行动
    PVP_CheckAttackData : 'PVP_CheckAttackData',
    // PVP变更战场速度
    pvp_ChangTimeScale : 'pvp_ChangTimeScale',

    //以上为所有的操控指令

    /**
     * 设置关卡进度，以便进行全局共享
     */
    SetTollgateProgress: 'SetTollgateProgress',
    /**
     * boss血量进度值
     */
    BossLifeProgress: "BossLifeProgress",
    /**
     * 打BOSS倒计时
     */
    BOSSTIME: "BOSSTIME",
    /**
     * BOSS可掉落奖励
     */
    BOSSBONUS: 'BOSSSTONE',
    /**
     * 已完成任务数量
     */
    TASK_FINISHED_NUM: 'TASK_FINISHED_NUM',
    /**
     * 任务列表
     */
    TASK_GET_LIST: 'TASK_GET_LIST',
    /**
     * 宠物列表
     */
    M_DAT_PetList: 'PET_GET_LIST',

    /**
     * 法宝列表
     */
    M_DAT_TalismanList: 'ITEM_GET_LIST',
    /**
     * 魔宠列表
     */
    M_DAT_CardList: 'GHOST_GET_LIST',
    /**
     * 编组列表
     */
    M_DAT_MarshallingList: 'Marshalling_GET_LIST',
    /**
     * 抽取符咒
     */
    M_DAT_Amulet: 'M_AT_AMULET',
    /**
     * 修改金币的数值
     */
    M_DAT_Change_Money: 'M_AT_CHANGE_MONEY',
    /**
     * 修改离线收益的数值
     */
    M_AT_CHANGE_OFFLINE: 'M_AT_CHANGE_OFFLINE',

    /**
     * 状态查询
     */
    M_AT_STATUSLIST: 'STATUS_LIST',
    /**
     * 更新攻击力
     */
    M_AT_STATUS_Power:'M_AT_STATUS_Power',
    /**
     * 更新点击攻击力
     */
    M_DAT_Status_PowerClick:'M_AT_STATUS_PowerClick',
    /**
     * 更新效果列表
     */
    M_AT_EFFECTS: 'M_AT_EFFECTS',
    /**
     * 受限行为推送
     */
    M_AT_ACTIONEXECUTE: `M_AT_ACTIONEXECUTE`,
    /**
     * 同步副本状态信息
     */
    M_AT_SyncCheckpoint: 'M_AT_SyncCheckpoint',
    /**
     * 导入宝箱怪战斗
     */
    M_AT_BattleWithFlyBoss: 'M_AT_BattleWithFlyBoss',
    /**
     * 100001协议返回值处理句柄
     */
    M_AT_EventHandleResult: 'M_AT_EventHandleResult',
    /**
     * 分支战斗结束，回到主线战斗中
     */
    M_AT_ReturnTollgate: 'M_AT_ReturnTollgate',
    /**
     * 新手引导
     */
    M_AT_GUIDE:`M_AT_GUIDE`,

    /**
     * 商品列表 
     */
    SHOP_GET_LIST: 'SHOP_GET_LIST',
    /**
     * 排行榜
     */
    RANK_GET_LIST1: 'RANK_GET_LIST1',
    RANK_GET_LIST2: 'RANK_GET_LIST2',
    RANK_GET_LIST3: 'RANK_GET_LIST3',

    /**
     * 邮箱列表
     */
    M_DAT_MailList: 'M_DAT_MailList',
    
    /**
     * 活动信息
     */
    M_DAT_ActivityInfo: 'M_DAT_ActivityInfo',

    //以上为所有的Action类型。Action类型也经常作为Reducer具体数据项的名称，在读取数据仓库内容时，和Reducer名称联合使用
    //@note 容易出现的错误：没有为M_AT_***定义对应的Action，或者没有在Reducer中登记关键字，导致无法对应到Reducer而无法执行数据修改

    Re_TaskInfo: 'r_taskInfo',
    Re_FightInfo: 'r_fightInfo',
    Re_ShopInfo: 'r_shopInfo',
    Re_Status: 'r_status',
    Re_RankInfo: 'r_rankInfo',
    Re_PetInfo: 'r_petInfo',
    Re_TalismanInfo: 'r_talismanInfo',
    Re_CardtInfo: 'r_cardInfo',
    Re_AmuletInfo: 'r_amuletInfo',
    Re_MailInfo: 'r_mailInfo',
    Re_ActivityInfo: 'r_activityInfo',
    
    //以上为所有的Reducer命名

    M_MS_FightStatusChg: 'M_MS_FIGHTSTATUSCHG',// 战斗状态

    //以上为消息通知
};

