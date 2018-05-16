/**
 * 过关奖励条
 */
class PassRewardList extends eui.Component{
	/**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/ui/PassRewardListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

	/**
	 * 更新
	 * type 类型 1. 魔宠 2.神魔
	 * obj 元件
	 * num 获得的奖励数量
	 */
	public async upDataShow($type,$obj,$num){

		this._Object = $obj;

		if($type == "神魔")
		{
			var _ghost: Card = this._Object;
			this._suipianIma.visible = true;
			this._numLabel.visible = true;

			if($obj)
			{
				this._nameIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(_ghost.Prototype.NameIcon);
				this._iconIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(_ghost.Prototype.HeadRes);
				this._derLabel.text = _ghost.Prototype.Description;
			}
			
			this._numLabel.text = "数量："+"0";
		}
		else if($type == "魔宠")
		{

			var _pet: Pet = this._Object;
			this._suipianIma.visible = false;
			this._numLabel.visible = false;

			if($obj)
			{
				this._nameIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(_pet.Name);
				this._iconIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(_pet.HeadRes);
				this._derLabel.text = _pet.Description;
			}
			
			this._numLabel.text = "获得金币："+String($num);

		}
	}

	/**
	 * 确定按钮
	 */
	public get SureBtn(){
		return this._sureButton;
	}

	private _Object: any;						// 物件
	private _suipianIma: eui.Image;				// 碎片标志图片
	private _sureButton: eui.Button;			// 确定按钮

	private _nameIma: eui.Image;				// 名字
	private _iconIma: eui.Image;				// 图标
	private _derLabel: eui.Label;				// 描述
	private _numLabel: eui.Label;				// 数量
}