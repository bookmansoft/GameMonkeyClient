/**
 * 技能管理
 */
class SkillManager{
    /**
     * 技能初始化
     */
    public static Init(){
        SkillManager._InitTalismanSkill();
        SkillManager._InitACSkill();
        SkillManager._InitCardSkill();
        FacadeApp.fetchData([CommandList.M_NET_SkillNum, "&oper=1&aid=1&pm=1"], [data => {
            SkillManager.UpdateStatus(data["data"]["items"]);
            FacadeApp.dispatchAction(CommandList.M_AT_EFFECTS, data['data']['effects']);//更新效果列表
            if (data["code"] == FacadeApp.SuccessCode){
            }else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
        SkillManager._isInit = true;
    }

    /**
     * 更新技能的状态，可使用/冷却中
     */
     public static UpdateStatus(skillSetObject: Object[]){
        Object.keys(skillSetObject).map(index=>{
            let skillObject = skillSetObject[index];
            let id: number = skillObject["id"];
            if (id < 7){
                let status: number = skillObject["status"];
                let cd: number = skillObject["cd"];
                let skill: ActiveSkill = SkillManager.GetActiveSkillByID(id);
                skill.Status = status;
                switch (status) {
                    case SkillStatusType.CanUse:
                        skill.LastTime = 0;
                        break;
                    case SkillStatusType.Cooldown:
                    case SkillStatusType.Used:
                        skill.LastTime = cd - GameConfigOfRuntime.Time;
                        break;
                }
                FacadeApp.Notify(CommandList.M_CMD_SkillStatus, id);
            }
            
        });
    }

    /**
     * 初始化主动技能
     */
    private static _InitACSkill() {
        SkillManager._activeSkillSet = [];
        let data = ConfigStaticManager.getList(ConfigTypeName.ActiveSkill);
        Object.keys(data).map(key => {
            let acSkill: ActiveSkill = new ActiveSkill(data[key]);
            SkillManager._activeSkillSet.push(acSkill);
        })
    }

    /**
     * 初始化法宝技能
     */
    private static _InitTalismanSkill(){
        SkillManager._talismanSkillSet = [];
        let data = ConfigStaticManager.getList(ConfigTypeName.TalismanSkill);
        Object.keys(data).map(key => {
            let skill: TalismanSkill = new TalismanSkill(data[key]);
            SkillManager._talismanSkillSet.push(skill);
        })
    }

    /**
     * 初始化卡牌技能
     */
    private static _InitCardSkill(){
        SkillManager._cardSkillSet = [];
        let data = ConfigStaticManager.getList(ConfigTypeName.CardSkill);
        Object.keys(data).map(key => {
            let skill: CardSkill = new CardSkill(data[key]);
            SkillManager._cardSkillSet.push(skill);
        })
    }

    /**
     * 通过ID获取法宝技能
     */
    public static GetTalismanSkillByID(id: number): TalismanSkill{
        for (var i= 0; i < SkillManager._talismanSkillSet.length; i++){
            if (id == SkillManager._talismanSkillSet[i].ID){
                return SkillManager._talismanSkillSet[i];
            }
        }
        return null;
    }

    /**
     * 通过ID获取主动技能技能
     */
    public static GetActiveSkillByID(id: number): ActiveSkill{
        for (var i = 0; i < SkillManager._activeSkillSet.length; i++){
            if (id == SkillManager._activeSkillSet[i].ID){
                return SkillManager._activeSkillSet[i];
            }
        }
        return null;
    }

    /**
     * 通过ID获取卡牌技能技能
     */
    public static GetCardSkillByID(id: number): CardSkill{
        for (var i = 0; i < SkillManager._cardSkillSet.length; i++){
            if (id == SkillManager._cardSkillSet[i].ID){
                return SkillManager._cardSkillSet[i];
            }
        }
        return null;
    }

    /**
     * 获取主动技能
     */
    public static get ActiveSkill(): ActiveSkill[]{
        return SkillManager._activeSkillSet;
    }
    
    /**
     * 帧响应
     * @param frameTime     两次调用间隔时间
     */
    public static Process(frameTime: number) {
        if (!SkillManager._isInit){
            return;
        } 
        for (var i = 0; i < SkillManager._activeSkillSet.length; i++){
            SkillManager._activeSkillSet[i].Process(frameTime);
        }
    }


    // 变量
    private static _isInit: boolean = false;
    private static _activeSkillSet: ActiveSkill[];              // 主动技能集合
    private static _talismanSkillSet: TalismanSkill[];          // 法宝技能集合
    private static _cardSkillSet: CardSkill[];                  // 卡牌技能集合
}