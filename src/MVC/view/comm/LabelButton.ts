/**
 * 动态按钮
 */
class LabelButton extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/comm/LabelButtonSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		// 每日
		this._eailyLabel2.touchEnabled = false;
		this. _eailyLabel1.touchEnabled = false;
		this._eailyIcon.touchEnabled = false;

		// 升级模块
		this._upLevelIcon1.touchEnabled = false;
		this._upLevelIcon2.touchEnabled = false;
		this._upLevelLabel1.touchEnabled = false;
		this._upLevelLabel2.touchEnabled = false;

		// 佛光管理模块
		this._buddhaIcon.touchEnabled = false;
		this._buddhaLabel1.touchEnabled = false;
		this._buddhaLabel2.touchEnabled = false;
		this._freeNumLabel.touchEnabled = false;
    }

	/**
	 * 更新显示
	 * $type 按钮类型 0 两个动态数值 1 一种动态数值 2 佛光管理界面
	 * $arr 需要传的数值，数组
	 * 0 [花费数值，增加的战力]
	 * 1 [花费数值，类型 1.1.刷新 1.2.升级 1.3.钻石领奖 1.4.金币购买 1.5.人民币购买]
	 * 2 [类型 2.1 免费转移 2.2 钻石转移 ， 次数/花费砖石]
	 */
	public updateShow($type,$arr){
		this._buttonType = $type;
		this.invalidateState();

		if(this._buttonType == 0){
			this.showUpLevel($arr[0],$arr[1]);
		}
		else if(this._buttonType == 1){
			this.showOneNum($arr[0],$arr[1]);
		}
		else if(this._buttonType == 2){
			this.showBuddha($arr[0],$arr[1]);
		}
	}

	/**
	 * 获取当前状态
	 */
	public getCurrentState(){
		if(this._buttonType == 0) return "twoNum";
		else if(this._buttonType == 1) return "oneNum";
		else if(this._buttonType == 2) return "buddha";

		return "twoNum";
	}

	/**
	 * 显示有1个动态数值
	 * 
	 * $num 花费数值
	 * $type 类型 1.刷新 2.升级 3.钻石领奖 3.金币购买 4.人民币购买
	 */
	private showOneNum($num, $type:String){

		this._eailyIcon.visible = true;

		if($type == "升级"){
			RES.getResAsync("ding_jp_png",icon =>{ this._eailyIcon.texture = icon},this);
		}
		else if($type == "刷新"){
			RES.getResAsync("ding_yb_png",icon =>{ this._eailyIcon.texture = icon},this);
		}
		else if($type == "领奖"){
			RES.getResAsync("ding_yb_png",icon =>{ this._eailyIcon.texture = icon},this);
		}
		else if($type == "金币购买"){
			RES.getResAsync("shengji_jb_png",icon =>{ this._eailyIcon.texture = icon},this);
			$type = "购买";
		}
		else if($type == "人民币购买"){
			this._eailyIcon.visible = false;
			$type = "购买";
		}

		this._eailyLabel1.text = String($num);
		this._eailyLabel2.text = String($type);
	}

	/**
	 * 显示有2个动态数值
	 * 宠物/法宝升级按钮 
	 * $num1 花费的数值
	 * $num2 增加的战力
	 */
	private showUpLevel($num, $num2){
		this._upLevelLabel1.text = String($num);
		this._upLevelLabel2.text = String($num2);
	}

	/**
	 * 佛光管理界面 按钮
	 * $num1 类型，免费转移，佛光转移
	 * $num2 免费次数/花费钻石
	 */
	private showBuddha($num, $num2){
		if($num == "免费转移"){
			this._buddhaLabel2.text = "免费转移";
			this._freeNumLabel.text = "（免费转移次数 "+String($num2)+" )";
			this._freeNumLabel.visible = true;
			this._buddhaIcon.visible = false;
			this._buddhaLabel1.visible = false;
		}
		else if($num == "佛光转移"){
			this._buddhaLabel2.text = "佛光转移";
			this._buddhaLabel1.text = String($num2);
			this._buddhaIcon.visible = true;
			this._buddhaLabel1.visible = true;
			this._freeNumLabel.visible = false;
		}
	}

	/**
	 * 不要直接设置enabled的数值，代之以调用setEnabled函数，以同步内部按钮的状态
	 */
	public setEnabled(_enabled:boolean){
		this.enabled = _enabled;
		this._upLevelbutton.enabled = this.enabled;
		this._eailybutton.enabled = this.enabled;
		this._buddhabutton.enabled = this.enabled;
	}

	/**
	 * 设置按钮灰度
	 */
	public setDisabled(){
		this._upLevelbutton.enabled = false;
		this._eailybutton.enabled = false;
		this._buddhabutton.enabled = false;
		// this._upLevelbutton.skin.currentState = "disabled";
		// this._eailybutton.skin.currentState = "disabled";
		// this._buddhabutton.skin.currentState = "disabled";
	}
	/**
	 * 设置按钮正常
	 */
	public setNormal(){
		this._upLevelbutton.enabled = true;
		this._eailybutton.enabled = true;
		this._buddhabutton.enabled = true;
		// this._upLevelbutton.skin.currentState = "up";
		// this._eailybutton.skin.currentState = "up";
		// this._buddhabutton.skin.currentState = "up";
	}

	// 每日任务模块按钮
	private _eailyLabel2: eui.BitmapLabel;				// 文字。升级，刷新，领奖，购买
	private _eailyLabel1: eui.BitmapLabel;				// 花费是数量
	private _eailyIcon: eui.Image;						// 花费的货币类型

	// 升级模块
	private _upLevelIcon1: eui.Image;					// 花费的货币类型
	private _upLevelIcon2: eui.Image;					// 增加的能力类型
	private _upLevelLabel1: eui.BitmapLabel;			// 花费的货币数量
	private _upLevelLabel2: eui.BitmapLabel;			// 增加的数值

	// 佛光管理模块
	private _buddhaIcon: eui.Image						// 花费转移时的货币类型
	private _buddhaLabel1: eui.BitmapLabel				// 花费转移时,花费的货币数量
	private _buddhaLabel2: eui.BitmapLabel				// 转移类型。文字
	private _freeNumLabel: eui.Label					// 免费转移次数。文字


	private _buttonType: number;						// 按钮状态

	// 按钮元件
	private _upLevelbutton : eui.Button = null;
	private _eailybutton : eui.Button = null;
	private _buddhabutton : eui.Button = null;
}