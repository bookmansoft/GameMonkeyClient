namespace SoldierManage{
	/**
	 * 英雄角色
	 */
	export class RoleSoldier extends Soldier {
		protected onReady(event?, from?, to?){
			this.x = GameConfigOfRuntime.roleX;
			this.y = GameConfigOfRuntime.roleY;

			FacadeApp.dispatchAction(CommandList.M_CMD_Change_Pet);
		}
		protected onRunning(event?, from?, to?){
			this.status.moveEvent();
		}
		protected onBeforeattacking(event?, from?, to?){
			this._Attack();
		}
		protected onHit(event?, from?, to?, data?){
		}
		protected onDeath(event?, from?, to?){

		}
		protected onSuspend(event?, from?, to?){

		}
		protected onAttacking(event?, from?, to?, msg?){
			//进入攻击动画时触发
		}
		protected onMove(event?, from?, to?){//进入行走状态时触发
			if(this._armature) this._armature.animation.gotoAndPlay('move');
		}
		protected onStand(event?, from?, to?){//进入站立状态时触发
			this._armature.animation.gotoAndPlay('stand');
		}

		/**
		 * 构造函数
		 */
		public constructor(){
			super();
			/**
			 * 订阅事件
			 */
			FacadeApp.AddListener(CommandList.M_CMD_RoleAttack, ()=>{
				this.status.attackingEvent();
			});

			this.createArmature(1);

			//设置动作组信息		
			this.attackAniSet[RoleAttackAniGroupNames.Attack1] = ["_1", "_2", "_3", "_4"];						//第一组攻击动作有4个
			this.attackAniSet[RoleAttackAniGroupNames.Attack2] = ["_1", "_2", "_3", "_4", "_5"];				//第二组攻击动作有5个
			this.attackAniSet[RoleAttackAniGroupNames.Attack3] = ["_1", "_2", "_3"];							//第三组攻击动作有3个
			this.attackAniSet[RoleAttackAniGroupNames.Attack4] = ["_1", "_2"];									//第四组攻击动作有2个
			this.attackAniSet[RoleAttackAniGroupNames.Attack5] = ["_1", "_2"];									//第五组攻击动作有2个
			this.attackAniSet[RoleAttackAniGroupNames.Attack6] = ["_1", "_2", "_3", "_4", "_5", "_6", "_7"];	//第六组攻击动作有7个
			this.attackAniSet[RoleAttackAniGroupNames.Attack7] = ["_1", "_2", "_3"];							//第七组攻击动作有3个

			this.skewY = 0; //对方战队反转
		}

		/**
		 * 创建角色骨架
		 */
		private async createArmature($id) {
			this._id = $id;

			if (this._armature) {
				this.removeChild(this._armature.display);
				MovieManage.RemoveArmature(this._armature);
				this._armature = null;
			}
			this._armature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie("wukong" + $id, this);
			
			//上一组攻击动作播放完毕后调用，以实现动画的循环播放
			this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, ()=>{
				if (this.curAniGroup && this.curAniIndex < this.curAniGroup.length){
					this._armature.animation.gotoAndPlay(this.AttackAniGroupName + this.curAniGroup[this.curAniIndex], -1, -1, 1);
					this.curAniIndex += 1;
					return;
				}
				//egret.Tween.removeTweens(this);
				this.status.moveEvent();
			}, this); 
			this.status.moveEvent();
			this.addChild(this._armature.display);
		}

		/**
		 * 角色帧监听
		 */
		public Framing(frameTime: number): void {
			this.timerOfResent += frameTime;

			if (this.status.current == SoldierStatusList.move && this.x < GameConfigOfRuntime.roleMaxX) {
				this.x += GameConfigOfRuntime.roleSpeed;
			}
			else if (this.status.current == SoldierStatusList.move) {
				BG.GetInstance().Move(5, 20);
			}
		}

		/**
		 * 播放攻击音效
		 */
		private _PlayAttackMusic(){
			for (var i = 1; i <= RoleAttackAniGroupNames.AttackCount; i++){
				if (this.AttackAniGroupName == "attack"+i){
					SoundManager.PlayMusic(SoundManager["Attack" + i + "_Music"], 1);
				}
			}
		}

		/**
		 * 播放攻击
		 */
		private _Attack(): void {
			if (this.status.current == SoldierStatusList.attacking) {//如果还在播放上一组攻击动作，那么直接返回
				return;
			}

			// 选取随机的攻击动作组
			let _attackStateArr: string[] = [];
			if (this.x > GameConfigOfRuntime.roleMaxX + 50) {
				_attackStateArr = [RoleAttackAniGroupNames.Attack1, RoleAttackAniGroupNames.Attack2, RoleAttackAniGroupNames.Attack3, RoleAttackAniGroupNames.Attack6, RoleAttackAniGroupNames.Attack7];
			}
			else {
				if (Math.random() < 0.4) {
					_attackStateArr = [RoleAttackAniGroupNames.Attack4, RoleAttackAniGroupNames.Attack5];
				}
				else{
					_attackStateArr = [RoleAttackAniGroupNames.Attack1, RoleAttackAniGroupNames.Attack2, RoleAttackAniGroupNames.Attack3, RoleAttackAniGroupNames.Attack4, RoleAttackAniGroupNames.Attack5, RoleAttackAniGroupNames.Attack6];
				}
			}

			let randomState: number = Math.floor(_attackStateArr.length * Math.random());
			if (this.AttackAniGroupName == _attackStateArr[randomState]) {
				_attackStateArr.splice(randomState, 1);
				randomState = Math.floor(_attackStateArr.length * Math.random());
			}
			this.AttackAniGroupName = _attackStateArr[randomState];

			//切换动作组
			this.curAniGroup = this.attackAniSet[this.AttackAniGroupName];
			//指向第一个动作
			this.curAniIndex = 0;
			
			//英雄攻击速度受技能影响
			this._armature.animation.timeScale = FacadeApp.Calc(effectEnum.HeroAttackSpeed, 1);
			this._armature.animation.gotoAndPlay(this.AttackAniGroupName + this.curAniGroup[this.curAniIndex], -1, -1, 1);
			
			this.curAniIndex += 1;
			this._PlayAttackMusic();

			var cx: number = this.x;
			//egret.Tween.removeTweens(this);
			var tw = egret.Tween.get(this);

			if (this.AttackAniGroupName == RoleAttackAniGroupNames.Attack7){
				tw.wait(300).to({ x: cx - 200 }, 300);
			} 

			switch (this.AttackAniGroupName) {
				case RoleAttackAniGroupNames.Attack1:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(11 * 1000 / 24));
					break;
				case RoleAttackAniGroupNames.Attack2:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(9 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit2"} );
					}, Math.floor(14 * 1000 / 24));
					break;
				case RoleAttackAniGroupNames.Attack3:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(7 * 1000 / 24));
					break;
				case RoleAttackAniGroupNames.Attack4:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(4 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(13 * 1000 / 24));
					tw.to({ x: cx + 100 }, 600);
					BG.GetInstance().Move(250, 700);
					break;
				case RoleAttackAniGroupNames.Attack5:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(3 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(8 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(13 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(18 * 1000 / 24));
					tw.to({ x: cx + 150 }, 500);
					BG.GetInstance().Move(200, 600);
					break;
				case RoleAttackAniGroupNames.Attack6:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(7 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(15 * 1000 / 24));
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1"} );
					}, Math.floor(28 * 1000 / 24));
					break;
				case RoleAttackAniGroupNames.Attack7:
					setTimeout(function () { 
						FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit3"} );
					}, Math.floor(10 * 1000 / 24));
					break;
				default:
					break;
			}
			if (this.AttackAniGroupName != RoleAttackAniGroupNames.Attack4 && this.AttackAniGroupName != RoleAttackAniGroupNames.Attack5 && this.AttackAniGroupName != RoleAttackAniGroupNames.Attack7
				&& this.x > GameConfigOfRuntime.roleMaxX) 
			{
				tw.to({ x: GameConfigOfRuntime.roleMaxX - 20 }, 1000);
				BG.GetInstance().Move(this.x - (GameConfigOfRuntime.roleMaxX - 20), 1000);
			}
		}

		// 攻击动作集合
		private attackAniSet: any = [];							
		private curAniIndex: number = 0;					// 当前动作组中的索引
		private curAniGroup: string[];						// 当前攻击动作集合
		/**
		 * 当前攻击动作组名
		 */
		public AttackAniGroupName:string = '';
	}
}