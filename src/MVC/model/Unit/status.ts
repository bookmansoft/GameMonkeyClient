enum em_EffectCalcType {
    em_EffectCalc_Multiplication = 0, //乘法，表示加持时，效果是按照百分比叠加的
    em_EffectCalc_Addition = 1,       //加法，标识加持时，效果是按照绝对值叠加的
    em_EffectCalc_Subduction = 2,     //减法，可以使用加法+负数实现
    em_EffectCalc_Division = 3,       //除法，可以使用乘法+小数实现
};

const effectEnum = {
  /**
   * 空
   */
  None: 0,
  /**
   * 圣光加护效果提升
   */
  PotentialEffect: 1,
  /**
   * 新增20161211：增加技能4效果
   */
  Skill4_Enhance: 2,
  /**
   * Boss携带魂石数量提升
   */
  StoneGetNum: 3,
  /**
   * 宝箱怪金币掉落数量上升
   */
  BoxMoney: 4,
  /**
   * 金币产出加成
   * 注 - 关于金币 ：在计数冲关状态下，金币可以在推进关卡进度时获取，也可以在通关时获取通关奖励。在无计数冲关状态下就只有离线收益。
   */
  MoneyOutput: 5,
  /**
   * 金币消耗下降
   */
  MoneyConsumeDiscount: 6,
  /**
   * 新增20161211：增加技能1时间
   */
  Skill1_Timer: 7,
  /**
   * 转生后初始金币增加
   */
  RevivalStartMoney: 8,
  /**
   * 转生后起始关卡增加
   */
  RevivalStartPoint: 9,
  /**
   * 减少技能6的CD
   */
  Skill6_Rcd: 10,
  /**
   * 减少技能5的CD
   */
  Skill5_Rcd: 11,
  /**
   * 减少技能1的CD
   */
  Skill1_Rcd: 12,
  /**
   * 宝箱怪出现几率
   */
  BoxRate: 13,
  Skill6_Timer: 14,
  Skill2_Timer: 15,
  /**
   * 点击暴强
   */
  DoubleAttackValue: 16,
  /**
   * 英雄之魂加成效果
   */
  StoneEffect: 17,
  Skill3_Timer: 18,
  /**
   * 十倍金币概率提升
   */
  TenMultiMoney: 19,
  /**
   * PVE攻击力转为点击攻击力
   */
  ConvertPveToClick: 20,
  Skill4_Rcd: 21,
  Skill4_Timer: 22,
  /**
   * Boss携带魂石概率提升
   */
  StoneGetRate: 23,
  Skill5_Timer: 24,
  /**
   * 点击暴击概率
   */
  DoubleAttackRate: 25,
  Skill2_Rcd: 26,
  /**
   * Boss血量下降
   */
  ReduceBossBlood: 27,
  /**
   * 减少普通关卡怪物数量
   */
  ReduceMonsterNum: 28,
  Skill3_Rcd: 29,
  /**
   * 自动攻击次数
   */
  AutoAttack: 30,
  /**
   * 通用PVE战力加成（例如：所有宝物攻击增加）
   */
  Attack: 31,
  /**
   * 每次攻击都掉钱
   */
  GetMoneyPerHit: 32,
  /**
   * 点击攻击力加成
   */
  AttackForClick: 33,
  /**
   * PVE攻击速度（英雄攻击速度）
   */
  HeroAttackSpeed: 34,
  /**
   * 对金属性的Boss攻击加成
   */
  AttackToGold: 38,
  /**
   * 对各类属性的Boss攻击加成
   */
  AttackToAll: 39,
  /**
   * 对风属性Boss攻击加成
   */
  AttackToWater: 40,
  AttackToWood: 41,
  /**
   * 对火属性Boss攻击加成
   */
  AttackToFire: 42,
  /**
   * 对土属性Boss攻击加成
   */
  AttackToEarth: 43,
  AttackAndClick: 44,
  /**
   * 25关开始，每逢20关时，通关奖励中获得额外的金币
   */
  MoneyOutput20: 45,
  /**
   * 主动技能冷却时间减少
   */
  SkillCooldownTime: 46,
  /**
   * 80关开始，每逢20关时，通关奖励中获得额外的魂石
   */
  StoneOutput20: 47,
  /**
   * 离线收益提升
   */
  OfflineBonus: 48,
  /**
   * 和转生次数正相关的PVE攻击力、点击攻击力加成
   */
  AttackForPveRevival: 49,
  /**
   * 降低法宝升级消耗
   */
  EquUpgradeCost: 50,
  /**
   * 95关开始，每逢20关时，通关奖励中获得额外的圣光，但只能领取一次
   */
  PotentialOutput20: 51,
  /**
   * 祭坛产量
   */
  AltarOutput: 52,

  /**
   * 额外君主经验加成
   */
  Exp_Added: 101,
  /**
   * 体力恢复速度提升
   */
  RecoverAction: 102,
  /**
   * 自身PVE战力加成，只用于法宝战力内部计算
   */
  selfPower: 103,
  /**
   * 特定卡牌的PVP攻击力加成（原卡牌攻击力），只能用缘分效果管理器检测计算
   * 可以为卡牌设定多个缘分卡牌，从而定向增加这些卡牌的攻击力
   */
  AttackForPvpRelated: 104,
  /**
   * 卡牌的PVP攻击力加成（不受限于缘分卡牌）
   */
  AttackForPvp: 105,
  /**
   * 宠物碎片掉落数量增加
   */
  PetChipDropNum: 231,
  /**
   * 特定宠物碎片掉落数量增加， 只能用缘分效果管理器进行检测计算
   */
  PetChipDropNumRelated: 232,
  /**
   * 主动技能生效时长增加
   */
  SkillContinueTime: 315,

  /**
   * 祭坛金产量
   */
  AltarGoldOutput: 212,
  /**
   * 祭坛银产量
   */
  AltarSilverOutput: 213,
  /**
   * 祭坛石产量
   */
  AltarStoneOutput: 214,
  /**
   * 祭坛金产量 绝对值
   */
  AltarGoldOutputNum: 215,
  /**
   * 祭坛银产量 绝对值
   */
  AltarSilverOutputNum: 216,
  /**
   * 祭坛石产量 绝对值
   */
  AltarStoneOutputNum: 217,
};

const effectConfig = {
  1:{'name': '圣光加护效果提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  2:{'name': '增加技能4效果', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  3:{'name': 'Boss携带魂石数量提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  4:{'name': '宝箱怪金币掉落数量上升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  5:{'name': '金币产出加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  6:{'name': '金币消耗下降', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  7:{'name': '增加技能1时间', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  8:{'name': '转生后初始金币增加', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  9:{'name': '转生后起始关卡增加', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  10:{'name': '减少技能6的CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  11:{'name': '减少技能5的CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  12:{'name': '减少技能1的CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  13:{'name': '宝箱怪出现几率', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  14:{'name': '延长技能6时长', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  15:{'name': '降低技能6CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  16:{'name': '点击暴强', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  17:{'name': '英雄之魂加成效果', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  18:{'name': '延长技能3时长', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  19:{'name': '十倍金币概率提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  20:{'name': 'PVE攻击力转为点击攻击力', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  21:{'name': '降低技能4CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  22:{'name': '延长技能4时长', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  23:{'name': 'Boss携带魂石概率提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  24:{'name': '延长技能5时长', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  25:{'name': '点击暴击概率', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  26:{'name': '降低技能2CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  27:{'name': 'Boss血量下降', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  28:{'name': '减少普通关卡怪物数量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  29:{'name': '降低技能3CD', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  30:{'name': '自动攻击次数', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  31:{'name': '通用PVE战力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  32:{'name': '每次攻击都掉钱', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  33:{'name': '点击攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  34:{'name': 'PVE攻击速度', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  39:{'name': '对各类属性的Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  40:{'name': '对风属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  41:{'name': '对木属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  42:{'name': '对火属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  43:{'name': '对土属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  44:{'name': '提升攻击力和点击攻击力', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  45:{'name': '通关奖励中获得额外的金币', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  46:{'name': '主动技能冷却时间减少', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  47:{'name': '通关奖励中获得额外的魂石', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  48:{'name': '离线收益提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  49:{'name': '转生次数正相关的PVE攻击力、点击攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  50:{'name': '降低法宝升级消耗', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  51:{'name': '通关奖励中获得额外的圣光', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  52:{'name': '祭坛产量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  101:{'name': '自动攻击', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  102:{'name': '对水属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  103:{'name': '对风属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  104:{'name': '对火属性Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  105:{'name': '对Boss攻击加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  106:{'name': '点击攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  107:{'name': '特定卡牌的PVP攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  108:{'name': '卡牌的PVP攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  110:{'name': 'Boss血量下降', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  111:{'name': '转生后PVE攻击力加成额外君主经验加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  112:{'name': '转生后点击攻击力加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  113:{'name': '英雄攻击速度', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  201:{'name': '金币产出加成', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  202:{'name': '逢20关通关奖额外金币', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  203:{'name': '金币消耗下降', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  204:{'name': '升级法宝的金币消耗下降', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  211:{'name': '逢20关通关奖励额外魂石', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  212:{'name': '祭坛金产量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  213:{'name': '祭坛银产量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  214:{'name': '祭坛石产量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  215:{'name': '祭坛金产量 绝对值', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  216:{'name': '祭坛银产量 绝对值', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  217:{'name': '祭坛石产量 绝对值', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  221:{'name': '逢20关通关奖励额外圣光', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  231:{'name': '宠物碎片掉落数量增加', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  232:{'name': '特定宠物碎片掉落数量增加', 'calc': em_EffectCalcType.em_EffectCalc_Addition},
  301:{'name': '圣光加护效果提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  302:{'name': '宝箱金币掉落数量上升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  303:{'name': '转生后起始关卡增加', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  304:{'name': 'PVE攻击力转为点击攻击力', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  305:{'name': '十倍金币概率提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  306:{'name': '减少普通关卡怪物数量', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  307:{'name': '点击暴击概率', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  308:{'name': '英雄之魂加成效果', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  309:{'name': '点击暴强', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  310:{'name': 'Boss携带魂石概率提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  311:{'name': '转生后初始金币增加', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  312:{'name': '宝箱怪出现几率', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  313:{'name': 'Boss携带魂石数量提升', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  314:{'name': '主动技能冷却时间减少', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
  315:{'name': '主动技能生效时长增加', 'calc': em_EffectCalcType.em_EffectCalc_Multiplication},
};

/**
 * 单个Reducer可以携带多个数据分量，可以订阅多个Action修改不同分量，每个订阅必须返回完整的state
 */
const r_status = FacadeApp.cr({
    money:{},
    diamond:0,
    power:{},
    powerClick:{},
    offline:{},
    stone:0,
    stoneHero:0,
    status:0,
    action:0,
    totem:0,
    freePoint:0,//免费洗点次数
    effects: [],
    execute: {},   //受限行为最大
    guideId: 0,         
    /**
     * 测试内丹是否足够
     */
    TestInternaldan: function(internaldan: number, isShowTip: boolean = false): boolean{
        if (this.stoneHero > internaldan)
            return true;

        if (isShowTip){
            UIPage.inst(UIPage).ShowPrompt().ShowWindow("内丹不足！");
        }
        return false;
    },

    /**
     * 测试金钱是否足够,money 所需金钱，isShowTip 是否显示提示
     */
    TestMoney: function(money: Digit, isShowTip: boolean = false): boolean{

        let curMoney = Digit.fromObject(this.money);
        if(curMoney.Larger(money) || curMoney.Equal(money))
            return true;

        if (isShowTip){
            UIPage.inst(UIPage).ShowPrompt().ShowWindow("金钱不足！");
        }
        return false;
    },
    
    /**
     * 测试修为是否足够
     */
    TestCultivation: function(cultivation: number, isShowTip: boolean = false): boolean{
        if (this.stone > cultivation) 
            return true;
            
        if (isShowTip){
            UIPage.inst(UIPage).ShowPrompt().ShowWindow("修为不足！");
        }
        return false;
    },

    /**
     * 计算原始数值经效果加成后的结果
     */
    Calc: function($_effect, $oriValue): number{
        if (!this.effects[$_effect]) {
            return $oriValue;
        }   
        switch (effectConfig[$_effect].calc) {
            case em_EffectCalcType.em_EffectCalc_Multiplication:
                return $oriValue * (1 + this.effects[$_effect].value);
            case em_EffectCalcType.em_EffectCalc_Addition:
                return $oriValue + this.effects[$_effect].value;
            case em_EffectCalcType.em_EffectCalc_Subduction:
                return $oriValue - this.effects[$_effect].value;
            case em_EffectCalcType.em_EffectCalc_Division:
                return (1 - this.effects[$_effect].value) * $oriValue;
        }
        return $oriValue;
    },
},{
    [CommandList.M_DAT_Amulet](state, {data}){
        state.power = data['power'];
        state.powerClick = data['powerClick'];
        return state;
    },
    [CommandList.M_AT_SyncCheckpoint](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.offline = data['mOffline'];
        } 
        return state;
    },
    [CommandList.M_AT_STATUSLIST](state, {data}){
        if (typeof data != 'undefined' && data != null) {
            state.money = data['money'];
            state.diamond = data['diamond'];
            state.power = data['power'];
            state.powerClick = data['powerClick'];
            state.offline = data['offline'];
            state.stone = data['stone'];
            state.stoneHero = data['stoneHero'];
            state.status = data['status'];
            state.action = data['action'];
            state.totem = data['totem'];
            state.effects = data['effects'];
            state.guideId = data[`newGuide`];
        } 
        return state;
    },
    [CommandList.M_DAT_TalismanList](state, {data}){
        if(data && data.totem){
            state.totem = data.totem;
            state.freePoint = data.freePoint;
        }
        return state;
    },
    [CommandList.M_AT_STATUS_Power](state, {data}){
        state.power = data;
        return state;
    },
    [CommandList.M_DAT_Status_PowerClick](state, {data}){
        state.powerClick  = data;
        return state;
    },
    [CommandList.M_DAT_Change_Money](state, {data}){
        state.money = data;
        return state;
    },
    [CommandList.M_AT_CHANGE_OFFLINE](state, {data}){
        state.offline = data;
        return state;
    },
    [CommandList.M_AT_EFFECTS](state, {data}){
        state.effects = data;
        return state;
    },
    [CommandList.M_AT_ACTIONEXECUTE](state, {data}){
        state.execute = data;
        return state;
    },
    [CommandList.M_AT_GUIDE](state, {data}){
        state.guideId = data['newGuide'];
        return state;
    },
});
