/**
 * PVP战场管理
 */
namespace PVPManager{
	/**
	 * 战场状态机用到的状态枚举
	 * $note suspend并不是暂停。目前"暂停"是通过停止帧动画监听来实现的，而suspend意味着停止战斗、修改战场参数以便开始新的战斗，过关、攻击宝箱怪、进行PVP时，都必须先suspend、修改参数完毕后，再重新进入running
	 */
	export const FightStatusList = {
		noready: 'noready',		//未准备就绪
		countDown: 'countDown',	//准备就绪,倒计时
		running: 'running',		//战斗进行中
		pause: 'pause',		//暂停战斗
		end: 'end',				//结束战斗
	}

	/**
	 * 和战斗相关的事件定义接口
	 */
	export interface IBattle extends StateMachine {
		ChangeCountDown?: StateMachineEvent;		//初始化战场,获取数据
		ChangeStart?: StateMachineEvent;		//进入战斗流程
		ChangePause?: StateMachineEvent;		//暂停战斗、修改设定
		ChangeContinue?: StateMachineEvent;	//继续战斗
		ChangeEnd?: StateMachineEvent;	//结束战斗
	}

	/**
	 * 伤害来源分类
	 */
	// export enum HurtSourceType {
	// 	mineRole = 4,
	// 	enemyRole = 5
	// }

	/**
	 * PVP战斗管理
	 */
	export class PVPFightManager extends egret.DisplayObjectContainer {
		/**
		 * 获取单例对象
		 */
		public static GetInstance(): PVPFightManager {
			if (!PVPFightManager._instance) {
				PVPFightManager._instance = new PVPFightManager(FightStatusList.noready);
			}
			return PVPFightManager._instance;
		}
		private static _instance: PVPFightManager;
		
		/**
		 * 构造函数
		 */
		public constructor(ini:any){
			super();

			this.createStatusMachine(ini);

			//订阅数据源：开始PVP.进场
			FacadeApp.AddListener(CommandList.PVP_StartComeIn, ()=>{
				this.status.ChangeCountDown();
			});
		}

		//设置状态机
		private createStatusMachine(ini){
			let self = this;
			this.status = StateMachine.create({
				initial: { state: ini, event: 'initialize' },
				events: [
					{ name: 'ChangeCountDown',  from: '*', to: FightStatusList.countDown },
					{ name: 'ChangeStart',  from: FightStatusList.countDown, to: FightStatusList.running },
					{ name: 'ChangePause',  from: FightStatusList.running, to: FightStatusList.pause },
					{ name: 'ChangeContinue', from: FightStatusList.pause, to: FightStatusList.running },
					{ name: 'ChangeEnd', from: FightStatusList.running, to: FightStatusList.end }
				],
				callbacks: {
					oncountDown :function(event?, from?, to?){//初始化完成时触发
						if(!self._countdownArmature){
							self.creatCountDown();
							// self.FrameCheckStart();
							FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData);
						}
					}, 
					onrunning : function(event?, from?, to?){	//进入战斗状态时触发
						if(from == FightStatusList.pause){
							// self.FrameCheckStart();
							self.armyOfMine.continuesFun();				//我方继续行动
							self.armyOfEnemy.continuesFun();			//我方继续行动
							console.log("继续");
						}
						FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData);
					},        
					onpause : function(event?, from?, to?){	//进入暂停状态时触发
						// self.FrameCheckStop();					//停止帧检测
						BG.GetInstance2().RemoveTween();		//停止背景移动
						self.armyOfMine.pauseFun();				//我方战队停止行动
						self.armyOfEnemy.pauseFun();				//敌方战队停止行动
						console.log("暂停");
					},
					onend : function(event?, from?, to?){		//进入停止状态时触发
						// if(!self._passImage){
						if(PVPEndWindow.inst(PVPEndWindow).parent == null){
							// self.FrameCheckStop();				//停止帧检测
							BG.GetInstance2().RemoveTween();		//停止背景移动
							self.ChangeTollgate();					//战报显示
							console.log("结算");
						}
					},
				},
				error: function(eventName, from, to, args, errorCode, errorMessage) {
		　　　　　　return 'event ' + eventName + ': ' + errorMessage;
		　　　　},
			});
		}

		/**
		 * 获取战队信息，创建战队
		 */
		public loadData(){
			this._haveFightControlSet = [];

			// 测试pvp表现
			var urlloader:egret.URLLoader = new egret.URLLoader();
			var urlreq: egret.URLRequest = new egret.URLRequest();
			urlreq.url = "resource/config/skillarmcfg.json";
			urlloader.load(urlreq);
			urlloader.addEventListener(egret.Event.COMPLETE,(data)=>{
				this.animationNameSet = JSON.parse(data.target.data);
			},this);

			// this.animationNameSet = ConfigStaticManager.getList(ConfigTypeName.PVPAni);
			PVPFightManager.TIMESCALE = 1;

			//创建己方战队
			if(!this.armyOfMine){
				this.armyOfMine = new PVPArmy(); 
			}
			this.addChild(this.armyOfMine);

			//创建敌方战队 延后注入编组信息
			if(!this.armyOfEnemy){
				this.armyOfEnemy = new PVPArmy();
			}
			this.addChild(this.armyOfEnemy);

			// 分发战斗数据
			this.FenJieFightJson();
			// 初始化技能数据
			// this.initAniNameSet();

			// 不跟自己打
			// if(this.armyOfMine._uid == this.armyOfEnemy._uid){
			// 	this.status.ChangeEnd();
			// }

			let uid = this.armyOfMine.FightDataSet[0]["params"]["uid"];
			let roleId = this.armyOfMine.FightDataSet[0]["params"]["hid"];
			let site = this.armyOfMine.FightDataSet[0]["params"]["site"];
			//注入编组信息
			this.armyOfMine.rebuild([
				new SoldierConfigInfo(SoldierType.pvpMineHero, roleId, site, uid)
			]);

			uid = this.armyOfEnemy.FightDataSet[0]["params"]["uid"];
			roleId = this.armyOfEnemy.FightDataSet[0]["params"]["hid"];
			site = this.armyOfEnemy.FightDataSet[0]["params"]["site"];
			//注入编组信息
			this.armyOfEnemy.rebuild([      
				new SoldierConfigInfo(SoldierType.pvpEnemyHero, roleId, site, uid)
			]);

			//首次同步状态
			this.refreshState(true);
		}

		/**
		 * 解析服务端的战斗数据
		 */
		private FenJieFightJson(){
			this.armyOfMine.FightDataSet = [];
			this.armyOfEnemy.FightDataSet = [];

			this.armyOfMine._uid = this._PVPFightControlSet[0]["params"]["me"];
			this.armyOfEnemy._uid = this._PVPFightControlSet[0]["params"]["enemy"];

			for(let i=1; i<this._PVPFightControlSet.length; i++){
				// if(this.armyOfMine._uid && this.armyOfEnemy._uid == null){
				// 	this.armyOfEnemy._uid = this._PVPFightControlSet[i]["params"]["uid"];
				// }
				// if(this.armyOfMine._uid == null){
				// 	this.armyOfMine._uid = this._PVPFightControlSet[i]["params"]["uid"];
				// }

				if(this._PVPFightControlSet[i]["params"]["uid"] == this.armyOfMine._uid){
					// 主角队伍
					this.armyOfMine.FightDataSet.push(this._PVPFightControlSet[i]);
				}
				else if(this._PVPFightControlSet[i]["params"]["uid"] == this.armyOfEnemy._uid){
					// 敌方队伍
					this.armyOfEnemy.FightDataSet.push(this._PVPFightControlSet[i]);
				}
			}

			for(let i=0; i<9; i++){
				this.armyOfMine.eachFightDataSet[i] = [];
				this.armyOfEnemy.eachFightDataSet[i] = [];
			}

			for(let i=0; i<this.armyOfMine.FightDataSet.length; i++){
				this.armyOfMine.eachFightDataSet[this.armyOfMine.FightDataSet[i]["params"]["site"]].push(this.armyOfMine.FightDataSet[i]);
			}
			for(let i=0; i<this.armyOfEnemy.FightDataSet.length; i++){
				this.armyOfEnemy.eachFightDataSet[this.armyOfEnemy.FightDataSet[i]["params"]["site"]].push(this.armyOfEnemy.FightDataSet[i]);
			}

			console.log("敌方流程",this.armyOfEnemy.FightDataSet,this.armyOfEnemy.eachFightDataSet);
			console.log("我方流程",this.armyOfMine.FightDataSet,this.armyOfMine.eachFightDataSet);
			
		}

		/**
		 * 利用数据仓库同步本地state
		 */
		private async refreshState(changeGate:boolean = false){
			let ri = FacadeApp.read(CommandList.Re_Status);

			if(!changeGate){
				return;
			}
		}

		/**
		 * 创建倒计时，播放倒计时
		 */
		private async creatCountDown(){
			this.status.ChangePause();
			// 创建倒计时
			if (!this._countdownArmature) {
				this._countdownArmature = new dragonBones.Armature;
				this._countdownArmature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie("countdown", this);
				this._countdownArmature.display.x = 320;
				this._countdownArmature.display.y = 400;
				this._countdownArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, ()=>{
					this._countdownArmature.animation.stop();
					this.removeChild(this._countdownArmature.display);
					this.status.ChangeStart();
				}, this);
			}
			this.addChild(this._countdownArmature.display);
			this._countdownArmature.animation.gotoAndPlay("start");
		}

		/**
		 * 准备过关时执行
		 */
		private ChangeTollgate(){

			// 清空数据
			this.armyOfMine.FightDataSet = [];
			this.armyOfEnemy.FightDataSet = [];

			//延迟一段时间后，显示恭喜过关图片

			PVPEndWindow.inst(PVPEndWindow).Register(this, false).ShowWindow(this._PVPFightControlSet[this._PVPFightControlSet.length - 1]);
			// if (!this._passImage) {
			// 	this._passImage = new eui.Image();
			// 	this._passImage.source = RES.getRes("gxguoguan_png");
			// 	this._passImage.y = 50;
			// }
			// this.addChild(this._passImage);

			// 需要判断是过关还是失败

			

			//延迟一段时间后，删除恭喜过关图片
			// setTimeout(()=>{
			// 	if(this._passImage.parent){
			// 		this.removeChild(this._passImage);
			// 	}
			// 	this._passImage = null;
			// 	this._countdownArmature = null;

				//主角开始移动，一段时间后从屏幕右侧消失
				// this.armyOfMine.goAheadFun().then(()=>{
				// 	this.armyOfMine.endFun();
				// 	this.removeChild(this.armyOfMine);
				// 	this.armyOfMine = null;
				// 	SoldierManage.FightManager.GetInstance().status.continue();
				// });
				// this.armyOfEnemy.goAheadFun().then(()=>{
				// 	this.armyOfEnemy.endFun();
				// 	this.removeChild(this.armyOfEnemy);
				// 	this.armyOfEnemy = null;
				// });
				// FacadeApp.dispatchAction(CommandList.PVP_RemoveFightWindow);
			// }, 1500);
		}

		/**
		 * 退出PVP战场
		 */
		public EndPVPFight(){
			this._countdownArmature = null;

			//主角开始移动，一段时间后从屏幕右侧消失
			// this.armyOfMine.goAheadFun().then(()=>{
				this.armyOfMine.endFun();
				this.removeChild(this.armyOfMine);
				this.armyOfMine = null;
				SoldierManage.FightManager.GetInstance().status.continue();
			// });
			// this.armyOfEnemy.goAheadFun().then(()=>{
				this.armyOfEnemy.endFun();
				this.removeChild(this.armyOfEnemy);
				this.armyOfEnemy = null;
			// });
			SoldierManage.FightManager.GetInstance().status.continue();
			FacadeApp.dispatchAction(CommandList.PVP_RemoveFightWindow);
		}


		/**
		 * 添加已经执行过的动作到内存
		 */
		public addAniEventToSet(object: Object){
			if(object){
				if(this.JudgeAniEventByIndex(object["PreCondition"])){
					if(this._haveFightControlSet.indexOf(object) == -1){
						this._haveFightControlSet.push(object);
					}
					return true;
				}else{
					return false
				}
			}
			else{
				console.log(object);
				return false;
			}
		}

		/**
		 * 判断动作是否已经执行过
		 */
		public JudgeAniEventByIndex(eventIndex: number): boolean{
			if(eventIndex == 0) return true;
			for(let i=this._haveFightControlSet.length - 1; i>=0; i--){
				if(eventIndex == this._haveFightControlSet[i]["EventIndex"]){
					return true;
				}
			}
			return false;
		}

		/**
		 * 正在执行的动作序号
		 */
		public curAniEventIndex(){
			return this._haveFightControlSet[this._haveFightControlSet.length - 1 ]["EventIndex"];
		}


		/**
		 * 帧监听
		 */
		// private _PVPFraming(frameTime: number): void {
		// 	if (this.status.current != FightStatusList.running && this.status.current != FightStatusList.countDown) {//停止动画播放
		// 		return;
		// 	}
		// }

		/**
		 * 立即结束战斗
		 */
		public EndFight(){
			PVPFightManager.GetInstance().status.ChangeEnd();
		}

		/**
		 * 暂停战斗
		 */
		public PauseFight(){
			PVPFightManager.GetInstance().status.ChangePause();
		}
		/**
		 * 继续战斗
		 */
		public ContinueFight(){
			PVPFightManager.GetInstance().status.ChangeContinue();
		}

		/**
		 * 启动帧检测
		 */
		// public FrameCheckStart(){
		// 	egret.Ticker.getInstance().register(this._PVPFraming, this); 
		// }

		/**
		 * 暂停帧检测
		 */
		// public FrameCheckStop(){
		// 	egret.Ticker.getInstance().unregister(this._PVPFraming, this);
		// }

		/**
		 * 我方战队
		 */
		public armyOfMine: PVPArmy;
		/**
		 * 敌方战队
		 */
		public armyOfEnemy: PVPArmy;

		/**
		 * 技能动画集合
		 */
		public animationNameSet: Object = new Object;

		/**
		 * 状态机
		 */
		public status: IBattle;

		/**
		 * 过关展示
		 */
		private _passImage: eui.Image;
		/**
		 * 倒计时龙骨
		 */
		public _countdownArmature: dragonBones.Armature = null;

		/**
		 * 整个战场流程
		 */
		public _PVPFightControlSet: Object[] = [];

		/**
		 * 发生过的战斗 
		*/
		public _haveFightControlSet: Object[] = [];
		/**
		 * 播放时间倍数
		 */
		public static TIMESCALE: number = 1;
	}
}