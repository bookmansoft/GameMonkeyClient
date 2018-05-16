/**
 * PVP数值表现
 */
class PVPNum extends eui.Component implements eui.UIComponent {
	/**
	 * 构造方法
	 * 
	 */
	public constructor($value:any) {
		super();
		this.skinName = "resource/game_skins/pvp/PVPNumSkins.exml";

		this._lifeBitmapLabel.visible = true;
		this._missIma.visible = false;

		if($value == PVPManager.AttrChangedType.Damage){// 普通攻击
			this._lifeBitmapLabel.font = "lifenumber_fnt";
		}
		else if($value == PVPManager.AttrChangedType.Bang){// 暴击
			this._lifeBitmapLabel.font = "petLifeNumber_fnt";
		}
		else if($value == PVPManager.AttrChangedType.Recover){// 恢复
			this._lifeBitmapLabel.font = "huifulifenum_fnt";
		}
		else if($value == PVPManager.AttrChangedType.Miss){// Miss
			this._lifeBitmapLabel.visible = false;
			this._missIma.visible = true;
		}
		else if($value == "comboo"){// comboo
			this._lifeBitmapLabel.font = "pvpcomboo_fnt";
		}
		else{// 其他。中毒
			this._lifeBitmapLabel.font = "lifenumber_fnt";
		}

	}

	/**
	 * 设置数值
	 */
	public set number($value) {
		this._lifeBitmapLabel.text = $value;
	}

	/**
	 * 血量图片文本
	 */
	public _lifeBitmapLabel: eui.BitmapLabel;
	/**
	 * miss图片
	 */
	public _missIma: eui.Image;
}