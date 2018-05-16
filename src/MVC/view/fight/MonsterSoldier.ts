namespace SoldierManage{
	/**
	 * 怪物
	 */
	export class MonsterSoldier extends Soldier{
		public constructor(){
			super();
			this.onInit();
		}

		protected onReady(event?, from?, to?){
			//egret.Tween.removeTweens(this);
		}
		protected onMove(event?, from?, to?){
			if(this._armature) this._armature.animation.gotoAndPlay('move');
		}
		protected onRunning(event?, from?, to?){
			this.status.moveEvent();
		}
		protected onHit(event?, from?, to?, data?){
			//egret.Tween.removeTweens(this);
			// console.log("hit");
			
			this.y = GameConfigOfRuntime.monsterY;
			var tw = egret.Tween.get(this);
			this._armature.animation.gotoAndPlay('hit');
			switch (data) {
				case "hit2":
					tw.to({ y: GameConfigOfRuntime.monsterY - 80 }, Math.floor(4 * 1000 / 24))
						.to({ y: GameConfigOfRuntime.monsterY, x: this.x + 81 }, Math.floor(5 * 1000 / 24))
						.call(this.status.moveEvent, this.status);
					break;
				case "hit3":
					tw.to({ x: this.x + 80 }, Math.floor(5 * 1000 / 24))
						.call(this.status.moveEvent, this.status);
					break;
				case "hit1": 
				default:
					tw.wait(Math.floor(6 * 1000 / 24))
						.to({ x: this.x + 20 }, 100)
						.call(this.status.moveEvent, this.status);
					break;
			}
		}

		/**
		 * IObjectPool接口函数：取用对象时调用
		 */
		public onInit(){
			this._id = 0;
			this.x = GameConfigOfRuntime.monsterX;
			this.y =  GameConfigOfRuntime.monsterY;
			//怪物死亡时，使用了连续改变alpha造成闪烁感的方式表达死亡动画，但最后停留在0值上，导致使用对象池后，怪物行走时不显示、死亡时才闪现，所以必须在此重设alpha值
			this.alpha = 1;

			return this;
		}
		
		/**
		 * 设置数据
		 */
		public setData($id, $isBoss, _armature:dragonBones.Armature){
			this._armature = _armature;
			this.addChild(this._armature.display);
			this.unitType = $isBoss ? SoldierType.boss : SoldierType.monster;
			this.ID = $id;
			if(this.IsBoss){
				this.unitType = SoldierType.boss;
				this.traitType = ConfigStaticManager.getItem(ConfigTypeName.Boss, this.ID)["trait"];
			}
			else{
				this.unitType = SoldierType.monster;
			}

			if (this.IsBoss == false) {
				this._monsterLifeBar = this._monsterLifeBar || new MonsterLifeBar();
				this.addChild(this._monsterLifeBar);

				this._monsterLifeBar.x = -this._monsterLifeBar.width / 2;
				this._monsterLifeBar.y = -this._armature.display.height;
				this._monsterLifeBar.slideDuration = 500; //缓动
			}
			
			let vlife = MonsterLiftConfig.life(FacadeApp.read(CommandList.Re_FightInfo).LEVEL);
			let vsum  = FacadeApp.read(CommandList.Re_FightInfo).TOTALMONSTER;
			//注意：由于Digit是对象，因此必须复制后赋值，否则将成为共享状态，导致数据间相互影响
			if($isBoss){
				//带入“Boss血量下降”科技的影响
				this.totalLife = vlife.clone.Mul(FacadeApp.Calc(effectEnum.ReduceBossBlood, 1));
				this.Life = this.totalLife.clone; 
			}
			else{
				this.totalLife = vlife.clone.Div(vsum);
				this.Life = this.totalLife.clone;
			}
			this.status.moveEvent(); 

			return this;
		}

		/**
		 * IObjectPool接口函数：回收对象时调用
		 */
		public onReturn(){
			this.parent.removeChild(this);
			//egret.Tween.removeTweens(this);
			this.RemoveArmature();
			this._id = 0;
			this.x = GameConfigOfRuntime.monsterX;
			this.y =  GameConfigOfRuntime.monsterY;
			
			if(this._monsterLifeBar){ //从舞台上移除血槽对象
				if(this._monsterLifeBar.parent){
					this._monsterLifeBar.parent.removeChild(this._monsterLifeBar);
				}
				this._monsterLifeBar = null;
			}
			return this;
		}
		
		/**
		 * 获取怪物是否boss
		 */
		public get IsBoss(): boolean {
			return this.unitType == SoldierType.boss;
		}

		/**
		 * 获取怪物是否宝箱
		 */
		public get IsBaoXiang(): boolean {
			return Army.MonsterResSet && (this._id == Army.MonsterResSet.length-1);
		}
	}


	/**
	 * 怪物血条
	 */
	export class MonsterLiftConfig{
		private static lifeList: Array<Digit> = [];
		public static life(gateNo: number){
			if(typeof this.lifeList[gateNo] == 'undefined ' || this.lifeList[gateNo] == null){
				//计算本关总血量
				let totalBlood = new Digit([200,0]);
				// totalBlood = gateNo / 10 > 1? totalBlood.Mul(gateNo/10) : totalBlood;
				let rec = 7 * gateNo/200.0;
				while(rec > 0){
					let cur = rec >= 100 ? 100 : rec;
					totalBlood.Mul(Math.pow(150, cur));
					rec -= cur;
				}
				this.lifeList[gateNo] = totalBlood;
			}
			return this.lifeList[gateNo];
		}
	}
}