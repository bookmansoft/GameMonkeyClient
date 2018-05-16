/**
 * 加载界面
 */
class LoadingPage extends eui.Component implements eui.UIComponent {
	/**
	 * 构造方法
	 */
	public constructor() {
		super();
		this.skinName = "resource/game_skins/page/LoadingPage.exml";
	}
	
	/**
	 * 显示
	 */
	public static Register(parent: egret.DisplayObjectContainer){
       	parent.addChild(LoadingPage.inst);
	}

	/**
	 * 移除显示
	 */
	public UnRegister(){
        this.parent.removeChild(this);
		LoadingPage._self = null; //去除引用
	}

	/**
	 * LoadingPage页面本身
	 */
	public static get inst() : LoadingPage{
		if(LoadingPage._self == null){
			LoadingPage._self = new LoadingPage(); 
		}
		return LoadingPage._self;
	}

	/**
	 * 外部调用-更新进度条函数
	 */
	public static upDateProgress($p: string): void {
		LoadingPage.inst.upDateProgress($p);
	} 
	
	/**
	 * 更新进度
	 */
	private upDateProgress($p: string): void {
		this._progressLabel.text = $p;
	}


	private static _self: LoadingPage;
	private _progressLabel: eui.Label;							// 进度文本
}