/**
 * 主页按钮
 */
class UIListButton extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/ui/UIListButtonSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._pointIma.touchEnabled = false;
		this. _newIma.touchEnabled = false;
    }

	/**
	 * 更新显示的按钮
	 * name 按钮名字
	 */
	public async updateShowButton($name){
		var normalResName:string;
		var downResName:string;

		if($name == "邮件")
		{
			normalResName = "youjian_png";
			downResName = "youjian_g_png";
		}
		else if($name == "每日")
		{
			normalResName = "meirirenwu_png";
			downResName = "meirirenwu_g_png";
		}
		else if($name == "佛光")
		{
			normalResName = "shengguang_png";
			downResName = "shengguang_g_png";
		}
		else if($name == "三界符")
		{
			normalResName = "sanjiefu_png";
			downResName = "sanjiefu_g_png";
		}
		else if($name == "挂机")
		{
			normalResName = "guaji_png";
			downResName = "guaji_g_png";
		}
		else if($name == "离线奖励")
		{
			normalResName = "lixianjinbi_png";
			downResName = "lixianjinbi_g_png";
		}
		else if($name == "过关奖励")
		{
			normalResName = "guoguanjiangli_png";
			downResName = "guoguanjiangli_g_png";
		}
		else if($name == "挂机奖励")
		{
			normalResName = "guajijiangli_png";
			downResName = "guajijiangli_g_png";
		}

		// console.log(normalResName,downResName);

		this._button.skinName=
		'<e:Skin class="skins.ButtonSkin" states="up,down,disabled" minHeight="50" minWidth="100" xmlns:e="http://ns.egret.com/eui">'
		+'<e:Image width="100%" height="100%" source="'+ normalResName + '" source.down="' + downResName + '"/>'
		+'</e:Skin>'

	}

	/**
	 * 更改状态
	 * type normalState 普通按钮状态 dianState 小红点状态 newState 新信息状态
	 */
	public changeState($type){
		this.currentState = $type;
	} 

	/**
	 * 点击的按钮
	 */
	public get Button(){
		return this._button;
	}

	private _button: eui.Button;					// 按钮
	private _pointIma: eui.Image;					// 点图片
	private _newIma: eui.Image;						// 新图片
}