/**
 * 邮件行
 */
class MailLine extends eui.Component{
	/*
	* 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/mail/MailLineSkins.exml";
    }

	//实现接口
    // public get getId():number{
    //     return this._mail ? this._mail["id"] : -1;
    // };

	/**
     * 更新
     */
    public update(mail:any):MailLine{
        this._mail = mail;
        this.Render();
        return this;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
		this.Render();
    }

	/**
     * 刷新页面
     */
    public Render(){
		if(!this._mail) return;

        // 测试数据
		// var _ifXin:boolean = false;
		var _derStr:string = "188区 【日月通混】开服公告";
		
		
		// 邮件类型 1 系统公告 2 系统邮件 3 活动邮件
		var _tyep:number = 1;
		if(_tyep == 1){
			RES.getResAsync("youjian_xitonggg_png",icon =>{ this._typeIma.texture = icon},this);
		}
		else if(_tyep == 2){
			RES.getResAsync("youjian_xitongyj_png",icon =>{ this._typeIma.texture = icon},this);
		}
		else if(_tyep == 1){
			RES.getResAsync("youjian_huodongyj_png",icon =>{ this._typeIma.texture = icon},this);
		}

		// 是否是未读邮件
		if(!this._mail["state"]){
			this._stateIma.source = "youjian_xin_png";
		}
		else
			this._stateIma.source = "youjian_yidu_png";
		
		this._derLabel.text = _derStr;
    }

	/**
	 * 点击邮件
	 */
	private onTap(e: egret.TouchEvent){
		// FacadeApp.fetchData([CommandList.M_NET_Mail,"&oper=4&idx=8"],[data=>{
			// FacadeApp.dispatchAction(CommandList.M_DAT_MailList, data['data']);
			// if(data["code"] != FacadeApp.SuccessCode){
			// 	UIPage.inst(UIPage).ShowPrompt().ShowWindow("失败！，错误代码" + data["code"]);
			// }else{
				UIPage.inst(UIPage).ShowMailDetailWindow(this._mail);
			// }
		// }]);
	}

	private _iconIma: eui.Image;					// 邮件图标
	private _typeIma: eui.Image;					// 邮件类型
	private _stateIma: eui.Image;					// 邮件状态标志
	private _derLabel: eui.Label;					// 邮件概要文本

	private _mail: Object = null;					// 邮件


}