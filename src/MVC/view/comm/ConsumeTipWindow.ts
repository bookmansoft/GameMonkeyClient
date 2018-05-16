/**
 * 提示弹框,确认购买弹框
 */
class ConsumeTipWindow extends APanel{
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/ui/ConsumeTipWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        SoundManager.PlayError1Music();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._waitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._rightNowBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSureClick, this);
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
    }

	/**
     * 确定点击响应
     */
    private _OnSureClick(event: egret.TouchEvent){
        SoundManager.PlayError2Music();
		if (this._okFunction != null) {
            this._okFunction();
        }
        this.UnRegister();
    }

	/**
     * 显示界面,设置界面文本
     * @param   prompt          显示内容
     * @param   okProcess       确认响应方法
	 * @param   sureParamSet    确认响应方法处理参数
     */
	public ShowWindow(prompt: string, okProcess: Function, okParamSet?: any[]) {
        this._msgLabel.text = prompt;
        this._okFunction = okProcess;
    }

	// 变量
    private _closeButton: eui.Button;                   // 关闭按钮
    private _msgLabel: eui.Label;                       // 提示内容
    private _rightNowBtn:eui.Button;                    // 确定按钮
    private _waitBtn:eui.Button;                        // 取消按钮
	private _okFunction: Function = null;               // 确定执行函数
}