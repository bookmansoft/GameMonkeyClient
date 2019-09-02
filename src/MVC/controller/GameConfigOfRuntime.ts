/**
 * 参数
 */
class GameConfigOfRuntime{
    public static ServerUrl: string = 'h5.gamegold.xin';
    public static ServerPort: number = 9202;
    public static commMode: CommMode = CommMode.socket;
	
	//此处填写测试账号，只有IsDebug为true时才生效

    public static TestUserId: string = Math.floor(Math.random()*100000) +'';
    
    /**
     * 是否是测试版本
     */
    public static get IsDebug(): boolean{
        return !egret.Capabilities.isMobile;
    }

	/**
	 * 当前时间
	 */
	public static get Date(): Date{
		return new Date();
	}

	/**
	 * 当前时间戳（秒）
	 */
	public static get Time(): number{
		var date: Date = GameConfigOfRuntime.Date;
		return Math.floor(date.getTime() / 1000);
	}

	/**
     * 接收服务端时间
     */
    // public static set ServerTime(json: Object){
    //     ProcessManager.AddProcess(UnitManager._Process.bind(UnitManager));
    // }

	/**
     * 服务端时间
     */
    public static get ServerTime(): number{
        return GameConfigOfRuntime.serverTime;
    }

	/**
	 * 服务端时间戳
	 */
	public static serverTime:number = 0;
	/**
	 * 游戏宽
	 */
	public static gameWidth: number = 640;

	/**
	 * 游戏高
	 */
	public static gameHeight: number = 1136;

	/**
	 * 面板显示高
	 */
	public static panelListHeight: number = 775;

	/**
	 * 面板弹出初始位置
	 */
	public static panelInitY: number = 525;

	/**
	 * 角色初始x坐标
	 */
	public static roleX: number = -100;
	public static roleEnemyX: number = 450;

	/**
	 * 角色初始y坐标
	 */
	public static roleY: number = 660;

	/**
	 * 角色最大x位置
	 */
	public static roleMaxX: number = 230;
	public static roleEnemyMaxX: number = 370;

	/**
	 * 角色移动速度
	 */
	public static roleSpeed: number = 6;

	/**
	 * 角色x轴攻击范围
	 */
	public static attackRange: number = 250;

	/**
	 * 怪物初始x坐标
	 */
	public static monsterX: number = 850;

	/**
	 * 怪物初始y坐标
	 */
	public static monsterY: number = 660;

	/**
	 * 怪物最小x位置
	 */
	public static monsterMinX: number = 400;

	/**
	 * 怪物移动速度
	 */
	public static monsterSpeed: number = 6;

	/**
	 * 怪物出现的时间间隔
	 */
	public static createTime: number = 40;

	public static monsterCount: number = 17;	// 怪物总数
	public static bossCount: number = 13;		// Boss总数
	public static CPMCount: number = 4;			// 关卡出现怪物种类数量

	/**
     * 挂机每关需要消耗的时间
     */
    public static HangupInterval = 1;

    /**
     * 获取英魂加成的公式
     */
    public static getStoneEffect(){
        return (FacadeApp.read(CommandList.Re_Status).stoneHero * 0.1 + Math.max(0, FacadeApp.read(CommandList.Re_FightInfo).rt-1)*0.01).toFixed(0);
    }

    
}

/**
 * 描述界面按钮激活状态的联合枚举
 */
const ButtonActiveStatus = {
    /**
     * 离线收益按钮激活
     */
    OfflineButton: 1 << 0,
    /**
     * 挂机按钮激活
     */
    HangupButton: 1<< 1,
    /**
     * 挂机奖励按钮
     */
    HangupBonusButton : 1<<2,
    /**
     * 过关奖励按钮激活
     */
    BonusOfPassGate: 1<< 3,
}

/**
 * 状态技能
 */
const enum SkillStatusType{
    /**
     * 可使用
     */
    CanUse = 1,

    /**
     * 使用中
     */
    Used = 2,

    /**
     * 冷却中
     */
    Cooldown = 3,
}

/**
 * 商店类型枚举
 */
const ShopTypeEnum = {
  /**
   * 购买钻石
   */
  diamond: 1 << 0,
  /**
   * 金币商店
   */
  Gold: 1 << 1,
  /**
   * 杂货铺
   */
  common: 1 << 2,
  /**
   * 神秘商店
   */
  secret: 1 << 3,
};

/**
 * 道具类型枚举，用作判断
 */
const enum ItemType {
    /**
     * 人民币
     */
    RMB = 0,
    /**
     * 元宝   'D'
     */
    Diamond = 1,
    /**
     * 金币   'M'
     */
    Gold = 2,
    /**
     * 魂石
     */
    Stone = 3,
    /**
     * 天赋点，也就是圣光。圣光可以在商城直接购买
     */
    Potential = 4,
    /**
     * 荣誉值，用于工会管理
     */
    honor = 6,
    /**
     * 用于升级PVP英雄的万能碎片
     */
    chip = 7,
    /**
     * 用于进阶PVP英雄的万能碎片
     */
    advancedChip = 8,
    /**
     * 体力值  'A'
     */
    Action = 9,
    /**
     * 圣光分配
     */
    AssignPotential = 10,
    /**
     * 工会贡献
     */
    Devotion = 13,
    /**
     * 工会经验
     */
    ExpOfAlly = 14,
    /**
     * 工会战积分
     */
    PointOfAllyWar = 15,
    /**
     * 魔宠总经验
     */
    ExpForPetOfAll = 18,
    /**
     * 力量源泉
     */
    OriOfPower = 19,
    VIP = 20 ,           //'V' VIP特权（单位：天）
    /**
     * 'coin' 数值型虚拟币，和Gold代表的大数型虚拟币不同
     */
    Coin = 21,
    /**
     * 英魂 转生后由魂石转化而来
     */
    StoneHero = 103,
    
    PetChipHead = 1000,     //"C" 用于升星的魔宠碎片
    PetHead = 1200,         //魔宠

    ActionHead = 1994,      //时效类技能

    FellowChipHead = 3000,  //PVE伙伴碎片
    FellowHead = 3100,      //PVE伙伴

    Road = 10000,    //"road"道路
    Role = 20000,    //"role" 角色
    Scene =30000,    //"scene" 场景
    Item = 40000,    //"I" 道具
    Box = 50000,     //"box" 礼包
}