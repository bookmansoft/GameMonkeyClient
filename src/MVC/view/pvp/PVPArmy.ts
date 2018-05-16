/**
 * PVP战队管理
 */
namespace PVPManager{
    /**
     * 战斗编队管理对象
     */
    export class PVPArmy extends egret.DisplayObjectContainer{
		public constructor(){
			super();

			// 攻击事件
			FacadeApp.AddListener(CommandList.PVP_HIT_ROLE, this.addHitEvent.bind(this), this);

			// 检测下一步
			FacadeApp.AddListener(CommandList.PVP_CheckAttackData, () => {
				this.StartCheckFight();
			}, this);

			// this.randMove();
		}

		// private randMove(){
		// 	if(this.y == ArmyOfPosiSet[this._uid][this.site].y && Math.abs(this.x - ArmyOfPosiSet[this._uid][this.site].x) <=50 && this._isWaitMove == false
		// 	&& this.RoleTweenComplete)
		// 	{
		// 		this._isWaitMove = true;
		// 		let randX = Math.random()*10 + 10;
		// 		let dir = Math.floor(Math.random() * 1);
		// 		randX = dir == 0 ? -randX : randX;
		// 		if(this.x != ArmyOfPosiSet[this._uid][this.site].x){
		// 			let moveX = Math.abs(this.x - ArmyOfPosiSet[this._uid][this.site].x);
		// 			egret.Tween.get(this).to({x:ArmyOfPosiSet[this._uid][this.site].x},moveX * 20).call(()=>{this._isWaitMove = false;this.randMove},this);
		// 		}
		// 		else{
		// 			let moveX = Math.abs(this.x - ArmyOfPosiSet[this._uid][this.site].x + randX);
		// 			egret.Tween.get(this).to({x:ArmyOfPosiSet[this._uid][this.site].x + randX},moveX * 20).call(()=>{this._isWaitMove = false;this.randMove},this);
		// 		}
				
		// 	}
		// }

		/**
		 * 当配置发生变化时，进行军队的重构
		 */
		public rebuild(sl: Array<SoldierConfigInfo>){
			this.TypeList = sl;

			//构造新的军队
			this.TypeList.map(ci=>{
				let ns= SoldierFactory.inst.newSildier(ci);
				ns["site"] = ci.site;
				this.soldiers.push(ns);
				return ns;
			});
			this.Register(this);
		}

		/**
		 * 全体撤退
		 */
		public retreatFun(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.ChangeMove();
					egret.Tween.get(so).to({x: -100}, 1000).call(()=>{
						resolve();
					}, this);
				});
			}));
		}

		/**
		 * 胜利后全体前进
		 */
		public goAheadFun(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.ChangeMove();
					egret.Tween.get(so).to({x: 1000}, 1700).call(()=>{
						so.x = GameConfigOfRuntime.roleX;
						resolve();
					}, this);
				});
			}));
		}

		/**
		 * 暂停
		 */
		public pauseFun(){
			this.soldiers.map(so=>{
				so.PausePVPFight();
			});
		}
		/**
		 * 继续
		 */
		public continuesFun(){
			this.soldiers.map(so=>{
				so.ContinuePVPFight();
			});
		}

		/**
		 * 结束战斗
		 */
		public endFun(){
			this.soldiers.map(so=>{
				so.EndPVPFight();
			});
		}

		/**
		 * 突然消失
		 */
		public disappearFun(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.ChangeMove();
					so.x = GameConfigOfRuntime.roleX;
					resolve();
				});
			}));
		}

		/**
		 * 实时侦听
		 */
		public Framing(frameTime: number, coordinate){
			// this.soldiers.map(so=>{
			// 	so.Framing(frameTime);
			// });
		}

		/**
		 * 开始执行战场数据
		 */
		public StartCheckFight(){

			// if(PVPFightManager.GetInstance().status.current == "suspend" ||) return;

			// 整个战斗结束
			if(this.FightDataSet[0] == null &&
				PVPFightManager.GetInstance().JudgeAniEventByIndex(PVPFightManager.GetInstance()._PVPFightControlSet[PVPFightManager.GetInstance()._PVPFightControlSet.length - 1]["PreCondition"])
				&& PVPFightManager.GetInstance().status.current != "end"){
				console.log("整个战场结束!~");
				PVPFightManager.GetInstance().status.ChangeEnd();
				return;
			}

			// 整个战场播放FightDataSet
			// if(this.FightDataSet[0]){
			// 	if(this.FightDataSet[0]["PreCondition"] == 0){
			// 		this.judgeAniEvent(this.FightDataSet[0]["params"]["site"], this.FightDataSet[0]);
			// 	}else{
			// 		//判断前置行动是否已完成
			// 		if(PVPFightManager.GetInstance().JudgeAniEventByIndex(this.FightDataSet[0]["PreCondition"])){
			// 			this.judgeAniEvent(this.FightDataSet[0]["params"]["site"], this.FightDataSet[0]);
			// 		}else{
			// 			let role = this.curPosiSoldier(this.FightDataSet[0]["params"]["site"]);
			// 			if(role){
			// 				role.status.wait();
			// 			}
			// 			this.curFightDataSet[this.FightDataSet[0]["params"]["site"]] = null;
			// 		}
			// 	}
			// }

			// 判断每个角色身上的事件
			for(let i=0;i<this.eachFightDataSet.length; i++){
				if(this.eachFightDataSet[i].length > 0){
					if(this.eachFightDataSet[i][0]["PreCondition"] == 0){
						this.judgeAniEvent(this.eachFightDataSet[i][0]["params"]["site"], this.eachFightDataSet[i][0]);
					}else{
						//判断前置行动是否已完成
						if(PVPFightManager.GetInstance().JudgeAniEventByIndex(this.eachFightDataSet[i][0]["PreCondition"])){
							this.judgeAniEvent(this.eachFightDataSet[i][0]["params"]["site"], this.eachFightDataSet[i][0]);
						}else{
							let role = this.curPosiSoldier(this.eachFightDataSet[i][0]["params"]["site"]);
							if(role){
								role.status.ChangeWait();
								this.curFightDataSet[this.eachFightDataSet[i][0]["params"]["site"]] = null;
							}
						}
					}
				}
			}
		}

		/**
		 * 判断动作类型,执行动作
		 * $site 位置
		 * $object 动作数据
		 */
		private async judgeAniEvent($site: number, $fightData: Object){

			if(PVPFightManager.GetInstance().status.current != FightStatusList.running){
				if($fightData["type"] != OperationType.Enter){
					this.curFightDataSet[$site] = null;
					return;
				}
			}

			if(this.curFightDataSet[$site] == $fightData) 
				return; // 正在执行

			this.curFightDataSet[$site] = $fightData;
			let _site = $site;

			// 获取操作角色
			let _role = this.curPosiSoldier(_site);
			if(_role == null){
				this.curFightDataSet[_site] = null;
				console.log("找不到形象");
				// if(PVPFightManager.GetInstance().status.current == FightStatusList.running && $fightData){
				// 	egret.setTimeout(()=>{FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData)},this,2000);
				// }
				return;
			}

			// if(_role.status.current == SoldierStatusList.hit){
			// 	console.log("处于受击中，返回");
			// 	this.curFightDataSet[$site] = null;
			// 	egret.setTimeout(function() {
			// 		FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData);
			// 	}, this,500);
			// 	return;
			// }
			

			if($fightData["type"] == OperationType.Enter){// 进场
				if(_role._pvpRoleLifeBar) _role._pvpRoleLifeBar.visible = false;
				_role.status.ChangeMove();

				// 获取位置
				let _posiUid = 1;
				if(_role._uid == PVPFightManager.GetInstance().armyOfEnemy._uid)	_posiUid = 2;
				let moveX: number = ArmyOfPosiSet[_posiUid][_site].x;
				let moveY: number = ArmyOfPosiSet[_posiUid][_site].y;
				if(_role._roleid != AllRoleId.wukong){
					_role.visible = false;
					_role.x = moveX;
					_role.y = moveY;
					let hit = await PVPArmatureManager.CreatHitEffectAni(_role, RoleAttackAniGroupNames.CommAttack_JinChang);
					let res = null;
					if(ArmyRoleResNameSet[_role._roleid]) res = ArmyRoleResNameSet[_role._roleid]["enterRes"];
					else res = ArmyRoleResNameSet[0]["enterRes"];

					let roleBai = new eui.Image(RES.getRes(res));
					this.addChild(roleBai);
					roleBai.x = moveX - roleBai.width/2;
					roleBai.y = moveY - roleBai.height;
					roleBai.visible = false;

					// 进场动画
					egret.Tween.get(roleBai).wait(400).call(()=>{
						_role.visible = true;
						roleBai.visible = true;}
					).to({alpha:0},500).call(()=>{
						this.removeChild(roleBai);
						// 更新血条
						// _role.filters = [];
						if(_role._pvpRoleLifeBar) _role._pvpRoleLifeBar.visible = true;

						if($fightData["params"]["value"] && _role._pvpRoleLifeBar){
							_role._pvpRoleLifeBar.upData($fightData["params"]["value"]);
						}
						_role.status.ChangeWait();

						// 主角和召唤区别
						this.removeFightData(_site);
					});
				}
				else{
					// 进场动画
					egret.Tween.get(_role).to({x:moveX,y:moveY},500).call(()=>{
						// 更新血条
						if(_role._pvpRoleLifeBar) _role._pvpRoleLifeBar.visible = true;

						if($fightData["params"]["value"] && _role._pvpRoleLifeBar){
							_role._pvpRoleLifeBar.upData($fightData["params"]["value"]);
						}
						_role.status.ChangeWait();

						// 主角和召唤区别
						if(_role._roleid != 1){
							this.removeFightData(_site);
						}else{
							this.removeFightData(_site,false);
						}
					});
				}
			}
			else if($fightData["type"] == OperationType.Skill){// 战斗，技能，攻击
				if($fightData["params"]["state"] == 0){// 前摇
					if(_role.status.current != SoldierStatusList.attackBefore)
						_role.status.ChangeReadyAttack($fightData["params"]["type"]);
				}
				else if($fightData["params"]["state"] == 1){// 攻击
					if(SkillType.isZhaoHuanSkill($fightData["params"]["type"])){// 准备召唤
						let petInfo = $fightData["params"]["sim"];
						//注入编组信息
						petInfo.map(pet=>{
							let petType = pet[0] == PVPFightManager.GetInstance().armyOfMine._uid ? SoldierType.pvpMinePet:SoldierType.pvpEnemyPet;
							let army = pet[0] == PVPFightManager.GetInstance().armyOfMine._uid ? PVPFightManager.GetInstance().armyOfMine:PVPFightManager.GetInstance().armyOfEnemy;
							army.rebuild([
								new SoldierConfigInfo(petType, pet[1], pet[2],pet[0])
							]);
						});
					}
					if(_role.status.current != SoldierStatusList.attacking){
						_role.status.ChangeAttacking();
					}
				}
				else if($fightData["params"]["state"] == 3){//结束攻击
					if(_role.status.current != SoldierStatusList.attackEnd) _role.status.ChangeAttackLater();
				}
				else if($fightData["params"]["state"] == 2){//被中断攻击
					_role.status.ChangeInterrupted();
				}
			}
			else if($fightData["type"] == OperationType.AttrChanged){ // 受击,生命，攻击发生变化
				// 更新血条
				if($fightData["params"]["value"]){
					_role._pvpRoleLifeBar.upData($fightData["params"]["value"]);
				}
				// buff中毒扣血
				if($fightData["params"]["type"] == AttrChangedType.Poisoned || $fightData["params"]["type"] == AttrChangedType.Fire){
					this.addHitEvent(null,
					{aniName:null, site:[_role._uid,_role._roleid,_site], jiduan:1, eventIndex:$fightData["PreCondition"]});
					egret.setTimeout(this.removeFightData, this, 500, _site);
				}else{
					this.removeFightData(_site);
				}
			}
			else if($fightData["type"] == OperationType.BuffChanged){// buff改變
				if($fightData["params"]["count"] > 0){
					_role._pvpRoleLifeBar.creatBuff($fightData["params"]["type"]);
				}else{
					_role._pvpRoleLifeBar.clearBuff($fightData["params"]["type"]);
				}
				let obj = new Object();
				obj["type"] = $fightData["params"]["type"];
				obj["count"] = $fightData["params"]["count"];
				_role.status.ChangeEffectChange(obj);
			}
			else if($fightData["type"] == OperationType.Alive){// 复活
				_role.status.ChangeWait();
				this.removeFightData(_site);
			}
			else if($fightData["type"] == OperationType.Dead){// 死亡
				_role.status.ChangeDeath();
				this.removeFightData(_site);
			}
			else if($fightData["type"] == OperationType.Disappear){// 死亡退场
				this.noRegister(_site);
				this.removeFightData(_site);
			}
			else if($fightData["type"] == OperationType.Combo){// combo增加
				this.ShowComboo($fightData["params"]["value"]);
				this.removeFightData(_site);
			}
			else{
				console.log("其他：",$fightData["type"],_role.unitType,_site,$fightData["EventIndex"]);
				this.removeFightData(_site);
			}
		}

		/**
		 * 获取当前位置人物
		 */
		public curPosiSoldier($site: number): PVPSoldier{
			for(let i=0; i<this.soldiers.length; i++){
				if(this.soldiers[i]["site"] == $site){
					return this.soldiers[i];
				}
			}
			return null;
		}

		/**
		 * 获取攻击对象位置
		 */
		public getHitRoleObject($site: number):number[][]{
			if(this.eachFightDataSet[$site][0]["type"] == 4 && this.eachFightDataSet[$site][0]["params"]["state"] == 1){
				return this.eachFightDataSet[$site][0]["params"]["sim"];
			}
			if(this.eachFightDataSet[$site][0]["type"] == 4 && this.eachFightDataSet[$site][0]["params"]["state"] == 0){
				return this.eachFightDataSet[$site][1]["params"]["sim"];
			}
			return null;
		}

		/**
		 * 侦听到攻击事件处理
		 */
		private addHitEvent(eventName,data){
			// 先判断是哪个战队
			let _hitToArmy = PVPFightManager.GetInstance().armyOfEnemy;
			if(data.site[0] != _hitToArmy._uid){
				_hitToArmy = PVPFightManager.GetInstance().armyOfMine;
			}
			if(_hitToArmy != this) return;

			
			let _hitToSite = data.site[2];// 获取位置
			let _hitToRole = _hitToArmy.curPosiSoldier(_hitToSite);// 获取攻击对象
			let _hitToRoleFightData = _hitToArmy.eachFightDataSet[_hitToSite];// 获取攻击对象战报
			
			if(_hitToRoleFightData == null || _hitToRole == null) return;

			/**
			 * 还可以优化
			 */
			// 受击了。去战报中搜索变化
			for(let i=_hitToRoleFightData.length-1; i>=0; i--){
				if(_hitToRoleFightData[i]["type"] == OperationType.AttrChanged && _hitToRoleFightData[i]["PreCondition"] == data.eventIndex + 1){
					// || _hitToRoleFightData[i]["PreCondition"] == data.eventIndex){
					// 血量
					let _damge = _hitToRole._pvpRoleLifeBar.CurHealth - _hitToRoleFightData[i]["params"]["value"]["d"];
					let _eachDamge = Math.floor(_damge/data.jiduan);
					
					_hitToArmy.ShowLife(_hitToArmy.curPosiSoldier(_hitToSite).x - 200, _hitToArmy.curPosiSoldier(_hitToSite).y - 200,
										_eachDamge,_hitToRoleFightData[i]["params"]["type"]);
					_hitToRole.HitFun(_hitToRoleFightData[i]["params"]["type"], data.aniName);
					break;
				}
			}
		}

		/**
		 * 扣血表现
		 * @param 	cx 			x位置
		 * @param 	cy 			y位置
		 * @param 	damage 		伤害
		 * @param	$attackType		受击类型。用于飘的文字
		 */
		public ShowLife(cx, cy, damage:number, $attackType: number): void {
			let _lifeNumber = new PVPNum($attackType);
			this.addChildAt(_lifeNumber, 0);
			_lifeNumber.x = cx;
			_lifeNumber.y = cy-30;
			_lifeNumber.scaleX = _lifeNumber.scaleY=0.7;
			
			if(damage < 0){
				_lifeNumber.number = "+" + Math.abs(damage);
			}else{
				_lifeNumber.number = damage;
			}

			var tw = egret.Tween.get(_lifeNumber);
			Math.random() < 0.5 ? tw.wait(150).to({ x: cx - 150, y: cy - 200, alpha: 0 }, 500).call(this._RemoveLife, this, [_lifeNumber]) : tw.wait(150).to({ x: cx + 150, y: cy - 200, alpha: 0 }, 500).call(this._RemoveLife, this, [_lifeNumber]);
		}

		/**
		 * 移除扣血表现
		 * @param	$component	移除对象
		 */
		private _RemoveLife($component) {
			this.removeChild($component);
		}

		/**
		 * 显示Comboo
		 * num comboo数值
		 */
		public ShowComboo(num: number): void {
			let _combooNumber = new PVPNum("comboo");
			this.addChildAt(_combooNumber, 0);

			_combooNumber.anchorOffsetX = _combooNumber.width/2;
			_combooNumber.anchorOffsetY = _combooNumber.height/2;

			if(PVPFightManager.GetInstance().armyOfMine == this){
				_combooNumber.x = ArmyOfPosiSet["1"]["2"]["x"];
				_combooNumber.y = ArmyOfPosiSet["1"]["2"]["y"] + 30;
			}else{
				_combooNumber.x = ArmyOfPosiSet["2"]["2"]["x"];
				_combooNumber.y = ArmyOfPosiSet["2"]["2"]["y"] + 30;
			}
			
			
			_combooNumber.scaleX = _combooNumber.scaleY = 1.7;
			_combooNumber.number = "cx" + num;

			var tw = egret.Tween.get(_combooNumber).to({scaleX:1,scaleY:1},400).to({alpha:0},300).call(this._RemoveLife, this, [_combooNumber]);
		}

		/**
		 * 当前动作已经执行完毕，移除
		 * $site 位置
		 * $isDisEvent 是否发送检测事件
		 */
		public removeFightData($site: number,$isDisEvent:boolean = true){
			if(PVPFightManager.GetInstance().addAniEventToSet(this.eachFightDataSet[$site][0])){
				for(let i=0; i<this.FightDataSet.length; i++){
					if(this.FightDataSet[i]==this.eachFightDataSet[$site][0]){
						this.FightDataSet.splice(i,1);
						break;
					}
				}
				this.eachFightDataSet[$site].splice(0,1);
			}
			this.curFightDataSet[$site] = null;
			if($isDisEvent) FacadeApp.dispatchAction(CommandList.PVP_CheckAttackData);
		}

		/**
		 * 添加到屏幕
		 */
		public Register(par: egret.DisplayObjectContainer){
			this.soldiers.map(so=>{
				par.addChild(so);
			});
		}

		/**
		 * 移除出屏幕
		 */
		public noRegister($site: number){
			for(let i=0; i<this.soldiers.length; i++){
				if(this.soldiers[i]["site"] == $site){
					this.removeChild(this.soldiers[i])
					this.soldiers.splice(i,1);
				}
			}
		}

		/**
		 * 战队类型数组
		 */
		private TypeList: Array<SoldierConfigInfo> = [];

		/**
		 * 所有士兵的列表
		 */
        private soldiers: Array<PVPSoldier> = new Array();
		private otherSoldiers: Array<PVPSoldier> = new Array();

		/**
		 * 当前执行的行动列
		 */
		public curFightDataSet: Object[] = [];

		/**
		 * 战斗数据
		 */
		public FightDataSet: Object[] = [];
		/**
		 * 每个人战斗数据
		 */
		public eachFightDataSet: Object[][] = [];
		/**
		 * comboo数量
		 */
		public combooNum: number = 0;
		/**
		 * comboo图片集合
		 */
		public combooSet: eui.Image;

		/**
		 * 战斗位置
		 */
		public _fightPosiSet: Object[] = [null,null,null,null,null,null,null,null,null];

		/**
		 * 队伍Id
		 */
		public _uid: number = null;
	}
}
