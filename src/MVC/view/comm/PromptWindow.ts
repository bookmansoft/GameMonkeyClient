/**
 * 提示弹框
 */
class PromptWindow extends APanel{
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/ui/PromptWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        SoundManager.PlayError1Music();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._sureButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSureClick, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnShareClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

	/**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayError2Music();
        this.UnRegister();
		if (this._okFunction != null) this._okFunction();
    }

	/**
     * 知道了按钮点击响应
     */
    private _OnSureClick(event: egret.TouchEvent){
        SoundManager.PlayError2Music();
        this.UnRegister();
		if (this._cancelFunction != null) this._cancelFunction();
    }

    /**
     * 分享按钮点击响应
     * todo:对接分享接口，并处理后续流程
     */
    private _OnShareClick(event: egret.TouchEvent){
        SoundManager.PlayError2Music();
        this.UnRegister();
    }

	/**
     * 显示界面,设置界面文本
     * @param   prompt          显示内容
     * @param   okProcess       确认响应方法
	 * @param   sureParamSet    确认响应方法处理参数
     * @param   isCancel        是否存在放弃（取消）按钮，默认是
     * @param   cancelProcess   取消响应方法
     * @param   cancelParamSet  取消响应方法处理参数
     * @param   share           是否为分享弹窗
     */
	public ShowWindow(prompt: string, okProcess: Function = null, okParamSet: any[] = null, isCancel: boolean = false, cancelProcess: Function = null, cancelParamSet: any[] = null , share:boolean = false ) {
        this._contentLabel.text = prompt;
        if(share) this._shareButton.visible = true;
        else this._shareButton.visible = false;
        //this._cancel.visible = isCancel;
        //isCancel ? this._ok.x = 238 : this._ok.x = 154;
        this._okFunction = okProcess;
        this._cancelFunction = cancelProcess;
    }


	// 变量
    private _closeButton: eui.Button;                   // 关闭按钮
    private _contentLabel:eui.Label;                    // 提示内容
    private _sureButton:eui.Button;                     // 确定按钮
    private _shareButton: eui.Button;

	private _okFunction: Function = null;               // 确定执行函数
    private _cancelFunction: Function = null;           // 取消执行函数
}