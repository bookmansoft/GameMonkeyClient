/**
 * 战斗模块 - 战士管理
 * 
 * @note 如果将父类和子类声明到不同的独立文件中，编译执行时容易引发类型定义错误，合并到同一个文件中错误消失，原因不明 2017.3.6
 */
namespace SoldierManage {
	/**
	 * 和战斗相关的事件定义接口
	 */
	interface ISoldier extends StateMachine {
		start?: StateMachineEvent;			// 初始化战场，进入战斗流程
		moveEvent?: StateMachineEvent;		// 开始行走
		attacked?: StateMachineEvent;		// 受击
		killed?: StateMachineEvent;			// 死亡
		stop?: StateMachineEvent;			// 暂停
		continue?: StateMachineEvent;		// 继续
		standEvent?: StateMachineEvent;		// 站住
		attackingEvent?: StateMachineEvent;	// 进入战斗
	}
	/**
	 * 战场单元基类，包括敌我双方的主角、魔宠、宠物、小怪、Boss等独立单元的抽象
	 * 每个战场单元拥有自己的独立的状态机、行为树等管理模型
	 * 多个战场单元可以组合成战队，接受统一的管理
	 */
	export class Soldier extends egret.Sprite implements IObjectPool /* 对象池接口 */{
		public constructor(){
			super();
			this.createStatusMachine(SoldierStatusList.ready);
		}

		//对象池接口支持
		public onInit(){}
		public onReturn(){}
		//对象池接口支持结束

		protected onReady(event?, from?, to?){
		}
		protected onRunning(event?, from?, to?){
		}
		protected onHit(event?, from?, to?, data?){
		}
		protected onDeath(event?, from?, to?){

		}
		protected onSuspend(event?, from?, to?){

		}
		protected onBeforeattacking(event?, from?, to?){
		}
		protected onAttacking(event?, from?, to?, msg?){
			//进入攻击动画时触发
		}
		protected onMove(event?, from?, to?){//进入行走状态时触发
			this._armature.animation.gotoAndPlay('move');
		}
		protected onStand(event?, from?, to?){//进入站立状态时触发
			this._armature.animation.gotoAndPlay('stand');
		}

		/**
		 * 创建状态机
		 */
		public createStatusMachine(ini){
			let self = this;
			this.status = StateMachine.create({
				initial: { state: ini, event: 'initialize' },
				events: [
					{ name: 'attacked', from:'*', to:SoldierStatusList.hit},
					{ name: 'killed', from:'*', to:SoldierStatusList.death},
					{ name: 'start',  from: SoldierStatusList.ready, to: SoldierStatusList.running},
					{ name: 'attackingEvent', from: '*', to: SoldierStatusList.attacking},
					{ name: 'stop',  from: '*', to: SoldierStatusList.suspend },
					{ name: 'continue', from: SoldierStatusList.suspend, to: SoldierStatusList.running},
					{ name: 'moveEvent', from:'*', to:SoldierStatusList.move},
					{ name: 'standEvent', from:'*', to:SoldierStatusList.stand},
				],
				callbacks: {
					onattacked: function(event?, from?, to?, data?){		//进入被击状态时触发
						self.onHit(event, from, to, data);
					},
					onkilled:  function(event?, from?, to?){		//死亡时触发
						self.onDeath(event, from, to);
					},
					onready : function(event?, from?, to?){		//初始化完成时触发
						self.onReady(event, from, to);
					},            
					onrunning : function(event?, from?, to?){		//进入战斗流程时触发
						self.onRunning(event, from, to);
					},
					onstop : function(event?, from?, to?){		//进入暂停状态时触发
						self.onSuspend(event, from, to);
					},
					onbeforeattackingEvent:function(event?, from?, to?){		//准备进入攻击动画时触发
						self.onBeforeattacking(event, from, to);
					},
					onattackingEvent : function(event?, from?, to?, msg?){	//进入攻击动画时触发
						self.onAttacking(event, from, to, msg);
					},
					onmoveEvent : function(event?, from?, to?){			//进入行走状态时触发
						self.onMove(event, from, to);
					},
					onstandEvent : function(event?, from?, to?){	//进入站立状态时触发
						self.onStand(event, from, to);
					},
				},
				error: function(eventName, from, to, args, errorCode, errorMessage) {
		　　　　　　return 'event ' + eventName + ': ' + errorMessage;
		　　　　},
			});
			this.status.start();
		}

		/**
		 * 设置血量
		 * @param $value	血量
		 */
		public set Life($value: Digit) {
			this._life = $value.max(0);

			// 修改血条显示
			switch(this.unitType){
				case SoldierType.boss:
					FacadeApp.dispatchAction(CommandList.BossLifeProgress, this._life.clone.Mul(100).Div(this._totalLife).Number);
					break;
				case SoldierType.monster:
					if(this._monsterLifeBar)
					this._monsterLifeBar.visible = !this._life.Equal(this._totalLife);
					this._monsterLifeBar.value = this._life.clone.Mul(100).Div(this._totalLife).Number;
					break;
				default:
					FacadeApp.dispatchAction(CommandList.M_CMD_SoldierLifeChanged, {id:this.ID, cur: this._life.clone, left: this._life.clone.Mul(100).Div(this._totalLife).Number});
					break;
			}

			//死亡，修改状态机的状态
			if (!this._life.Larger(0)) {
				if(this.unitType == SoldierType.monster || this.unitType == SoldierType.boss){
					this.status.killed();
				}
			}
		}

		/**
		 * 移除龙骨
		 */
		protected RemoveArmature(){
			if(this._armature != null){ //从舞台上移除怪物的龙骨动画对象，并将其置空
				MovieManage.RemoveArmature(this._armature);
				if(this._armature.display.parent){
					this._armature.display.parent.removeChild(this._armature.display);
				}
				this._armature = null;
			}
		}

		/**
		 * 移除缓动和setTimeout
		 */
		public RemoveTweenAndSetTimeout(): void {
			//egret.Tween.removeTweens(this);
		}

		/**
		 * 实时侦听
		 */
		public Framing(frameTime: number): void {
		}

		/**
		 * 角色攻击力
		 */
		public set Damage($value: Digit) {
			this._damage = $value;
		}
		/**
		 * 获取角色攻击力
		 */
		public get Damage(): Digit {
			return this._damage;
		}
		/**
		 * 设置怪物总血量
		 * @param $value	总血量
		 */
		public set totalLife($value: Digit) {
			this._totalLife = $value.max(0);
		}
		/**
		 * 获取总血量
		 */
		public get totalLife():Digit{
			return this._totalLife;
		}
		/**
		 * 获取血量
		 */
		public get Life(): Digit {
			return this._life;
		}
		/**
		 * 获取高度
		 */
		public get MonsterHeight(): number {
			return this._armature ? this._armature.display.height : 0;
		}
		/**
		 * 怪物的五行属性
		 */
		public get Trait(): SoldierTrait {
			return this.traitType;
		}
		/**
		 * 设置怪物ID
		 */
		public set ID($value) {
			this._id = $value;
		}
		/**
		 * 获取怪物id
		 */
		public get ID(): number {
			return this._id;
		}


		/**
		 * 怪物ID
		 */
		protected _id: number = 0;
		/**
		 * 名字
		 */
		private _name: string = "";
		/**
		 * 等级
		 */
		private _level: number = 1;
		/**
		 * 描述
		 */
		private _desc: string = "";
		/**
		 * 战斗单元动画骨架
		 */
		protected _armature: dragonBones.Armature;
		/**
		 * 角色攻击力
		 */
		protected _damage: Digit = new Digit([0,0]);
		protected timerOfResent:number = 0;
		/**
		 * 怪物血量
		 */
		protected _life: Digit = new Digit([0,0]);
		/**
		 * 状态机
		 */
		public status: ISoldier;
		/**
		 * 战斗单元的类型
		 */
		public unitType: SoldierType = SoldierType.hero;
		/**
		 * 五行属性
		 */
		public traitType: SoldierTrait = SoldierTrait.None;
		/**
		 * 怪物血条
		 */
		public _monsterLifeBar: MonsterLifeBar;
		/**
		 * 怪物总血量
		 */
		protected _totalLife: Digit;
	}


	

	/**
	 * 卡牌
	 */
	// export class CardSoldier extends Soldier {
	// 	/**
	// 	 * 构造函数
	// 	 */
	// 	public constructor(){
	// 		super();

	// 		this.UpdateCard();

	// 		this.skewY = 0; //对方战队反转
	// 	}

	// 	/**
	// 	 * 当前出战的卡牌
	// 	 */
	// 	public get FightingCard(): Card{
	// 		return this._fightingCard;
	// 	}

	// 	/**
	// 	 * 出战卡牌
	// 	 */
	// 	private _fightingCard: Card;

	// 	public Framing(frameTime: number): void {
	// 		this.timerOfResent += frameTime;

	// 		if (this.status.current == SoldierStatusList.move && this.x < 70) {
	// 			this.x += GameConfigOfRuntime.roleSpeed;
	// 		}
	// 	}

	// 	/**
	// 	 * 更新卡牌动画
	// 	 */
	// 	public async UpdateCard(){
	// 		this._fightingCard = <Card> FacadeApp.read(CommandList.Re_CardtInfo).FightingCard;
	// 		let arm = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(this._fightingCard.Res, this);
	// 		if(this._armature != null){
	// 			MovieManage.RemoveArmature(this._armature);
	// 			if(this._armature.display.parent){
	// 				this._armature.display.parent.removeChild(this._armature.display);
	// 			}
	// 		}
	// 		// console.log(this._fightingPet.Res);
	// 		this._armature = arm;
	// 		this.x = 80;
	// 		this.y = 650;
	// 		this.addChild(this._armature.display);
	// 		this._armature.animation.gotoAndPlay('move');
	// 	}
	// }
	
}
