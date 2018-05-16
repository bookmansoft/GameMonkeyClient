/**
 * 战斗模块 - 战士管理
 * 
 * @note 如果将父类和子类声明到不同的独立文件中，编译执行时容易引发类型定义错误，合并到同一个文件中错误消失，原因不明 2017.3.6
 */
namespace PVPManager {
	/**
	 * 战斗单元的状态
	 */
	export const SoldierStatusList = {
		noReady: 'noReady',				// 准备未就绪--初始化创建，角色未好
		ready: 'ready',					// 准备就绪--创建完成
		move:  'move',					// 移动中--进场
		attackBefore: 'attackBefore', 	// 攻击前--攻击前摇，移动。可打断
		attacking: 'attacking', 		// 攻击中--攻击发动
		attackEnd: 'attackEnd', 		// 攻击后--攻击结束，返回
		// hit: 'hit',						// 受击中--受击，打断，闪避，格挡
		death: 'death',					// 死亡--死亡
		wait: 'wait',					// 等待--站立
		interrupted: 'interrupted',		// 中断--被打断
		seeThrough: 'seeThrough',		// 识破
		effectChange: 'effectChange',	// 效果改变
		// miss: 'miss',					// 闪避
		// startEffect: 'startEffect',		// 发动效果动画
	}

	/**
	 * 和战斗相关的事件定义接口
	 */
	interface ISoldier extends StateMachine {
		ChangeReady ?: StateMachineEvent;			// 战场完成---进入战斗流程
		ChangeMove ?: StateMachineEvent;			// 开始行走---进场
		ChangeReadyAttack ?: StateMachineEvent;	// 准备攻击---前摇
		ChangeAttacking ?: StateMachineEvent;		// 开始攻击---攻击中
		ChangeAttackLater ?: StateMachineEvent;	// 攻击之后---攻击结束，返回
		// hit ?: StateMachineEvent;			// 受击---受击，打断
		ChangeDeath ?: StateMachineEvent;			// 死亡---死亡
		ChangeWait ?: StateMachineEvent;			// 等待---站立，等待对方攻击
		ChangeInterrupted ?: StateMachineEvent;	// 中断--被打断
		ChangeSeeThrough ?: StateMachineEvent;	// 识破
		ChangeEffectChange ?: StateMachineEvent;	// 效果改变
		// startEffect ?: StateMachineEvent;	// 发动效果动画
	}

	/**
	 * 战斗单元五行属性
	 */
	// export enum SoldierTrait
	// {
	// 	None = 0,	//普通
	// 	Gold = 1,	//金
	// 	Wood = 2,	//木
	// 	Water = 3,	//水
	// 	Fire = 4,	//火
	// 	Earth = 5,	//土
	// }

	/**
	 * 战斗单元的类型
	 */
	export enum SoldierType
	{
		pvpMineHero = 0,       	// pvp英雄/主角
		pvpEnemyHero = 1,		// pvp敌方英雄/主角
		pvpMinePet = 2,   		// pvp召唤兽
		pvpEnemyPet = 3   		// pvp敌方召唤兽
	}

	/**
	 * 战场单元基类，包括敌我双方的主角、魔宠、宠物、小怪、Boss等独立单元的抽象
	 * 每个战场单元拥有自己的独立的状态机、行为树等管理模型
	 * 多个战场单元可以组合成战队，接受统一的管理
	 */
	export class PVPSoldier extends egret.Sprite implements IObjectPool /* 对象池接口 */
	{
		public constructor(){
			super();
			this.createStatusMachine(SoldierStatusList.noReady);

			FacadeApp.AddListener(CommandList.pvp_ChangTimeScale,this.changeRoleTimeScale.bind(this),this);
		}

		//对象池接口支持
		public onInit(){}
		public onReturn(){}
		//对象池接口支持结束

		public createStatusMachine(ini){
			let self = this;

			this.status = StateMachine.create({
				initial: { state: ini, event: 'initialize' },
				events: [
					{ name: 'ChangeReady', from:SoldierStatusList.noReady, to:SoldierStatusList.ready},
					{ name: 'ChangeMove', from:'*', to:SoldierStatusList.move},
					{ name: 'ChangeReadyAttack', from:'*', to:SoldierStatusList.attackBefore},
					{ name: 'ChangeAttacking', from:'*', to:SoldierStatusList.attacking},
					{ name: 'ChangeAttackLater', from:'*', to:SoldierStatusList.attackEnd},
					// { name: 'hit', from:'*', to:SoldierStatusList.hit},
					{ name: 'ChangeDeath', from:'*', to:SoldierStatusList.death},
					{ name: 'ChangeWait', from:'*', to:SoldierStatusList.wait},
					{ name: 'ChangeInterrupted', from:'*', to:SoldierStatusList.interrupted},
					{ name: 'ChangeSeeThrough', from:'*', to:SoldierStatusList.seeThrough},
					{ name: 'ChangeEffectChange', from:'*', to:SoldierStatusList.effectChange},
					// { name: 'startEffect', from:'*', to:SoldierStatusList.startEffect},
				],
				callbacks: {
					// onnoready : function(event?, from?, to?){	//初始化完成时触发
					// 	self.onnoReady(event, from, to);
					// }, 
					onChangeReady : function(event?, from?, to?){	//初始化完成时触发
						self.onReady(event, from, to);
					}, 
					onChangeMove : function(event?, from?, to?){	//进入行走状态时触发
						self.onMove(event, from, to);
					}, 
					onChangeReadyAttack : function(event?, from?, to?, msg?){	//进入准备攻击动画时触发
						self.onReadyAttack(event, from, to, msg);
					},
					onChangeAttacking : function(event?, from?, to?, msg?){	//进入攻击动画时触发
						self.onAttacking(event, from, to, msg);
					},
					onChangeAttackLater : function(event?, from?, to?){	//进入攻击动画结束时触发
						self.onAttackLater(event, from, to);
					},
					// onhit: function(event?, from?, to?, data?){	//进入被击状态时触发
					// 	self.onHit(event, from, to, data);
					// },
					onChangeDeath:  function(event?, from?, to?){	//死亡时触发
						self.onDeath(event, from, to);
					},
					onChangeWait : function(event?, from?, to?){	//进入等待状态时触发
						self.onWait(event, from, to);
					},
					onChangeInterrupted : function(event?, from?, to?){	//进入被打断
						self.onInterrupted(event, from, to);
					},
					onChangeSeeThrough : function(event?, from?, to?){	//进入识破
						self.onSeeThrough(event, from, to);
					},
					onChangeEffectChange : function(event?, from?, to?, msg?){	//效果改变
						self.onEffectChange(event, from, to, msg);
					},
					// onstartEffect : function(event?, from?, to?){	//发动效果
					// 	self.onStartEffect(event, from, to);
					// },
				},
				error: function(eventName, from, to, args, errorCode, errorMessage) {
		　　　　　　return 'event ' + eventName + ': ' + errorMessage;
		　　　　},
			});
		}
		protected onReady(event?, from?, to?){
		}
		protected onMove(event?, from?, to?){//进入行走状态时触发
			// this.PlayRoleAnimation("move",0);
			// this._roleArmature.animation.gotoAndPlay('move');
		}
		protected onReadyAttack(event?, from?, to?, msg?){
		}
		protected onAttacking(event?, from?, to?, msg?){
			//进入攻击动画时触发
		}
		protected onAttackLater(event?, from?, to?, msg?){
			//攻击动画结束返回时
		}
		// protected onHit(event?, from?, to?, data?){
		// }
		protected onDeath(event?, from?, to?){
		}
		protected onWait(event?, from?, to?){	//进入等待
			// this.PlayRoleAnimation("stand",0);
			// this._roleArmature.animation.gotoAndPlay('stand');
		}
		protected onInterrupted(event?, from?, to?){	// 被打断
		}
		protected onSeeThrough(event?, from?, to?){	// 识破
		}
		protected onEffectChange(event?, from?, to?, msg?){	// 效果改变
		}
		// protected onStartEffect(event?, from?, to?){	// 发动效果
		// }

		/**
		 * 受击函数。判断受击类型。还可以优化
		 */
		public async HitFun(_type:number, aniName:string){
			if(_type == AttrChangedType.Damage || _type == AttrChangedType.Bang){//普通受击
				this.creatHitEffectRes(aniName);// 技能名称
				if(this.status.current == SoldierStatusList.wait)
					this.PlayRoleAnimation("hit1",1);
			}
			else if(_type == AttrChangedType.Recover){// 恢复
				this.creatHitEffectRes(aniName);
			}
			else if(_type == AttrChangedType.Miss){// 闪避
				if(this.status.current == SoldierStatusList.wait){
					// this.HitEffectComplete = false;
					let moveX = 100 * this._direction;
					this.PlayRoleAnimation("move",0);
					let oriX = this._posiXYSet[this.site].x;
					egret.Tween.get(this).to({x:oriX - moveX},150/PVPFightManager.TIMESCALE).to({x:oriX},150/PVPFightManager.TIMESCALE).call(()=>{
						if(this._roleArmature["curPlayName"] == "move" && this.status.current == SoldierStatusList.wait)
							this.PlayRoleAnimation("move",0);
						// this.HitEffectComplete = true;
						this.judgeAndClearCurFightData();
					},this);
				}
			}
			else if(_type == AttrChangedType.Parry){//格挡
				if(this.status.current == SoldierStatusList.wait){
					if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("block",1);
					else this.PlayRoleAnimation("hit1",1);
				}
			}
			else if(_type == AttrChangedType.Poisoned){//中毒
				if(this.status.current == SoldierStatusList.wait) this.PlayRoleAnimation("hit1",1);
			}
			else{// 其他
				console.log("其他受击动作");
				if(this.status.current == SoldierStatusList.wait) this.PlayRoleAnimation("hit1",1);
			}
		}

		/**
		 * 根据技能名称，创建受击特效
		 */
		public async creatHitEffectRes(aniName: string){
			let hitMv = null;
			if(AttrChangedType.ShouJiRes(aniName).isCreat){
				hitMv = await PVPArmatureManager.CreatHitEffectAni(this,aniName);
				this._hitAniSet.push(hitMv);
			}
			else if(aniName == RoleAttackAniGroupNames.WuKong_QianChong){//悟空冲刺技能
				let moveX = 250 * this._direction;
				let oriX = this._posiXYSet[this.site].x;
				egret.Tween.get(this).to({x:oriX - moveX},200).wait(100).to({x:oriX},200).call(()=>{
				},this);
			}
			else if(aniName == RoleAttackAniGroupNames.WuKong_BaJiaoShan){//悟空芭蕉扇技能。角色乱飞
				if(this.status.current == SoldierStatusList.wait && Math.abs(this.y - this._posiXYSet[this.site].y) <= 30 ){

					let oriX = this._posiXYSet[this.site].x;
					let oriY = this._posiXYSet[this.site].y;

					let dir = Math.floor(Math.random()*2);// 左边还是右边
					let randBian = [[0,640], [640,0]];
					let randPosi = [Math.random()*400+100, Math.random()*100+300, Math.random()*400+100];//随机位置

					if(this._roleArmature["curPlayName"] == "move" || this._roleArmature["curPlayName"] == "stand"){
						if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("hit2",0);
						else this.PlayRoleAnimation("hit1",0);

						egret.Tween.get(this).to({x:randBian[dir][0],y:randPosi[0],rotation:180},250).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
						.to({x:randPosi[1],y:300,rotation:0},250).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
						.to({x:randBian[dir][1],y:randPosi[2],rotation:180},250).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
						.to({x:oriX, y:oriY, rotation:0},250)
						.call(()=>{
							if(this.status.current == SoldierStatusList.wait){
								this.PlayRoleAnimation("move",0);
							}
						},this);
					}
					// if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("hit2",0);
					// else this.PlayRoleAnimation("hit1",0);
				}else{
					hitMv = await PVPArmatureManager.CreatHitEffectAni(this,aniName);
					this._hitAniSet.push(hitMv);
				}
			}
			else if(aniName == RoleAttackAniGroupNames.CommAttack_yinyangerqiping || aniName == RoleAttackAniGroupNames.CommAttack_jinnao || aniName == RoleAttackAniGroupNames.CommAttack_zijinhonghulu || aniName == RoleAttackAniGroupNames.CommAttack_renzhongdai){//通用被吸入动画。阴阳二气瓶技能。
				if(this.status.current == SoldierStatusList.wait && Math.abs(this.y - this._posiXYSet[this.site].y) <= 30){
					
					// 飞入的位置，现在只能固定为悟空的位置
					let tarX = 223 - 50;
					let tarY = 450;

					if(this._roleArmature["curPlayName"] == "move" || this._roleArmature["curPlayName"] == "stand"){
						if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("hit2",0);
						else this.PlayRoleAnimation("hit1",0);

						if(this._isMineArmy){
							tarX = 431 + 50;
						}
						egret.Tween.get(this).to({x:tarX,y:tarY,rotation:1520,scaleX:0.1,scaleY:0.1},500).wait(1000)
						.to({x:this._posiXYSet[this.site].x,y:this._posiXYSet[this.site].y,rotation:0,scaleX:1,scaleY:1},500)
						.call(()=>{
							if(this.status.current == SoldierStatusList.wait){
								this.PlayRoleAnimation("move",0);
							}
						},this);
					}
				}else{
					hitMv = await PVPArmatureManager.CreatHitEffectAni(this,aniName);
					this._hitAniSet.push(hitMv);
				}
			}

			// if(aniName == RoleAttackAniGroupNames.ZJB_NormalAttack1){ //紫金钵普攻受击特效等待
			// 	egret.Tween.get(hitMv).wait(300/PVPFightManager.TIMESCALE).call(()=>{
			// 		if(hitMv.parent){
			// 			hitMv.parent.removeChild(hitMv);
			// 		}
			// 		for(let i=this._hitAniSet.length-1; i>=0; i--){
			// 			if(this._hitAniSet[i] == hitMv){
			// 				this._hitAniSet.splice(i,1);
			// 			}
			// 		}
			// 	});
			// }

			// if(aniName == RoleAttackAniGroupNames.WuKong_SanMeiZhenHuo || aniName == RoleAttackAniGroupNames.CommAttack_LiuXingHuo
			//  || aniName == RoleAttackAniGroupNames.CommAttack_HuiFu){//三昧真火受击爆破特效
			// 	let hitMv = await PVPArmatureManager.CreatHitEffectAni(this,aniName);
			// 	this._hitAniSet.push(hitMv);
			// }
			// else if(aniName == RoleAttackAniGroupNames.CommAttack_LiuXingHuo){//流星火受击爆破特效
			// 	let hitMv = await PVPArmatureManager.CreatHitEffectAni(this,"dra","pvp_sanmei_di","pvp_sanmei_di",aniName);
			// 	this._hitAniSet.push(hitMv);
			// }
			// else if(aniName == RoleAttackAniGroupNames.CommAttack_HuiFu){//白骨精恢复技能
			// 	await this._hitAniSet.push(PVPArmatureManager.CreatHitEffectAni(this,"dra","buff_blood","buff_before",aniName));
			// }
			// else if(aniName == RoleAttackAniGroupNames.WuKong_QianChong){//悟空冲刺技能
			// 	let moveX = 250 * this._direction;
			// 	let oriX = ArmyOfPosiSet[this._uid][this.site].x;
			// 	egret.Tween.get(this).to({x:oriX - moveX},200).wait(100).to({x:oriX},200).call(()=>{
			// 	},this);
			// }
			// else if(aniName == RoleAttackAniGroupNames.WuKong_BaJiaoShan){//悟空芭蕉扇技能。角色乱飞
			// 	if(this.status.current == SoldierStatusList.wait){

			// 		let oriX = ArmyOfPosiSet[this._uid][this.site].x;
			// 		let oriY = ArmyOfPosiSet[this._uid][this.site].y;

			// 		let dir = Math.floor(Math.random()*2);// 左边还是右边
			// 		let randBian = [[0,640], [640,0]];
			// 		let randPosi = [Math.random()*400+100, Math.random()*100+300, Math.random()*400+100];//随机位置

			// 		if(this._roleArmature["curPlayName"] == "stand"){
			// 			if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("hit2",0);
			// 			else this.PlayRoleAnimation("hit1",0);

			// 			egret.Tween.get(this).to({x:randBian[dir][0],y:randPosi[0],rotation:180},200).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
			// 			.to({x:randPosi[1],y:0,rotation:0},200).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
			// 			.to({x:randBian[dir][1],y:randPosi[2],rotation:180},200).call(()=>{FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);})
			// 			.to({x:oriX, y:oriY, rotation:0},200)
			// 			.call(()=>{
			// 				if(this.status.current == SoldierStatusList.wait){
			// 					this.PlayRoleAnimation("stand",0);
			// 				}
			// 			},this);
			// 		}
			// 		// if(this._roleid == AllRoleId.wukong) this.PlayRoleAnimation("hit2",0);
			// 		// else this.PlayRoleAnimation("hit1",0);
			// 	}
			// }
			// else if(aniName == RoleAttackAniGroupNames.ZJB_NormalAttack1){//紫金钵普攻受击特效
			// 	let _hitAni = await PVPArmatureManager.CreatHitEffectAni(this,"ima","pvp-hit_png",null);
			// 	this._hitAniSet.push(_hitAni);

			// 	egret.Tween.get(_hitAni).wait(300/PVPFightManager.TIMESCALE).call(()=>{
			// 		if(_hitAni.parent){
			// 			_hitAni.parent.removeChild(_hitAni);
			// 		}
			// 		for(let i=this._hitAniSet.length-1; i>=0; i--){
			// 			if(this._hitAniSet[i] == _hitAni){
			// 				this._hitAniSet.splice(i,1);
			// 			}
			// 		}
			// 	});
			// }
		}

		/**
		 * 实时侦听
		 */
		// public Framing(frameTime: number): void {
		// }

		/**
		 * 创建角色骨架，站立在原位
		 */
		protected async createArmature() {
			this.RemoveArmature(this._roleArmature);

			let resid = this._roleid;
			if(ArmyRoleResNameSet[this._roleid] == null){ resid = 0; }// 如果没有角色，就用id=0
			let res = ArmyRoleResNameSet[resid]["res"];
			this._roleArmature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(res, this);

			this._roleArmature.display.scaleX = ArmyRoleResNameSet[resid]["scaleX"];
			this._roleArmature.display.scaleY = ArmyRoleResNameSet[resid]["scaleY"];
			if(!this._isMineArmy){ this._roleArmature.display.scaleX *= -1; }// 如果不是我方战队，需要翻转

			this._roleArmature["Height"] = ArmyRoleResNameSet[resid]["Height"];
			this._roleArmature["Width"] = ArmyRoleResNameSet[resid]["Width"];
			
			if(!this._isMineArmy){
				let colorMatrix = [
					1,0,0,0,0,
					0,1,0,0,0,
					1,0,0,0,0,
					0,0,0,1,0
				];
				let colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
				this._roleArmature.display.filters = [colorFlilter]
			}
			
			this._roleArmature.animation.timeScale = 1;
			this._roleArmature.animation.timeScale = FacadeApp.Calc(effectEnum.HeroAttackSpeed, 1);
			this._roleArmature.animation.timeScale *= PVPFightManager.TIMESCALE;
			this._roleArmature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.RoleArmComplete.bind(this), this); 
			this.status.ChangeWait();
			this.addChild(this._roleArmature.display);
			this.creatLife();
		}

		/**
		 * 創建血条
		 */
		protected creatLife(){
			if(this._pvpRoleLifeBar == null){ this._pvpRoleLifeBar = new PVPRoleLife(); }
			this.addChild(this._pvpRoleLifeBar);

			this._pvpRoleLifeBar.x = -this._pvpRoleLifeBar.width / 2;
			this._pvpRoleLifeBar.y = -this.RoleHeight - this._roleArmature.display.y;
			this._pvpRoleLifeBar.slideDuration = 500; //缓动
		}

		/**
		 * 播放动作动画
		 */
		protected async PlayRoleSkillAniFun(){

			// 没有可以播放的动作。直接结束
			if(!this.curAniGroup && this.curAniIndex >= this.curAniGroup.length){
				return;
			}

			// 技能开始阶段就受击。发动攻击事件
			if(this.curAniGroup[this.curAniIndex]["hit"] && this.curAniGroup[this.curAniIndex]["hit"] == "startHit"){
				let _HitRoleObject = this.Army.getHitRoleObject(this.site);// 获取目标
				if(_HitRoleObject){
				for(let i=0; i<_HitRoleObject.length; i++){
					FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
					{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
					, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
				}
				}
			}

			// 判断动作类型
			if(this.curAniGroup[this.curAniIndex]["type"] == "mine"){// 角色身上动作
				this.RoleAniComplete = false;
				this._roleArmature["aniData"] = this.curAniGroup[this.curAniIndex];
				this.PlayRoleAnimation(this.curAniGroup[this.curAniIndex]["aniName"],1);
				this.curAniIndex += 1;
			}
			else if(this.curAniGroup[this.curAniIndex]["type"] == "newDragon" || this.curAniGroup[this.curAniIndex]["type"] == "newImage" || 
				this.curAniGroup[this.curAniIndex]["type"] == "newParticle" || this.curAniGroup[this.curAniIndex]["type"] == "newMovieClip"){
				this.SkillAniComplete = false;
				await this.creatSkillArmature(this.curAniGroup[this.curAniIndex],this.curAniIndex);
				this.curAniIndex += 1;
			}
			else{// 继续龙骨技能特效
				this.SkillAniComplete = false;
				for(let i=0; i<this._skillArmaSet.length; i++){
					// 如果不是全体动画。切换动画的时候重新对下位置。出现在敌人的方位。
					/**
					 * 这块-还可以优化
					 */
					if(!this.curAniGroup[this.curAniIndex]["isMulti"]){
						let emeyUid = this._skillArmaSet[i]["hitData"][0];
						let emeySite = this._skillArmaSet[i]["hitData"][2];
						let _posiUid = 1;
						if(emeyUid == PVPFightManager.GetInstance().armyOfEnemy._uid)	_posiUid = 2;
						let posi = ArmyOfPosiSet[_posiUid][emeySite];
						this._skillArmaSet[i].display.x = posi.x + this.curAniGroup[this.curAniIndex]["oriXY"][0] * this._direction;// + tarX;
						this._skillArmaSet[i].display.y = posi.y + this.curAniGroup[this.curAniIndex]["oriXY"][1];// + tarY;

					}
					this._skillArmaSet[i]["aniData"] = this.curAniGroup[this.curAniIndex];
					this._skillArmaSet[i]["curAniIndex"] = this.curAniIndex;
					this._skillArmaSet[i]["isClear"] = this.curAniGroup[this.curAniIndex]["isClear"];
					this._skillArmaSet[i].animation.gotoAndPlay(this.curAniGroup[this.curAniIndex]["aniName"], -1, -1, 1);
				}
				this.curAniIndex += 1;
			}

			// 不显示角色
			if(this.AttackAniGroupName == RoleAttackAniGroupNames.WuKong_Comboo && this.status.current == SoldierStatusList.attacking && this.curAniIndex - 1 == 0){
				this.visible = false;
			}else{
				this.visible = true;
			}

			// 震屏动画
			if(this.curAniGroup[this.curAniIndex-1] && this.curAniGroup[this.curAniIndex-1]["isZhenPing"] && this.curAniGroup[this.curAniIndex-1]["isZhenPing"] == "startZhenPing"){
				FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);
			}
			
			// 不等待直接播放下一个
			if(this.curAniGroup[this.curAniIndex] && this.curAniGroup[this.curAniIndex - 1]["isStop"] != null && this.curAniGroup[this.curAniIndex - 1]["isStop"] == false){ // 是否需要等待
				this.PlayRoleSkillAniFun();
			}
		}

		/**
		 * 创建技能特效
		 */
		protected async creatSkillArmature(aniObject: Object,curAniIndex) {
			let _HitRoleObject:number[][] = this.Army.getHitRoleObject(this.site);
			if(_HitRoleObject == null){
				_HitRoleObject = [[this._uid,1,2]];
				console.log("没有受击目标,可能给自己释放技能");
			}

			let type = "dra";
			if(aniObject["type"] == "newImage") type = "ima";
			else if(aniObject["type"] == "newParticle") type = "par";
			else if(aniObject["type"] == "newMovieClip") type = "mov";

			// 清空特效
			this.ClearSkillArmature();
			// 创建龙骨特效。初始化。单体攻击。多个目标
			if(aniObject["isMulti"]){
				this._skillArmaSet.push(await PVPArmatureManager.creatSkillArmaRes(this, aniObject,type,_HitRoleObject[0],curAniIndex));
			}
			else{
				if(_HitRoleObject){
				for(let i=0; i<_HitRoleObject.length; i++){
					this._skillArmaSet.push(await PVPArmatureManager.creatSkillArmaRes(this, aniObject,type,_HitRoleObject[i],curAniIndex));
				}
				}
			}

			this.PlaySkillMoveFun();

			if(type == "ima" || type == "par"){ this.SkillAniComplete = true; }
		}

		/**
		 * 技能特效龙骨动画播放完成
		 */
		public SkillArmatureCompleteFun(e){
			// 全体攻击，没有移动，播放完直接发出攻击。1.处于攻击状态2.结束受击3.是全体攻击4.移动完成
			if(this.status.current == SoldierStatusList.attacking && e.target._armature["aniData"]["hit"] && e.target._armature["aniData"]["hit"] == "endHit" 
			&& e.target._armature["aniData"]["isMulti"] && this.SkillTweenComplete){
				let _HitRoleObject = this.Army.getHitRoleObject(this.site);// 获取目标
				if(_HitRoleObject){
				for(let i=0; i<_HitRoleObject.length; i++){
					FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
					{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
						, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
				}
				}
			}

			this.SkillAniComplete = true;

			// 清理特效。1.如果特效存在2.如果特效是播放就清理3.并且特效没有移动
			let lastSkill = this._skillArmaSet[this._skillArmaSet.length - 1];
			if(lastSkill && lastSkill["isClear"]
				 && RoleAttackAniGroupNames.skillMoveAni(this.AttackAniGroupName,this.status.current,lastSkill["curAniIndex"]).isMove == false){
				this.ClearSkillArmature();
			}
			this.judgeAndClearCurFightData();
		}

		/**
		 * 技能特效帧动画播放完成
		 */
		public SkillMovieClipCompleteFun(e){
			// 全体攻击，没有移动，播放完直接发出攻击。1.处于攻击状态2.结束受击3.是全体攻击4.移动完成
			if(this.status.current == SoldierStatusList.attacking && e.target["aniData"]["hit"] && e.target["aniData"]["hit"] == "endHit" 
			&& e.target["aniData"]["isMulti"] && this.SkillTweenComplete){
				let _HitRoleObject = this.Army.getHitRoleObject(this.site);// 获取目标
				if(_HitRoleObject){
				for(let i=0; i<_HitRoleObject.length; i++){
					FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
					{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
						, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
				}
				}
			}

			this.SkillAniComplete = true;

			// 清理特效。1.如果特效存在2.如果特效是播放就清理3.并且特效没有移动
			let lastSkill = this._skillArmaSet[this._skillArmaSet.length - 1];
			if(lastSkill && lastSkill["isClear"]
				 && RoleAttackAniGroupNames.skillMoveAni(this.AttackAniGroupName,this.status.current,lastSkill["curAniIndex"]).isMove == false){
				this.ClearSkillArmature();
			}
			this.judgeAndClearCurFightData();
		}

		/**
		 * 开始技能特效-移动动画
		 */
		private PlaySkillMoveFun(){
			let moveData = RoleAttackAniGroupNames.skillMoveAni(this.AttackAniGroupName,this.status.current,this.curAniIndex);

			if(moveData.isMove){
				this.SkillTweenComplete = false;
				let _HitRoleObject:number[][] = this.Army.getHitRoleObject(this.site);// 受击目标。可能自己-buff。可能友方-恢复。可能敌方-单体攻击。可能全体-全体攻击。

				for(let i=this._skillArmaSet.length-1; i >=0; i--){
					// 获取移动目标
					let mubiao = this._skillArmaSet[i];
					if(this._skillArmaSet[i]["type"] == "dra"){
						mubiao = this._skillArmaSet[i].display;
					}

					// 获取目标点
					let target = this._posiXYSet[this.site];// 初始化为原位
					if(moveData.isMulti && _HitRoleObject != null){// 如果是全体攻击。攻击对方悟空位置
						let _posiUid = 1;
						if(_HitRoleObject[0][0] == PVPFightManager.GetInstance().armyOfEnemy._uid)	_posiUid = 2;
						target = ArmyOfPosiSet[_posiUid][2];// 攻击目标
					}
					else if(!moveData.isMulti && _HitRoleObject != null){// 如果是单体攻击。攻击对应位置
						let _posiUid = 1;
						if(_HitRoleObject[i][0] == PVPFightManager.GetInstance().armyOfEnemy._uid)	_posiUid = 2;
						target = ArmyOfPosiSet[_posiUid][_HitRoleObject[i][2]];// 攻击目标
					}

					// 获取距离。用于时间
					let mubiaoPosi = new Object;
					mubiaoPosi["x"] = target.x + moveData.deviation[0] * this._direction;
					mubiaoPosi["y"] = target.y + moveData.deviation[1];
					let dx = target.x - mubiao.x;
					let dy = target.y - mubiao.y;
					let distance = Math.sqrt((dx)*(dx)+(dy)*(dy));
					let time = distance * moveData.speed / PVPFightManager.TIMESCALE;
					if(distance == 0) time = moveData.speed / PVPFightManager.TIMESCALE;// 原位的动画

					// 设定参数值
					mubiao["tarX"] = target.x;
					mubiao["tarY"] = target.y;
					mubiao["oriX"] = mubiao.x;
					mubiao["oriY"] = mubiao.y;

					// Tween动画
					/**
					 * 还可以优化
					 */
					if(moveData.tweenType == SkillAniType.bajiaoshan){// 龙卷风(动画中没有分层。tween动画来分攻击层)
						// let eachTime = time/RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName);
						egret.Tween.get(mubiao)
					.to({x:mubiaoPosi["x"] - 130*this._direction, y:mubiaoPosi["y"]}, time*0.3)
						.call(()=>{
							if(_HitRoleObject){
							for(let i=0; i<_HitRoleObject.length; i++){
								FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
								{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
									, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
							}
							}
						})
					// .to({x:mubiaoPosi["x"], y:mubiaoPosi["y"]}, time*0.4)
					// 	.call(()=>{
					// 		for(let i=0; i<_HitRoleObject.length; i++){
					// 			FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
					// 			{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
					// 				, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
					// 		}
					// })
					.to({x:mubiaoPosi["x"] + (100)*this._direction, y:mubiaoPosi["y"]}, time*0.7)
						 .call(this.SkillTweenCompleteFun,this,[moveData]);
					}
					else if(moveData.tweenType == SkillAniType.wukongComboo){//comboo
						egret.Tween.get(mubiao).to(
							{x:mubiaoPosi["x"] - 100*this._direction, y:mubiaoPosi["y"] - mubiao.height/3, scaleX:1*this._direction, scaleY:1}, time)
						 .call(this.SkillTweenCompleteFun,this,[moveData]);
					}
					else if(moveData.tweenType == SkillAniType.paodan){//子弹攻击
						if(i==0){ egret.Tween.get(this).to({factor:1}, time, egret.Ease.circIn).call(this.SkillTweenCompleteFun,this,[moveData]);}//只执行一次
					}
					else if(moveData.tweenType == SkillAniType.huifu){//恢复
						if(i==0){ egret.Tween.get(this).to({factor:1}, time).call(this.SkillTweenCompleteFun,this,[moveData]);}//只执行一次
					}
					else if(moveData.tweenType == SkillAniType.dunwu){//顿悟
						// mubiao.y -= (this.RoleHeight - 50);
						egret.Tween.get(mubiao).to({x:mubiaoPosi["x"], y:mubiaoPosi["y"]},time)
						.call(this.SkillTweenCompleteFun,this,[moveData]);
					}
					else if(moveData.tweenType == SkillAniType.normal){//普通攻击
						mubiao.rotation = Math.atan2(dy,dx)*180/Math.PI;
						egret.Tween.get(mubiao).to({x:mubiaoPosi["x"], y:mubiaoPosi["y"], rotation:Math.atan2(dy,dx)*180/Math.PI},time)
						.call(this.SkillTweenCompleteFun,this,[moveData]);
					}
				}
			}
		}

		/**
		 * 技能特效移动动画播放完成
		 */
		public SkillTweenCompleteFun(moveData){
			// 位移,发出攻击。1.处于攻击的状态。2.到达触发受击。3.移动没有完成,只发出一个受击
			if(this.status.current == SoldierStatusList.attacking && moveData.isHit && !this.SkillTweenComplete){
				let _HitRoleObject = this.Army.getHitRoleObject(this.site);// 获取目标
				if(_HitRoleObject){
					for(let i=0; i<_HitRoleObject.length; i++){
						FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE, 
						{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
							, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
					}
				}
			}
			this.SkillTweenComplete = true;
			this.judgeAndClearCurFightData();
		}

		/**
		 * 角色动画播放完成
		 */
		protected RoleArmComplete(){
			// 如果是攻击中,每次进入最低都是1。发出受击事件
			if(this.status.current == SoldierStatusList.attacking && this.curAniIndex !=0 && this.curAniGroup[this.curAniIndex-1]["hit"] && this.curAniGroup[this.curAniIndex-1]["hit"] == "endHit"){
				let _HitRoleObject = this.Army.getHitRoleObject(this.site);// 获取目标
				if(this.curAniGroup[this.curAniIndex-1]["type"] == "mine"){//如果是角色自己本身
					if(_HitRoleObject){
					for(let i=0; i<_HitRoleObject.length; i++){
						FacadeApp.dispatchAction(CommandList.PVP_HIT_ROLE,
						{aniName: this.AttackAniGroupName, site: _HitRoleObject[i], jiduan:RoleAttackAniGroupNames.getHitNum(this.AttackAniGroupName)
							, eventIndex: this.Army.eachFightDataSet[this.site][0]["EventIndex"]});
					}
					}
				}
			}

			// 播放下一个动画序列
			if ((this.status.current == SoldierStatusList.attackBefore || this.status.current == SoldierStatusList.attackEnd || this.status.current == SoldierStatusList.attacking)
				&& this.curAniGroup && this.curAniIndex < this.curAniGroup.length){
					if(this._roleArmature["aniData"]["isStop"] == null || this._roleArmature["aniData"]["isStop"] == true){
						this.PlayRoleSkillAniFun();
						return;
					}
			}


			/**
			 * 还可以优化
			 */
			// 处于被中断攻击
			if(this.status.current == SoldierStatusList.interrupted){
				// console.log("_攻击完成");
				this.RoleAniComplete = true;
				this.RoleTweenComplete = true;
				this.SkillAniComplete = true;
				this.SkillTweenComplete = true;
				this.judgeAndClearCurFightData();
				return;
			}

			// 处于受击后。
			if(this.status.current == SoldierStatusList.wait){
				if(this._roleArmature["curPlayName"] == "hit1" || this._roleArmature["curPlayName"] == "hit2"){
					this.PlayRoleAnimation("move",0);
				}
			}

			// 会下来说明动画已经全部播放出来
			this.RoleAniComplete = true;
			this.judgeAndClearCurFightData();
		}

		/**
		 * 更改攻击速度
		 */
		public changeRoleTimeScale(){
			this._roleArmature.animation.timeScale = 1;
			this._roleArmature.animation.timeScale = FacadeApp.Calc(effectEnum.HeroAttackSpeed, 1);
			this._roleArmature.animation.timeScale *= PVPFightManager.TIMESCALE;

			for(let i=0; i<this._skillArmaSet.length;i++){
				if(this._skillArmaSet[i]["type"] == "dra"){
					this._skillArmaSet[i].animation.timeScale = PVPFightManager.TIMESCALE;
				}
			}

			for(let i=this._hitAniSet.length-1; i>=0; i--){
				if(this._hitAniSet[i]["type"] == "dra"){
					this._hitAniSet[i].animation.timeScale = PVPFightManager.TIMESCALE;
				}
			}

			for(let i=0; i<this._buffArmaSet.length; i++){
				if(this._buffArmaSet[i]["type"] == "dra"){
					this._buffArmaSet[i].animation.timeScale = PVPFightManager.TIMESCALE;
				}
			}
		}

		/**
		 * 播放攻击音效
		 */
		protected _PlayAttackMusic(){
			for (var i = 1; i <= RoleAttackAniGroupNames.AttackCount; i++){
				if (this.AttackAniGroupName == "attack"+i && i < 6){
					SoundManager.PlayMusic(SoundManager["Attack" + i + "_Music"], 1);
				}
			}
		}

		/**
		 * 如果动作全部播放完毕。删除当前动作
		 */
		public judgeAndClearCurFightData(){
			let lastSkill = this._skillArmaSet[this._skillArmaSet.length - 1];
			// 播放下一个动画序列
			if ((this.status.current == SoldierStatusList.attackBefore || this.status.current == SoldierStatusList.attackEnd || this.status.current == SoldierStatusList.attacking)
				&& this.curAniGroup && this.curAniIndex < this.curAniGroup.length){
					// 判断是否需要等待移动完成。移动OK了才可以播放下一个。用是否有移动动画判断
					if((lastSkill && RoleAttackAniGroupNames.skillMoveAni(this.AttackAniGroupName,this.status.current,lastSkill["curAniIndex"]).isMove == false)
					|| (lastSkill && RoleAttackAniGroupNames.skillMoveAni(this.AttackAniGroupName,this.status.current,lastSkill["curAniIndex"]).isMove && this.SkillTweenComplete)
					|| (!lastSkill))
					{
						this.PlayRoleSkillAniFun();
						return;
					}
			}

			// 所有动作播放完成
			if(this.RoleAniComplete && this.RoleTweenComplete && this.SkillAniComplete && this.SkillTweenComplete){
				// && this.HitEffectComplete && this._hitAniSet.length == 0){
				this.ClearSkillArmature();
				this._roleArmature["aniData"] = null;
				this.status.ChangeWait();
				if(PVPFightManager.GetInstance().status.current!="end"){
					this.Army.removeFightData(this.site);
				}
			}
		}

		/**
		 * 判断受击对象状态。等待发动攻击
		 */
		// protected judgeHitObjectStute(){

		// 	// 下个动作是攻击
		// 	if(this.Army.eachFightDataSet[this.site][1]["type"] == OperationType.Skill && this.Army.eachFightDataSet[this.site][1]["params"]["state"] == 1){
		// 		let _hitObject =  this.Army.eachFightDataSet[this.site][1]["params"]["sim"];// 受击对象
		// 		let _skillType = this.Army.eachFightDataSet[this.site][1]["params"]["type"];// 技能类型

		// 		if(_hitObject == null) return true;

		// 		// 判断攻击的对象是否都已经处于可受击状态
		// 		if((_skillType == SkillType.Attack || _skillType == SkillType.Encourage || _skillType == SkillType.ConfuseAttack
		// 		|| _skillType == SkillType.BaJiao || _skillType == SkillType.RealFire) && _hitObject){//&& _skillType != SkillType.Counter || _skillType == SkillType.Recover
		// 			for(let i=0; i<_hitObject.length;i++){
		// 				let army = this.getArmy(_hitObject[i][0]);
		// 				let site = _hitObject[i][2];
		// 				if(army.eachFightDataSet[site][0]["type"] != OperationType.AttrChanged){
		// 					// console.log("播放动画对象数据："+this.isMineArmy, this.Army.curFightDataSet[this.site]);
		// 					this.Army.curFightDataSet[this.site] = null;
		// 					egret.setTimeout(()=>{FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData);},this,500/PVPFightManager.TIMESCALE);
		// 					return false;
		// 				}
		// 			}
		// 		}
		// 	}

		// 	return true;
		// }


		/**
		 * 播放人物动画
		 */
		public PlayRoleAnimation($aniName:string, time:number){
			if(this._roleArmature == null) return;

			if(time == 0){
				if(this._roleArmature["curPlayName"] != $aniName){
					this._roleArmature.animation.gotoAndPlay($aniName,-1,-1,time);
				}
			}else{
				this._roleArmature.animation.gotoAndPlay($aniName,-1,-1,time);
			}
			
			this._roleArmature["curPlayName"] = $aniName;
		}

		/**
		 * 移除龙骨
		 */
		public RemoveArmature($dargon){
			if($dargon != null){ //从舞台上移除怪物的龙骨动画对象，并将其置空
				MovieManage.RemoveArmature($dargon);
				if($dargon.display.parent){
					$dargon.display.parent.removeChild($dargon.display);
				}
				$dargon = null;
			}
		}

		/**
		 * 移除技能骨架
		 */
		public ClearSkillArmature() {
			if(this._skillArmaSet.length > 0){
				for(let i=0; i<this._skillArmaSet.length; i ++){
					if(this._skillArmaSet[i]["type"] == "dra"){
						if(this._skillArmaSet[i].display.parent){
							this._skillArmaSet[i].display.scaleX = 1;
							this._skillArmaSet[i].display.rotation = 0;
							PVPFightManager.GetInstance().removeChild(this._skillArmaSet[i].display);
							MovieManage.RemoveArmature(this._skillArmaSet[i]);
						}
					}else if(this._skillArmaSet[i]["type"] == "ima"){
						if(this._skillArmaSet[i].parent){
							this._skillArmaSet[i].scaleX = 1;
							this._skillArmaSet[i].rotation = 0;
							PVPFightManager.GetInstance().removeChild(this._skillArmaSet[i]);
							ObjectPool.getPool('eui.Image').returnObject(this._skillArmaSet[i]);
						}
					}
					else{
						if(this._skillArmaSet[i].parent){
							this._skillArmaSet[i].stop();
							this._skillArmaSet[i].scaleX = 1;
							this._skillArmaSet[i].rotation = 0;
							PVPFightManager.GetInstance().removeChild(this._skillArmaSet[i]);
						}
						// if(this._skillArmaSet[i]["type"] == "mov") ObjectPool.getPool('egret.MovieClip').returnObject(this._skillArmaSet[i]);
					}
				}
				this._skillArmaSet = [];
			}
		}

		/**
		 * 暂停战斗
		 */
		public PausePVPFight(){
			for(let i=0;i<this._skillArmaSet.length;i++){
				egret.Tween.pauseTweens(this._skillArmaSet[i]);
				if(this._skillArmaSet[i]["type"] == "dra"){
					this._skillArmaSet[i].animation.stop();
				}else if(this._skillArmaSet[i]["type"] == "mov"){
					this._skillArmaSet[i].stop();
				}
			}
			this._roleArmature.animation.stop();
			egret.Tween.pauseTweens(this);
		}

		/**
		 * 继续战斗
		 */
		public ContinuePVPFight(){
			for(let i=0;i<this._skillArmaSet.length;i++){
				egret.Tween.resumeTweens(this._skillArmaSet[i]);
				if(this._skillArmaSet[i]["type"] == "dra"){
					this._skillArmaSet[i].animation.play();
				}else if(this._skillArmaSet[i]["type"] == "mov"){
					this._skillArmaSet[i].play();
				}
			}
			this._roleArmature.animation.play();
			egret.Tween.resumeTweens(this);
		}

		/**
		 * 结束战斗
		 */
		public EndPVPFight(){
			for(let i=0;i<this._skillArmaSet.length;i++){
				egret.Tween.removeTweens(this._skillArmaSet[i]);
				if(this._skillArmaSet[i]["type"] == "dra"){
					this._skillArmaSet[i].animation.stop();
				}else if(this._skillArmaSet[i]["type"] == "mov"){
					this._skillArmaSet[i].stop();
				}
			}
			this._roleArmature.animation.stop();
			egret.Tween.removeTweens(this);
			this.ClearSkillArmature();
		}

		/**
		 * 获取战队
		 */
		public get Army(){
			let army = PVPFightManager.GetInstance().armyOfEnemy;
			if(this._isMineArmy){
				army = PVPFightManager.GetInstance().armyOfMine;
			}
			return army;
		}

		/**
		 * 获取另一个战队
		 */
		public getArmy($uid){
			if($uid == 1 || $uid == true){
				return PVPFightManager.GetInstance().armyOfMine;
			}else{
				return PVPFightManager.GetInstance().armyOfEnemy;
			}
		}

		/**
		 * 获取角色的高
		 */
		public get RoleHeight(){
			if(this._roleArmature.display){
				return this._roleArmature["Height"];
			}

			return 0;
		}

		/**
		 * 获取角色的宽
		 */
		public get RoleWidth(){
			if(this._roleArmature.display){
				return this._roleArmature["Width"];
			}

			return 0;
		}

		/**
		 * 角色身上动画
		 */
		public get RoleAniComplete(){
			return this._isRoleAniComplete;
		}
		/**
		 * 角色身上动画
		 */
		public set RoleAniComplete(value: boolean){
			this._isRoleAniComplete = value;
		}
		/**
		 * 角色身上移动动画
		 */
		public get RoleTweenComplete(){
			return this._isRoleTweenComplete;
		}
		/**
		 * 角色身上移动动画
		 */
		public set RoleTweenComplete(value: boolean){
			this._isRoleTweenComplete = value;
		}
		/**
		 * 技能特效动画
		 */
		public get SkillAniComplete(){
			return this._isSkillAniComplete;
		}
		/**
		 * 技能特效动画
		 */
		public set SkillAniComplete(value: boolean){
			this._isSkillAniComplete = value;
		}
		/**
		 * 技能特效移动动画
		 */
		public get SkillTweenComplete(){
			return this._isSkillTweenComplete;
		}
		/**
		 * 技能特效移动动画
		 */
		public set SkillTweenComplete(value: boolean){
			this._isSkillTweenComplete = value;
		}
		/**
		 * 受击特效动画
		 */
		// public get HitEffectComplete(){
		// 	return this._isHitEffectComplete;
		// }
		// /**
		//  * 受击特效动画
		//  */
		// public set HitEffectComplete(value: boolean){
		// 	this._isHitEffectComplete = value;
		// }


		/**
		 * 弧度动画参数
		 */
		public get factor():number {
			return 0;
		}
		/**
		 * 弧度动画
		 */
		public set factor(value:number) {
			for(let i=this._skillArmaSet.length-1 ;i>=0;i--){
				let dx = this._skillArmaSet[i]["tarX"] - this._skillArmaSet[i]["oriX"];
				let dy = this._skillArmaSet[i]["tarY"] - this._skillArmaSet[i]["oriY"];
				this._skillArmaSet[i].rotation = Math.atan2(dy,dx)*180/Math.PI;
				/**
				 * 还可以优化
				 */
				this._skillArmaSet[i].x = (1 - value) * (1 - value) * this._skillArmaSet[i]["oriX"] + 2 * value * (1 - value) * (this._skillArmaSet[i]["oriX"] + dx/2) 
											+ value * value * this._skillArmaSet[i]["tarX"];
				this._skillArmaSet[i].y = (1 - value) * (1 - value) * this._skillArmaSet[i]["oriY"] + 2 * value * (1 - value) * (this._skillArmaSet[i]["oriY"] - 300) 
											+ value * value * this._skillArmaSet[i]["tarY"];
			}
		}
		/**
		 * 战斗单元的类型
		 */
		public unitType: SoldierType = SoldierType.pvpMineHero;
		/**
		 * 是否是我方战队
		 */
		public _isMineArmy: boolean = false;
		/**
		 * 方向
		 */
		public _direction: number = 1;
		/**
		 * 血条
		 */
		public _pvpRoleLifeBar: PVPRoleLife;		
		/**
		 * 角色ID
		 */
		public _roleid: number = 0;
		/**
		 * 位置信息
		 */
		public _posiXYSet:Object = null;
		/**
		 * 队伍ID
		 */
		public _uid: number = 0;
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
		public _roleArmature: dragonBones.Armature;
		/**
		 * 技能特效动画骨架
		 */
		protected _skillArmaSet: any[] = [];
		/**
		 * buff动画骨架
		 */
		public _buffArmaSet: any[] = [];
		/**
		 * 当前攻击动作组名
		 */
		public AttackAniGroupName:string = '';
		/**
		 * 位置
		 */
		public site: number = 2;
		/**
		 * 已经发生的所有战斗事件序列编号
		 */
		public _allEventIndex: number[] = [];

		/**
		 * 当前角色发动技能动画是否播放完毕
		 */
		public _isRoleAniComplete: boolean = true;
		public _isRoleTweenComplete: boolean = true;
		public _isSkillAniComplete: boolean = true;
		public _isSkillTweenComplete: boolean = true;
		public _isHitEffectComplete: boolean = true;

		/**
		 * 当前动作组中的索引
		 */
		public curAniIndex: number = 0;
		/**
		 * 当前攻击动作集合
		 */
		public curAniGroup: string[];
		/**
		 * 受击特效
		 */
		public _hitAniSet = [];
		/**
		 * 状态机
		 */
		public status: ISoldier;
	}
}
