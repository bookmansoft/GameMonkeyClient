/**
 * 登录界面
 */
class LoginPage extends eui.Component implements eui.UIComponent {
	/**
	 * 构造方法
	 */
	public constructor() {
		super();
		this.skinName = "resource/game_skins/page/LoginPage.exml";
	}

	/**
	 * 子项创建完成
	 */
	protected childrenCreated(): void {
		super.childrenCreated();
		this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._StartTouchTap, this);
	}
	
	/**
	 * 点击进入游戏
	 */
	private _StartTouchTap($e: egret.TouchEvent): void {
		SoundManager.PlayButtonMusic();
		this._startButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._StartTouchTap, this);
		FacadeApp.Notify(CommandList.M_CMD_Login);
	}

	/**
	 * 显示
	 */
	public static Register(parent: egret.DisplayObjectContainer){
        this.inst.UnRegister();
        parent.addChild(this.inst);
	}

	/**
	 * 移除显示
	 */
	public UnRegister(){
		if(this.parent){
		    this.parent.removeChild(this);
		}
		LoginPage._self = null;
	}

	/**
	 * LoginPage 本身实例
	 */
	public static get inst() : LoginPage{
		if(LoginPage._self == null){
			LoginPage._self = new LoginPage(); 
		}
		return LoginPage._self;
	}

	/**
	 * 进入游戏的按钮
	 */
	private _startButton: eui.Button;
	private static _self: LoginPage;
}