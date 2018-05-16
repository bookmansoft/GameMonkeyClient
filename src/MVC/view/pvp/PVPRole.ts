/**
 * 战斗模块 - 战士管理
 * 
 * @note 如果将父类和子类声明到不同的独立文件中，编译执行时容易引发类型定义错误，合并到同一个文件中错误消失，原因不明 2017.3.6
 */
namespace PVPManager {
	/**
	 * PVP英雄角色
	 */
	export class PVPRole extends PVPSoldier {
		protected onReady(event?, from?, to?){
		}
		protected onnoReady(event?, from?, to?){
		}
		protected onMove(event?, from?, to?){//进入行走状态时触发
			this.PlayRoleAnimation("move",0);
		}
		protected onReadyAttack(event?, from?, to?, msg?){
			this.AttackAniGroupName = PVPArmatureManager.RandomAttack(this._roleid,msg);
			this._AttackBefor(msg);
		}
		protected onAttacking(event?, from?, to?, msg?){
			this._Attacking();
			//进入攻击动画时触发
		}
		protected onAttackLater(event?, from?, to?, msg?){
			this._AttackLater();
			//攻击动画结束返回时
		}
		// protected onHit(event?, from?, to?, data?){// 受击
		// 	this._Hit(data[0],data[1]);
		// }
		protected onDeath(event?, from?, to?){// 死亡
			this.PlayRoleAnimation("stand",0);
		}
		protected onWait(event?, from?, to?){	//进入等待状态时触发
			this._Wait();
		}
		protected onInterrupted(event?, from?, to?){	//被打断
			this._Interrupted();
		}
		protected onSeeThrough(event?, from?, to?){	// 识破
			this._SeeThrough();
		}
		protected onEffectChange(event?, from?, to?, msg?){	// 效果改变
			this._EffectChange(msg);
		}

		/**
		 * 构造函数
		 */
		public constructor(utype: number,site: number,roleid: number,uid: number){
			super();

			this.unitType = utype;
			this._uid = uid;
			this._direction = this._uid == PVPFightManager.GetInstance().armyOfMine._uid ? 1 : -1;
			this._isMineArmy = this._uid == PVPFightManager.GetInstance().armyOfMine._uid ? true : false;
			this._roleid = roleid;
			this.site = site;

			if(this._isMineArmy){
				this.x = GameConfigOfRuntime.roleX;
			}else{
				this.x = 640 - GameConfigOfRuntime.roleX;
			}

			let _uidPosi = 1;
			if(!this._isMineArmy) _uidPosi = 2;

			this._posiXYSet = ArmyOfPosiSet[_uidPosi];
			this.y = this._posiXYSet[site].y;

			this.createArmature();
		}

		/**
		 * 攻击前
		 */
		private _AttackBefor($skillType: number){
			// if(this.judgeHitObjectStute() == false){
			// 	return;
			// }

			// 清空受击的移动
			egret.Tween.removeTweens(this);
			this.x = this._posiXYSet[this.site].x;
			this.y = this._posiXYSet[this.site].y;
			this.rotation = 0;

			this.curAniGroup = PVPFightManager.GetInstance().animationNameSet[this.AttackAniGroupName]["before"];
			//指向第一个动作
			this.curAniIndex = 0;
			this.PlayRoleSkillAniFun();

			let hitRole = this.Army.getHitRoleObject(this.site);
			// 初始化为原位
			let target = [this._posiXYSet[this.site].x,this._posiXYSet[this.site].y];
			// 有攻击对象并且当前动作需要移动
			if(hitRole && RoleAttackAniGroupNames.isMove(this.AttackAniGroupName,this.status.current)){
				let _uidPosi = 1;
				if(hitRole[0][0] == PVPFightManager.GetInstance().armyOfEnemy._uid) _uidPosi = 2;
				target = [ArmyOfPosiSet[_uidPosi][hitRole[0][2]].x - 100 * this._direction, ArmyOfPosiSet[_uidPosi][hitRole[0][2]].y];
			}

			if(this.x != target[0] || this.y != target[1]){
				this.RoleTweenComplete = false;
				let tw = egret.Tween.get(this);
				tw.to({x:target[0],y:target[1]},400/PVPFightManager.TIMESCALE).call(()=>{
					this.RoleTweenComplete = true;
					this.judgeAndClearCurFightData();
				},this);
			}
			this._isWaitMove = false;
		}

		/**
		 * 攻击中
		 */
		private _Attacking(): void {
			//切换动作组
			this.curAniGroup = PVPFightManager.GetInstance().animationNameSet[this.AttackAniGroupName]["attacking"];
			//指向第一个动作
			this.curAniIndex = 0;
			//英雄攻击速度受技能影响
			this._roleArmature.animation.timeScale = FacadeApp.Calc(effectEnum.HeroAttackSpeed, 1);
			this.PlayRoleSkillAniFun();

			let emeyId = this._uid == 1 ? 2 : 1;
			let hitRole = this.Army.getHitRoleObject(this.site);


			// comboo动画有个直接移动
			if(this.AttackAniGroupName == RoleAttackAniGroupNames.WuKong_Comboo){
				egret.Tween.removeTweens(this);
				BG.GetInstance2().Move(250, 200/PVPFightManager.TIMESCALE);
				this.RoleTweenComplete = true;
				let _uidPosi = 1;
				if(hitRole[0][0] == PVPFightManager.GetInstance().armyOfEnemy._uid) _uidPosi = 2;
				this.x = ArmyOfPosiSet[_uidPosi][2].x - 100*this._direction;
			}

			// 前冲动画有个位移动画。其他动画没有移动
			
			if(this.AttackAniGroupName == RoleAttackAniGroupNames.WuKong_QianChong){
				// BG.GetInstance2().Move(250*this._direction, 200/PVPFightManager.TIMESCALE);
				egret.Tween.removeTweens(this);
				let tw = egret.Tween.get(this);
				this.RoleTweenComplete = false;
				if(hitRole){
					let _uidPosi = 1;
					if(hitRole[0][0] == PVPFightManager.GetInstance().armyOfEnemy._uid) _uidPosi = 2;
					tw.to({x:ArmyOfPosiSet[_uidPosi][hitRole[0][2]].x + 50*this._direction},200/PVPFightManager.TIMESCALE).call(()=>{
						this.RoleTweenComplete = true;
						this.judgeAndClearCurFightData();
					},this);
				}else{
					let _uidPosi = 1;
					if(emeyId == PVPFightManager.GetInstance().armyOfEnemy._uid) _uidPosi = 2;
					tw.to({x:ArmyOfPosiSet[_uidPosi][this.site].x + 50*this._direction},200/PVPFightManager.TIMESCALE).call(()=>{
						this.RoleTweenComplete = true;
						this.judgeAndClearCurFightData();
					},this);
				}
			}

		}

		/**
		 * 攻击后
		 */
		private _AttackLater(){
			this.curAniGroup = PVPFightManager.GetInstance().animationNameSet[this.AttackAniGroupName]["later"];
			//指向第一个动作
			this.curAniIndex = 0;
			this.PlayRoleSkillAniFun();

			this.RoleTweenComplete = false;
			let targetPosi = this._posiXYSet[this.site];
			let tw = egret.Tween.get(this);
			tw.to({x:targetPosi.x,y:targetPosi.y},300/PVPFightManager.TIMESCALE).call(()=>{
				this.RoleTweenComplete = true;
				this.judgeAndClearCurFightData();
			},this);
		}

		/**
		 * 等待。待在原位
		 */
		private _Wait(): void {

			this.randMove();

			this.PlayRoleAnimation("move",0);
			// let targetPosi = ArmyOfPosiSet[this._uid][this.site];
			// let tw = egret.Tween.get(this);
			// tw.to({x:targetPosi.x,y:targetPosi.y},300/PVPFightManager.TIMESCALE);
		}

		private randMove(){
			if(this.y == this._posiXYSet[this.site].y && Math.abs(this.x - this._posiXYSet[this.site].x) <=50 && this._isWaitMove == false
			&& this.RoleTweenComplete && this.status.current == SoldierStatusList.wait)
			{
				this._isWaitMove = true;
				let randX = Math.random()*10 + 10;
				let dir = Math.floor(Math.random() * 1);
				randX = dir == 0 ? -randX : randX;
				if(this.x != this._posiXYSet[this.site].x){
					let moveX = Math.abs(this.x - this._posiXYSet[this.site].x);
					egret.Tween.get(this).to({x:this._posiXYSet[this.site].x},moveX * 20).call(()=>{this._isWaitMove = false;this.randMove},this);
				}
				else{
					let moveX = Math.abs(this.x - this._posiXYSet[this.site].x + randX);
					egret.Tween.get(this).to({x:this._posiXYSet[this.site].x + randX},moveX * 20).call(()=>{this._isWaitMove = false;this.randMove},this);
				}
			}
		}

		/**
		 * 被打断
		 */
		private async _Interrupted() {
			let _daduanEff = await PVPArmatureManager.CreatHitEffectAni(this,RoleAttackAniGroupNames.CommAttack_DaDuan);
			this.PlayRoleAnimation("hit1",1);
		}

		/**
		 * 识破
		 */
		private _SeeThrough(): void {
			this.PlayRoleAnimation("move",1);
		}

		/**
		 * 效果改变。buff
		 */
		protected async _EffectChange(data:Object){
			let _isHave: boolean = false;
			let _isDie: boolean = false;
			// 判断是否拥有这个buff
			for(let i=0; i<this._buffArmaSet.length; i++){
				if(this._buffArmaSet[i]["type"] == data["type"]){
					_isHave = true;
					// 持續回合小于等于0。並且有，移除
					if(data["count"] <= 0 && _isHave){
						this._buffArmaSet[i]["curAnimationName"] = "buff_later";
						this._buffArmaSet[i].animation.gotoAndPlay("buff_later",-1,-1,1);
					}
				}

				if(this._buffArmaSet[i]["type"] == BattleBuffEnum.Dead){
					_isDie = true;
				}
			}

			if(data["type"] == BattleBuffEnum.Dead){
				_isDie = true;
			}

			// 死亡角色隐藏
			if(_isDie){
				this._roleArmature.display.visible = false;
			}else{
				this._roleArmature.display.visible = true;
			}

			// 持續回合大於0。並且沒有，创建
			if(data["count"] > 0 && _isHave == false){
				await this._buffArmaSet.push(await PVPArmatureManager.createBuffEffect(this, data["type"]));
			}
		}

		/**
		 * 当前播放的序列号
		 */
		private _curEventIndex: number[] = [];

		/**
		 * 是否等待移动
		 */
		private _isWaitMove: boolean = false;
	}
}
