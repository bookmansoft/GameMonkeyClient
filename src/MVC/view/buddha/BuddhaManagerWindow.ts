/**
 * 佛光管理界面
 * 
 * 实现如下功能：
 * 1、标定当前选中项目 OK
 * 2、选中并点选重新分配该项上的佛光 OK
 * 
 * @todo: 
 *  界面上没有安排每日免费佛光转移次数：在 _freeChangeBtn 按钮上安排文本域
 *  界面上没有安排本次佛光转移需要消耗的元宝数量：在 _changeBtn 按钮上安排文本域和元宝图标
 */
class BuddhaManagerWindow extends APanel{
	/*
	* 构造方法
     */
    public constructor(){
		super("resource/game_skins/buddha/BuddhaManagerWindowSkins.exml");
		FacadeApp.inst.removeMediator(ViewerName.BuddhaManagerMediator); 
        FacadeApp.inst.registerMediator(new BuddhaManagerMediator(this));
        
    }

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        // this._fgChange.visible = false;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._changeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeClick, this);
		this._freeChangeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeClick, this);

        // 初始按钮类型
        this._changeBtn.updateShow(2,["佛光转移","-20"]);
        this._freeChangeBtn.updateShow(2,["免费转移","3"]);

        this.Render();
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public async ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Talisman);

        if(this.lineSelected){
            this.lineSelected.ChooseBg(true);
            // this._choseBg.texture = <egret.Texture> await MovieManage.PromisifyGetRes("foguang_fp01_png", this);
            // this._fgGroup.addChild(this._choseBg);
            // this._choseBg.x = this.lineSelected.x-15;
            // this._choseBg.y = this.lineSelected.y-15;

            this._fgChange.updataShow(this.lineSelected.Talisman);
            this._fgChange.visible = true;
        }
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        if(FacadeApp.read(CommandList.Re_Status).freePoint > 0){
            var num:number = FacadeApp.read(CommandList.Re_Status).freePoint;
            this._freeChangeBtn.updateShow(2,["免费转移",num]);
            this._freeChangeBtn.visible = true;
            this._changeBtn.visible = false;
        }
        else{
            this._changeBtn.updateShow(2,["佛光转移","-20"]);
            this._freeChangeBtn.visible = false;
            this._changeBtn.visible = true;
        }

        if (this._fgLineSet == null){
            this._fgLineSet = [];
        }

        let self = this;

        let talismans = FacadeApp.read(CommandList.Re_TalismanInfo).list;
        let totalPoint = 0;
        Object.keys(talismans).map(i => {
            let talisman = talismans[i];
            let line: BuddhaLine = null;
            //实际调测中，发现如果每次都创建新对象并添加到舞台，会导致程序运行异常缓慢，战斗模块的帧动画播放掉帧严重；改为已有项只做数据刷新后，程序运行恢复正常
            if(typeof self._fgLineSet[talisman.i] == 'undefined' || self._fgLineSet[talisman.i] == null){
                line = new BuddhaLine(TalismanManager.fromData(talisman));
                line.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnFoGuangImaClick,this);
                self._fgLineSet[talisman.i] = line;
            }
            else{
                line = self._fgLineSet[talisman.i]; 
            }
            totalPoint += line.Talisman.ori.p;

            if(self.lineSelected == null){
                self.lineSelected = line;
                self._fgChange.updataShow(self.lineSelected.Talisman);
            }
        });
        this._fgNumLabel.text = totalPoint.toString();

        //所有佛光遍历一次，已有的刷新，尚未获得的使用配置信息填充
        let id = 1;
        let lineHeight: number = 0;
		let lineWidth: number = 0;
        while(TalismanManager.GetTalismanByID(id) != null){
            let line: BuddhaLine = null;

            if(typeof self._fgLineSet[id] == 'undefined' || self._fgLineSet[id] == null){
                line = new BuddhaLine(TalismanManager.GetTalismanByID(id));
                self._fgLineSet[id] = line;
            }
            else {
                line = self._fgLineSet[id]; 
                line.UpdateShow();
            }
            line.x = lineWidth;
            line.y = lineHeight;
            self._fgGroup.addChild(line);
            lineWidth += line.width;

            if(lineWidth >= line.width*5)
            {
                lineWidth = 0;
                lineHeight += line.height;
            }

            id++;
        }
    }

    /**
     * 点击法宝图标
     */
    private _OnFoGuangImaClick(event : egret.TouchEvent){
        let curChoose = event.target.parent;
        if(curChoose != this.lineSelected){
            if(!(curChoose instanceof BuddhaLine)) return;
            this.lineSelected.ChooseBg(false);
            this.lineSelected = curChoose;
            this.lineSelected.ChooseBg(true);    
            this._fgChange.updataShow(this.lineSelected.Talisman);
            this._fgChange.visible = true;
            // this._choseBg.texture = <egret.Texture> await MovieManage.PromisifyGetRes("foguang_fp01_png", this);
            // this._fgGroup.addChild(this._choseBg);
            // this._choseBg.x = this.lineSelected.x - 15;
            // this._choseBg.y = this.lineSelected.y-15;
            // this._fgChange.updataShow(this.lineSelected.Talisman);
            // this._fgChange.visible = true;
        }
    }

	/**
	 * 点击转移按钮
	 */
	private _OnChangeClick(event : egret.TouchEvent){
        if(this.lineSelected && this.lineSelected.Talisman.ori){
            //this._fgGroup.removeChild(this._choseBg);
            if(this.lineSelected){
                this.lineSelected.ChooseBg(false);
                // this.lineSelected = null;
            }
            // if(this._choseBg.parent){
            //     this._choseBg.parent.removeChild(this._choseBg);
            // }
            //根据用户的选择，决定转移的佛光的数量
            let totalNum = 1;
            switch(this._fgChange._curChooseNum){
                case 1:
                    if(FacadeApp.read(CommandList.Re_Status).freePoint > 0){
                        totalNum = Math.min(10, Math.min(FacadeApp.read(CommandList.Re_Status).freePoint, this.lineSelected.Talisman.ori.p));
                    }
                    else{
                        totalNum = Math.min(10, this.lineSelected.Talisman.ori.p);
                    }
                    break;
                case 2:
                    if(FacadeApp.read(CommandList.Re_Status).freePoint > 0){
                        totalNum = Math.min(FacadeApp.read(CommandList.Re_Status).freePoint, this.lineSelected.Talisman.ori.p);
                    }
                    else{
                        totalNum = this.lineSelected.Talisman.ori.p;
                    }
                    break;
            }
            FacadeApp.fetchData([CommandList.M_NET_TalismanNum, `&oper=3&id=${this.lineSelected.Talisman.ori.i}&pm=${totalNum}`], [data => {
                if (data["code"] == FacadeApp.SuccessCode){
                    let list:Array<any> = [];

                    // 制作佛光重新分配动画：
                    let curId:number = this.lineSelected.Talisman.ori.i;
                    Object.keys(data['data']['reAssign']).map(id=>{
                        // id(法宝编号) / data['data']['reAssign'][id](分配到的数量)
                        // console.log(`${id} / ${data['data']['reAssign'][id]}`);

                        // 同一个法宝，有可能分配了多个佛光, 因此传入数量参数 - 注意：creatChangeAni返回了一个Promise对象
                        list.push(this.creatChangeAni(curId, parseInt(id), data['data']['reAssign'][id]));
                    });
                    //并发：list中所有的Promise同时开始异步执行，且全部执行完毕、返回结果后，才会执行then中的语句，这是为了先播放动画、再修改佛光的最终数值（真实体验），而不是数值先改变、再播放动画（好假）
                    Promise.all(list).then(posts => {
                        FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList, data['data']);
                    });
                }
                else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
        }
    }

    /**
     * 创建佛光星星转移动画
     * $id 转移的法宝id
     * $posiId 变化后的法宝id
     * $num 转移的数量
     */
    private creatChangeAni($oriId:number, $posiId:number, $num:number){
        return new Promise( (resolve, reject) => {
            //加载星星资源
            RES.getResAsync("foguang_fp02_png",star =>{
                let starIma:eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
                starIma.texture = star;
                this._fgGroup.addChild(starIma);

                starIma.scaleX = 0.5;
                starIma.scaleY = 0.5;
                starIma.anchorOffsetX = starIma.width/2;
                starIma.anchorOffsetY = starIma.height/2;
                
                starIma.x = this._fgLineSet[$oriId].x + this._fgLineSet[$oriId].width/2;
                starIma.y = this._fgLineSet[$oriId].y + this._fgLineSet[$oriId].height/2;

                //为每次跳转设置若干中间点，以模拟一个随机飞跃路线
                let moveArr:any[]=[];
                for(let i:number=0; i<4; i++) {
                    let changNum:number = 0;
                    if(moveArr.length>1)  {
                        if(i<3){
                            do{
                                changNum = Math.floor( Math.random() * (this._fgLineSet.length-1)) + 1;
                            }while(moveArr[moveArr.length-1] == changNum)
                        }
                        else{
                            do{
                                changNum = Math.floor( Math.random() * (this._fgLineSet.length-1)) + 1;
                            }while(moveArr[moveArr.length-1] == changNum || changNum == $posiId)
                        }
                    }
                    else{
                        changNum = Math.floor( Math.random() * (this._fgLineSet.length-1)) + 1;
                    }
                    moveArr.push(changNum);
                }
                moveArr.push($posiId);

                //星星移动动画
                egret.Tween.get(starIma)
                .to({x:this._fgLineSet[moveArr[0]].x+this._fgLineSet[moveArr[0]].width/2, y : this._fgLineSet[moveArr[0]].y+this._fgLineSet[moveArr[0]].height/2},300)
                .to({x:this._fgLineSet[moveArr[1]].x+this._fgLineSet[moveArr[1]].width/2 , y : this._fgLineSet[moveArr[1]].y+this._fgLineSet[moveArr[1]].height/2},300)
                .to({x:this._fgLineSet[moveArr[2]].x+this._fgLineSet[moveArr[2]].width/2 , y : this._fgLineSet[moveArr[2]].y+this._fgLineSet[moveArr[2]].height/2},300)
                .to({x:this._fgLineSet[moveArr[3]].x+this._fgLineSet[moveArr[3]].width/2 , y : this._fgLineSet[moveArr[3]].y+this._fgLineSet[moveArr[3]].height/2},300)
                .to({x:this._fgLineSet[moveArr[4]].x+this._fgLineSet[moveArr[4]].width/2 , y : this._fgLineSet[moveArr[4]].y+this._fgLineSet[moveArr[4]].height/2},300)
                .call(
                    function(){
                        this.starMoveEnd(starIma,$oriId,$posiId)
                        resolve();
                    }.bind(this));
            },this);
        });
    }

    /**
     * 星星移动结束,开始闪光特效
     * 星星元件，初始位置，终点位置
     */
    private async starMoveEnd($star,$oriId,$posiId){
        ObjectPool.getPool('eui.Image').returnObject($star);
        this._fgGroup.removeChild($star);

        let starBgIma:eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
        starBgIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("foguang_fp02_png", this);
        this._fgGroup.addChild(starBgIma);

        starBgIma.scaleX = 1;
        starBgIma.scaleY = 1;
        starBgIma.anchorOffsetX = starBgIma.width/2;
        starBgIma.anchorOffsetY = starBgIma.height/2;
        starBgIma.x = this._fgLineSet[$posiId].x + this._fgLineSet[$posiId].width/2;
        starBgIma.y = this._fgLineSet[$posiId].y + this._fgLineSet[$posiId].height/2;

        //加载闪光龙骨的动画
        let _armature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie('foguang_fp03', this);
        this._fgGroup.addChild(_armature.display);
        _armature.display.anchorOffsetX = 0;
        _armature.display.anchorOffsetY = 0;

        _armature.display.x = this._fgLineSet[$posiId].x + this._fgLineSet[$posiId].width/2;
        _armature.display.y = this._fgLineSet[$posiId].y + this._fgLineSet[$posiId].height-10;
        _armature.animation.gotoAndPlay("foguang_fp03");

        _armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, (e:egret.TouchEvent) =>	{
            ObjectPool.getPool('eui.Image').returnObject(starBgIma);
            this._fgGroup.removeChild(starBgIma);

            MovieManage.RemoveArmature(e.target.parent);
            this._fgGroup.removeChild(e.target);
            _armature = null;
        },this);
    }

	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
        FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_CONTINUE);
    }

	private _fgNumLabel : eui.BitmapLabel;				// 佛光总数量文本
    private _fgGroup : eui.Group;               		// 滚动容器
	private _closeButton : eui.Button;					// 关闭按钮

	private _changeBtn : LabelButton;					// 转移按钮
	private _freeChangeBtn :LabelButton;				// 免费转移按钮

    private _fgChange : BuddhaChange;                   // 佛光转移详情
	private _fgLineSet : BuddhaLine[];                  // 佛光行集合

    public _armature: dragonBones.Armature = null;      // 龙骨

    // public _choseBg: eui.Image = new eui.Image;                  // 选择显示的背景
    private lineSelected: BuddhaLine = null;            // 当前选中的法宝
}