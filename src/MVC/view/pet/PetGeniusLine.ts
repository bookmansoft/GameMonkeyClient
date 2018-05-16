/**
 * 宠物天赋条
 */
class PetGeniusLine extends eui.Component{
	public constructor() {
		super();
	}

	/**
	 * 显示天赋内容
	 */
	public upDataShow($id: number, $desc: string = null){
		if(this._iconIma == null){
			this._iconIma = new eui.Image();
			this.addChild(this._iconIma);
			this._iconIma.width = 30;
			this._iconIma.height = 30;
		}
		if(this._descLabel == null){
			this._descLabel = new eui.Label();
			this.addChild(this._descLabel);
			this._descLabel.width = 418;
			this._descLabel.x = 40;
			this._descLabel.fontFamily = "KaiTi";
			this._descLabel.size = 22;
			this._descLabel.stroke = 2.5;
			this._descLabel.strokeColor = 0x000000;
		}
		if($id == 0){
			this._iconIma.visible = false;
			this._descLabel.text = $desc;
		}else{
			this._iconIma.visible = true;
			this._descLabel.text = $desc;
			
			if(ConfigStaticManager.getItem(ConfigTypeName.PetGenius,$id)["iconRes"])
				this._iconIma.source = ConfigStaticManager.getItem(ConfigTypeName.PetGenius,$id)["iconRes"] + "_png";
			this._descLabel.text = ConfigStaticManager.getItem(ConfigTypeName.PetGenius,$id)["desc"];
		}

		// this._height = this._descLabel.height;
	}

	/**
	 * 高
	 */
	// public get Height(){
	// 	return this._height;
	// }

	private _iconIma: eui.Image;				// 图标
	private _descLabel: eui.Label;				// 文本描述
	// private _height: number = 0;				// 高
}