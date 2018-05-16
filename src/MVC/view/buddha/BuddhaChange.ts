/**
 * 佛光转移条
 */
class BuddhaChange extends eui.Component{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/buddha/BuddhaChangeSkins.exml";
	}

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._curChooseIma.visible = false;
		this._curChooseIma.touchEnabled = false;
		this._chooseOneIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChooseOneClick, this);
		this._chooseTwoIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChooseTwoClick, this);

		this._isCreat = true;
		this.updataShow(this._talisman);
    }

	/**
	 * 选择1
	 */
	private _OnChooseOneClick(event:egret.TouchEvent){
		if(this._curChooseNum == 1){
			this._curChooseIma.visible = false;
			this._curChooseNum = 0; //转移一个佛光
		}
		else{
			this._curChooseIma.visible = true;
			this._curChooseIma.x = event.target.x;
			this._curChooseIma.y = event.target.y;
			this._curChooseNum = 1;//转移10个佛光
		}
	}

	/**
	 * 选择2
	 */
	private _OnChooseTwoClick(event:egret.TouchEvent){
		if(this._curChooseNum == 2){
			this._curChooseIma.visible = false;
			this._curChooseNum = 0;//转移一个佛光
		}else{
			this._curChooseIma.visible = true;
			this._curChooseIma.x = event.target.x;
			this._curChooseIma.y = event.target.y;
			this._curChooseNum = 2;//转移所有佛光
		}
	}

	/**
	 * 更新显示内容
	 */
	public updataShow(talisman:Talisman){
		this._talisman = talisman;
		if(!this._isCreat) return;

		this._iconIma.source = this._talisman.Icon + "_png";//<egret.Texture> await MovieManage.PromisifyGetRes(talisman.Icon + "_png", this);
		this._nameIma.source = this._talisman.NameRes + "_png";//<egret.Texture> await MovieManage.PromisifyGetRes(talisman.NameRes + "_png", this);
	}

	/**
	 * 返回当前选择
	 */
	public get CurChooseNum(){
		return this._curChooseNum;
	}

	private _curChooseIma : eui.Image;					// 当前选项
	private _nameIma : eui.Image;						// 名字
	private _iconIma : eui.Image;						// 图标
	private _addLabel1 : eui.Label;						// 显示添加的数值1
	private _addLabel2 : eui.Label;						// 显示添加的数值2
	private _chooseOneIma : eui.Image;					// 选择1
	private _chooseTwoIma : eui.Image;					// 选择2

	public _curChooseNum : number = 0;					// 当前选择编号

	private _isCreat: boolean = false;					// 是否创建完成
	private _talisman: Talisman = null;					// 法宝
}