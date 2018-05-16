/**
 * 佛光守护界面
 */
class BuddhaGuardWindow extends APanel{
	/*
	* 构造方法
     */
    public constructor(){
		super("resource/game_skins/buddha/BuddhaGuardWindowSkins.exml");

		FacadeApp.inst.removeMediator(ViewerName.BuddhaGuardMediator); 
        FacadeApp.inst.registerMediator(new BuddhaManagerMediator(this));
    }

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._shouhuBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGuardClick, this);
        this._lookForBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnLookForClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Talisman);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
	}

    /**
     * 访问
     */
    public onAccess(){
        super.onAccess();

        this._iconIma.visible = false;
        this._iconBgIma.visible = false;

        this._shouhuBtn.visible = true;
        this._lookForBtn.enabled = false;
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    /**
     * 守护按钮响应
     */
    private _OnGuardClick(event : egret.TouchEvent){

        this._shouhuBtn.visible = false;

        FacadeApp.fetchData([CommandList.M_NET_TalismanNum, `&oper=4&id&pm=${FacadeApp.read(CommandList.Re_Status).totem}`], [data=>{
            if (data["code"] == FacadeApp.SuccessCode){

                Object.keys(data['data']['reAssign']).map(id=>{
                    // 带入佛光重新分配动画：id（法宝编号） / ['reAssign'][id]（分配到的数量）
                    // console.log(`${id} / ${data['data']['reAssign'][id]}`);

                    // 如果同一个法宝，分配了多个佛光。不知道是否会多次执行，所以写个循环
                    // for(var i:number=0; i<data['data']['reAssign'][id]; i++)
                    // {
                    //     this.creatBuddhaGuardAni(id);
                    // }

                    this.creatBuddhaGuardAni(id);
                });
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
            FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList, data['data']); //更新法宝数据

        }]);
    }

    /**
     * 点击查看
     */
    private _OnLookForClick(event : egret.TouchEvent){
        //1、关闭当前窗口
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
        //2、通知UIPage打开佛光管理窗口
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Buddha);
    }

    /**
     * 创建佛光守护动画
     */
    private async creatBuddhaGuardAni($id){
        // console.log("守护的法宝id："+$id)
        
        this._armature = <dragonBones.Armature> await MovieManage.PromisifyGetDragonBonesMovie('foguang_sh', this);
        this.addChild(this._armature.display);

        this._armature.display.x = 0;
        this._armature.display.y = 0;

        this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, (e:egret.TouchEvent) =>{
            //显示守护的法宝
            this._iconIma.visible = true;
            this._iconBgIma.visible = true;

            var item:Talisman =TalismanManager.GetTalismanByID($id);
            // console.log("图片："+item.Icon);
            // this._iconIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(item.Icon + "_png", this);
            RES.getResAsync(item.Icon+"_png",icon =>{ this._iconIma.texture = icon},this);

            MovieManage.RemoveArmature(e.target.parent);
            this.removeChild(e.target);
            this._armature = null;
            this._lookForBtn.enabled = true;
        },this);
        this._armature.animation.gotoAndPlay("foguang_sh");
    }

	public _closeButton : eui.Button;						// 关闭按钮
	public _shouhuBtn : eui.Button;						    // 守护按钮
	private _iconIma : eui.Image;							// 守护的法宝图标
    private _iconBgIma : eui.Image;                         // 图标的背景图
    public _armature: dragonBones.Armature = null;          // 龙骨

    private _lookForBtn : eui.Button;						// 查看按钮
    public _buddhaNumLabel : eui.Label;						// 守护佛光数量的Label
}