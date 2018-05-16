/**
 * 战斗模块 - 战场管理
 */
namespace SoldierManage{
	/**
	 * 战斗管理
	 * 1、进入战斗界面，和服务端同步初始数据
	 * 2、消灭怪物后，修改本地已消灭怪物数量，达到一定数量时自动向服务端进行临时提交
	 * 3、通关时，向服务端发送通关请求
	 * 4、战斗失败时，向服务端发送战斗失败消息
	 * 5、战斗失败、回退关卡后，进入无限挂机模式，不再主动提交通关请求。
	 * 6、无限挂机模式下，再次提交通关请求
	 * 
	 * 新的目标：
	 * 1、战斗管理的对象，是3V3 PVP或PVE，其中3V3 PVP包括了我方三个成员、敌方三个成员的对决，PVE包括了我方三个成员、敌方敌方若干成员的对决。
	 * 2、PVE完全由客户端进行计算，PVP由于考虑到未来即时对战的需求，放在服务端计算，由客户端表现。
	 * 
	 * PVE战斗中，载入roleOfMine和MonsterManage来表现战斗
	 * PVP战斗中，载入roleOfMine和roleOfEnemy来表现战斗，使用skewY=180来进行动画反转
	 * 
	 * 每个关卡的掉落物计算：
	 * 1、每关掉落的金币 OK 
	 * 2、逢10大关掉落的魂石
	 * 3、逢10大关掉落的卡牌碎片
	 * 
	 * 存在的问题：
	 * 1、升级法宝后，金币未及时扣除 - OK
	 * 2、法宝升级后的等级，感觉不太正常，目前是指定一次升级25级 - OK 程序做了限制，未激活法宝只能从0升到1级，后续才能一次升多级
	 * 3、金币充足时，法宝升级按钮未及时亮起 - OK
	 * 
	 * 注：关于程序中数据流的用法说明：
	 * 1、界面元素事先通过AddListener订阅Action
	 * 2、Fetch取回网络数据后，通过Dispatch发出一个或多个Action：先修改和Action相关的本地数据，然后通知所有订阅者，来自动调用事先指定的回调函数
	 * 3、也可以不需要访问网络数据，而是在有需要时，直接发出Action来引发相关界面刷新
	 * 4、针对重要的数据，例如金币和元宝，定义单独的Action，以便灵活应用
	 * 5、当多个Action同时发出，有可能引发同一个界面单元连续刷新，此处有优化空间
	 * 
	 * 技能施放：
	 * 1、技能施放 - OK
	 * 2、技能持续生效 - OK
	 * 3、技能冷却 - OK
	 * 4、钻石消除技能冷却CD - todo：需要Ui支持 - OK
	 * 
	 * 随机事件的处理
	 * 1、根据随机事件，出现小飞兔，点击后小飞兔消失，同时获取到指定奖励 - OK 奖励发放尚未实现
	 * 2、根据随机事件，出现宝箱怪，点击后进入和宝箱怪的战斗流程，胜利后获取到指定奖励 - OK 奖励发放尚未实现
	 * 3、（暂拟，待定）根据随机事件，出现PVP对手（要那种欠欠的表情动作），点击后进入PVP战斗，胜利后获取相关奖励
	 * 
	 * 下一步需要的UI支持：
	 * 1、法宝升级界面需要升等数值设置 - 用户可以设定1级、25级、100级、1000级四档的任意一档 - OK
	 * 2、钻石消除面板技能冷却CD功能需要UI支持 - 点击处于冷却期的技能按钮，弹出UI，提示用户是否10元宝消除CD，确认后向服务端发起请求，成功后消除全部技能CD - OK
	 * 3、长按界面元素，弹出浮层，显示即时帮助 - OK
	 * 
	 */
	export class FightManager extends egret.DisplayObjectContainer {
		/**
		 * 构造函数
		 */
		public constructor(ini:any){
			super();
			//关卡数据变化事件 - 非切换类
			this.RegisterDataSource([
				CommandList.SetTollgateProgress,		// 关卡进度发生变化
				
			],this.refreshState.bind(this));

			this.RegisterDataSource([
				CommandList.M_CMD_ArmyDestory,			// 战队被消灭
			],this.ChangeTollgate.bind(this));

			this.RegisterDataSource([
				CommandList.M_AT_BattleWithFlyBoss,		// 开展支线任务 - 和宝箱怪作战
				CommandList.M_AT_SyncCheckpoint,		// 通关
				CommandList.M_AT_ReturnTollgate,		// 结束支线任务、返回主线任务
			],this.refreshState.bind(this), true);

			this.RegisterDataSource([
				CommandList.M_CMD_Fight_Suspend,		// 二级界面打开时抛出暂停动画事件
			],this.FrameCheckStop.bind(this));

			this.RegisterDataSource([
				CommandList.M_CMD_FIGHT_CONTINUE,		// 二级界面关闭时抛出恢复动画事件
			],this.FrameCheckStart.bind(this));

			this.RegisterDataSource([
				CommandList.M_CMD_FIGHT_MonsterKilled,		// 怪物被击中、被击杀事件
				CommandList.M_CMD_FIGHT_MonsterHitted,		// 怪物被击中、被击杀事件
			],this.creatJinBi.bind(this));

			this.RegisterDataSource([
				CommandList.M_CMD_FIGHT_GiveUpOrFight,		// 再次挑战或者放弃挑战消息
			],this.giveUpOrFight.bind(this));

			this.RegisterDataSource([
				CommandList.PVP_SRART,		// 开始PVP,清理挂机战场，开始PVP战场
			],this._RemoveGuaJiStartPVP.bind(this));

			this.loadData(ini);
		}

		/**
		 * 注册订阅数据
		 */
		private RegisterDataSource(source: any, fun: Function, parameter:any = null){
			source.map((item)=>{
				FacadeApp.AddListener(item, (type, data)=>{
					// if(type == CommandList.M_AT_SyncCheckpoint){
					// 	console.log(1);
					// }
					// if(type == CommandList.M_AT_ReturnTollgate){
					// 	console.log(2);
					// }
					if(type == CommandList.M_CMD_ArmyDestory){
						// console.log(3);
					}

					//订阅和数据仓库相关的事件，当数据更新时自动刷新界面
					if(parameter == null && data != null)
						fun(data); 
					else
						fun(parameter);

				});
			});
		}

		/**
		 * 加载数据
		 */
		private loadData(ini){
			//一次性取得所有需要的配置信息
			FacadeApp.PromisifyFetchList([
				[CommandList.M_NET_Card, "&oper=1&id=0&pm=0"]/*取得神魔列表*/,
				[CommandList.M_NET_PetNum, "&oper=1&pm=0&id=0"],/*取得宠物列表 */
			]).then(datas =>{
				//创建状态机
				this.createStatusMachine(ini);

				FacadeApp.dispatchAction(CommandList.M_DAT_CardList, datas[0]['data']);
				FacadeApp.dispatchAction(CommandList.M_DAT_PetList, datas[1]['data']);

				let pet:Pet =  FacadeApp.read(CommandList.Re_PetInfo).FightingPet;
				let roleId = 1;

				//创建己方战队
				this.armyOfMine = new SoldierManage.Army(SoldierManage.ArmyRunType.static); 
				this.armyOfMine.rebuild([
					new SoldierManage.SoldierConfigInfo(SoldierManage.SoldierType.hero, roleId),
					new SoldierManage.SoldierConfigInfo(SoldierManage.SoldierType.pet, pet.ID),
				]);
				this.addChild(this.armyOfMine);

				//创建敌方战队 延后注入编组信息
				this.armyOfEnemy = new SoldierManage.Army(SoldierManage.ArmyRunType.dyncCreate); //build Defenser list
				this.addChildAt(this.armyOfEnemy,0);

				//首次同步状态
				this.refreshState(true);
				this.status.start();
			}).catch(e=>{
				setTimeout(()=>{this.loadData(ini)}, 1000);
			})
		}

		/**
		 * 创建状态机
		 */
		private createStatusMachine(ini){
			let self = this;
			this.status = StateMachine.create({
				initial: { state: ini, event: 'initialize' },
				events: [
					{ name: 'start',  from: FightStatusList.ready, to: FightStatusList.running },
					{ name: 'stop',  from: FightStatusList.running, to: FightStatusList.suspend },
					{ name: 'continue', from: FightStatusList.suspend, to: FightStatusList.running },
				],
				callbacks: {
					onstart : async function(event?, from?, to?){// 初始化完成时触发
						self.FrameCheckStart();					// 启动帧检测
					}, 
					oncontinue : function(event?, from?, to?){// 进入战斗状态时触发
						self.FrameCheckStart();					// 启动帧检测
					},
					// onleaverunning: function(event?, from?, to?){// 离开战斗状态时触发
					// },             
					onstop : function(event?, from?, to?){// 进入暂停状态时触发
						self.FrameCheckStop();					// 暂停帧检测
						BG.GetInstance().RemoveTween();			// 停止背景移动
						Decoration.GetInstance().RemoveTween();	// 停止近景移动
						self.armyOfMine.suspend();				// 我方战队停止行动
						self.armyOfEnemy.suspend();				// 敌方战队停止行动
					},            
				},
				error: function(eventName, from, to, args, errorCode, errorMessage) {
		　　　　　　return 'event ' + eventName + ': ' + errorMessage;
		　　　　},
			});
		}

		/**
		 * 利用数据仓库同步本地state
		 */
		private async refreshState(changeGate:boolean = false){
			let ri = FacadeApp.read(CommandList.Re_Status);
			this.armyOfMine.hero.Damage = Digit.fromObject(ri.power);
			this.armyOfMine.pet.Damage  = Digit.fromObject(ri.powerClick);
			this.armyOfMine.AutoTimes =  this.armyOfMine.pet.FightingPet.AutoTimes + FacadeApp.Calc(effectEnum.AutoAttack, 0);
			this.state.LEVEL = FacadeApp.read(CommandList.Re_FightInfo).LEVEL; //关卡号
			this.state._monsterCount = FacadeApp.read(CommandList.Re_FightInfo)._monsterCount;//关卡进度，即已消灭怪物数量
			this.state.checkPointStatus = FacadeApp.read(CommandList.Re_FightInfo).checkPointStatus; //关卡状态
			this.state.TOTALMONSTER = FacadeApp.read(CommandList.Re_FightInfo).TOTALMONSTER; // 当前怪物数量

			// 显示随机副本事件
			if(parseInt(FacadeApp.read(CommandList.Re_FightInfo).eid) <= 0){ //如果处于战斗类事件处理流程中，则暂不展示其他事件
				let self = this;
				let events = FacadeApp.read(CommandList.Re_FightInfo).events;
				Object.keys(events).map(eid => {
					EventHandler.createEvent(events[eid], this.status);
				});
			}

			if(!changeGate){
				return;
			}

			this.status.stop();

			let monsterIDMin: number = Math.max(this.state.LEVEL % (GameConfigOfRuntime.monsterCount - 3), 1);
			let bossID: number = FacadeApp.read(CommandList.Re_FightInfo).BOSSID;//Math.max(1, (this.state.LEVEL / ConfigStaticManager.bossLevel) % (GameConfigOfRuntime.bossCount + 1));

			// if(UIPage.inst(UIPage)._bossLifeUI.visible){
			let bossObject = ConfigStaticManager.getItem(ConfigTypeName.Boss,bossID);
			if(bossObject == null || bossObject == undefined) {
				bossID = 13;
				bossObject = ConfigStaticManager.getItem(ConfigTypeName.Boss,bossID);
			}
			UIPage.inst(UIPage)._bossLifeUI["bossIconIma"].source = bossObject["iconRes"] + "_png";

			if (parseInt(FacadeApp.read(CommandList.Re_FightInfo).eid) > 0 || (this.state.LEVEL % ConfigStaticManager.bossLevel == 0)) {//进入Boss关卡
				if(this.armyOfEnemy.soldierNum == 0 || this.armyOfEnemy.soldierOfFirst.unitType != SoldierManage.SoldierType.boss){
					if (!this._countdownArmature) {
						this._countdownArmature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie("countdown", this);
						this._countdownArmature.display.x = 320;
						this._countdownArmature.display.y = 400;
						this._countdownArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, ()=>{
							this.removeChild(this._countdownArmature.display);
							if(parseInt(FacadeApp.read(CommandList.Re_FightInfo).eid) > 0){
								this.state._monsterCount = FacadeApp.read(CommandList.Re_FightInfo)._monsterCount;
								this.state.TOTALMONSTER = FacadeApp.read(CommandList.Re_FightInfo).TOTALMONSTER; 
								bossID = 36;
								bossObject = ConfigStaticManager.getItem(ConfigTypeName.Boss,bossID);
								UIPage.inst(UIPage)._bossLifeUI["bossIconIma"].source = bossObject["iconRes"] + "_png";
								this.armyOfEnemy.rebuild([new SoldierManage.SoldierConfigInfo(SoldierManage.SoldierType.boss, bossID)]); //宝箱怪
							}
							else{
								bossID = FacadeApp.read(CommandList.Re_FightInfo).BOSSID;
								bossObject = ConfigStaticManager.getItem(ConfigTypeName.Boss,bossID);
								if(bossObject == null || bossObject == undefined) {
									bossID = 13;
									bossObject = ConfigStaticManager.getItem(ConfigTypeName.Boss,bossID);
								}
								UIPage.inst(UIPage)._bossLifeUI["bossIconIma"].source = bossObject["iconRes"] + "_png";
								this.armyOfEnemy.rebuild([new SoldierManage.SoldierConfigInfo(SoldierManage.SoldierType.boss, bossID)]);
							}
							UIPage.inst(UIPage)._bossLifeUI.visible = true;
							this.status.continue();
						}, this);
					}

					this.addChild(this._countdownArmature.display);
					this._countdownArmature.animation.gotoAndPlay("start",0);
				}
			}
			else{
				// 普通关卡设置
				UIPage.inst(UIPage)._bossLifeUI.visible = false;
				let am:Array<SoldierManage.SoldierConfigInfo> = new Array();
				for (var n: number = 0; n < GameConfigOfRuntime.CPMCount; n++) {
					var random: number = Math.random();
					let monsterID:number = 0;

					//是否是宝箱怪
					var ifBaoXiangNum:number = Math.floor(Math.random() * 10);
					if(ifBaoXiangNum == 0){
						monsterID = SoldierManage.Army.MonsterResSet.length - 1;
					}
					else{
						monsterID = Math.floor(random * (GameConfigOfRuntime.CPMCount+1)) +  monsterIDMin;
					}
					am.push(new SoldierManage.SoldierConfigInfo(SoldierManage.SoldierType.monster, monsterID));
				}
				this.armyOfEnemy.rebuild(am);
				this.status.continue();
			}
		}

		/**
		 * 创建金币掉落动画
		 * data 数据
		 */
		private creatJinBi(data){
			if(data.t==0){	//普通怪
				//目前只是掩饰效果：随机选取一张图片作为掉落物
				let arr = ['ding_jb_png'];//['ding_jp_png', 'ding_nd_png', 'ding_jb_png', 'ding_yb_png', 'chengjiu_fen_png'];
				physicsWorld.addOneBox(arr[Math.floor(Math.random()*arr.length)], data.x, data.y, 1, Main.Instance.TopSence);
			}
			else if(data.t==1){//宝箱怪
				physicsWorld.addOneBox('ding_jb_png', data.x, data.y, 10, Main.Instance.TopSence);
			}
			else if(data.t==2){//boss
				physicsWorld.addOneBox('ding_jb_png', data.x, data.y, 20, Main.Instance.TopSence); 
			}
			else if(data.t == 3){ // 由每击都掉落金币科技引发的掉落
				physicsWorld.addOneBox('ding_jb_png', data.x, data.y, 1, Main.Instance.TopSence);
			}
			SoundManager.PlayGoldMusic();
		}

		/**
		 * 帧监听
		 */
		private _Framing(frameTime: number): void {
			if (this.status.current != FightStatusList.running) {//停止动画播放
				return;
			}

			//角色监听
			this.armyOfMine.Framing(frameTime,{x: 0, y: 0});
			//怪物监听
			this.armyOfEnemy.Framing(frameTime, {x: this.armyOfMine.hero.x, y: this.armyOfMine.hero.y});
			//事件监听
			EventHandler.Framing();
		}

		/**
		 * 准备过关时执行
		 */
		private ChangeTollgate(){
			//战斗转入暂停状态
			if(this.succAni != null) return;

			this.status.stop();
			this.succAni = setTimeout(()=>{
				//延迟一段时间后，显示恭喜过关图片
				if (!this._passImage) {
					this._passImage = new eui.Image();
					this._passImage.source = RES.getRes("gxguoguan_png");
					this._passImage.y = 50;
				}
				this.addChild(this._passImage);
				this.succAni = setTimeout(()=>{
					//延迟一段时间后，删除恭喜过关图片
					if(this._passImage.parent)	this.removeChild(this._passImage);

					//主角开始移动，一段时间后从屏幕右侧消失
					this.armyOfMine.goAhead().then(()=>{
						this.succAni = null;
						if(parseInt(FacadeApp.read(CommandList.Re_FightInfo).eid) > 0){
							FacadeApp.dispatchAction(CommandList.M_AT_ReturnTollgate, {});
							FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint);
						}
						else{
							//提交过关请求
							FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=1", "&gateNo=", this.state.LEVEL, "&monsterNum=", this.state.TOTALMONSTER], [data=>{
								FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
								FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
								if(data["code"] == FacadeApp.SuccessCode){
								}else{
									UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
								}
							}, e=>{
								this.status.continue();
							}]);
						}
					}).catch(e=>{
						this.succAni = null;
						this.status.continue();
					});
				}, 1500);
			}, 500);
		}

		/**
		 * 转生流程和相关的动画展示
		 * @_type: 7 普通转生 8 高级转生
		 */
		public readyZS(){
			//转入暂停状态
			this.status.stop();
			this.armyOfMine.disappear();
			this.status.continue();
			//发送转生请求 注意此处使用了 await 异步语法
			// try{
			// 	let data = await FacadeApp.PromisifyFetch([CommandList.M_NET_CheckpointNum, `&oper=${_type}&gateNo&monsterNum`]);
			// 	//收到应答 更新数据仓库
			// 	FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
			// 	FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);

			// 	//显示转生结果界面
			// 	UIPage.inst(UIPage).ShowReviveTipsWindow();
			// }
			// catch(e){
			// 	this.status.continue();
			// }
		}

		/**
		 * 点击时触发的动画展示
		 */
		public _TouchTap($e: egret.TouchEvent): void {
			if(!this.status || this.status.current == FightStatusList.suspend){
				return;
			}
			if($e.stageY >= 680 || $e.stageY <= 200) return;
			//点击出现闪电链，注意加了范围判断
			// if ($e && $e.stageY > 200 && $e.stageY < 680) {
			// 	this.creatShangDian($e);
			// }
			FacadeApp.dispatchAction(CommandList.M_CMD_PetAttack);
		}

		/**
		 * 创建点击闪电效果
		 */
		private async creatShangDian($e){
			if(this.armyOfEnemy == null || this.armyOfEnemy.soldierNum == 0){
				return;
			}

			//异步加载闪光龙骨的动画
			var shangdian = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie('shandian', this);

			this.addChild(shangdian.display);

			shangdian.display.x = $e.stageX;
			shangdian.display.y = $e.stageY;

			if(this.armyOfEnemy.soldierNum > 0)
			{
				if(this.armyOfEnemy.soldierOfFirst.x>640)
				{
					shangdian.display.posiX = 400;
					shangdian.display.posiY = this.armyOfMine.hero.y;
				}
				else
				{
					shangdian.display.posiX = this.armyOfEnemy.soldierOfFirst.x;
					shangdian.display.posiY = (this.armyOfEnemy.soldierOfFirst.y - 60);
				}
				
			}
			else
			{
				shangdian.display.posiX = 400;
				shangdian.display.posiY = this.armyOfMine.hero.y;
			}

			var _dx = shangdian.display.posiX - shangdian.display.x;
			var _dy = shangdian.display.posiY - shangdian.display.y;

			shangdian.display.scaleX = Math.sqrt(_dx * _dx + _dy * _dy)/(shangdian.display.width-20);
			
			shangdian.display.rotation = Math.atan2(_dy,_dx) * 180 / Math.PI;
			
			shangdian.addEventListener(dragonBones.AnimationEvent.COMPLETE, async function(e){
				MovieManage.RemoveArmature(e.target.parent);
				this.removeChild(e.target);
				var targe = e.target;

				var hit: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
				hit.texture = <egret.Texture> await MovieManage.PromisifyGetRes('shoudian_png', this);
				hit.anchorOffsetX = hit.width/2;
				hit.anchorOffsetY = hit.height/2;
				hit.x = targe.posiX;
				hit.y = targe.posiY;
				this.addChild(hit);
				setTimeout(()=>{
					this.removeChild(hit);
					ObjectPool.getPool('eui.Image').returnObject(hit);
				}, 100);
			}, this);

			shangdian.animation.gotoAndPlay("shandian");
		}

		/**
		 * 挑战或者放弃战斗
		 */
		public giveUpOrFight(){
			if(this.status.current == FightStatusList.running){
				if (FacadeApp.read(CommandList.Re_FightInfo).GIVEUPORFIGHT == "fight") {
					//进入暂停状态
					this.status.stop();
					//再次挑战
					FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=5", "&gateNo=", this.state.LEVEL, "&monsterNum=", this.state.TOTALMONSTER], [data=>{
						FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
						if(data["code"] == FacadeApp.SuccessCode){
						}
						else{
							UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
						}
					}, e=>{
						this.status.continue();
					}]);
				}
				else {
					this._GiveUp();
				}
			}
		}

		/**
		 * 放弃当前Boss战
		 */
		public _GiveUp(): void {
			//暂停战斗
			this.status.stop();

			// let enemyRetreatTweenCom = false;	// 敌方队伍是否退场完毕
			// let mineRetreatTweenCom = false;	// 我方队伍是否退场完毕

			// 敌方退场
			this.armyOfEnemy.goAhead().then(()=>{
				this.armyOfEnemy.suspend();
				// enemyRetreatTweenCom = true;
			})
			

			//主角开始后退，一段时间后从屏幕左侧消失
			this.armyOfMine.retreat().then(()=>{
				if(parseInt(FacadeApp.read(CommandList.Re_FightInfo).eid) > 0){
					FacadeApp.dispatchAction(CommandList.M_AT_ReturnTollgate, {});
				}
				else{
					//发送放弃请求
					FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=2", "&gateNo=", this.state.LEVEL, "&monsterNum=", 0], [data=>{
						if(data["code"] == FacadeApp.SuccessCode){
							FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);							
						}else{
							UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
						}
					}, e=>{
						this.status.continue();
					}]);
				}

			}).catch(e=>{
				this.status.continue();
			})
		}

		/**
		 * 开始PVP，挂机角色离场
		 */
		public _RemoveGuaJiStartPVP(): void {
			//暂停战斗
			this.status.stop();

			//主角开始后退，一段时间后从屏幕左侧消失
			this.armyOfMine.retreat().then(()=>{
				FacadeApp.dispatchAction(CommandList.PVP_StartComeIn);
			});
		}

		/**
		 * 启动帧检测
		 */
		public FrameCheckStart(){
			egret.Ticker.getInstance().register(this._Framing, this); 
			FacadeApp.Notify(CommandList.M_MS_FightStatusChg); //向其他界面发送通知
		}

		/**
		 * 暂停帧检测
		 */
		public FrameCheckStop(){
			egret.Ticker.getInstance().unregister(this._Framing, this);
			FacadeApp.Notify(CommandList.M_MS_FightStatusChg); //向其他界面发送通知
		}

		/**
		 * 获取单例对象
		 */
		public static GetInstance(): FightManager {
			if (!FightManager._instance) {
				FightManager._instance = new FightManager(FightStatusList.ready);
			}
			return FightManager._instance;
		}

		/**
		 * 组件自有状态，视需要和数据仓库同步
		 */
		private state = {
			LEVEL:0, 				//关卡编号
			_monsterCount:0, 		//关卡进度（已消灭怪物数量）
			checkPointStatus:0, 	//关卡状态标记
			_timer: 0, 				//持续战斗时间
			TOTALMONSTER: 30,		//本关怪物总数
		};

		/**
		 * 我方战队
		 */
		public armyOfMine: SoldierManage.Army = null;
		/**
		 * 敌方战队
		 */
		public armyOfEnemy: SoldierManage.Army = null;
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
		private _countdownArmature: dragonBones.Armature;
		private static _instance: FightManager;
		private succAni = null;		// 通关文本时间动画
	}
}
