/**
 * 邮件界面
 */
class MailWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/mail/MailWindowSkins.exml");

        //注册界面介质，为避免重复注册，先移除同名介质
        FacadeApp.inst.removeMediator(ViewerName.MailWindowMediator);
        FacadeApp.inst.registerMediator(new MailWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._chuliBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChuLiClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Mail);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();

        let data = FacadeApp.read(CommandList.Re_MailInfo).list;

        // 刷新与创建
        let _mailHeight = 0;
        for(let i=0; i<data.length; i++){
            if(!this._mailLineSet[i]){
                let line = new MailLine;
                this._mailGroup.addChild(line);
                this._mailLineSet.push(line);
            }
            this._mailLineSet[i].update(data[i]);
            this._mailLineSet[i].y = _mailHeight;
            _mailHeight += this._mailLineSet[i].height;
        }

        /**
         * 移除
         */
        if(data.length < this._mailLineSet.length){
            let deleLength = this._mailLineSet.length - data.length;
            for(let i=0; i<deleLength; i++){
                this._mailGroup.removeChild(this._mailLineSet[this._mailLineSet.length - 1]);
                this._mailLineSet.splice(this._mailLineSet.length - 1,1);
            }
        }
    }
	
	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

	/**
     * 一键处理按钮响应
     */
    private _OnChuLiClick(event : egret.TouchEvent){
		console.log("一键处理");

        let data = FacadeApp.read(CommandList.Re_MailInfo).noReadList;
        if(data.length > 0){
            FacadeApp.fetchData([CommandList.M_NET_Mail,"&oper=4&idx=" + data],[data=>{
                if(data["code"] != FacadeApp.SuccessCode){
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
                FacadeApp.Notify(CommandList.M_CMD_UiOpened_Mail);
                SoundManager.PlayCloseWinMusic();
                this.UnRegister();
            }]);
        }
    }

    // 变量
    private _closeButton : eui.Button;                      // 关闭按钮
	private _chuliBtn: eui.Button;							// 一键处理按钮
    
    private _mailScroller : eui.Scroller;                     // 物品列表
    private _mailGroup : eui.Group;                            // 滚动容器
    private _mailLineSet : MailLine[] = [];                  // 邮箱行集合

    private 
    // private _mailLineSet: MailLine[];                        // 条目信息
}