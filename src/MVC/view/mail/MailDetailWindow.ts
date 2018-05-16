class MailDetailWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/mail/MailDetailWindowSkins.exml");
    }

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._deleteButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._closeButton1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick2, this);
		this.Render();
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

		if(!this._mail) return;
		this.showMailContent(this._mail);
	}

	/**
	 * 更新显示内容
	 */
	public showMailContent($mail: Object){
		this._mail = $mail;
		// console.log(JSON.parse(this._mail["content"]));

		this._titleLabel.text = "";
		this._contentLabel.text = "";

		// 邮件类型 1 系统公告 2 系统邮件 3 活动邮件
		var _tyep:number = 1;
		if(_tyep == 1){
			RES.getResAsync("youjian_xitonggg_png",icon =>{ this._mailTypeIma.texture = icon},this);
		}
		else if(_tyep == 2){
			RES.getResAsync("youjian_xitongyj_png",icon =>{ this._mailTypeIma.texture = icon},this);
		}
		else if(_tyep == 1){
			RES.getResAsync("youjian_huodongyj_png",icon =>{ this._mailTypeIma.texture = icon},this);
		}

		// 是否是未读邮件
		if(!this._mail["state"]){
			this._deleteButton.visible = false;
		}
		else
			this._deleteButton.visible = true;


	}

	/**
     * 领取并且关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
		FacadeApp.fetchData([CommandList.M_NET_Mail,"&oper=4&idx=" + this._mail["id"]],[data=>{
			if(data["code"] != FacadeApp.SuccessCode){
				UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
			}
			FacadeApp.Notify(CommandList.M_CMD_UiOpened_Mail);
			SoundManager.PlayCloseWinMusic();
        	this.UnRegister();
		}]);
    }

	/**
     * 删除按钮响应
     */
    private _OnDeleteClick(event : egret.TouchEvent){
		FacadeApp.fetchData([CommandList.M_NET_Mail,"&oper=2&idx=" + this._mail["id"]],[data=>{
			if(data["code"] != FacadeApp.SuccessCode){
				UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
			}
			FacadeApp.Notify(CommandList.M_CMD_UiOpened_Mail);
			SoundManager.PlayCloseWinMusic();
        	this.UnRegister();
		}]);
    }

	/**
     * 关闭按钮响应
     */
    private _OnCloseClick2(event : egret.TouchEvent){
		FacadeApp.Notify(CommandList.M_CMD_UiOpened_Mail);
		SoundManager.PlayCloseWinMusic();
		this.UnRegister();
    }

	// 变量
    private _closeButton : eui.Button;                      // 关闭按钮
	private _mailTypeIma: eui.Image;						// 邮件类型图片
	private _bonusScroller: eui.Scroller;					// 奖励滚动区域
	private _bonusGroup: eui.Group;							// 奖励显示容器
	private _titleLabel: eui.Label;							// 邮件标题文本
	private _contentLabel: eui.Label;						// 邮件内容文本
	private _deleteButton: eui.Button;						// 删除按钮
	private _closeButton1: eui.Button;						// 关闭按钮

	private _mail: Object;									// 邮件
}