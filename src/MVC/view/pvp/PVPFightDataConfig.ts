namespace PVPManager{
	let OperationTypeInc = 0, OperationTypeEnd = 1000;
	/**
	 * 输出指令类型
	 */
	export const OperationType = {
		/**
		 * 战斗开始0
		 */
		Start: OperationTypeInc++,
		/**
		 * 角色入场1
		 */
		Enter: OperationTypeInc++,
		/**
		 * 死亡2
		 */
		Dead: OperationTypeInc++,
		/**
		 * 复活3
		 */
		Alive: OperationTypeInc++,
		/**
		 * 发动技能4, 状态统一为：0准备、1攻击、2中断、3复原
		 */
		Skill: OperationTypeInc++,
		/**
		 * Buff发生变化5
		 */
		BuffChanged: OperationTypeInc++,
		/**
		 * 攻击、生命、士气发生变化时发送6
		 */
		AttrChanged: OperationTypeInc++,
		/**
		 * 收到事件7
		 */
		Notify: OperationTypeInc++,
		/**
		 * 连击数增加8
		 */
		Combo: OperationTypeInc++,
		/**
		 * 连击成熟9
		 */
		ComboReady: OperationTypeInc++,
		/**
		 * 新增效果10
		 */
		Effect: OperationTypeInc++,
		/**
		 * 阵亡英雄退场11
		 */
		Disappear: OperationTypeInc++,
		/**
		 * 战斗结束12
		 */
		End: OperationTypeEnd,
	}

	let $AttrChangedType = 0;
	/**
	 * 引发属性变化的原因
	 */
	export const AttrChangedType = {
		/**
		 * 闪避 0
		 */
		Miss: $AttrChangedType++,
		/**
		 * 格挡 1
		 */
		Parry: $AttrChangedType++,
		/**
		 * 暴击 2
		 */
		Bang: $AttrChangedType++,
		/**
		 * 普通攻击 3
		 */
		Damage: $AttrChangedType++,
		/**
		 * 反弹伤害 4
		 */
		Reflect: $AttrChangedType++,
		/**
		 * 鼓舞 5
		 */
		Encourage: $AttrChangedType++,
		/**
		 * 恢复 6
		 */
		Recover: $AttrChangedType++,
		/**
		 * 沮丧 7
		 */
		Depression: $AttrChangedType++,
		/**
		 * 吸收 8
		 */
		Absorb: $AttrChangedType++,
		/**
		 * 施放EX技能 9
		 */
		EXSkill:$AttrChangedType++,
		/**
		 * 自残 10
		 */
		SelfHurt: $AttrChangedType++,
		/**
		 * 中毒 11
		 */
		Poisoned:  $AttrChangedType++,
		/**
		 * 燃烧 12
		 */
		Fire:  $AttrChangedType++,
		/**
		 * 枚举值总数
		 */
		Length: $AttrChangedType++,

		/**
		 * 受击资源
		 * @param {Number} $ai BattleBuffEnum
		 */
		ShouJiRes: function($ai) {
			switch ($ai){
				case RoleAttackAniGroupNames.WuKong_SanMeiZhenHuo:
				case RoleAttackAniGroupNames.CommAttack_LiuXingHuo:
					return {"isCreat":true , "type":"dra", "res":"pvp_sanmei_di", "aniName":"pvp_sanmei_di", "desc":"火焰爆破效果", parX:0, parY:0, zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_HuiFu:
					return {"isCreat":true , "type":"dra", "res":"buff_blood", "aniName":"buff_before", "desc":"恢复效果", parX:0, parY:-50,zhenping:false};
				case RoleAttackAniGroupNames.ZJB_NormalAttack1:
					return {"isCreat":true , "type":"ima", "res":"pvp-hit_png", "aniName":null, "desc":"紫金钵攻击的受击效果", parX:0, parY:-50,zhenping:false};
				case RoleAttackAniGroupNames.CommAttack_DaDuan:
					return {"isCreat":true , "type":"mov", "res":"effect_lightningrods", "aniName":"effect_lightningrods", "desc":"打断技能", parX:0, parY:0,zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_JinChang:
					return {"isCreat":true , "type":"mov", "res":"effect_call", "aniName":"effect_call", "desc":"进场特效", parX:0, parY:0,zhenping:false};
				case RoleAttackAniGroupNames.WuKong_NormalAttack1:
				case RoleAttackAniGroupNames.WuKong_NormalAttack2:
				case RoleAttackAniGroupNames.WuKong_NormalAttack3:
					return {"isCreat":true , "type":"mov", "res":"effect_gethit", "aniName":"effect_gethit", "desc":"悟空普攻", parX:0, parY:0,"zhenping":true};
				case RoleAttackAniGroupNames.CommAttack_LeiTing:
					return {"isCreat":true , "type":"mov", "res":"effect_gethit", "aniName":"effect_gethit", "desc":"雷霆一击", parX:0, parY:0,"zhenping":true};
				case RoleAttackAniGroupNames.CommAttack_ShaBao:
					return {"isCreat":true , "type":"mov", "res":"effect_gethit", "aniName":"effect_gethit", "desc":"沙暴", parX:0, parY:0,"zhenping":true};
				case RoleAttackAniGroupNames.WuKong_BaJiaoShan:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"芭蕉扇，多次攻击", parX:0, parY:0,zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_zijinling:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"紫金玲", parX:0, parY:0,zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_yinyangerqiping:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"阴阳二气瓶", parX:0, parY:0,zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_jinnao:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"金铙", parX:0, parY:0,zhenping:true};
					case RoleAttackAniGroupNames.CommAttack_zijinhonghulu:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"紫金红葫芦", parX:0, parY:0,zhenping:true};
				case RoleAttackAniGroupNames.CommAttack_renzhongdai:
					return {"isCreat":false , "type":"mov", "res":"effect_manyhit", "aniName":"effect_manyhit", "desc":"人种袋", parX:0, parY:0,zhenping:true};
			}
			return {"isCreat":false, "type":null, "res":null, "aniName":null, "desc":null, parX:0, parY:0,zhenping:false};
		}
	}

	/**
	 * 战斗状态,BUFF
	 */
	export const BattleBuffEnum = {
		None: 1 << 0,
		/**
		 * 陷入混乱状态 4
		 */
		Confused: 1 << 2,
		/**
		 * 陷入晕眩状态 8
		 */
		Dazed: 1 << 3,
		/**
		 * 陷入中毒状态 16
		 */
		Poisoned: 1 << 4,
		/**
		 * 禁止使用技能 32
		 */
		UnabledAction: 1 << 5,
		/**
		 * 咆哮 64
		 */
		PaoXiao: 1 << 6,
		/**
		 * 神佑 免除负面影响 128
		 */
		Bless: 1 << 7,
		/**
		 * 石头皮肤 此状态下，单次被击受伤不超过50点 256
		 */
		Stone: 1 << 8,
		/**
		 * 激昂，满血时3倍伤害 512
		 */
		JiAng: 1 << 9,
		/**
		 * 濒死 1024
		 */
		BeDead: 1 << 10,
		/**
		 * 减免风属性伤害 2048
		 */
		DingHai: 1 << 11,
		/**
		 * 幻象标志 4096
		 */
		Illusion: 1 << 12,
		/**
		 * 死亡标志：阵亡但尚未离场时的状态 8192
		 */
		Dead: 1 << 13,
		/**
		 * 持续燃烧 16384
		 */
		Fire: 1 << 14,
		/**
		 * 风怒 32768
		 */
		WindFury: 1 << 15,
		/**
		 * 恢复 65536
		 */
		HuiFu: 1 << 16,
		/**
		 * 冰封 131072
		 */
		BingFeng: 1 << 17,

		/**
		 * Buff资源
		 * @param {Number} $ai BattleBuffEnum
		 */
		BuffRes: function($ai,roleId) {
			let roleData = ArmyRoleResNameSet[roleId.toString()];
			if(roleData == null) roleData = ArmyRoleResNameSet[0];
			switch ($ai){
				case BattleBuffEnum.Confused:
					return {"res":"buff_hunluan","desc":"混乱", parX:0, parY:-roleData.Height - 70,};
				case BattleBuffEnum.Dazed:
					return {"res":"buff_yunxuan","desc":"晕眩", parX:0, parY:-roleData.Height - 30,};
				case BattleBuffEnum.Poisoned:
					return {"res":"buff_zhongdu","desc":"中毒", parX:0, parY:0,};
				case BattleBuffEnum.UnabledAction:
					return {"res":"buff_jingu","desc":"禁锢", parX:0, parY:0,};
				case BattleBuffEnum.PaoXiao:
					return {"res":"buff_chaofeng","desc":"咆哮", parX:50, parY:30,};// 嘲讽
				case BattleBuffEnum.Stone:
					return {"res":"buff_jianshou","desc":"坚守", parX:40, parY:-20,};//坚守
				case BattleBuffEnum.Bless:
					return {"res":"buff_shengguang","desc":"圣光", parX:0, parY:0,};//神佑，圣光
				case BattleBuffEnum.JiAng:
					return {"res":"buff_kuangbao","desc":"激昂", parX:0, parY:-70,};// 狂暴
				case BattleBuffEnum.BeDead:
					return {"res":"buff_binsi","desc":"濒死", parX:0, parY:-roleData.Height - 30,};
				case BattleBuffEnum.Dead:
					return {"res":"buff_die","desc":"死亡", parX:0, parY:0,};
				case BattleBuffEnum.Fire:
					return {"res":"buff_ranshao","desc":"燃烧", parX:0, parY:0,};
				case BattleBuffEnum.BingFeng:
					return {"res":"buff_bingfeng","desc":"冰封", parX:0, parY:0,};
				case BattleBuffEnum.HuiFu:
					return {"res":"buff_blood","desc":"恢复", parX:0, parY:-50,};
			}
			console.log("BattleBuffEnum.BingFeng:  ",BattleBuffEnum.BingFeng);
			return {"res":"buff_binsi","desc":"其他", parX:0, parY:0,};
		}
	}

	/**
	 * 攻击类型
	 */
	export const SkillType = {     // 技能类型枚举
		/**
		 * 反击，格挡后几率触发反击原攻击者 1
		 */
		Counter: 1,         // 反击，格挡后几率触发反击原攻击者
		/**
		 * 普通攻击 2
		 */
		Attack: 2,          // 普通攻击
		/**
		 * 恢复，恢复友军生命 3
		 */
		Recover: 3,         // 恢复，恢复友军生命
		/**
		 * 鼓舞，增加友军士气 4
		 */
		Encourage: 4,       // 鼓舞，增加友军士气
		/**
		 * 伤害时附加混乱效果 6
		 */
		Confuse: 6,         // 伤害时附加混乱效果
		/**
		 * 混乱状态下发动的攻击 7
		 */
		ConfuseAttack: 7,   // 混乱状态下发动的攻击
		/**
		 * 伤害时附加中毒 8
		 */
		Poison: 8,          // 伤害时附加中毒
		/**
		 * 伤害时附加晕眩 9
		 */
		Daze: 9,            // 伤害时附加晕眩
		/**
		 * 伤害时附加沮丧 10
		 */
		Depression: 10,     // 伤害时附加沮丧
		/**
		 * 禁止使用技能 11
		 */
		UnableAction: 11,   // 禁止使用技能
		/**
		 * 咆哮，强制敌方攻击自己 12
		 */
		PaoXiao: 12,        // 咆哮，强制敌方攻击自己
		/**
		 * 尖刺，反弹30%伤害 13
		 */
		JianCi: 13,         // 尖刺，反弹30%伤害
		/**
		 * 神佑 14
		 */
		Bless: 14,          // 神佑 免除负面影响


		Blood: 15,          // 血爆，死亡时对全体敌人造成伤害
		Alive: 16,          // 重生
		Stone: 17,          // 石头皮肤 每次最多承受50点伤害
		Illusion: 18,       // 幻象 在随机空位生成自身复制品
		XueZhou: 19,        // 血咒 秒杀被攻击者
		BloodRecover: 20,   // 嗜血
		GodBless: 21,       // 祈福

		YongWu: 30,         // 勇武，对敌人造成伤害时，攻击上升15%
		BuQu: 31,           // 不屈，受到伤害攻击上升20%

		/**
		 * 激昂 32
		 */
		JiAng: 32,          // 激昂

		XianJi: 34,         // 献祭
		QuSan: 35,          // 驱散
		LiZhi: 37,          // 励志
		DongCha: 38,        // 洞察

		/**
		 * 芭蕉扇 39
		 */
		BaJiao: 39,         //芭蕉扇(风属性攻击)
		/**
		 * 定海神针（风属性防御） 40
		 */
		DingHai: 40,        //定海神针（风属性防御）
		AntiWind:41,        //避风珠
		BeDead:42,          //求生
		IncreaseAttack:43,  //提升攻击力
		IncreaseAttackAll:44,  //提升全体攻击力
		/**
		 * 三昧真火 45
		 */
		RealFire:45,        //三昧真火
		AntiFire:46,        //避火珠
		RealWater:47,       //三昧真水
		AntiWater:48,       //避水珠
		Unity:49,           //团结 号召所有队友帮助分担伤害
		DecreaseFee:50,     //降低法术费用
		DecreaseFeeAll:51,  //降低全局法术费用
		Enchant:52,         //魅惑
		AttachBaJiao:53,    //亡语：附加芭蕉扇技能
		Study:54,           //偷师
		/**
		 * 顿悟 55
		 */
		Insight:55,         //顿悟
		IncAtkOnRecovered:56,//回复体力时提升攻击力
		/**
		 * comboo 57
		 */
		Comboo:57,
		/**
		 * 死亡冲刺 58
		 */
		DieGoGo:58,
		/**
		 * 流星火 59
		 */
		LiuXingHuo: 59,
		/**
		 * 雷霆一击 60
		 */
		LeiTing:60,
		/**
		 * 沙暴 61
		 */
		ShaBao:61,
		/**
		 * 紫金玲
		 */
		ZiJinLing:75,
		/**
		 * 阴阳二气瓶
		 */
		YingYang:76,
		/**
		 * 金铙
		 */
		JinNao:77,
		/**
		 * 紫金红葫芦
		 */
		Zijinhonghulu:79,
		/**
		 * 幌金绳
		 */
		HuangJinShen:80,
		/**
		 * 人种袋
		 */
		RenZhongdai:81,
		/**
		 * 杨柳净瓶
		 */
		YangLiuJingPing:82,
		/**
		 * 宝莲灯
		 */
		BaoLianDeng:83,
		/**
		 * 锦斓袈裟
		 */
		JinLangJiaSha:84,
		/**
		 * 五彩霞衣
		 */
		WuCaiXiaYi:85,
		/**
		 * 般若波罗蜜
		 */
		BoLeBoLuoMi:86,
		
		/**
		 * 召唤 
		 */
		Summon1:101,         // 召唤悟空
		Summon2:102,         // 召唤桃子
		Summon3:103,         // 召唤蟹将
		Summon4:104,         // 召唤童女
		Summon5:105,         // 召唤黑熊精
		Summon6:106,         // 召唤白骨精
		Summon7:107,         // 召唤奔波儿灞
		Summon8:108,         // 召唤哪吒
		Summon9:109,         // 召唤紫金钵
		Summon10:110,        // 召唤唐僧
		Summon14:204,        // 亡语:召唤铁扇公主

		/**
		 * 检测是否是召唤
		 * @param {Number} $ai skilltype
		 */
		isZhaoHuanSkill: function($ai) {
			switch (parseInt($ai)){
				case SkillType.Summon1:
				case SkillType.Summon2:
				case SkillType.Summon3:
				case SkillType.Summon4:
				case SkillType.Summon5:
				case SkillType.Summon6:
				case SkillType.Summon7:
				case SkillType.Summon8:
				case SkillType.Summon9:
				case SkillType.Summon10:
				case SkillType.Summon14:
					return true;
			}
			return false;
		},

		/**
		 * 获取技能名称
		 * @param {Number} typeNum skilltype
		 */
		getSkillName: function(typeNum,roleId){
			switch (parseInt(typeNum)){
				// 召唤
				case SkillType.Summon1: case SkillType.Summon2: case SkillType.Summon3: case SkillType.Summon4: case SkillType.Summon5: 
				case SkillType.Summon6: case SkillType.Summon7: case SkillType.Summon8: case SkillType.Summon9: case SkillType.Summon10: case SkillType.Summon14:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_ZhaoHuan];
				// 普攻
				case SkillType.Attack:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_NormalAttack1,RoleAttackAniGroupNames.WuKong_NormalAttack2,RoleAttackAniGroupNames.WuKong_NormalAttack3];
					else if(roleId == AllRoleId.baiguj || roleId == AllRoleId.other) return [RoleAttackAniGroupNames.BGJ_NormalAttack1];
					else return [RoleAttackAniGroupNames.ZJB_NormalAttack1];
				// 芭蕉扇
				case SkillType.BaJiao:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_BaJiaoShan];
				// 定海神针
				case SkillType.DingHai:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_JinGangChu];
				// buff技能
				case SkillType.Encourage:
				case SkillType.Insight:
				case SkillType.PaoXiao:
				case SkillType.Bless:
				case SkillType.JiAng:
				case SkillType.Stone:
					return [RoleAttackAniGroupNames.CommAttack_BuffAttack];
				// 恢复
				case SkillType.Recover:
					return [RoleAttackAniGroupNames.CommAttack_HuiFu];
				// 三昧真火
				case SkillType.RealFire:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_SanMeiZhenHuo];
				// comboo
				case SkillType.Comboo:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_Comboo];
				// 死亡冲刺
				case SkillType.DieGoGo:
					if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_QianChong];
				// 流星火
				case SkillType.LiuXingHuo:
					return [RoleAttackAniGroupNames.CommAttack_LiuXingHuo];
				// 禁锢
				// case SkillType.UnableAction:
				// 	return [RoleAttackAniGroupNames.CommAttack_JinGu];
				// 雷霆一击
				case SkillType.LeiTing:
					return [RoleAttackAniGroupNames.CommAttack_LeiTing];
				// 沙暴
				case SkillType.ShaBao:
					return [RoleAttackAniGroupNames.CommAttack_ShaBao];
				case SkillType.YingYang://阴阳二气瓶
					return [RoleAttackAniGroupNames.CommAttack_yinyangerqiping];
				case SkillType.ZiJinLing://紫金玲
					return [RoleAttackAniGroupNames.CommAttack_zijinling];
				case SkillType.RenZhongdai://人种袋
					return [RoleAttackAniGroupNames.CommAttack_renzhongdai];
				case SkillType.JinNao://金铙
					return [RoleAttackAniGroupNames.CommAttack_jinnao];
				case SkillType.Zijinhonghulu://紫金红葫芦
					return [RoleAttackAniGroupNames.CommAttack_zijinhonghulu];
				case SkillType.JinLangJiaSha://锦斓袈裟
					return [RoleAttackAniGroupNames.CommAttack_jinrangjiasha];
				case SkillType.WuCaiXiaYi://五彩霞衣
					return [RoleAttackAniGroupNames.CommAttack_wucaixiayi];
				case SkillType.HuangJinShen:// 幌金绳
					return [RoleAttackAniGroupNames.CommAttack_huangjinshen];
				case SkillType.BoLeBoLuoMi://菠萝菠萝蜜
					return [RoleAttackAniGroupNames.CommAttack_boreboluomi];
				case SkillType.YangLiuJingPing://杨柳净瓶
					return [RoleAttackAniGroupNames.CommAttack_yangliujingping];
				case SkillType.BaoLianDeng://宝莲灯
					return [RoleAttackAniGroupNames.CommAttack_baoliandeng];
			}

			// 没有设定的技能，选用通用技能或者普通攻击
			if(roleId == AllRoleId.wukong) return [RoleAttackAniGroupNames.WuKong_ZhaoHuan];
			else if(roleId == AllRoleId.baiguj || roleId == AllRoleId.other) return [RoleAttackAniGroupNames.BGJ_NormalAttack1];
			else return [RoleAttackAniGroupNames.ZJB_NormalAttack1];
		}
	}


	/**
	 * 角色动作
	 */
	export const RoleAttackAniGroupNames = {
		WuKong_NormalAttack1: "WuKong_NormalAttack1",// 悟空，普攻
		WuKong_NormalAttack2: "WuKong_NormalAttack2",// 悟空，普攻
		WuKong_NormalAttack3: "WuKong_NormalAttack3",// 悟空，普攻
		WuKong_BaJiaoShan: "WuKong_BaJiaoShan",// 悟空，芭蕉扇
		WuKong_JinGangChu: "WuKong_JinGangChu",// 悟空，金刚杵
		WuKong_SanMeiZhenHuo: "WuKong_SanMeiZhenHuo",// 悟空，三昧真火
		WuKong_QianChong: "WuKong_QianChong",// 悟空，冲刺
		WuKong_Comboo: "WuKong_Comboo",// 悟空，comboo
		WuKong_ZhaoHuan: "WuKong_ZhaoHuan",// 悟空。召唤
		BGJ_NormalAttack1: "BGJ_NormalAttack1",// 召唤兽，白骨精，普攻
		ZJB_NormalAttack1: "ZJB_NormalAttack1",// 召唤兽，紫金钵，普攻
		CommAttack_HuiFu: "CommAttack_HuiFu",// 通用技能-恢复
		CommAttack_BuffAttack: "CommAttack_BuffAttack",// 顿悟等 , 通用buff技能
		CommAttack_LiuXingHuo: "CommAttack_LiuXingHuo",// 流星火
		//CommAttack_JinGu: "CommAttack_JinGu",// 禁锢
		CommAttack_LeiTing: "CommAttack_LeiTing",// 雷霆一击
		CommAttack_ShaBao: "CommAttack_ShaBao",// 沙暴
		CommAttack_yinyangerqiping:"CommAttack_yinyangerqiping",//阴阳二气瓶
		CommAttack_zijinling: "CommAttack_zijinling",//紫金玲
		CommAttack_renzhongdai: "CommAttack_renzhongdai",//人种袋
		CommAttack_wucaixiayi:"CommAttack_wucaixiayi",//五彩霞衣
		CommAttack_huangjinshen:"CommAttack_huangjinshen",//幌金绳
		CommAttack_jinrangjiasha: "CommAttack_jinrangjiasha",//锦斓袈裟
		CommAttack_boreboluomi:"CommAttack_boreboluomi",//般若波罗蜜
		CommAttack_yangliujingping:"CommAttack_yangliujingping",//杨柳净瓶
		CommAttack_baoliandeng:"CommAttack_baoliandeng",//宝莲灯
		CommAttack_jinnao: "CommAttack_jinnao", //金铙
		CommAttack_zijinhonghulu: "CommAttack_zijinhonghulu", //紫金红葫芦
		CommAttack_DaDuan: "CommAttack_DaDuan",// 打断
		CommAttack_JinChang: "CommAttack_JinChang",// 进场
		AttackCount: 11,
		Common_NormalAttack1: "Common_NormalAttack1",//通用普通攻击1
		Common_NormalAttack2: "Common_NormalAttack2",//通用普通攻击2
		/**
		 * 几段攻击
		 * @param {Number} $ai fenduan
		 */
		getHitNum: function($ai) {
			switch ($ai){
				case RoleAttackAniGroupNames.WuKong_NormalAttack2: return 2;
				case RoleAttackAniGroupNames.WuKong_NormalAttack3: return 3;
				case RoleAttackAniGroupNames.WuKong_BaJiaoShan: return 2;
				case RoleAttackAniGroupNames.CommAttack_yinyangerqiping: return 2;
			}
			return 1;
		},

		/**
		 * 角色是否移动
		 */
		isMove: function($name,$status){
			switch($name){
				case RoleAttackAniGroupNames.Common_NormalAttack1:				
				case RoleAttackAniGroupNames.WuKong_NormalAttack1:
				case RoleAttackAniGroupNames.WuKong_NormalAttack2:
				case RoleAttackAniGroupNames.WuKong_NormalAttack3:
					if($status == SoldierStatusList.attackBefore) return true;
				case RoleAttackAniGroupNames.WuKong_QianChong:
					if($status == SoldierStatusList.attacking) return true;	
			}
			return false;
		},

		/**
		 * 检测是否是在敌方位置出现
		 * @param {Number} $ai skilltype
		 */
		isEmeryPosi: function($ai) {
			switch ($ai){
				case RoleAttackAniGroupNames.WuKong_Comboo:
				case RoleAttackAniGroupNames.CommAttack_LiuXingHuo:
				case RoleAttackAniGroupNames.CommAttack_LeiTing:
				case RoleAttackAniGroupNames.WuKong_NormalAttack1:
				case RoleAttackAniGroupNames.WuKong_NormalAttack2:
				case RoleAttackAniGroupNames.WuKong_NormalAttack3:
				case RoleAttackAniGroupNames.CommAttack_huangjinshen:
				case RoleAttackAniGroupNames.CommAttack_yangliujingping:
				case RoleAttackAniGroupNames.CommAttack_jinrangjiasha:
				case RoleAttackAniGroupNames.CommAttack_wucaixiayi:
					return true;
			}
			return false;
		},

		/**
		 * 技能移动位置
		 */
		skillMoveAni: function(name,status,index){
			switch(name){
				case RoleAttackAniGroupNames.WuKong_BaJiaoShan:
					if(status == SoldierStatusList.attacking) return {"isMove":true, "deviation":[0,0], "tweenType":SkillAniType.bajiaoshan, "speed":10, "isMulti": true, "isHit": false};
				case RoleAttackAniGroupNames.WuKong_Comboo:
					if(status == SoldierStatusList.attacking && index == 0) 
						return {"isMove":true, "deviation":[0,0], "tweenType":SkillAniType.wukongComboo, "speed":0.5, "isMulti": true, "isHit": false};
				case RoleAttackAniGroupNames.CommAttack_HuiFu:
					if(status == SoldierStatusList.attacking) return {"isMove":true, "deviation":[0,-30], "tweenType":SkillAniType.huifu, "speed":2, "isMulti": false, "isHit": true};
				case RoleAttackAniGroupNames.CommAttack_BuffAttack:
					if(status == SoldierStatusList.attacking) return {"isMove":true, "deviation":[0,-50], "tweenType":SkillAniType.dunwu, "speed":10, "isMulti": false, "isHit": false};
				case RoleAttackAniGroupNames.ZJB_NormalAttack1:
					if(status == SoldierStatusList.attacking) return {"isMove":true, "deviation":[0,0], "tweenType":SkillAniType.paodan, "speed":2, "isMulti": false, "isHit": true};
				case RoleAttackAniGroupNames.BGJ_NormalAttack1:
					if(status == SoldierStatusList.attacking) return {"isMove":true, "deviation":[25,-50], "tweenType":SkillAniType.normal, "speed":1, "isMulti": false, "isHit": true};
				// case RoleAttackAniGroupNames.WuKong_BaJiaoShan:
				// 	return {"isMove":true, "deviation":[0,0], "tweenType":null, "speed":10};
			}
			return {"isMove":false, "deviation":[0,0], "tweenType":null, "speed":0, "isMulti": false, "isHit": false};
		},
	}

	/**
	 * 各角色技能集合，前期测试用
	 */
	// export const SkillAttackSet: string[][] = [
	// 	null,
	// 	// [RoleAttackAniGroupNames.WuKong_NormalAttack1,RoleAttackAniGroupNames.WuKong_SanMeiZhenHuo],
	// 	[RoleAttackAniGroupNames.WuKong_NormalAttack1,RoleAttackAniGroupNames.WuKong_NormalAttack2,RoleAttackAniGroupNames.WuKong_NormalAttack3,
	// 	RoleAttackAniGroupNames.WuKong_BaJiaoShan,RoleAttackAniGroupNames.WuKong_SanMeiZhenHuo,RoleAttackAniGroupNames.WuKong_QianChong,RoleAttackAniGroupNames.WuKong_Comboo],// id1 悟空
	// 	[RoleAttackAniGroupNames.BGJ_NormalAttack1],// id2 白骨精
	// 	[RoleAttackAniGroupNames.ZJB_NormalAttack1],// id3 紫金钵
	// 	[RoleAttackAniGroupNames.BGJ_NormalAttack1],// id2 白骨精
	// ]

	/**
	 * 队伍中角色资源集合
	 */
	export const ArmyRoleResNameSet: Object = {
		"0":{"res":"pvp_baigujing","enterRes":"pvp_baigujing_png","Width":175.25,"Height":192.65,"scaleX":1,"scaleY":1,"desc":"其他","ansOffX":0,"ansOffY":100},
		"1":{"res":"pvp_wukong","enterRes":"pvp_baigujing_png","Width":125.9,"Height":164,"desc":"悟空","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":-29.04},
		"2":{"res":"pvp_taozi","enterRes":"pvp_taozi_png","Width":147.85,"Height":105.45,"desc":"桃子","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"3":{"res":"pvp_xiejiang","enterRes":"pvp_xiejiang_png","Width":147.85,"Height":105.45,"desc":"蟹将","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"4":{"res":"pvp_tongnv","enterRes":"pvp_tongnv_png","Width":147.85,"Height":105.45,"desc":"童女","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"5":{"res":"pvp_heixiongjing","enterRes":"pvp_heixiongjing_png","Width":147.85,"Height":105.45,"desc":"黑熊精","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"6":{"res":"pvp_baigujing","enterRes":"pvp_baigujing_png","Width":175.25,"Height":192.65,"desc":"白骨精","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":100},
		"7":{"res":"pvp_benboba","enterRes":"pvp_benboba_png","Width":147.85,"Height":105.45,"desc":"奔波儿灞","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"8":{"res":"pvp_nazha","enterRes":"pvp_nazha_png","Width":147.85,"Height":105.45,"desc":"哪吒","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"9":{"res":"pvp_zijinbo","enterRes":"pvp_zijinbo_png","Width":147.85,"Height":105.45,"desc":"紫金钵","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
		"10":{"res":"pvp_tangseng","enterRes":"pvp_tangseng_png","Width":147.85,"Height":105.45,"desc":"唐僧","scaleX":1,"scaleY":1,"ansOffX":0,"ansOffY":50},
	}

	/**
	 * 各个角色id
	 */
	export const AllRoleId = {
		other:0,
		wukong: 1,
		taozi:2,
		xiejiang:3,
		tongnv:4,
		heixiong:5,
		baiguj:6,
		benboba:7,
		ezha:8,
		zijinbo:9,
		tangseng:10,
		length:11,
	}

	/**
	 * 所有位置
	 */
	// export const ArmyOfPosiSet: Object = {
	// 	"1":{
	// 		"0":{"x":270,"y":260},
	// 		"1":{"x":270,"y":460},
	// 		"2":{"x":270,"y":660},
	// 		"3":{"x":180,"y":260},
	// 		"4":{"x":180,"y":460},
	// 		"5":{"x":180,"y":660},
	// 		"6":{"x":90,"y":260},
	// 		"7":{"x":90,"y":460},
	// 		"8":{"x":90,"y":660}
	// 	},
	// 	"2":{
	// 		"0":{"x":370,"y":260},
	// 		"1":{"x":370,"y":460},
	// 		"2":{"x":370,"y":660},
	// 		"3":{"x":460,"y":260},
	// 		"4":{"x":460,"y":460},
	// 		"5":{"x":460,"y":660},
	// 		"6":{"x":550,"y":260},
	// 		"7":{"x":550,"y":460},
	// 		"8":{"x":550,"y":660}
	// 	},
		
	// }

	/**
	 * 所有位置
	 */
	export const ArmyOfPosiSet: Object = {
		"1":{
			"0":{"x":102,"y":320},
			"1":{"x":102,"y":460},
			"2":{"x":102,"y":639},
			"3":{"x":223,"y":320},
			"4":{"x":223,"y":460},
			"5":{"x":223,"y":639},
			"6":{"x":223,"y":320},
			"7":{"x":223,"y":460},
			"8":{"x":223,"y":639},

		},
		"2":{
			"0":{"x":550,"y":320},
			"1":{"x":550,"y":460},
			"2":{"x":550,"y":639},
			"3":{"x":431,"y":320},
			"4":{"x":431,"y":460},
			"5":{"x":431,"y":639},
			"6":{"x":223,"y":320},
			"7":{"x":223,"y":460},
			"8":{"x":223,"y":639},

		},
	}

	/**
	 * 获取动画
	 */
	export const SkillAniType = {
		/**
		 * 普通
		 */
		normal:0,
		/**
		 * 炮弹攻击，紫金钵
		 */
		paodan:1,
		/**
		 * 恢复技能
		 */
		huifu:2,
		/**
		 * 顿悟技能
		 */
		dunwu:3,
		/**
		 * 龙卷风
		 */
		bajiaoshan:4,
		/**
		 * 悟空comboo
		 */
		wukongComboo:5,
	}
}