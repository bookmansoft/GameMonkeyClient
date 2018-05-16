/**
 * 战斗模块 - 战队管理
 */
namespace SoldierManage{
    /**
     * 战斗编队管理对象
	 * 
	 * @note 特殊的军队：怪物军团，一开始给定若干类型，然后依次构造若干怪物，达到数量上限后停止生产，当怪物死亡导致数量下降，则立即依据原型库继续生产怪物以补足数量
	 * @note 其它要求：某个类型的士兵被撤换成其他类型的士兵
     */
    export class Army extends egret.DisplayObjectContainer{
		public constructor(_at:ArmyRunType){
			super();
			this.runType = _at;

			/**
			 * 订阅事件
			 */
			// FacadeApp.AddListener(CommandList.M_CMD_Change_Pet, this.UpdatePet, this);
			// FacadeApp.AddListener(CommandList.M_CMD_Change_Marshalling, this.UpdateGhost, this);
			FacadeApp.AddListener(CommandList.M_CMD_FIGHT_HIT_ENEMY, (atype, data) => {
				this.monsterAttacked(data.aniName, data.src);
			}, this);

			if(Army.MonsterResSet == null || Army.BossResSet == null){
				Army.MonsterResSet = [];
				Army.BossResSet = [];

				// 生成怪物数组
				let monsterJson = ConfigStaticManager.getList(ConfigTypeName.Monster);
				let monsterLength = 0;
				Object.keys(monsterJson).map(key=>{
					let id: number = monsterJson[key]["id"];
					let res: string = monsterJson[key]["draRes"];
					Army.MonsterResSet[id] = res;
					monsterLength += 1;
				})
				//最后添加上宝箱怪资源
				Army.MonsterResSet[monsterLength] = "baoxiang_walk";
				
				// 生成boss数组
				let bossJson = ConfigStaticManager.getList(ConfigTypeName.Boss);
				Object.keys(bossJson).map(key=>{
					let id: number = bossJson[key]["id"];
					let res: string = bossJson[key]["draRes"];
					Army.BossResSet[id] = res;
				})
			}
		}

		/**
		 * 当配置发生变化时，进行军队的重构
		 */
		public rebuild(sl: Array<SoldierConfigInfo>){
			this.TypeList = sl;
			this._countTime = 0;

			if(this.runType == ArmyRunType.dyncCreate){
				return;
			}

			//构造新的军队
			this.soldiers = this.TypeList.map(ci=>{
				let ns= SoldierFactory.inst.newSildier(ci);
				switch(ci.utype){
					case SoldierType.hero:
						this.hero = <RoleSoldier> ns;
						break;
					case SoldierType.pet:
						this.pet = <PetSoldier> ns;
						break;
					case SoldierType.boss:
						break;
				}
				return ns;
			});
			this.Register(this);
		}

		/**
		 * 怪物受击 扣减怪物的血量
		 * @param 	$type 			受击类型
		 * @param	$pet			是否宠物伤害
		 */
		public monsterAttacked($type: string, $src: HurtSourceType = HurtSourceType.role): void {
			let $pet = $src == HurtSourceType.pet ? true : false;
			let ri = FacadeApp.read(CommandList.Re_Status);
			let damage: Digit = $pet ?
				Digit.fromObject(ri.powerClick): 
				Digit.fromObject(ri.power);
			//主动技能2效果
			if(SkillManager.GetActiveSkillByID(2)._status == SkillStatusType.Used && !$pet){
				damage.Mul(2);
			}
			//主动技能5效果
			if(SkillManager.GetActiveSkillByID(5)._status == SkillStatusType.Used && $pet){
				damage.Mul(2);
			}
			//计算暴击率、暴强
			if(Math.random() < FacadeApp.Calc(effectEnum.DoubleAttackRate, 0.1)){	
				damage.Mul(FacadeApp.Calc(effectEnum.DoubleAttackValue, 2));
			}

			for (let n: number = this.soldiers.length - 1; n >= 0; n--) {
				let monster = this.soldiers[n];

				if(monster.unitType != SoldierType.monster && monster.unitType != SoldierType.boss){
					continue;
				}

				if (( !monster.Life.Little(0)  && Math.abs(FightManager.GetInstance().armyOfMine.hero.x - monster.x) < GameConfigOfRuntime.attackRange) 
					|| ($pet && monster.Life.Larger(0) && Math.abs(FightManager.GetInstance().armyOfMine.hero.x - monster.x) < GameConfigOfRuntime.attackRange + 50)
					|| (FightManager.GetInstance().armyOfMine.hero.AttackAniGroupName == SoldierManage.RoleAttackAniGroupNames.Attack7 && monster.Life.Larger(0) && Math.abs(FightManager.GetInstance().armyOfMine.hero.x - monster.x) < GameConfigOfRuntime.attackRange + 100))
				{
					if(monster.unitType == SoldierType.boss){
						//计算属性伤害
						switch(monster.Trait){
							case SoldierManage.SoldierTrait.Gold: damage.CalcFinallyValue([effectEnum.AttackToGold]);break;
							case SoldierManage.SoldierTrait.Wood:damage.CalcFinallyValue([effectEnum.AttackToWood]);break;
							case SoldierManage.SoldierTrait.Water:damage.CalcFinallyValue([effectEnum.AttackToWater]);break;
							case SoldierManage.SoldierTrait.Fire:damage.CalcFinallyValue([effectEnum.AttackToFire]);break;
							case SoldierManage.SoldierTrait.Earth:damage.CalcFinallyValue([effectEnum.AttackToEarth]);break;
						}
						damage.CalcFinallyValue([effectEnum.AttackToAll]);
					}
					//播放扣血动画
					this.ShowLife(monster.x - 200, GameConfigOfRuntime.monsterY - monster.MonsterHeight - 30, damage, $pet);

					if ($pet) { //宠物不会引发怪物受击动作; 死亡直接播放死亡动画，不需要受击动作
						//扣减怪物血量，并自动触发死亡动画播放
						monster.Life = monster.Life.Sub(damage);
					}
					else{
						monster.status.attacked($type);
						monster.Life = monster.Life.Sub(damage);
					}
				}
			}
		}

		/**
		 * 扣血表现
		 * @param 	cx 			x位置
		 * @param 	cy 			y位置
		 * @param 	damage 		伤害
		 * @param	$pet		是否宠物伤害
		 */
		public ShowLife(cx, cy, damage:Digit, $pet: boolean = false): void {
			let _lifeNumber = new LifeNumber($pet);
			this.addChildAt(_lifeNumber, 0);
			_lifeNumber.x = cx;
			_lifeNumber.y = cy-30;
			_lifeNumber.scaleX = _lifeNumber.scaleY=0.7;
			_lifeNumber.number = damage.Power > 8 ? damage.Base.toFixed(2) + 'e' + damage.Power : damage.Number.toFixed(0);
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
		 * 切换宠物
		 */
		// private UpdatePet(){
			
		// }
		/**
		 * 切换魔宠
		 */
		// private UpdateGhost(){}

		/**
		 * 实时侦听
		 */
		public Framing(frameTime: number, coordinate){
			if(this.runType == ArmyRunType.dyncCreate){
				let ri = FacadeApp.read(CommandList.Re_FightInfo);
				this._countTime--;
				if (this.TypeList.length > 0 
				&& this._countTime <= 0 
				&& this.soldiers.length < 5 
				&& (ri.TollgateProgressLeft() > this.soldiers.length 
				|| ri.UnlimitedMode())) {
					var random = Math.floor(this.TypeList.length * Math.random());
					this.CreateMonster(this.TypeList[random].uid, this.TypeList[random].utype == SoldierType.boss);
					this._countTime = GameConfigOfRuntime.createTime;

					if(this.TypeList[random].utype == SoldierType.boss && FightManager.GetInstance().status.current == FightStatusList.running){
						FacadeApp.dispatchAction(CommandList.BossLifeProgress, 100);
						FacadeApp.dispatchAction(CommandList.BOSSTIME, 30);
						FacadeApp.dispatchAction(CommandList.BOSSBONUS, {type:'ding_nd', num:FacadeApp.read(CommandList.Re_FightInfo).aStone});
					}else{
						FacadeApp.dispatchAction(CommandList.BossLifeProgress, 0);
					}
				}
				for (let i: number = this.soldiers.length - 1; i >= 0; i--) {
					if (this.soldiers[i] && this.soldiers[i].status.current == SoldierManage.SoldierStatusList.move && this.soldiers[i].x > GameConfigOfRuntime.monsterMinX) {
						this.soldiers[i].x -= GameConfigOfRuntime.monsterSpeed;
					}
				}

				let MoneyPerHit:boolean = FacadeApp.Calc(effectEnum.GetMoneyPerHit, 0) > 0;
				/**
				 * 检测怪物生命是否为0
				 */
				for (let n = this.soldiers.length - 1; n >= 0; n--) {
					if (this.soldiers[n] && !this.soldiers[n].Life.Larger(0) &&
						this.soldiers[n]["isTween"] == null && this.soldiers[n].status.current == SoldierManage.SoldierStatusList.death) {

						let monster: MonsterSoldier = <MonsterSoldier> this.soldiers[n];
						let type:number = 0;
						if(monster.IsBaoXiang){
							type = 1;
						}
						else if(monster.unitType == SoldierType.boss)	{
							type = 2;
						}
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_MonsterKilled, {t:type, x:monster.x, y:monster.y, w:monster.width, h:monster.height});//发送事件

						this.reduceMonster(n); //释放士兵对象

						//变更已消灭怪物数量
						let val = ri._monsterCount + 1;
						if (ri._monsterCount > 0 && (val % 5) == 0 && (val < ri.TOTALMONSTER || ri.UnlimitedMode())){
							//触发临时提交
							FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=3", "&gateNo=", ri.LEVEL, "&monsterNum=", val], [data=>{
								FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
								FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
								if(data["code"] == FacadeApp.SuccessCode){
								}else{
									UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
								}
							}]);
						}
						//发送数据变更通知
						FacadeApp.dispatchAction(CommandList.SetTollgateProgress, val);
					}
					else{
						if(MoneyPerHit){
							FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_MonsterHitted, {t:3, x:this.soldiers[n].x, y:this.soldiers[n].y, w:this.soldiers[n].width, h:this.soldiers[n].height});
						}
					}
				}

				//碰撞检测：是否达到攻击范围
				for (let n: number = this.soldiers.length - 1; n >= 0; n--) {
					if (this.soldiers[n] && this.soldiers[n].status.current != SoldierManage.SoldierStatusList.death && Math.abs(coordinate.x - this.soldiers[n].x) < GameConfigOfRuntime.attackRange) {
						FacadeApp.dispatchAction(CommandList.M_CMD_RoleAttack)
						break;
					}
				}

				//检测是否过关
				if(ri.TOTALMONSTER <= ri._monsterCount && ri.UnlimitedMode() == false){
					FacadeApp.dispatchAction(CommandList.BOSSTIME);
					FacadeApp.dispatchAction(CommandList.M_CMD_ArmyDestory);
				}
			}
			
			this.soldiers.map(so=>{
				so.Framing(frameTime);
			});
		}

		/**
		 * 回收怪物对象，新增了对象池
		 */
		public reduceMonster(idx: number){
			let monster = <MonsterSoldier> this.soldiers[idx];
			if(monster && monster.parent && monster["isTween"] == null){
				monster["isTween"] = true;
				egret.Tween.get(monster)
					.to({ alpha: 0 }, 0)
					.wait(80)
					.to({ alpha: 1 }, 0)
					.wait(80)
					.to({ alpha: 0 }, 0)
					.wait(80)
					.to({ alpha: 1 }, 0)
					.wait(80)
					.to({ alpha: 0 }, 0)
					.wait(80)
					.to({ alpha: 1 }, 0)
					.wait(80)
					.to({ alpha: 0 }, 0)
					.call(()=>{
						let removeMonster = null;
						for(let i=0; i<this.soldiers.length; i++){
							if(this.soldiers[i] == monster){
								removeMonster = this.soldiers[i];
								this.soldiers[i] = null;
								this.soldiers.splice(i, 1);
								break;
							}
						}
						//应用对象池来回收对象
						if(removeMonster){
							egret.Tween.removeTweens(removeMonster);
							ObjectPool.getPool('SoldierManage.MonsterSoldier').returnObject(monster);
							monster["isTween"] = null;
						}
					});
			}
		}

		/**
		 * 创建怪物 设定怪物的血量
		 * @param	$ID				怪物ID
		 * @param	$isBoss			是否是Boss
		 */
		public async CreateMonster($id, $isBoss) {
			let _monster:SoldierManage.MonsterSoldier = ObjectPool.getPool('SoldierManage.MonsterSoldier').borrowObject();//改为应用对象池

			/**
			 * 采用异步Promise方式下载并加载资源，以压缩首次下载的包大小
			 */
			let res: string = "";
			if ($isBoss){
				res = Army.BossResSet[$id];
			}
			else{
				res = Army.MonsterResSet[$id];
			}
			let _armature:dragonBones.Armature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(res, this);
			if(_armature == null){
				console.log('create monster armature error: ' + res);
				return;
			}

			//Promise机制确保了只有上述资源加载操作成功后，才会继续执行下面的语句：
			_monster.setData($id, $isBoss, _armature);
			this.addChild(_monster);
			this.soldiers.push(_monster);
		}

		/**
		 * 结束
		 */
		public suspend(){
			this.soldiers.map(so=>{
				so.RemoveTweenAndSetTimeout();
				so.status.moveEvent();
			});

			for (let n = this.soldiers.length - 1; n >= 0; n--) {
				if(this.soldiers[n].unitType == SoldierType.monster){
					this.reduceMonster(n);
				}
				if(this.soldiers[n].unitType == SoldierType.boss){
					this.reduceMonster(n);
				}
			}
		}

		/**
		 * 胜利后全体前进
		 */
		public goAhead(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.moveEvent();
					egret.Tween.get(so).to({x: 1000}, 1700).call(()=>{
						so.x = GameConfigOfRuntime.roleX;
						resolve();
					}, this);
				});
			}));
		}

		/**
		 * 突然消失
		 */
		public disappear(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.moveEvent();
					so.x = GameConfigOfRuntime.roleX;
					resolve();
				});
			}));
		}
		
		/**
		 * 全体撤退
		 */
		public retreat(){
			return Promise.all(this.soldiers.map(so=>{
				return new Promise((resolve, reject)=>{
					so.status.moveEvent();
					egret.Tween.get(so).to({x: -100}, 1000).call(()=>{
						resolve();
					}, this);
				});
			}));
		}
		/**
		 * 士兵数量
		 */
		public get soldierNum():number{
			return this.soldiers.length;
		}

		/**
		 * 获取第一个士兵
		 */
		public get soldierOfFirst():Soldier{
			return this.soldiers[0];
		}

		/**
		 * 获取全部士兵
		 */
		public get soldierSet():Array<Soldier>{
			return this.soldiers;
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
		 * 士兵类型数组
		 */
		private TypeList: Array<SoldierConfigInfo> = [];
		public hero: RoleSoldier = null;
		public pet: PetSoldier = null;

		/**
		 * 创建倒计时
		 */
		public _countTime: number = 0;

		/**
		 * 是否是宝箱boos
		 */
		public _ifBaiXiangBoss:boolean=false;

		/**
		 * 总自动攻击次数。
		 */
		public AutoTimes:number = 0;

		/**
		 * 所有士兵的列表
		 */
        private soldiers: Array<Soldier> = new Array();

		private runType:ArmyRunType = ArmyRunType.static;
		/**
		 * 怪物资源集合
		 */
		public static MonsterResSet: string[] = null;
		/**
		 * Boss资源集合
		 */
		public static BossResSet: string[] = null;
    }
}
