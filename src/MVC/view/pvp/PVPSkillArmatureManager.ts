namespace PVPManager{

	export class PVPArmatureManager extends egret.Sprite{
		public constructor() {
			super();
		}

		/**
		 * 创建受击特效资源
		 */
		public static async CreatHitEffectAni(object: PVPSoldier,curAttackName:string){
			let _hitAni = null;
			let _arm = null;
			let resObject = AttrChangedType.ShouJiRes(curAttackName);

			if(resObject.type == "dra"){
				_hitAni = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(resObject.res, object);
				_arm = _hitAni.display;
				_hitAni.animation.gotoAndPlay(resObject.aniName,-1,-1,1);
				_hitAni.animation.timeScale = PVPFightManager.TIMESCALE;
			}else if(resObject.type == "mov"){
				_hitAni = new egret.MovieClip();
				_hitAni.movieClipData = <egret.MovieClipData> await MovieManage.GetMovieClipData(resObject.res + "_json", resObject.res + "_png", resObject.aniName);
				_arm = _hitAni;
				_hitAni.play(1);
				_hitAni.frameRate = _hitAni.frameRate/PVPFightManager.TIMESCALE;
			}
			else if(resObject.type == "ima"){
				_hitAni = <eui.Image> await ObjectPool.getPool('eui.Image').borrowObject();
				_hitAni.texture = RES.getRes(resObject.res);
				_arm = _hitAni;
				_hitAni.anchorOffsetX = _hitAni.width/2;
				_hitAni.anchorOffsetY = _hitAni.height/2;
			}

			_arm["type"] = resObject.type;
			if(curAttackName == RoleAttackAniGroupNames.CommAttack_JinChang){
				object.Army.addChild(_arm)
				let _uidPosi = 1;
				if(!object._isMineArmy) _uidPosi = 2;
				_arm.x = ArmyOfPosiSet[_uidPosi][object.site].x;
				_arm.y = ArmyOfPosiSet[_uidPosi][object.site].y - object.RoleHeight/2;
			}
			else{
				object.addChild(_arm);
				_arm.x = 0 + resObject.parX * object._direction;
				_arm.y = 0 + resObject.parY;
			}

			if(_arm["type"] == "dra"){
				_hitAni.addEventListener(dragonBones.AnimationEvent.COMPLETE, (e:dragonBones.AnimationEvent)=>{
					if(_hitAni.display.parent){
						_hitAni.display.parent.removeChild(_hitAni.display);
					}
					for(let i=0; i<object._hitAniSet.length; i++){
						if(object._hitAniSet[i] == _hitAni){
							object._hitAniSet.splice(i,1);
						}
					}
				}, object); 
			}
			else if(_arm["type"] == "mov"){
				// 帧动画侦听
				_hitAni.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
					if(_hitAni.parent){
						_hitAni.parent.removeChild(_hitAni);
					}
					for(let i=0; i<object._hitAniSet.length; i++){
						if(object._hitAniSet[i] == _hitAni){
							object._hitAniSet.splice(i,1);
						}
					}
				}, object); 
			}
			else if(curAttackName == RoleAttackAniGroupNames.ZJB_NormalAttack1){ //紫金钵普攻受击特效等待
				egret.Tween.get(_hitAni).wait(300/PVPFightManager.TIMESCALE).call(()=>{
					if(_hitAni.parent){
						_hitAni.parent.removeChild(_hitAni);
					}
					for(let i= object._hitAniSet.length-1; i>=0; i--){
						if(object._hitAniSet[i] == _hitAni){
							object._hitAniSet.splice(i,1);
						}
					}
				});
			}

			if(resObject.zhenping){
				FacadeApp.dispatchAction(CommandList.M_CMD_ZhenPing);
			}

			return _hitAni;
		}

		/**
		 * 创建buff特效
		 * $type buff类型
		 */
		public static async createBuffEffect($object: PVPSoldier, $type: number) {

			let resObject = BattleBuffEnum.BuffRes($type,$object._roleid);
			let _buff = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(resObject.res, $object);
			$object.addChild(_buff.display);

			_buff["curAnimationName"] = "buff_before";
			_buff.animation.gotoAndPlay("buff_before",-1,-1,1);
			_buff["type"] = $type;
			_buff.display.scaleX = 1;//$object._roleArmature.display.scaleX;
			_buff.display.scaleY = 1;//$object._roleArmature.display.scaleY;

			_buff.display.scaleX *= $object._direction;
			_buff.animation.timeScale = PVPFightManager.TIMESCALE;

			_buff.display.x = 0 + resObject.parX * $object._direction;
			_buff.display.y = 0 + resObject.parY;
			// _buff.display.

			_buff.addEventListener(dragonBones.AnimationEvent.COMPLETE, ()=>{
				if(_buff["curAnimationName"] == "buff_before"){// 出现到中ing
					
					// $object.Army.removeFightData($object.site);
					_buff["curAnimationName"] = "buff_playing";
					_buff.animation.gotoAndPlay("buff_playing",-1,-1,0);
					$object.judgeAndClearCurFightData();
				}
				if(_buff["curAnimationName"] == "buff_later"){//消失
					for(let i=$object._buffArmaSet.length - 1; i>=0; i--){
						if($object._buffArmaSet[i] == _buff){
							MovieManage.RemoveArmature(_buff);
							if(_buff.display.parent){
								console.log(_buff);
								_buff.display.parent.removeChild(_buff.display);
							}
							$object._buffArmaSet.splice(i,1);
							// break;
						}
					}
					$object.judgeAndClearCurFightData();
				}
			}, $object);

			return _buff;
		}

		/**
		 * 随机抽取攻击动作
		 * @skillType 技能类型
		 */
		public static RandomAttack(roleid: number,$skillType: number){
			let _attackStateArr: string[] = [];

			_attackStateArr = SkillType.getSkillName($skillType,roleid);
			// 随机动作抽取
			let randomState: number = Math.floor(_attackStateArr.length * Math.random());
			return _attackStateArr[randomState];
		}

		/**
		 * 创建龙骨或者图片资源,并且设置位置
		 */
		public static async creatSkillArmaRes($object: PVPSoldier,aniObject:Object,$type: string, hitObjectData:number[], curAniIndex: number){
			let res = aniObject["res"];
			let dur = $object._isMineArmy ? 1 : -1;// 方向
			let oriX = aniObject["oriXY"][0] * dur; // 加上角色固定的宽高
			let oriY = aniObject["oriXY"][1];
			
			let _skill = null;
			let _arm = null;
			if($type == "dra"){
				_skill = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie(res, $object);
				_arm = _skill.display;
				_skill.animation.gotoAndPlay(aniObject["aniName"],-1,-1,1);
				_skill.animation.timeScale = PVPFightManager.TIMESCALE;
			}
			else if($type == "mov"){
				_skill = new egret.MovieClip();
				_skill.movieClipData = <egret.MovieClipData> await MovieManage.GetMovieClipData(res + "_json", res + "_png", aniObject["aniName"]);
				_arm = _skill;
				_skill.play(1);
				_skill.frameRate = _skill.frameRate/PVPFightManager.TIMESCALE;
			}
			else if($type == "ima"){
				_skill = new eui.Image();// ObjectPool.getPool('eui.Image').borrowObject();
				_skill.texture = RES.getRes(res[0]);// <egret.Texture> await MovieManage.PromisifyGetRes(res[0]);
				_arm = _skill;
				console.log(_arm.height,_arm.width);				
				_arm.anchorOffsetY = _arm.height/2;
				_arm.anchorOffsetX = _arm.width/2;
			}
			else if($type == "par"){
				_skill = new particle.GravityParticleSystem(RES.getRes(res[0] + "_png"), RES.getRes(res[0] + "_json"));
				_skill.start();
				_arm = _skill;
			}
			
			_arm["aniName"] = aniObject["aniName"];
			_skill["isClear"] = aniObject["isClear"];
			_skill["type"] = $type;
			_skill["hitData"] = hitObjectData;
			_skill["curAniIndex"] = curAniIndex;
			// _skill["ishit"] = aniObject["hit"];
			_skill["aniData"] = aniObject;
			PVPFightManager.GetInstance().addChild(_arm);


			// 初始化位置为角色身上。为定点和初始偏差相加。角度没有计算。
			let _uidPosi = 1;
			if(!$object._isMineArmy) _uidPosi = 2;
			let posi = ArmyOfPosiSet[_uidPosi][$object.site];
			_arm.x = posi["x"] + oriX;
			_arm.y = posi["y"] + oriY;

			// 技能位置为敌方身上。检测技能
			if($object.status.current == SoldierStatusList.attacking && RoleAttackAniGroupNames.isEmeryPosi($object.AttackAniGroupName)){
				let _uidPosi2 = 1;
				if(hitObjectData[0] == PVPFightManager.GetInstance().armyOfEnemy._uid) _uidPosi2 = 2;
				
				// 为了comboo里面的图片
				if($type == "ima"){
					_arm.scaleX = 0.3;
					_arm.scaleY = 0.3;
				}

				let emeyPosi = ArmyOfPosiSet[_uidPosi2][2];
				if(!aniObject["isMulti"]){ emeyPosi = ArmyOfPosiSet[_uidPosi2][hitObjectData[2]]; }
				
				_arm.x = emeyPosi.x + oriX;
				_arm.y = emeyPosi.y + oriY;

				// 若是敌方。不是全体。翻转
				if(_uidPosi2 == 1){
					if($object.AttackAniGroupName == RoleAttackAniGroupNames.CommAttack_huangjinshen && curAniIndex == 2){
						_arm.scaleX *= dur;
					}
					if($object.AttackAniGroupName == RoleAttackAniGroupNames.CommAttack_wucaixiayi && curAniIndex == 2){
						_arm.scaleX *= dur;
						_arm.x = emeyPosi.x + oriX;
					}
				}
			}

			// 翻转。全体攻击
			if(aniObject["isMulti"]){
				_arm.scaleX *= dur;
			}

			if($type == "dra"){
				// 龙骨动画侦听
				_skill.addEventListener(dragonBones.AnimationEvent.COMPLETE, $object.SkillArmatureCompleteFun, $object);
			}else if($type == "mov"){
				// 帧动画侦听
				_skill.addEventListener(egret.Event.COMPLETE, $object.SkillMovieClipCompleteFun, $object);
			}

			return _skill;
		}


	}
}