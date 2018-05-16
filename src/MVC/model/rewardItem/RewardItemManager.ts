/**
 * 奖励道具管理
 */
class RewardItemManager{
    /**
     * 初始化
     */
    public static Init(){
        RewardItemManager._rewardItemSet = [];
        let data = ConfigStaticManager.getList(ConfigTypeName.Task);
        Object.keys(data).map(key => {
			RewardItemManager._rewardItemSet[data["id"]] = data[key];
        })
        
    }

    /**
     * 获得所有奖励道具类型列表
     */
    public static get RewardItemSet(): Object[]{
        return RewardItemManager._rewardItemSet;
    }

    /**
     * 通过ID获得奖励的所有数据
     * @param id    任务ID
     */
    public static GetRewardItemByID(id: number): Object{
        return this._rewardItemSet[id];
    }

	/**
     * 通过ID获得奖励的所有数据
     * @param id    任务ID
     */
    public static GetRewardItemNameByID(id: number): Object{
		return this._rewardItemSet[id]["rewardType"];
    }

    // 变量
    private static _rewardItemSet : Object[];
}