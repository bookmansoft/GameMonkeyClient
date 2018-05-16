namespace SoldierManage{
	/**
	 * 战场状态机用到的状态枚举
	 * $note suspend并不是暂停。目前"暂停"是通过停止帧动画监听来实现的，而suspend意味着停止战斗、修改战场参数以便开始新的战斗，过关、攻击宝箱怪、进行PVP时，都必须先suspend、修改参数完毕后，再重新进入running
	 */
	export const FightStatusList = {
		ready: 'ready',			// 准备就绪
		running: 'running',		// 战斗进行中
		suspend: 'suspend',		// 停止战斗，准备切换
	}

	/**
	 * 和战斗相关的事件定义接口
	 */
	export interface IBattle extends StateMachine {
		start?: StateMachineEvent;		// 初始化战场，进入战斗流程
		stop?: StateMachineEvent;		// 暂停战斗、修改设定
		continue?: StateMachineEvent;	// 继续战斗
		// end?: StateMachineEvent;		// 结束战斗
	}

	/**
	 * 伤害来源分类
	 */
	export enum HurtSourceType {
		pet = 1,
		card = 2,
		role = 3,
	}

	/**
	 * 队伍创建类型
	 */
	export enum ArmyRunType{
		static = 0,		//静态创建
		dyncCreate = 1,	//动态调整
	}

	/**
	 * 角色动作
	 */
	export const RoleAttackAniGroupNames = {
		Attack1: "attack1",
		Attack2: "attack2",
		Attack3: "attack3",
		Attack4: "attack4",
		Attack5: "attack5",
		Attack6: "attack6",
		Attack7: "attack7",
		AttackCount: 7,
	}

	/**
	 * 战斗单元的状态
	 */
	export const SoldierStatusList = {
		ready: 'ready',			// 准备就绪
		move:  "move",			// 移动中
		hit: 'hit',				// 受击中
		death: 'death',			// 死亡
		running: 'running',		// 进行中
		suspend: 'suspend',		// 暂停
		stand: "stand",			// 站立
		attacking: 'attacking',	// 攻击中
	}

	/**
	 * 战斗单元五行属性
	 */
	export enum SoldierTrait{
		None = 0,	//普通
		Gold = 1,	//金
		Wood = 2,	//木
		Water = 3,	//水
		Fire = 4,	//火
		Earth = 5,	//土
	}

	/**
	 * 战斗单元的类型
	 */
	export enum SoldierType{
		hero = 0,       //英雄/主角
		pet = 1,        //宠物
		ghost = 2,      //魔宠
		monster = 3,    //小怪
		boss = 4,       //Boss
	}
}