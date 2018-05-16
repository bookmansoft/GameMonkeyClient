const DragonObjType = {
    show_hou: 'show_hou',
    stand_hou: 'stand_hou',
    show_qian: 'show_qian',
    guang: 'guang',
    stand_qian: 'stand_qian',
}

class DragonObj
{
    public name:string = '';
    public obj:dragonBones.Armature = null;
    
    public constructor(_name:string, _obj){
        this.name = _name;
        this.obj = _obj;
    }
}

/**
 * 三界符动画管理
 */
class SanjieAniManage extends egret.DisplayObjectContainer {
    /**
     * 五行召唤龙骨资源
     */
    private _resArr1 = {};      
    /**
     * 窥探天机龙骨资源
     */
    private _resArr2 = {};      

    /**
	 * 构造方法
	 */
	public constructor() {
		super();

        //根据资源名称,载入骨骼动画
        Object.keys(DragonObjType).map(id=>{
            //如果首屏加载了group.sanjiefu，那么此处可以同步加载
            // this._resArr1[DragonObjType[id]] = new DragonObj(MovieManage.GetDragonBonesMovie('hong_' + DragonObjType[id]));
            // this._resArr2[DragonObjType[id]] = new DragonObj(MovieManage.GetDragonBonesMovie('lan_' + DragonObjType[id]));

            // 如果首屏没有加载group.sanjiefu，那么此处要异步加载
            MovieManage.GetDragonBonesMovie('hong_' + DragonObjType[id], _armature => {
                if(_armature == null){
                    console.log('create monster armature error: ' + 'hong_' + DragonObjType[id]);
                    return;
                }
                this._resArr1[DragonObjType[id]] = new DragonObj('hong_' + DragonObjType[id], _armature);
            });
            MovieManage.GetDragonBonesMovie('lan_' + DragonObjType[id], _armature => {
                if(_armature == null){
                    console.log('create monster armature error: ' + 'lan_' + DragonObjType[id]);
                    return;
                }
                this._resArr2[DragonObjType[id]] = new DragonObj('lan_' + DragonObjType[id], _armature);
            }, this);
        });
	}

    /**
     * 开始播放动画
     * @param cur 五行 1 天机 2
     * @param arr 卡牌数组
     * @param adChip 万能进阶碎片
     * @param chip 万能强化碎片
     */
    public PlayAni(cur:number, arr:any[] = [], adChip:number = 0, chip:number = 0)
    {   
        //创建显示的符咒
        this._sanjieGhost = [];
        this._cur = cur;
        for(let i = 0;i<arr.length;i++){
            let tem = arr[i].p;
            for(tem > 0;tem--;){
                this._sanjieGhost.push(new SanjieCard(arr[i].id));
            }
        }
        for(adChip > 0;adChip--;){
            this._sanjieGhost.push(new SanjieCard(5)); //需替换为万能碎片id
        }
        for(chip > 0;chip--;){
            this._sanjieGhost.push(new SanjieCard(6)); //需替换为万能碎片id
        }
        for(let j = 0;j < this._sanjieGhost.length;j++){        
            this.addChild(this._sanjieGhost[j]);
            this._sanjieGhost[j].y=500;
            this._sanjieGhost[j].x=170;
            this._sanjieGhost[j].scaleX=0.001;
            this._sanjieGhost[j].scaleY=0.001;
        }
        if(cur == 1){
            this._curResArr=this._resArr1;
        }
        else if(cur == 2){
            this._curResArr=this._resArr2;
        }
        

        this._state="ing";

        // 初始显示动画
        this._startShowAni = this._curResArr[DragonObjType.show_hou].obj;
        this._startShowAni.addEventListener(dragonBones.AnimationEvent.COMPLETE,this.showAni, this);
                
        MovieManage.ADDArmature(this._startShowAni);
        this.addChild(this._startShowAni.display);
        this._startShowAni.animation.gotoAndPlay(this._curResArr[DragonObjType.show_hou].name, -1,-1,1);
    }
    private showAni(e:egret.Event){
        {
            if(this._startShowAni.display.parent == null){
                return;
            }

            this._startShowAni.display.parent.removeChild(this._startShowAni.display);
            MovieManage.RemoveArmature(this._startShowAni);
            this._startShowAni.removeEventListener(dragonBones.AnimationEvent.COMPLETE,(e,cur)=>{this.showAni},this);
            
            //创建圆圈动画
            MovieManage.ADDArmature(this._curResArr[DragonObjType.stand_hou].obj);
            this.addChild(this._curResArr[DragonObjType.stand_hou].obj.display);
            this._curResArr[DragonObjType.stand_hou].obj.animation.gotoAndPlay(this._curResArr[DragonObjType.stand_hou].name);
            for(let num = 0; num < this._sanjieGhost.length;num++)
            {           
                this._sanjieGhost[num].anchorOffsetX=this._sanjieGhost[num].width/2;
                this._sanjieGhost[num].anchorOffsetY=this._sanjieGhost[num].height/2;
                this._sanjieGhost[num].x = 1000+44*num;
                this._sanjieGhost[num].y = 1136/2+25;
                this.setChildIndex(this._sanjieGhost[num],this.numChildren-1);
                if(this._cur == 1){
                    this._sanjieGhost[num].scaleX=1.5;
                    this._sanjieGhost[num].scaleY=1.5;
                }else{
                    this._sanjieGhost[num].scaleX=0.6;
                    this._sanjieGhost[num].scaleY=0.6;
                }
                
            }
            this._count = 0;
            this.feichu(this._cur);
        }
    }
    /**
     * 漂浮动画监听
     */
    // private _OnFrame(e:egret.Event){
    //     if(this._speed>=0.7){
	// 	    this._a=-0.05;
    //     }
	// 	else if(this._speed<=-0.7){
	// 		this._a=0.05;
    //     }

	// 	this._speed+=this._a;
	// 	this._sanjieGhost[0].y+=this._speed;
    //     this._curResArr[DragonObjType.stand_qian].obj.display.y+=this._speed;
    //     this._curResArr[DragonObjType.guang].obj.display.y+=this._speed;
    // }

    /**
     * 动画全部结束
     */
    public AniEnd()
    {
        // this.removeEventListener(egret.Event.ENTER_FRAME,this._OnFrame,this);

        // this.removeChild(this._curResArr[DragonObjType.stand_qian].obj.display);
        // MovieManage.RemoveArmature(this._curResArr[DragonObjType.stand_qian].obj);

        this.removeChild(this._curResArr[DragonObjType.stand_hou].obj.display);
        MovieManage.RemoveArmature(this._curResArr[DragonObjType.stand_hou].obj);

        // this.removeChild(this._curResArr[DragonObjType.guang].obj.display);
        // MovieManage.RemoveArmature(this._curResArr[DragonObjType.guang].obj);
        for(let num = 0; num < this._sanjieGhost.length;num++)
        {
            this.removeChild(this._sanjieGhost[num]);
        }
    }
    private feichu(cur:number){
        //开始神符飞出动画
        egret.Tween.get(this._sanjieGhost[this._count]).to({scaleX:(cur==1?1.5:0.6),scaleY:(cur==1?1.5:0.6),x:(cur==1?323:this._sanjieGhost[this._count].width/2*0.6 + 44*this._count),y:593},200).call(()=>{
            //飞出动画结束

            //创建八卦动画
            // MovieManage.ADDArmature(this._curResArr[DragonObjType.show_qian].obj);
            // this.addChild(this._curResArr[DragonObjType.show_qian].obj.display);
            // this._curResArr[DragonObjType.show_qian].obj.animation.gotoAndPlay(this._curResArr[DragonObjType.show_qian].name,-1,-1,1);
            // this._curResArr[DragonObjType.show_qian].obj.addEventListener(dragonBones.AnimationEvent.COMPLETE, ()=>{
                // //八卦播放完成
                // if(this._curResArr[DragonObjType.show_qian].obj.display.parent == null){
                //     return;
                // }
                // this._curResArr[DragonObjType.show_qian].obj.display.parent.removeChild(this._curResArr[DragonObjType.show_qian].obj.display);
                // MovieManage.RemoveArmature(this._curResArr[DragonObjType.show_qian].obj._baGuaAni);
                //创建结束,漂浮动画开始
                if(this._sanjieGhost[this._count].Card.ID == 13 || this._sanjieGhost[this._count].Card.ID == 16 || this._sanjieGhost[this._count].Card.ID == 20){
                    let tw = egret.Tween.get(this._sanjieGhost[this._count]);
                    tw.to({scaleX:1,scaleY:1,x:320,y:450},1000,egret.Ease.backOut).call(()=>{
                        FacadeApp.Notify(CommandList.M_CMD_ZhenPing);
                    },this).wait(1000).to({scaleX:(cur==1?1.5:0.6),scaleY:(cur==1?1.5:0.6),x:(cur==1?323:this._sanjieGhost[this._count].width/2*0.6 + 44*this._count),y:593},200).call(()=>{
                        if(this._count == this._sanjieGhost.length -1 ) this._state="end";
                        else {
                            this._count++;
                            this.feichu(cur);
                        }
                    });
                }
                else{
                    if(this._count == this._sanjieGhost.length -1 ) this._state="end";
                    else {
                        this._count++;
                        this.feichu(cur);
                    }
                }

            // }, this);

                //创建边框动画
                // MovieManage.ADDArmature(this._curResArr[DragonObjType.guang].obj);
                // this._curResArr[DragonObjType.guang].obj.display.x=640/2;
                // this._curResArr[DragonObjType.guang].obj.display.y=1136/2;
                // this.addChild(this._curResArr[DragonObjType.guang].obj.display);
                // this._curResArr[DragonObjType.guang].obj.animation.gotoAndPlay(this._curResArr[DragonObjType.guang].name);
                // this.setChildIndex(this._sanjieGhost[0],this.numChildren-1);

                //创建闪电动画
                // MovieManage.ADDArmature(this._curResArr[DragonObjType.stand_qian].obj);
                // this.addChild(this._curResArr[DragonObjType.stand_qian].obj.display);
                // this._curResArr[DragonObjType.stand_qian].obj.animation.gotoAndPlay(this._curResArr[DragonObjType.stand_qian].name);
                // this._curResArr[DragonObjType.stand_qian].obj.animation.gotoAndPlay(this._curResArr[DragonObjType.stand_qian].name);

                
                // this.addEventListener(egret.Event.ENTER_FRAME,this._OnFrame,this);
        },this);
    }
    /**
	 * 获取动画播放状态
	 */
	public GetState(): string {
		return this._state;
	}

    /**
	 * 设置动画播放状态
	 */
	public SetState($state=null) {
		this._state = $state;
	}

    private _curResArr: any;                              // 当前动画
    private _startShowAni: dragonBones.Armature ;
    private _state: string;                               // 动画是否播放完 ing 正在播放 end 结束 null 没有动画
    private _sanjieGhost: SanjieCard[];                    // 神符
    private _speed: number = 0.7;                         // 漂浮的速度
	private _a: number = 0.05;                            // 漂浮的加速度
    private _count:number;
    private _cur:number;
}