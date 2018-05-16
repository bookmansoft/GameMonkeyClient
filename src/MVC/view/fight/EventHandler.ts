/**
 * 战斗模块 - 战场随机事件管理
 */
namespace SoldierManage{
	/**
	 * 随机事件类型
	 */
	enum RandomEventEnum{
		None = 0,				//空
		Enemy = 1,				//遭遇其他玩家
		BossAppear = 2,			//遭遇宝箱怪
		BossAttack = 102,		//攻击宝箱怪(金币类型)，该事件由“BossAppear”点击后转化而来
		BossStoneAttack = 202,	//攻击宝箱怪（魂石类型），该事件由“BossAppear”点击后转化而来
		Rabbit = 3,				//小飞兔
	}

	/**
	 * 单一随机事件
	 */
	class EventObject{
		public constructor(_evt:any, _container:IBattle){
			this.container = _container;
			this.evt = _evt;
		}

		public container:IBattle = null;
		public evt:any = null;

		protected _ViewArmature: dragonBones.Armature = null;
		protected async createView(resName:string){
			this._ViewArmature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(resName, this);
			Main.Instance.TopSence.addChild(this._ViewArmature.display); //这是一处全局依赖
			
			// 定义一个状态参数
			this._ViewArmature.display.ifCanMove=true;

			this._ViewArmature.display.x = 150;
			this._ViewArmature.display.y = 270;
			this._ViewArmature.animation.gotoAndPlay("move");
			this._ViewArmature.display.direction = 1;
			this._ViewArmature.display.touchEnabled = true;
			this._ViewArmature.display.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTouched, this);
		}
		protected onViewTouched(e:egret.TouchEvent) {
			this._ViewArmature.display.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewTouched, this);

			this._ViewArmature.display.ifCanMove=false;
			this._ViewArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onViewCompleted, this);
			this._ViewArmature.animation.gotoAndPlay("hit",-1,-1,1);
		}
		protected onViewCompleted(e:egret.TouchEvent) {
			this._ViewArmature.removeEventListener(dragonBones.AnimationEvent.COMPLETE, this.onViewCompleted, this);
			this._ViewArmature = null;
			MovieManage.RemoveArmature(e.target.parent);
			Main.Instance.TopSence.removeChild(e.target);//这是一处全局依赖
		}
		public FrameIng(){
			//让小飞兔在屏幕上漂移
			if(this._ViewArmature != null && this._ViewArmature.display.ifCanMove == true){
				this._ViewArmature.display.x += this._ViewArmature.display.direction * 2;

				if(this._ViewArmature.display.x >= 550)	{
					this._ViewArmature.display.direction *=-1;
					this._ViewArmature.display.skewY  = -180;
				}
				else if(this._ViewArmature.display.x <= 150)	{
					this._ViewArmature.display.direction *=-1;
					this._ViewArmature.display.skewY  = 0;
				}
			}
		}
	}

	/**
	 * 宝箱怪
	 */
	class EventObjectOfBoss extends EventObject{
		public constructor(_evt:any, _container:IBattle){
			super(_evt, _container);
			this.createView("baoxiang_fly");
		}

		protected onViewTouched(e:egret.TouchEvent) {
			if(this.container.current != FightStatusList.running){ //已经有一个中断在处理中了
				return;
			}
			this.container.stop();//这是一处全局依赖

			super.onViewTouched(e);
		}
		protected onViewCompleted(e:egret.TouchEvent) {
			super.onViewCompleted(e);

			//提交点击事件
			FacadeApp.fetchData([CommandList.M_NET_CheckEvent, "&eid=", this.evt.type], [data => {
				EventHandler.EventUnRegister(this); //之所以在此处才注销事件，是为了避免相同事件被重复创建，所以必须等待服务端处理结果返回后再注销
				FacadeApp.dispatchAction(CommandList.M_AT_EventHandleResult, data['data']); //更新事件列表
				if(data.code ==  FacadeApp.SuccessCode && FacadeApp.read(CommandList.Re_FightInfo).LEVEL % 5 != 0){
					let events = FacadeApp.read(CommandList.Re_FightInfo).events; 
					Object.keys(events).map(eid => { //处理特殊事件
						switch(events[eid].type){
							case RandomEventEnum.BossAttack://导入金币怪战斗
							case RandomEventEnum.BossStoneAttack://导入魂石怪战斗
								this.container.stop();
								FacadeApp.dispatchAction(CommandList.M_AT_BattleWithFlyBoss, {'eid': eid});
								break;
						}
					});
				}
				else{
					UIPage.inst(UIPage).ShowTrottingHorseLampWindow("宝箱怪逃跑了！");
					this.container.continue();
				}
			}, e=>{
				UIPage.inst(UIPage).ShowTrottingHorseLampWindow("宝箱怪逃跑了！");
				this.container.continue();
			}]);
		}  
	}

	/**
	 * 小飞兔宝箱
	 */
	class EventObjectOfBaoXiang extends EventObject{

		public constructor(_evt:any, _container:IBattle){
			super(_evt, _container);
			this.createView("baoxiang");
		}

		protected onViewCompleted(e:egret.TouchEvent) {
			super.onViewCompleted(e);

			//提交点击事件
			FacadeApp.fetchData([CommandList.M_NET_CheckEvent, "&eid=", this.evt.type], [data => {
				EventHandler.EventUnRegister(this); //之所以在此处才注销事件，是为了避免相同事件被重复创建，所以必须等待服务端处理结果返回后再注销
				FacadeApp.dispatchAction(CommandList.M_AT_EventHandleResult, data['data']); //更新事件列表

				if(data.code == FacadeApp.SuccessCode){
					
					//console.log('小飞兔事件提交成功');
					let dataSet: string[] = (<string>data.data.params.bonus).split(",");
					UIPage.inst(UIPage).ShowTrottingHorseLampWindow(`恭喜您获得了 ${dataSet[1]} ${ConfigStaticManager.getItem(ConfigTypeName.RewardType, parseInt(dataSet[0]))["rewardType"]}！今日可领取次数：${this.evt.numOfMax - this.evt.numOfCur}`);
					let temp = FacadeApp.read(CommandList.Re_Status);
					temp.diamond += parseInt(dataSet[1]);
					FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, temp);
				}else{
					UIPage.inst(UIPage).ShowTrottingHorseLampWindow("小飞兔不见了!");
				}
			}]);
		}
	}

	/**
	 * 随机事件管理类
	 */
	export class EventHandler{
		public static Framing(){
			EventHandler.eventList.map(evt=>{
				evt.FrameIng();
			});
		}
		/**
		 * 添加一个随机事件
		 */
		public static EventRegister(evt: EventObject){
			EventHandler.eventList.push(evt);
		}
		/**
		 * 移除一个随机事件
		 */
		public static EventUnRegister(evt: EventObject){
			EventHandler.eventList.splice(EventHandler.eventList.indexOf(evt), 1);
		}

		/**
		 * 事件类工厂
		 */
		public static createEvent(evt:any, container:IBattle){
			let isFind:boolean = false;
			EventHandler.eventList.map(it=>{
				if(it.evt.type == evt.type){
					isFind = true;
				}
			});
			
			if(isFind){//已经有同类型事件了
				return;
			}

			switch(evt.type){
				case RandomEventEnum.Rabbit: //小飞兔
					EventHandler.EventRegister(new EventObjectOfBaoXiang(evt, container));
					break;
				case RandomEventEnum.BossAppear:
					EventHandler.EventRegister(new EventObjectOfBoss(evt, container));
					break;
				default:
					EventHandler.EventRegister(new EventObject(evt, container));
					break;
			}
		}

		/**
		 * 随机事件列表
		 */
		private static eventList: Array<EventObject> = new Array();
	}

}

