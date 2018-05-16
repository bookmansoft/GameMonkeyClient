/**
 * 管理所有JSON配置文件
 */
class ConfigStaticManager{
    /**
     * 初始化
     */
    public static Init(){
        ConfigStaticManager.localStorage = {};

        //载入全部配置表
        Object.keys(ConfigTypeName).map(id => {
            ConfigStaticManager.LoadJSON(ConfigTypeName[id]); 
        });
    }
    /**
     * 获取指定配置表中指定ID的条目
     */
    public static getItem(cname:string, id: number): Object {
        return ConfigStaticManager.localStorage[cname][id];
    }

    /**
     * 获取指定配置表
     */
    public static getList(cname:string): Object {
        return ConfigStaticManager.localStorage[cname];
    }

    /**
     * 载入指定JSON文件
     */
    private static LoadJSON(cname: string){
        ConfigStaticManager.localStorage[cname] = null;

        var data = RES.getRes(cname);
        if (data == null){
            console.log("读取数据配置失败");
            return;
        }
        ConfigStaticManager.localStorage[cname] = data;
        Object.keys(data).map(key => {
            ConfigStaticManager.localStorage[cname][data[key]["id"]] = data[key];
        })
    }

	/**
	 * 每几关作为boss关
	 */
	public static bossLevel = 5;
	/**
	 * 打boss总时间
	 */
	public static bossTotalTime = 30;

    /**
     * 存储全部本地静态配置的数据结构
     */
    private static localStorage: {};             
}

/**
 * 配置文件命名列表
 * @note 注意文件后缀名要以"_"连接，取代原先的"."
 */
const ConfigTypeName  = {
    Talisman: 'talismancfg_json',           //  法宝配置表
    Task: 'dailyTaskcfg_json',              //  任务信息
    Shop: 'goodscfg_json',                  //  商店信息
    Amulet: 'amuletcfg_json',               //  符咒信息
    Card: 'cardcfg_json',                   //  卡牌配置表
    Boss: 'bosscfg_json',                   //  BOSS配置表
    RewardType: 'rewardTypecfg_json',       //  奖励类型
    Pet: 'petcfg_json',                     //  宠物配置
    Monster: "monstercfg_json",             //  怪物配置
    ActiveSkill: 'activeSkillscfg_json',    //  主动技能配置
    TalismanSkill: "talismanSkillscfg_json",//  法宝技能配置
    CardSkill: "cardSkill_json",            //  卡牌技能配置
    PetGenius: "petGeniuscfg_json",         //  宠物天赋配置
    PVPAni:"skillarmcfg_json",              //  PVP动画配置
    
}
