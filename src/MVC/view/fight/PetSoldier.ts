namespace SoldierManage{
	/**
	 * 宠物
	 */
	export class PetSoldier extends Soldier {
		/**
		 * 构造函数
		 */
		public constructor(){
			super();
			this.UpdatePet();
			this.skewY = 0; //对方战队反转

			FacadeApp.AddListener(CommandList.M_CMD_PetAttack, ()=>{
				this.PetAttacking();
			}, this);
			FacadeApp.AddListener(CommandList.M_CMD_Change_Pet, this.UpdatePet, this);
		}

		/**
		 * 切换宠物
		 */
		// private UpdatePet(){
			
		// }

		/**
		 * 实时侦听
		 */
		public Framing(frameTime: number): void {
			this.timerOfResent += frameTime;	
			if(!this.FightingPet){
				return;
			}
			if(FightManager.GetInstance().armyOfMine.pet.FightingPet.AutoTimes + FacadeApp.Calc(effectEnum.AutoAttack, 0) > 0){
				if(this.timerOfResent >= 1000 / (FightManager.GetInstance().armyOfMine.pet.FightingPet.AutoTimes + FacadeApp.Calc(effectEnum.AutoAttack, 0))){
					this.timerOfResent = 0;
					FacadeApp.dispatchAction(CommandList.M_CMD_PetAttack);
				}
			}

			if (this.status.current == SoldierStatusList.move && this.x < 70) {
				this.x += GameConfigOfRuntime.roleSpeed;
			}
		}

		/**
		 * 更新宠物动画
		 */
		public async UpdatePet(){
			let arm = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(this.FightingPet.DragonRes, this);
			if(this._armature != null){
				MovieManage.RemoveArmature(this._armature);
				if(this._armature.display.parent){
					this._armature.display.parent.removeChild(this._armature.display);
				}
			}
			this._armature = arm;
			this.x = 100;
			this.y = 350;
			this.addChild(this._armature.display);
			this._armature.animation.gotoAndPlay('move');
		}

		/**
		 * 宠物结束攻击
		 */
		private PetFinishAttack(){
			this._armature.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.PetFinishAttack, this);
			this._armature.animation.gotoAndPlay('move');
		}

		/**
		 * 宠物攻击	
		 */
		public PetAttacking(){
			let stage: egret.DisplayObjectContainer = FightManager.GetInstance();

			//宠物攻击音效
			SoundManager.PlayMusic(this.FightingPet.Music, 1);
			//宠物攻击动作
			if (this._armature) {
				let stat = this._armature.animation.getState('attack');
				if(!stat || stat.isCompleted){
					this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.PetFinishAttack, this);
					this._armature.animation.gotoAndPlay("attack",-1,-1,1);
				}
			}
			
			let rx: number = this.x + 135;
			let ry: number = this.y + 350;

			let self = this;
			MovieManage.getResList([this.FightingPet.FSRes,this.FightingPet.DJRes,self.FightingPet.SJ1Res,self.FightingPet.SJ2Res], list => {
				//宠物攻击火球
				let fs: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
				fs.source = list[0];
				fs.anchorOffsetX = 0;
				fs.anchorOffsetY = 0;
				fs.x = -110 + rx ;
				fs.y = -380 + ry ;
				//console.log(rx,ry);
				//console.log("中心点:"+fs.anchorOffsetX,fs.anchorOffsetY);
				stage.addChild(fs);
				setTimeout(()=>{
					stage.removeChild(fs);
					ObjectPool.getPool('eui.Image').returnObject(fs);
				}, 100);

				let dj: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
				dj.source = list[1];
				dj.anchorOffsetX = 0;
				dj.anchorOffsetY = 0;
				//宠物攻击引发的打击火花
				dj.x = -100 + rx;
				dj.y = -370 + ry;
				stage.addChild(dj);
				let random = (Math.random()*200); //弹道随机偏移值
				egret.Tween.get(dj).to({ x: 130 + rx + random, y: -125 + ry }, 300).call(($image, $rx, $ry)=>{
					stage.removeChild($image);
					ObjectPool.getPool('eui.Image').returnObject($image);

					let sj1: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
					sj1.source = list[2];
					sj1.anchorOffsetX = 0;
					sj1.anchorOffsetY = 0;
					//受击光效1
					sj1.x = 30 + $rx + random;
					sj1.y = $ry;
					stage.addChild(sj1);
					setTimeout(()=>{
						stage.removeChild(sj1);
						ObjectPool.getPool('eui.Image').returnObject(sj1);

						let sj2: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
						sj2.source = list[3];
						sj2.anchorOffsetX = 0;
						sj2.anchorOffsetY = 0;
						//受击光效2
						sj2.x = $rx + random;
						sj2.y = $ry;
						stage.addChild(sj2);
						setTimeout(()=>{
							stage.removeChild(sj2);
							ObjectPool.getPool('eui.Image').returnObject(sj2);
						}, 100);
					}, 100)

					FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_HIT_ENEMY, {aniName: "hit1", src: HurtSourceType.pet} );
				}, stage, [dj, 130 + rx, -125 + ry]);	
			}, this);
		}
		
		/**
		 * 当前出战的宠物
		 */
		public get FightingPet(): Pet{
			return <Pet> FacadeApp.read(CommandList.Re_PetInfo).FightingPet;
		}
	}
}